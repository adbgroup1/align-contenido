import React from "react";
import { AbsoluteFill } from "remotion";
import { DefEscena, Montaje, PropsVoz, Sfx } from "../kit";
import { Aviso, Chat, en, MsgChat } from "../estilos";

// W49-25 · «El grupo de la familia se entera de tu aguinaldo» · Reel · ESTILO chat · CIERRE remate (sin CTA)
// Piloto del replanteamiento del 27 nov: personajes con voz propia (mamá, tía, primo, abuelita), voz mexicana
// coloquial (eleven_v3), cero tarjeta final. Sin cifras externas: «$500» y «$2,000» son de la historia.

export const EXTRA_W4925: Record<string, number> = { hook: 0.3, abuelita: 0.3, giro: 0.2, remate: 1.6 };

const MIEMBROS = {
  Mamá: { color: "#E11D48", avatar: "👩🏽" },
  "Tía Chuy": { color: "#7C3AED", avatar: "💅🏽" },
  "Primo Charly": { color: "#0891B2", avatar: "🧢" },
  Abuelita: { color: "#B45309", avatar: "👵🏽" },
};

const ESCENAS: DefEscena[] = ["hook", "mama", "tia", "primo", "abuelita", "giro", "remate"].map((id) => ({
  id,
  estiloSub: id === "hook" || id === "giro" || id === "remate" ? "caja" : "ninguno",
  render: ({ dur }) => (id === "remate" ? <Remate dur={dur} /> : null),
}));

const Remate: React.FC<{ dur: number }> = () => (
  <AbsoluteFill>
    <Aviso caja y={1474} />
  </AbsoluteFill>
);

export const W4925: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? (
    <Montaje
      videoId={videoId}
      voz={voz}
      escenas={ESCENAS}
      extra={EXTRA_W4925}
      pista="lay-back.mp3"
      nivelMusica={0.8}
      subY={1430}
      fondoFijo={({ inicios }) => {
        const m: MsgChat[] = [
          { de: "yo", en: 0, escribe: 0, texto: "¡Ya me cayó el aguinaldo! 🥳🥳", hora: "13:02" },
          { de: "Mamá", en: en(inicios, "mama", 0), texto: "¡Ay, mijo, qué bueno! ¿Entonces ahora sí me pagas los $500 de la luz? 🙏", hora: "13:03" },
          { de: "Tía Chuy", en: en(inicios, "tia", 0), texto: "¿Y cuánto te dieron, mijo? Nomás por saber 👀", hora: "13:03", reaccion: { emoji: "😒", en: en(inicios, "primo", -0.3) } },
          { de: "Primo Charly", en: en(inicios, "primo", 0), texto: "Primo préstame $2,000, el viernes sin falta te los paso NETA 🙏🙏", hora: "13:04", reaccion: { emoji: "😂", en: en(inicios, "primo", 2) } },
          { de: "Abuelita", en: en(inicios, "abuelita", 0), tipo: "audio", segundosAudio: 47, hora: "13:05" },
          { de: "yo", en: en(inicios, "giro", 2.6), escribe: 0, texto: "Ya lo aparté desde el día que cayó 😇", hora: "13:06" },
          { de: "Tía Chuy", en: en(inicios, "remate", 1.1), escribe: 0.6, tipo: "borrado", hora: "13:06" },
          { de: "Mamá", en: en(inicios, "remate", 1.8), escribe: 0.3, tipo: "sticker", texto: "😤", hora: "13:06" },
          { de: "sistema", en: en(inicios, "remate", 2.4), escribe: 0, tipo: "sistema", texto: "Tía Chuy salió del grupo" },
        ];
        return (
          <>
            <ChatFamilia mensajes={m} />
            <SistemaSalio en={en(inicios, "remate", 2.4)} />
          </>
        );
      }}
    />
  ) : null;

/** El chat no sube por detrás de los subtítulos del narrador (caja arriba, hasta y≈490): las burbujas que pasan de
 *  y=510 se van. La barra «Mensaje» queda en 1352–1462 y el aviso legal, debajo. */
const ChatFamilia: React.FC<{ mensajes: MsgChat[] }> = ({ mensajes }) => (
  <Chat titulo="Familia 🇲🇽🎄" info="Tú, Mamá, Tía Chuy, Primo Charly, Abuelita" miembros={MIEMBROS} mensajes={mensajes} base={1322} tope={510} />
);

/** Golpe de sonido cuando la tía sale del grupo (el aviso va dentro del chat, tipo «sistema»). */
const SistemaSalio: React.FC<{ en: number }> = ({ en: t0 }) => <Sfx s="impacto" volumen={0.45} en={t0} />;
