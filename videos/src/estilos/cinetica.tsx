// ESTILO «cinética»: solo tipografía, a pantalla completa, palabra a palabra al ritmo de la voz. Fondos de color
// plano que cambian de golpe en cada frase, palabras clave enormes y que tiemblan. Para hot takes, listas rápidas,
// «cosas que nadie te dice», rants con actitud. Usa subtitulos="ninguno" en Montaje: esto YA es el subtítulo.
import React from "react";
import type { Inicios, Voz } from "../kit";
import { F, useSeg } from "./comun";

const PALETA: [string, string][] = [
  ["#111111", "#FFFFFF"],
  ["#FDE047", "#111111"],
  ["#2563EB", "#FFFFFF"],
  ["#F43F5E", "#FFFFFF"],
  ["#F5F5F4", "#111111"],
  ["#16A34A", "#FFFFFF"],
];

export const Cinetica: React.FC<{
  voz: Voz;
  inicios: Inicios;
  fps?: number;
  resalta?: string[]; // palabras (en minúsculas, sin tildes ni signos) que salen gigantes y de otro color
  paleta?: [string, string][]; // [fondo, tinta] por frase
  porPantalla?: number; // palabras que se quedan en pantalla a la vez (3)
}> = ({ voz, inicios, fps = 30, resalta = [], paleta = PALETA, porPantalla = 3 }) => {
  const t = useSeg();
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9$%]/g, "");
  // todas las palabras con tiempo absoluto
  const todas = voz.escenas.flatMap((e, ie) =>
    e.palabras.map((p) => ({ ...p, ie, inicio: inicios[e.id].voz / fps + p.inicio, fin: inicios[e.id].voz / fps + p.fin })),
  );
  const iAct = todas.reduce((acc, p, i) => (t >= p.inicio - 0.02 ? i : acc), -1);
  if (iAct < 0) {
    const [bg] = paleta[0];
    return <div style={{ position: "absolute", inset: 0, background: bg }} />;
  }
  const act = todas[iAct];
  const [bg, tinta] = paleta[act.ie % paleta.length];
  // grupo de pantalla: corta por frase o cada N palabras
  let ini = iAct;
  let n = 1;
  while (ini > 0 && todas[ini - 1].ie === act.ie && !/[.,;:!?…]$/.test(todas[ini - 1].t) && n < porPantalla) {
    ini--;
    n++;
  }
  const grupo = todas.slice(ini, iAct + 1);
  return (
    <div style={{ position: "absolute", inset: 0, background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "260px 130px 460px 90px" }}>
      {grupo.map((p, i) => {
        const fuerte = resalta.includes(norm(p.t));
        const k = Math.min(1, (t - p.inicio) / 0.12);
        const ultima = i === grupo.length - 1;
        const temblor = fuerte ? Math.sin(t * 60) * 4 : 0;
        return (
          <div
            key={`${p.inicio}`}
            style={{
              fontFamily: F.anton,
              fontSize: fuerte ? 230 : p.t.length > 9 ? 120 : 160,
              lineHeight: 1.02,
              color: fuerte ? (bg === "#FDE047" || bg === "#F5F5F4" ? "#DC2626" : "#FDE047") : tinta, // en fondo claro, rojo (el amarillo no se lee)
              textTransform: "uppercase",
              textAlign: "center",
              scale: String(ultima ? 0.7 + 0.3 * k : 1),
              opacity: ultima ? k : 0.9,
              translate: `${temblor}px 0px`,
              textShadow: fuerte ? "6px 6px 0 rgba(0,0,0,0.25)" : undefined,
            }}
          >
            {p.t.replace(/[.,;:…]+$/, "")}
          </div>
        );
      })}
    </div>
  );
};
