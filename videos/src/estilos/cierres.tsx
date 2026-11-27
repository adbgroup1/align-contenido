// CIERRES sin tarjeta fija. Andrés (27 nov): «pones la misma pantalla de CTA; puede que algún vídeo no necesite
// tenerlo». Un vídeo puede cerrar con: un remate (el último plano es el chiste), un bucle al inicio, un CTA dicho
// por un personaje dentro de la historia, un comentario fijado o, solo si suma, la tarjeta CtaCrecer del kit.
// Lo único obligatorio al final es el aviso legal pequeño (<Aviso />).
import React from "react";
import { entrada, F, useSeg } from "./comun";

/** Aviso legal obligatorio, pequeño y legible, sobre el último plano. `en` relativo a donde se monte. */
export const Aviso: React.FC<{ texto?: string; claro?: boolean; y?: number; hipotetico?: boolean; caja?: boolean }> = ({ texto, claro = false, y = 1480, hipotetico = false, caja = false }) => (
  <div
    style={{
      position: "absolute",
      top: y,
      left: 90,
      right: 120,
      textAlign: "center",
      fontFamily: F.roboto,
      fontWeight: 500,
      fontSize: 27,
      color: claro ? "#1F2937" : "rgba(255,255,255,0.92)",
      textShadow: claro || caja ? "none" : "0 1px 4px rgba(0,0,0,0.9)",
    }}
  >
    <span style={caja ? { background: "rgba(17,24,39,0.82)", color: "#fff", padding: "6px 16px", borderRadius: 10 } : undefined}>
    {texto ?? `${hipotetico ? "Ejemplo hipotético · " : ""}Contenido informativo, no es asesoramiento financiero.`}
    </span>
  </div>
);

/**
 * Comentario fijado de mentira (genérico, sin marca de red social): el CTA dentro de la conversación.
 * «📌 Fijado por align_finanzas — ¿Cuál de las tres eres tú? 👇»
 */
export const ComentarioFijado: React.FC<{ texto: string; en?: number; usuario?: string; y?: number }> = ({ texto, en = 0, usuario = "align_finanzas", y = 1180 }) => {
  const t = useSeg();
  const k = entrada(t, en, 0.35);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 70,
        right: 140,
        background: "rgba(255,255,255,0.97)",
        borderRadius: 30,
        padding: "22px 28px",
        boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
        display: "flex",
        gap: 20,
        fontFamily: F.roboto,
        opacity: Math.min(1, k * 1.5),
        translate: `0px ${(1 - Math.min(1, k)) * 80}px`,
      }}
    >
      <div style={{ width: 74, height: 74, borderRadius: 37, background: "#1D4ED8", color: "#fff", fontWeight: 900, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>A</div>
      <div>
        <div style={{ fontSize: 28, color: "#6B7280" }}>📌 Fijado por {usuario}</div>
        <div style={{ fontSize: 30, fontWeight: 700, color: "#111827" }}>{usuario}</div>
        <div style={{ fontSize: 42, color: "#111827", lineHeight: 1.2, marginTop: 4 }}>{texto}</div>
      </div>
    </div>
  );
};

/** Pregunta suelta sobre el último plano, sin tarjeta: texto grande con caja, como en los reels hechos a mano. */
export const PreguntaFinal: React.FC<{ texto: string; en?: number; y?: number }> = ({ texto, en = 0, y = 1250 }) => {
  const t = useSeg();
  const k = entrada(t, en, 0.3);
  return (
    <div style={{ position: "absolute", top: y, left: 90, right: 120, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#fff", color: "#111", fontFamily: F.roboto, fontWeight: 900, fontSize: 56, padding: "12px 30px", borderRadius: 18, rotate: "-2deg", scale: String(Math.min(1.05, k)) }}>{texto}</div>
    </div>
  );
};
