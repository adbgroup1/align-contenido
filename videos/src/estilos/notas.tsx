// ESTILO «notas»: la app de notas del celular, escribiéndose sola con cursor. Listas, «mi plan para este año»,
// «cosas que compré en el Buen Fin», presupuestos de la quincena… Los renglones se pueden tachar con el rayón.
// Muy íntimo y muy compartible. Sin subtítulos: lo que se escribe ES el texto.
import React from "react";
import { interpolate } from "remotion";
import { Sfx } from "../kit";
import { BarraEstado, clamp, F, useSeg } from "./comun";

export type Renglon = {
  en: number; // cuándo se empieza a escribir
  texto: string;
  cps?: number; // caracteres por segundo (18 por defecto)
  tachar?: number; // segundo absoluto en que se tacha
  check?: boolean; // casilla
  marcar?: number; // segundo en que se marca la casilla
  color?: string;
  grande?: boolean;
};

export const Notas: React.FC<{ titulo: string; renglones: Renglon[]; fecha?: string; oscuro?: boolean; sonido?: boolean }> = ({
  titulo,
  renglones,
  fecha = "27 de noviembre, 13:30",
  oscuro = false,
  sonido = true,
}) => {
  const t = useSeg();
  const bg = oscuro ? "#1C1C1E" : "#FFFFFF";
  const tinta = oscuro ? "#F2F2F7" : "#1C1C1E";
  const acento = "#E5A50A";
  const activo = renglones.findIndex((r) => t >= r.en && t < r.en + r.texto.length / (r.cps ?? 18));
  return (
    <div style={{ position: "absolute", inset: 0, background: bg, fontFamily: F.roboto, color: tinta, overflow: "hidden" }}>
      <BarraEstado color={tinta} top={180} />
      <div style={{ position: "absolute", top: 250, left: 70, right: 140, display: "flex", justifyContent: "space-between", color: acento, fontSize: 44 }}>
        <span>‹ Notas</span>
        <span>Listo</span>
      </div>
      <div style={{ position: "absolute", top: 360, left: 80, right: 150 }}>
        <div style={{ fontSize: 30, color: "#8E8E93", textAlign: "center", marginBottom: 20 }}>{fecha}</div>
        <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.1, marginBottom: 30 }}>{titulo}</div>
        {renglones
          .filter((r) => t >= r.en)
          .map((r, i) => {
            const n = Math.floor((t - r.en) * (r.cps ?? 18));
            const txt = r.texto.slice(0, n);
            const escribiendo = n < r.texto.length;
            const tacha = r.tachar !== undefined ? interpolate(t, [r.tachar, r.tachar + 0.35], [0, 1], clamp) : 0;
            const marcado = r.marcar !== undefined && t >= r.marcar;
            return (
              <div key={i} style={{ display: "flex", gap: 22, alignItems: "flex-start", marginBottom: 18, fontSize: r.grande ? 64 : 52, lineHeight: 1.25, color: r.color ?? tinta }}>
                {r.check ? (
                  <span
                    style={{
                      flex: "none",
                      width: 54,
                      height: 54,
                      marginTop: 6,
                      borderRadius: 27,
                      border: `4px solid ${marcado ? acento : "#C7C7CC"}`,
                      background: marcado ? acento : "transparent",
                      color: "#fff",
                      fontSize: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {marcado ? "✓" : ""}
                  </span>
                ) : null}
                <span style={{ position: "relative" }}>
                  {txt}
                  {escribiendo || i === activo ? <span style={{ color: acento, opacity: Math.floor(t * 3) % 2 ? 1 : 0 }}>|</span> : null}
                  {tacha > 0 ? (
                    <span style={{ position: "absolute", left: 0, top: "52%", height: 6, width: `${tacha * 100}%`, background: "#EF4444", borderRadius: 3 }} />
                  ) : null}
                </span>
              </div>
            );
          })}
      </div>
      {sonido
        ? renglones.flatMap((r, i) => [
            <Sfx key={`t${i}`} s="tick" volumen={0.12} en={r.en} />,
            ...(r.tachar !== undefined ? [<Sfx key={`x${i}`} s="swoosh" volumen={0.3} en={r.tachar} />] : []),
          ])
        : null}
    </div>
  );
};
