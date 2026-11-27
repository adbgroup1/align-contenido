import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { DefEscena, ENTRADA_VOZ, EscenaVoz, Montaje, PropsVoz, Sfx, SubtituloFrase } from "../kit";
import { AppBanco, Aviso, clamp, en, entrada, F, Movimiento, pesos, PreguntaFinal } from "../estilos";

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

// «El truco»: sin esto, 12 s de la misma pantalla quieta. Sube una hoja de «Apartado · Fiestas» que se llena con
// «aparta una lana» y se vacía con «cuando se acaba»; con «se acabó la fiesta», sello. Tiempos atados a las palabras.
const palabra = (voz: EscenaVoz, w: string, def: number) => voz.palabras.find((p) => p.t.toLowerCase().startsWith(w))?.inicio ?? def;
const Apartado: React.FC<{ voz: EscenaVoz }> = ({ voz }) => {
  const t = (useCurrentFrame() - ENTRADA_VOZ) / useVideoConfig().fps;
  const tAparta = palabra(voz, "aparta", 2.4);
  const tAcaba = palabra(voz, "acaba", 5.6);
  const tAcabo = palabra(voz, "acabó", 6.6);
  const sube = entrada(t, Math.max(0, tAparta - 0.5), 0.45);
  const lleno = interpolate(t, [tAparta, tAparta + 1.6], [0, 1], clamp) * (1 - interpolate(t, [tAcaba, tAcabo], [0, 1], clamp));
  const sello = entrada(t, tAcabo, 0.25);
  const META = 1500;
  return (
    <>
      <div style={{ position: "absolute", left: 60, right: 60, top: 920 + (1 - sube) * 900, height: 520, background: "#fff", borderRadius: 40, boxShadow: "0 -10px 40px rgba(0,0,0,0.25)", fontFamily: F.roboto, padding: "40px 50px" }}>
        <div style={{ fontSize: 40, color: "#6B7280" }}>Apartado</div>
        <div style={{ fontSize: 64, fontWeight: 900, color: "#111827", marginTop: 4 }}>Fiestas 🎉</div>
        <div style={{ fontSize: 110, fontWeight: 900, color: "#134E4A", marginTop: 20, fontVariantNumeric: "tabular-nums", letterSpacing: -3 }}>{pesos(META * lleno)}</div>
        <div style={{ height: 34, borderRadius: 17, background: "#E5E7EB", marginTop: 26, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${lleno * 100}%`, background: lleno > 0.25 ? "#10B981" : "#EF4444", borderRadius: 17 }} />
        </div>
        <div style={{ fontSize: 34, color: "#6B7280", marginTop: 16 }}>Solo para posadas, intercambios y tacos</div>
      </div>
      {sello > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1130, display: "flex", justifyContent: "center" }}>
          <div style={{ rotate: "-8deg", scale: String(1.6 - 0.6 * sello), opacity: sello, border: "10px solid #DC2626", color: "#DC2626", fontFamily: F.anton, fontSize: 92, padding: "6px 34px", borderRadius: 16, background: "rgba(255,255,255,0.85)" }}>
            SE ACABÓ LA FIESTA
          </div>
        </div>
      ) : null}
      <Sfx s="whoosh" volumen={0.35} en={Math.max(0, tAparta - 0.5)} />
      <Sfx s="impacto" volumen={0.45} en={tAcabo} />
    </>
  );
};

const ESCENAS: DefEscena[] = ["hook", "intercambio", "uber", "tacos", "tiendita", "truco", "remate"].map((id) => ({
  id,
  estiloSub: "ninguno",
  render: ({ voz }) =>
    id === "truco" ? (
      <AbsoluteFill>
        <Apartado voz={voz} />
        <SubHastaFin voz={voz} desde={ENTRADA_VOZ} />
      </AbsoluteFill>
    ) : id !== "remate" ? (
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
