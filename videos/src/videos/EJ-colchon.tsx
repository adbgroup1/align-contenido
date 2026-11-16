import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../brand";
import {
  Cifra,
  DefEscena,
  Escena,
  Foto,
  Lluvia,
  Montaje,
  Palabras,
  Pildora,
  PropsVoz,
  Sfx,
  useSpring,
  Zona,
} from "../kit";

// EJEMPLO DEL MÉTODO «IMÁGENES + KIT» · «El colchón» · CTA COLCHÓN
// Plantilla para vídeos con imágenes generadas: cada escena = <Foto> de fondo + texto arriba.
// Imágenes: public/img/EJ-colchon/ (encargos en imagenes.json). Es una prueba: no publicar.
const IMG = (n: string) => `img/EJ-colchon/${n}.jpg`;

export const EXTRA_EJCOLCHON: Record<string, number> = { cifra: 0.6, idea: 0.5, cta: 1.0 };

// Texto arriba, encima de la imagen (la imagen deja libre el tercio de arriba)
const Arriba: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 26 }) => (
  <Zona top={250} bottom={1050} justify="flex-start" gap={gap}>
    {children}
  </Zona>
);

const ESCENAS: DefEscena[] = [
  {
    id: "hook",
    render: () => (
      <Escena sinEntrada sacudidas={[0.05]}>
        <Foto src={IMG("01-hucha")} zoom={[1.18, 1.02]} />
        <Sfx s="impacto" volumen={0.5} />
        <Arriba>
          <Pildora>ALIGN · FINANZAS FÁCILES</Pildora>
          <Palabras texto="¿Cuánto deberías tener **por si acaso?**" size={100} stagger={0.05} />
        </Arriba>
      </Escena>
    ),
  },
  {
    id: "imprevistos",
    render: () => (
      <Escena sonidoEntrada="swoosh">
        <Foto src={IMG("02-imprevistos")} zoom={[1.0, 1.12]} subir={30} />
        <Lluvia />
        <Arriba gap={10}>
          <Palabras texto="El coche." size={84} />
          <Palabras texto="El dentista." size={84} delay={0.7} />
          <Palabras texto="**Un mes sin ingresos.**" size={76} delay={1.4} resalta={COLORS.accent} maxWidth={940} />
        </Arriba>
      </Escena>
    ),
  },
  {
    id: "cifra",
    render: () => <EscenaCifra />,
  },
  {
    id: "idea",
    render: () => (
      <Escena sonidoEntrada="whoosh">
        <Foto src={IMG("04-crece")} zoom={[1.0, 1.15]} />
        <Sfx s="ding" volumen={0.35} en={0.9} />
        <Arriba>
          <Palabras texto="Primero, **el colchón.**" size={96} />
          <Palabras texto="Después, invertir." size={80} delay={0.8} color={COLORS.light} />
        </Arriba>
      </Escena>
    ),
  },
  {
    id: "cta",
    render: () => <Cta />,
  },
];

const EscenaCifra = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const t = frame / fps;
  return (
    <Escena sonidoEntrada="whoosh">
      <Foto src={IMG("03-llenando")} zoom={[1.12, 1.0]} subir={-20} />
      <Sfx s="pop" volumen={0.4} en={0.5} />
      <Arriba gap={18}>
        <Palabras texto="Eso es tu **colchón:**" size={78} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, opacity: t > 0.6 ? 1 : 0 }}>
          <Cifra a={3} de={0} inicio={0.6} fin={1.2} formato={(v) => String(Math.round(v))} size={170} ticks={false} />
          <span style={{ fontSize: 120, fontWeight: 900, color: COLORS.white }}>–</span>
          <Cifra a={6} de={3} inicio={1.2} fin={2.0} formato={(v) => String(Math.round(v))} size={170} />
          <span style={{ fontSize: 90, fontWeight: 900, color: COLORS.white }}>meses</span>
        </div>
        <Palabras texto="de tus gastos" size={70} delay={1.6} color={COLORS.light} />
        <Pildora delay={2.2}>Referencia habitual · depende de tu caso</Pildora>
      </Arriba>
    </Escena>
  );
};

const Cta = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSpring(0.35, 8, 0.8);
  const pulso = 1 + 0.035 * Math.sin((frame / fps) * Math.PI * 2.2);
  return (
    <Escena fondo="claro">
      <Sfx s="pop" volumen={0.4} en={0.35} />
      <Sfx s="click" volumen={0.4} en={1.2} />
      <Zona gap={46}>
        <Palabras texto="Comenta" size={100} color={COLORS.navy} />
        <div
          style={{
            fontSize: 150,
            fontWeight: 900,
            color: COLORS.white,
            background: `linear-gradient(160deg, #3B6BFF, ${COLORS.blue})`,
            padding: "26px 60px",
            borderRadius: 44,
            letterSpacing: 4,
            rotate: "-3deg",
            scale: String(s * pulso),
            boxShadow: `0 30px 80px ${COLORS.blue}66, inset 0 -10px 0 rgba(0,0,0,0.2)`,
          }}
        >
          COLCHÓN
        </div>
        <Palabras texto="y te mando **cómo organizarlo** en una llamada gratis" size={60} color={COLORS.navy} resalta={COLORS.blue} delay={0.8} />
        <div style={{ fontSize: 28, fontWeight: 600, color: COLORS.grey, marginTop: 10 }}>
          Contenido informativo, no es asesoramiento financiero.
        </div>
      </Zona>
    </Escena>
  );
};

export const EJColchon: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_EJCOLCHON} pista="lofi-polaroids.mp3" /> : null;
