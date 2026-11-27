// Piezas comunes de los ESTILOS (ver KIT.md, «Estilos»). Un estilo es una pantalla entera con su propia gramática
// visual (chat, app del banco, noticiero, meme, notas, libreta, telenovela, tipografía cinética…). Sirven para que
// los vídeos NO se parezcan entre sí: cada estilo cambia fondo, tipografía, subtítulos y forma de cerrar.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as anton } from "@remotion/google-fonts/Anton";
import { loadFont as caveat } from "@remotion/google-fonts/Caveat";
import { loadFont as playfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as roboto } from "@remotion/google-fonts/Roboto";
import { loadFont as marker } from "@remotion/google-fonts/PermanentMarker";
import { loadFont as bangers } from "@remotion/google-fonts/Bangers";
import { fontFamily } from "../brand";
import type { Inicios } from "../kit";

export const F = {
  inter: fontFamily,
  anton: anton("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
  caveat: caveat("normal", { weights: ["600", "700"], subsets: ["latin"] }).fontFamily,
  playfair: playfair("normal", { weights: ["700", "900"], subsets: ["latin"] }).fontFamily,
  playfairIt: playfair("italic", { weights: ["700"], subsets: ["latin"] }).fontFamily,
  roboto: roboto("normal", { weights: ["400", "500", "700", "900"], subsets: ["latin"] }).fontFamily,
  marker: marker("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
  bangers: bangers("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Segundos desde el inicio del vídeo (úsalo dentro de fondoFijo/capa de Montaje). */
export const useSeg = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

/**
 * Momento absoluto (en segundos) de algo que pasa «s segundos después de que empiece a hablar la escena X».
 * Así los mensajes de un chat o las notificaciones de un banco van pegados a la voz aunque cambie su duración.
 */
export const en = (inicios: Inicios, escena: string, s = 0, fps = 30) => {
  const i = inicios[escena];
  if (!i) throw new Error(`Escena «${escena}» no existe en la voz`);
  return i.voz / fps + s;
};

/** 0 → 1 con un pequeño rebote, empezando en el segundo `desde` (absoluto). */
export const entrada = (t: number, desde: number, dur = 0.35) => {
  const k = interpolate(t, [desde, desde + dur], [0, 1], clamp);
  return k === 0 ? 0 : 1 - (1 - k) ** 3 + Math.sin(k * Math.PI) * 0.08;
};

/** Pesos mexicanos: 12500 → «$12,500» (con decimales opcional). */
export const pesos = (n: number, dec = false) => {
  const s = Math.abs(n)
    .toFixed(dec ? 2 : 0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${n < 0 ? "-" : ""}$${s}`;
};

/** Barra de estado de celular (hora, cobertura, batería). Decorativa. */
export const BarraEstado: React.FC<{ color?: string; hora?: string; bateria?: number; top?: number }> = ({
  color = "#111",
  hora = "13:30",
  bateria = 23,
  top = 150,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 80,
      right: 80,
      display: "flex",
      justifyContent: "space-between",
      fontFamily: F.roboto,
      fontWeight: 700,
      fontSize: 34,
      color,
    }}
  >
    <span>{hora}</span>
    <span style={{ display: "flex", gap: 14, alignItems: "center" }}>
      <span style={{ letterSpacing: -4 }}>▂▄▆</span>
      <span style={{ border: `3px solid ${color}`, borderRadius: 8, width: 60, height: 28, position: "relative", display: "inline-block" }}>
        <span
          style={{
            position: "absolute",
            left: 3,
            top: 3,
            bottom: 3,
            width: `${bateria * 0.5}px`,
            background: bateria < 25 ? "#EF4444" : color,
            borderRadius: 4,
          }}
        />
      </span>
    </span>
  </div>
);
