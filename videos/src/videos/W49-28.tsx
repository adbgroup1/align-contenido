import React from "react";
import { AbsoluteFill } from "remotion";
import { DefEscena, Montaje, PropsVoz } from "../kit";
import { Aviso, Cinetica, ComentarioFijado } from "../estilos";

// W49-28 · «Matemáticas de quincena» · Reel · ESTILO cinética (solo tipografía) · CIERRE comentario fijado
// Lógica absurda de justificar el gasto (investigacion/MEXICO-VIRAL.md, A7), sin género. Ritmo rápido, sin dibujos.

export const EXTRA_W4928: Record<string, number> = { merezco: 0.3, verdad: 2.4 };

const ESCENAS: DefEscena[] = ["hook", "oferta", "tarjeta", "casa", "merezco", "verdad"].map((id) => ({
  id,
  subtitulos: false,
  render: ({ voz }) =>
    id === "verdad" ? (
      <AbsoluteFill>
        <ComentarioFijado texto="¿Cuál de estas has usado? Sé honest@ 👇" en={voz.segundos + 0.2} y={1150} />
        <Aviso y={1480} />
      </AbsoluteFill>
    ) : null,
}));

export const W4928: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? (
    <Montaje
      videoId={videoId}
      voz={voz}
      escenas={ESCENAS}
      extra={EXTRA_W4928}
      pista="tech-synthpop.mp3"
      nivelMusica={1.4}
      fondoFijo={({ inicios }) => (
        <Cinetica voz={voz} inicios={inicios} resalta={["gratis", "perdiendo", "cuenta", "inversion", "merezco", "sobra", "primero", "apartas"]} />
      )}
    />
  ) : null;
