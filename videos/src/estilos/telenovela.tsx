// ESTILO «telenovela»: drama exagerado. Bandas negras de cine, viñeta morada, zooms de golpe en tres tiempos sobre
// la cara del personaje (con acorde dramático), títulos de capítulo dorados con serifa. Para «la traición de la
// tarjeta de crédito», «la tanda que nunca pagó», «el regreso del aguinaldo». Se combina con Personaje del kit.
import React from "react";
import { interpolate } from "remotion";
import { Sfx } from "../kit";
import { clamp, entrada, F, useSeg } from "./comun";

/** Marco de telenovela: bandas negras, viñeta y grano. Va por encima de todo (capa). */
export const MarcoTelenovela: React.FC<{ tono?: string }> = ({ tono = "#4C1D95" }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 45%, transparent 45%, ${tono}cc 100%)` }} />
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 150, background: "#000" }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 150, background: "#000" }} />
  </div>
);

/** Título de capítulo: «Capítulo 3: La tarjeta» en dorado sobre negro. `en` absoluto o relativo a la escena. */
export const TituloCapitulo: React.FC<{ capitulo: string; titulo: string; en?: number; sonido?: boolean }> = ({ capitulo, titulo, en = 0, sonido = true }) => {
  const t = useSeg();
  const k = entrada(t, en, 0.6);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <div style={{ fontFamily: F.playfairIt, fontSize: 60, color: "#E9D5A1", letterSpacing: 6, opacity: Math.min(1, k) }}>{capitulo}</div>
      <div
        style={{
          fontFamily: F.playfair,
          fontWeight: 900,
          fontSize: 120,
          lineHeight: 1.05,
          textAlign: "center",
          padding: "0 120px",
          background: "linear-gradient(180deg, #FDE68A, #B45309)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          scale: String(1.15 - 0.15 * Math.min(1, k)),
          opacity: Math.min(1, k),
        }}
      >
        {titulo}
      </div>
      {sonido ? <Sfx s="riser" volumen={0.35} en={en} /> : null}
    </div>
  );
};

/**
 * Zoom dramático en tres golpes sobre un punto (x, y) a partir del segundo `en` (relativo a la escena).
 * Envuelve al personaje o a la cara: <ZoomDrama en={0.4} x={540} y={900}>…</ZoomDrama>
 */
export const ZoomDrama: React.FC<{ children: React.ReactNode; en: number; x?: number; y?: number; sonido?: boolean }> = ({ children, en, x = 540, y = 900, sonido = true }) => {
  const t = useSeg();
  const paso = (d: number) => interpolate(t, [en + d, en + d + 0.06], [0, 1], clamp);
  const z = 1 + 0.35 * paso(0) + 0.45 * paso(0.35) + 0.7 * paso(0.7);
  return (
    <div style={{ position: "absolute", inset: 0, transformOrigin: `${x}px ${y}px`, scale: String(z) }}>
      {children}
      {sonido ? (
        <>
          <Sfx s="impacto" volumen={0.4} en={en} />
          <Sfx s="impacto" volumen={0.45} en={en + 0.35} />
          <Sfx s="impacto" volumen={0.55} en={en + 0.7} />
        </>
      ) : null}
    </div>
  );
};
