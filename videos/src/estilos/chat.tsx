// ESTILO «chat»: una conversación de grupo de mensajería a pantalla completa (sin logos ni marcas).
// Para historias de familia, tandas, el primo que pide prestado, el grupo de la oficina… El texto ya está en
// pantalla: usa subtitulos="ninguno" o «limpio» solo para la voz del narrador.
import React from "react";
import { interpolate } from "remotion";
import { Sfx } from "../kit";
import { BarraEstado, clamp, entrada, F, useSeg } from "./comun";

export type MsgChat = {
  de: string; // nombre de un miembro, o «yo» (va a la derecha)
  en: number; // segundo absoluto en que aparece (usa en(inicios, "escena", s))
  texto?: string;
  tipo?: "texto" | "audio" | "sticker" | "borrado" | "foto";
  segundosAudio?: number; // para tipo audio: duración que se muestra («0:47»)
  escribe?: number; // segundos de «escribiendo…» antes (por defecto 0.9; 0 = sin aviso)
  reaccion?: { emoji: string; en: number };
  hora?: string;
  visto?: boolean;
};

export const Chat: React.FC<{
  titulo: string; // «Tanda oficina 💸», «Familia 🇲🇽», «Primo Beto»
  info?: string; // debajo del título: «Tú, Mamá, Tía Lupe, Beto»
  miembros: Record<string, { color: string; avatar?: string }>;
  mensajes: MsgChat[];
  oscuro?: boolean;
  sonido?: boolean;
  base?: number; // borde inferior de la lista de mensajes (1440)
}> = ({ titulo, info, miembros, mensajes, oscuro = false, sonido = true, base = 1440 }) => {
  const t = useSeg();
  const fondo = oscuro ? "#0B141A" : "#EFE7DD";
  const burbujaYo = oscuro ? "#005C4B" : "#D9FDD3";
  const burbujaOtro = oscuro ? "#202C33" : "#FFFFFF";
  const tinta = oscuro ? "#E9EDEF" : "#111B21";
  const gris = oscuro ? "#8696A0" : "#667781";

  const visibles = mensajes.filter((m) => t >= m.en);
  const siguiente = mensajes.find((m) => t < m.en && t >= m.en - (m.escribe ?? 0.9));
  const escribiendo = siguiente && siguiente.de !== "yo" ? siguiente.de : null;

  // alto aproximado de cada burbuja para apilar desde abajo
  const alto = (m: MsgChat) => {
    if (m.tipo === "sticker") return 250;
    if (m.tipo === "audio") return 130;
    if (m.tipo === "foto") return 420;
    const lineas = Math.max(1, Math.ceil((m.texto ?? "").length / 24));
    return 70 + lineas * 54 + (m.de !== "yo" ? 44 : 0) + (m.reaccion ? 30 : 0);
  };
  const BASE = base; // borde inferior de la lista (deja libre la zona segura de abajo)
  const GAP = 18;
  const alturas = visibles.map(alto);
  const ultimo = visibles[visibles.length - 1];
  const kUltimo = ultimo ? entrada(t, ultimo.en, 0.3) : 1;
  const typingAlto = escribiendo ? 110 : 0;
  let y = BASE - typingAlto;
  const pos: number[] = [];
  for (let i = visibles.length - 1; i >= 0; i--) {
    y -= alturas[i];
    pos[i] = y;
    y -= GAP;
  }
  // el último mensaje empuja a los demás hacia arriba con suavidad
  const empuje = ultimo ? (1 - Math.min(1, kUltimo)) * (alturas[alturas.length - 1] + GAP) : 0;

  return (
    <div style={{ position: "absolute", inset: 0, background: fondo, overflow: "hidden", fontFamily: F.roboto }}>
      {/* papel tapiz con garabatos */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: oscuro ? 0.05 : 0.07 }}>
        {Array.from({ length: 60 }).map((_, i) => (
          <text key={i} x={(i * 173) % 1080} y={(i * 241) % 1920} fontSize={64} fill={tinta}>
            {["$", "☕", "✿", "★", "♪", "☁"][i % 6]}
          </text>
        ))}
      </svg>
      {visibles.map((m, i) => {
        const k = i === visibles.length - 1 ? kUltimo : 1;
        const yo = m.de === "yo";
        const mb = miembros[m.de];
        const top = pos[i] + empuje;
        if (top < 120) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top,
              left: yo ? undefined : 60,
              right: yo ? 150 : undefined,
              maxWidth: 760,
              transformOrigin: yo ? "right bottom" : "left bottom",
              scale: String(0.6 + 0.4 * k),
              opacity: Math.min(1, k * 1.5),
            }}
          >
            {m.tipo === "sticker" ? (
              <div style={{ fontSize: 210, lineHeight: 1 }}>{m.texto}</div>
            ) : (
              <div
                style={{
                  background: yo ? burbujaYo : burbujaOtro,
                  color: tinta,
                  borderRadius: 26,
                  borderTopLeftRadius: yo ? 26 : 6,
                  borderTopRightRadius: yo ? 6 : 26,
                  padding: "16px 26px 14px",
                  boxShadow: "0 2px 2px rgba(0,0,0,0.12)",
                  fontSize: 46,
                  lineHeight: 1.18,
                  position: "relative",
                }}
              >
                {!yo ? (
                  <div style={{ color: mb?.color ?? "#1FA855", fontWeight: 700, fontSize: 36, marginBottom: 6 }}>
                    {mb?.avatar ? `${mb.avatar} ` : ""}
                    {m.de}
                  </div>
                ) : null}
                {m.tipo === "borrado" ? (
                  <span style={{ color: gris, fontStyle: "italic" }}>⊘ Se eliminó este mensaje</span>
                ) : m.tipo === "audio" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <span style={{ fontSize: 50 }}>▶</span>
                    <svg width={420} height={60}>
                      {Array.from({ length: 34 }).map((_, j) => {
                        const h = 10 + Math.abs(Math.sin(j * 1.7 + i)) * 42;
                        return <rect key={j} x={j * 12.4} y={30 - h / 2} width={6} height={h} rx={3} fill={gris} />;
                      })}
                    </svg>
                    <span style={{ fontSize: 34, color: gris }}>
                      {Math.floor((m.segundosAudio ?? 47) / 60)}:{String((m.segundosAudio ?? 47) % 60).padStart(2, "0")}
                    </span>
                  </div>
                ) : m.tipo === "foto" ? (
                  <div style={{ width: 560, height: 330, borderRadius: 16, background: "linear-gradient(135deg,#FDE68A,#F472B6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 140 }}>
                    {m.texto ?? "🏖️"}
                  </div>
                ) : (
                  <span>{m.texto}</span>
                )}
                <div style={{ textAlign: "right", fontSize: 28, color: gris, marginTop: 4 }}>
                  {m.hora ?? "13:30"} {yo ? <span style={{ color: m.visto === false ? gris : "#53BDEB" }}>✓✓</span> : null}
                </div>
                {m.reaccion && t >= m.reaccion.en ? (
                  <div
                    style={{
                      position: "absolute",
                      bottom: -34,
                      left: yo ? 20 : undefined,
                      right: yo ? undefined : 20,
                      background: burbujaOtro,
                      borderRadius: 999,
                      padding: "2px 12px",
                      fontSize: 40,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      scale: String(entrada(t, m.reaccion.en, 0.25)),
                    }}
                  >
                    {m.reaccion.emoji}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        );
      })}
      {escribiendo ? (
        <div style={{ position: "absolute", top: BASE - 100 + empuje * 0, left: 60, background: burbujaOtro, borderRadius: 26, padding: "22px 30px", display: "flex", gap: 12 }}>
          {[0, 1, 2].map((j) => (
            <div key={j} style={{ width: 18, height: 18, borderRadius: 9, background: gris, opacity: 0.4 + 0.6 * Math.abs(Math.sin(t * 6 + j)) }} />
          ))}
        </div>
      ) : null}
      {/* cabecera */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 360, background: oscuro ? "#202C33" : "#F0F2F5", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        <BarraEstado color={tinta} top={180} />
        <div style={{ position: "absolute", top: 240, left: 60, right: 140, display: "flex", alignItems: "center", gap: 26 }}>
          <span style={{ fontSize: 54, color: tinta }}>‹</span>
          <div style={{ width: 90, height: 90, borderRadius: 45, background: "#CBD5E1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>
            {Object.values(miembros)[0]?.avatar ?? "👥"}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: 46, fontWeight: 700, color: tinta, whiteSpace: "nowrap" }}>{titulo}</div>
            <div style={{ fontSize: 32, color: escribiendo ? "#1FA855" : gris, whiteSpace: "nowrap" }}>
              {escribiendo ? `${escribiendo} está escribiendo…` : info ?? "toca para info del grupo"}
            </div>
          </div>
        </div>
      </div>
      {/* barra de escribir (queda bajo la interfaz de la red; es decorado) */}
      <div style={{ position: "absolute", top: BASE + 30, left: 40, right: 40, height: 110, borderRadius: 55, background: oscuro ? "#2A3942" : "#FFFFFF", display: "flex", alignItems: "center", padding: "0 40px", color: gris, fontSize: 40, opacity: interpolate(t, [0, 0.3], [0, 1], clamp) }}>
        Mensaje
      </div>
      {sonido
        ? mensajes.map((m, i) => <Sfx key={i} s={m.de === "yo" ? "swoosh" : "pop"} volumen={m.de === "yo" ? 0.18 : 0.32} en={m.en} />)
        : null}
    </div>
  );
};
