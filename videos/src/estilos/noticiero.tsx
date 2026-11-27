// ESTILO «noticiero»: un noticiero de TV de mentira. Rótulo de ÚLTIMA HORA, cintillo que corre, EN VIVO con reloj.
// Para tratar algo cotidiano como si fuera noticia nacional («Se acaba la quincena el día 3: los expertos no se lo
// explican»). En el hueco del centro va lo que quieras (children): un personaje, una gráfica, una foto.
import React from "react";
import { interpolate } from "remotion";
import { Sfx } from "../kit";
import { clamp, entrada, F, useSeg } from "./comun";

export type Titular = { en: number; texto: string; etiqueta?: string };

export const Noticiero: React.FC<{
  titulares: Titular[];
  cintillo: string; // texto que corre abajo, se repite
  canal?: string; // «ALIGN NOTICIAS»
  hora?: string;
  children?: React.ReactNode; // contenido de la pantalla central (1080 × ~900, de y=330 a y=1200)
  sonido?: boolean;
}> = ({ titulares, cintillo, canal = "ALIGN NOTICIAS", hora = "13:30", children, sonido = true }) => {
  const t = useSeg();
  const actual = titulares.filter((x) => t >= x.en).pop() ?? titulares[0];
  const k = entrada(t, actual.en, 0.35);
  const parpadeo = Math.floor(t * 2) % 2 === 0;
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 35%, #1E3A8A, #020617 75%)", overflow: "hidden", fontFamily: F.roboto }}>
      {/* rejilla del plató */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.12 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={i} x1={0} y1={i * 100} x2={1080} y2={i * 100} stroke="#93C5FD" strokeWidth={2} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={1920} stroke="#93C5FD" strokeWidth={2} />
        ))}
      </svg>
      {/* pantalla central */}
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, height: 900 }}>{children}</div>
      {/* EN VIVO + canal */}
      <div style={{ position: "absolute", top: 240, left: 70, display: "flex", gap: 18, alignItems: "center" }}>
        <div style={{ background: "#DC2626", color: "#fff", fontWeight: 900, fontSize: 36, padding: "6px 20px", borderRadius: 8, display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", opacity: parpadeo ? 1 : 0.3 }} />
          EN VIVO
        </div>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 36, letterSpacing: 2 }}>{canal}</div>
      </div>
      {/* rótulo inferior */}
      <div style={{ position: "absolute", top: 1210, left: 40, right: 40 }}>
        <div
          style={{
            display: "inline-block",
            background: "#DC2626",
            color: "#fff",
            fontFamily: F.anton,
            fontSize: 52,
            padding: "4px 26px",
            letterSpacing: 2,
            translate: `${(1 - Math.min(1, k)) * -600}px 0px`,
          }}
        >
          {actual.etiqueta ?? "ÚLTIMA HORA"}
        </div>
        <div
          style={{
            background: "#fff",
            color: "#0F172A",
            fontWeight: 900,
            fontSize: 54,
            lineHeight: 1.1,
            padding: "18px 26px",
            textTransform: "uppercase",
            clipPath: `inset(0 ${(1 - Math.min(1, k)) * 100}% 0 0)`,
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          }}
        >
          {actual.texto}
        </div>
      </div>
      {/* cintillo */}
      <div style={{ position: "absolute", top: 1440, left: 0, right: 0, height: 70, background: "#FBBF24", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{ background: "#0F172A", color: "#FBBF24", fontWeight: 900, fontSize: 36, padding: "0 22px", height: "100%", display: "flex", alignItems: "center", zIndex: 2 }}>{hora}</div>
        <div style={{ whiteSpace: "nowrap", fontSize: 38, fontWeight: 700, color: "#0F172A", translate: `${1100 - ((t * 220) % 4000)}px 0px` }}>
          {`${cintillo}   •   ${cintillo}   •   ${cintillo}`}
        </div>
      </div>
      {sonido ? titulares.map((x, i) => <Sfx key={i} s={i === 0 ? "impacto" : "whoosh"} volumen={0.35} en={x.en} />) : null}
      {/* destello de cambio de titular */}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: interpolate(t, [actual.en, actual.en + 0.12], [0.18, 0], clamp), pointerEvents: "none" }} />
    </div>
  );
};
