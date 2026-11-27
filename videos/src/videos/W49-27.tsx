import React from "react";
import { AbsoluteFill } from "remotion";
import { DefEscena, Montaje, PropsVoz } from "../kit";
import { AppBanco, Aviso, en, Movimiento, PreguntaFinal } from "../estilos";

// W49-27 · «POV: abres la app del banco después de la posada» · Reel · ESTILO banco · CIERRE remate + pregunta
// Voz de narradora joven, en primera persona, con quejas y risas. Montos de ejemplo (no son datos).

export const EXTRA_W4927: Record<string, number> = { hook: 0.4, tiendita: 0.3, remate: 1.8 };

const ESCENAS: DefEscena[] = ["hook", "intercambio", "uber", "tacos", "tiendita", "truco", "remate"].map((id) => ({
  id,
  render: ({ voz }) =>
    id === "remate" ? (
      <AbsoluteFill>
        <PreguntaFinal texto="¿Cuánto se fue en tu posada? 👇" en={voz.segundos + 0.15} y={690} />
        <Aviso caja y={1500} />
      </AbsoluteFill>
    ) : null,
}));

export const W4927: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? (
    <Montaje
      videoId={videoId}
      voz={voz}
      escenas={ESCENAS}
      extra={EXTRA_W4927}
      pista="lofi-polaroids.mp3"
      subtitulos="caja"
      subY={1170}
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
