import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { DefEscena, ENTRADA_VOZ, EscenaVoz, Montaje, PropsVoz, SubtituloFrase } from "../kit";
import { AppBanco, Aviso, en, Movimiento, PreguntaFinal } from "../estilos";

// W49-27 · «POV: abres la app del banco después de la posada» · Reel · ESTILO banco · CIERRE remate + pregunta
// Voz de narradora joven, en primera persona, con quejas y risas. Montos de ejemplo (no son datos).

export const EXTRA_W4927: Record<string, number> = { hook: 0.4, tiendita: 0.3, remate: 1.8 };

// Subtítulos entre el saldo y la tarjeta de movimientos (caja de 698 a 790), de 3 en 3 palabras para que no salgan
// en dos líneas encima del saldo. En el remate, la caja se va al acabar la voz y en su sitio sale la pregunta, con el
// aviso legal justo debajo (sin tapar movimientos).
const SUB_Y = 1130;
const SubHastaFin: React.FC<{ voz: EscenaVoz; desde: number }> = ({ voz, desde }) => {
  const t = (useCurrentFrame() - desde) / useVideoConfig().fps;
  return t > voz.segundos + 0.1 ? null : <SubtituloFrase palabras={voz.palabras} desde={desde} estilo="caja" y={SUB_Y} porPagina={3} />;
};
const AvisoTrasVoz: React.FC<{ voz: EscenaVoz }> = ({ voz }) => {
  const t = (useCurrentFrame() - ENTRADA_VOZ) / useVideoConfig().fps;
  return t > voz.segundos + 0.1 ? <Aviso caja y={776} /> : null;
};

const ESCENAS: DefEscena[] = ["hook", "intercambio", "uber", "tacos", "tiendita", "truco", "remate"].map((id) => ({
  id,
  estiloSub: "ninguno",
  render: ({ voz }) =>
    id !== "remate" ? (
      <SubHastaFin voz={voz} desde={id === "hook" ? 0 : ENTRADA_VOZ} />
    ) : (
      <AbsoluteFill>
        <SubHastaFin voz={voz} desde={ENTRADA_VOZ} />
        <PreguntaFinal texto="¿Cuánto se fue en tu posada? 👇" en={voz.segundos + 0.15} y={680} tam={46} />
        <AvisoTrasVoz voz={voz} />
      </AbsoluteFill>
    ),
}));

export const W4927: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? (
    <Montaje
      videoId={videoId}
      voz={voz}
      escenas={ESCENAS}
      extra={EXTRA_W4927}
      pista="lofi-polaroids.mp3"
      subtitulos="ninguno"
      subY={SUB_Y}
      fondoFijo={({ inicios }) => {
        const m: Movimiento[] = [
          { en: en(inicios, "intercambio", 0.3), concepto: "Intercambio posada", monto: -500, icono: "🎁" },
          { en: en(inicios, "intercambio", 2.2), concepto: "Bolsita de regalo", monto: -80, icono: "🛍️" },
          { en: en(inicios, "uber", 0.2), concepto: "Viaje · ida", monto: -164, icono: "🚗" },
          { en: en(inicios, "uber", 1.6), concepto: "Viaje · regreso 2:47 a.m.", monto: -238, icono: "🚗" },
          { en: en(inicios, "tacos", 0.2), concepto: "Taquería El Güero", monto: -260, icono: "🌮" },
          { en: en(inicios, "tiendita", 0.6), concepto: "Tiendita", monto: -89, icono: "🏪" },
          { en: en(inicios, "tiendita", 1.0), concepto: "Tiendita", monto: -45, icono: "🏪" },
          { en: en(inicios, "tiendita", 1.4), concepto: "Tiendita", monto: -112, icono: "🏪" },
        ];
        return <AppBanco saldoInicial={1630.5} movimientos={m} titular="Cuenta de nómina" color="#134E4A" />;
      }}
    />
  ) : null;
