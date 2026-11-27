// ESTILO «libreta»: hoja de cuaderno de rayas, todo dibujado a plumón como si alguien lo explicara a mano.
// Trazos que se dibujan solos, letra manuscrita, flechas y círculos. Cálido, cercano, nada de «banco».
// Va bien para cuentas sencillas, «te lo explico como a mi abuelita», comparaciones hechas a mano.
import React from "react";
import { interpolate } from "remotion";
import { clamp, F, useSeg } from "./comun";

export const HojaLibreta: React.FC<{ papel?: string }> = ({ papel = "#FFFDF5" }) => (
  <div style={{ position: "absolute", inset: 0, background: papel }}>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 32 }).map((_, i) => (
        <line key={i} x1={0} y1={200 + i * 62} x2={1080} y2={200 + i * 62} stroke="#BFDBFE" strokeWidth={3} />
      ))}
      <line x1={120} y1={0} x2={120} y2={1920} stroke="#FCA5A5" strokeWidth={4} />
    </svg>
  </div>
);

/** Texto manuscrito que se escribe letra a letra desde `en` (segundos, relativo a donde se monte). */
export const Manuscrito: React.FC<{
  texto: string;
  en?: number;
  x: number;
  y: number;
  size?: number;
  color?: string;
  cps?: number;
  rot?: number;
  ancho?: number;
}> = ({ texto, en = 0, x, y, size = 80, color = "#1E3A8A", cps = 22, rot = -2, ancho = 820 }) => {
  const t = useSeg();
  const n = Math.max(0, Math.floor((t - en) * cps));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: ancho, fontFamily: F.caveat, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, rotate: `${rot}deg`, whiteSpace: "pre-wrap" }}>
      {texto.slice(0, n)}
    </div>
  );
};

/** Trazo SVG que se dibuja solo: flechas, círculos, subrayados, tachones. `d` es un path en coordenadas 1080×1920. */
export const Trazo: React.FC<{ d: string; en?: number; dur?: number; color?: string; grosor?: number; largo?: number; punta?: boolean }> = ({
  d,
  en = 0,
  dur = 0.5,
  color = "#DC2626",
  grosor = 12,
  largo = 2000,
  punta = false,
}) => {
  const t = useSeg();
  const k = interpolate(t, [en, en + dur], [0, 1], clamp);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
      <defs>
        <marker id={`p${d.length}`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="none" stroke={color} strokeWidth={1.4} />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={grosor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={largo}
        strokeDashoffset={largo * (1 - k)}
        markerEnd={punta && k > 0.95 ? `url(#p${d.length})` : undefined}
      />
    </svg>
  );
};

/** Círculo a mano alrededor de (cx, cy). */
export const CirculoMano: React.FC<{ cx: number; cy: number; rx: number; ry: number; en?: number; color?: string }> = ({ cx, cy, rx, ry, en = 0, color = "#DC2626" }) => (
  <Trazo
    en={en}
    color={color}
    largo={Math.PI * (rx + ry) * 1.25}
    d={`M ${cx + rx} ${cy} C ${cx + rx} ${cy - ry * 1.1}, ${cx - rx * 1.05} ${cy - ry}, ${cx - rx} ${cy} C ${cx - rx} ${cy + ry * 1.05}, ${cx + rx * 1.1} ${cy + ry}, ${cx + rx * 0.95} ${cy - ry * 0.25}`}
  />
);
