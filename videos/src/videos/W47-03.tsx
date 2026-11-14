import React from "react";
import { interpolate, Series, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, euros } from "../brand";
import { BrandOutro, CountUp, KeywordCta, Pill, Stage, Title, useIn } from "../Scenes";

// Ejemplo hipotético del guion: nómina 1.600 €; ahorro 10 % = 160 €; resto 1.440 €
const NOMINA = 1600;
const AHORRO = 160;
const GASTO = NOMINA - AHORRO;

const sec = (s: number) => Math.round(s * 30);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* Casilla de ahorro (hook y cierre) */
const AhorroBox: React.FC<{ value: string; full: boolean }> = ({ value, full }) => (
  <div
    style={{
      fontSize: 64,
      fontWeight: 900,
      padding: "22px 44px",
      borderRadius: 24,
      border: `6px solid ${full ? COLORS.green : COLORS.red}`,
      backgroundColor: full ? COLORS.green : "transparent",
      color: full ? COLORS.navy : COLORS.red,
      whiteSpace: "nowrap",
    }}
  >
    AHORRO: {value}
  </div>
);

/* Barra de nómina que se vacía */
const Nomina: React.FC<{ level: number; label?: string }> = ({ level, label = "NÓMINA" }) => (
  <div style={{ width: 760 }}>
    <div style={{ fontSize: 42, fontWeight: 800, color: COLORS.light, marginBottom: 12 }}>{label}</div>
    <div style={{ height: 110, borderRadius: 26, backgroundColor: "#1E293B", overflow: "hidden" }}>
      <div style={{ width: `${level * 100}%`, height: "100%", backgroundColor: COLORS.accent, borderRadius: 26 }} />
    </div>
  </div>
);

const Hook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const level = interpolate(frame, [0, 2 * fps], [1, 0], clamp);
  return (
    <Stage gap={70}>
      <Title size={72} instant>
        «Ahorro lo que me sobra.»
        <br />
        <span style={{ color: COLORS.red }}>Por eso nunca sobra.</span>
      </Title>
      <Nomina level={level} />
      <AhorroBox value="0 €" full={false} />
    </Stage>
  );
};

/* Bloques de orden */
const Block: React.FC<{ text: string; color: string; n: number }> = ({ text, color, n }) => (
  <div
    style={{
      width: 620,
      padding: "26px 0",
      borderRadius: 26,
      backgroundColor: color,
      color: COLORS.navy,
      fontSize: 64,
      fontWeight: 900,
      textAlign: "center",
    }}
  >
    {n}. {text}
  </div>
);

const Order: React.FC<{ swap?: boolean; delay?: number }> = ({ swap = false, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = swap ? spring({ frame: frame - delay * fps, fps, config: { damping: 14 }, durationInFrames: 30 }) : 0;
  const STEP = 150;
  const items = [
    { text: "Cobrar", color: COLORS.light, pos: 0 },
    { text: "Gastar", color: COLORS.red, pos: 1 + t },
    { text: "Ahorrar", color: COLORS.green, pos: 2 - t },
  ];
  return (
    <div style={{ position: "relative", width: 620, height: STEP * 3 }}>
      {items.map((it) => (
        <div key={it.text} style={{ position: "absolute", top: it.pos * STEP, left: 0 }}>
          <Block text={it.text} color={it.color} n={Math.round(it.pos) + 1} />
        </div>
      ))}
    </div>
  );
};

const Reparto = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const segs = [0.3, 0.22, 0.18, 0.16, 0.14];
  let acc = 0;
  return (
    <Stage gap={50}>
      <Title size={76} instant>
        El orden de siempre:
        <br />
        <span style={{ color: COLORS.light }}>cobrar, gastar y ahorrar</span>
      </Title>
      <Pill instant>Ejemplo</Pill>
      <div style={{ fontSize: 110, fontWeight: 900, color: COLORS.white }}>{euros(NOMINA)}</div>
      <div style={{ width: 800, height: 110, borderRadius: 26, backgroundColor: COLORS.accent, overflow: "hidden", display: "flex" }}>
        {segs.map((w, i) => {
          const p = interpolate(frame, [(0.6 + i * 0.5) * fps, (0.9 + i * 0.5) * fps], [0, 1], clamp);
          acc += w;
          return <div key={i} style={{ width: `${w * 100 * p}%`, height: "100%", backgroundColor: i % 2 ? "#DC2626" : COLORS.red, borderRight: p > 0 ? `4px solid ${COLORS.navy}` : "none" }} />;
        })}
      </div>
      <div style={{ fontSize: 46, fontWeight: 800, color: COLORS.red }}>gastos, gastos, gastos…</div>
    </Stage>
  );
};

const Dia25 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const day = Math.round(interpolate(frame, [0, 1.2 * fps], [1, 25], clamp));
  return (
    <Stage gap={60}>
      <Title size={84} instant>
        Día 25: no queda
        <br />
        <span style={{ color: COLORS.red }}>nada que ahorrar</span>
      </Title>
      <div style={{ width: 300, borderRadius: 30, overflow: "hidden", backgroundColor: COLORS.white, textAlign: "center" }}>
        <div style={{ backgroundColor: COLORS.red, color: COLORS.white, fontSize: 44, fontWeight: 800, padding: 12 }}>DÍA</div>
        <div style={{ fontSize: 170, fontWeight: 900, color: COLORS.navy, fontVariantNumeric: "tabular-nums" }}>{day}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <span style={{ fontSize: 60, fontWeight: 800, color: COLORS.light }}>Para ahorrar:</span>
        <CountUp from={NOMINA} to={0} start={0} end={1.6} size={110} color={COLORS.red} format={(v) => euros(Math.round(v / 10) * 10)} />
      </div>
    </Stage>
  );
};

const Wow = () => {
  const p = useIn(1.6);
  return (
    <Stage gap={40}>
      <Title size={76} instant>
        Cambia el orden:
        <br />
        <span style={{ color: COLORS.green }}>cobrar, ahorrar y gastar</span>
      </Title>
      <Order swap delay={0.4} />
      <div style={{ display: "flex", gap: 40, opacity: p }}>
        <Pill bg={COLORS.green} size={48}>Ahorro fijo: {euros(AHORRO)}</Pill>
      </div>
      <div style={{ opacity: p }}>
        <Pill bg={COLORS.red} size={48}>Gasto: {euros(GASTO)}</Pill>
      </div>
    </Stage>
  );
};

const Cuenta: React.FC<{ title: string; color: string; amount?: string }> = ({ title, color, amount }) => (
  <div style={{ width: 300, height: 220, borderRadius: 30, backgroundColor: color, color: COLORS.navy, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
    <div style={{ fontSize: 40, fontWeight: 800 }}>{title}</div>
    {amount ? <div style={{ fontSize: 60, fontWeight: 900 }}>{amount}</div> : null}
  </div>
);

const Transfer = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [0.6 * fps, 1.8 * fps], [0, 1], clamp);
  const ang = (frame / fps) * 360;
  return (
    <Stage gap={60}>
      <Title size={76} instant>
        Día 1: transferencia automática
        <br />
        <span style={{ color: COLORS.green }}>a otra cuenta</span>
      </Title>
      <svg width={220} height={220} viewBox="-70 -70 140 140">
        <circle r={62} fill={COLORS.white} />
        <text y={-14} textAnchor="middle" fontSize={26} fontWeight={800} fill={COLORS.navy}>DÍA</text>
        <text y={34} textAnchor="middle" fontSize={56} fontWeight={900} fill={COLORS.blue}>1</text>
        <line x1={0} y1={0} x2={0} y2={-50} stroke={COLORS.red} strokeWidth={4} transform={`rotate(${ang})`} />
      </svg>
      <div style={{ display: "flex", alignItems: "center", gap: 20, width: 860, justifyContent: "space-between", position: "relative" }}>
        <Cuenta title="Nómina" color={COLORS.light} />
        <div style={{ flex: 1, height: 12, backgroundColor: COLORS.green, borderRadius: 6, transformOrigin: "left", scale: `${t} 1` }} />
        <div style={{ position: "absolute", left: 300 + t * 200, top: 70, fontSize: 52, fontWeight: 900, color: COLORS.green, opacity: t > 0 && t < 1 ? 1 : 0 }}>→</div>
        <Cuenta title="Ahorro" color={COLORS.green} amount={t >= 1 ? euros(AHORRO) : "0 €"} />
      </div>
    </Stage>
  );
};

const Vives = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const day = Math.round(interpolate(frame, [0.2 * fps, 2.4 * fps], [1, 30], clamp));
  return (
    <Stage gap={60}>
      <Title size={84} instant>
        Vives con lo que queda,
        <br />
        <span style={{ color: COLORS.light }}>sin pensarlo</span>
      </Title>
      <div style={{ width: 800 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 44, fontWeight: 800, color: COLORS.light, marginBottom: 12 }}>
          <span>Cuenta de gastos</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>Día {day}</span>
        </div>
        <div style={{ height: 110, borderRadius: 26, backgroundColor: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, fontWeight: 900, color: COLORS.navy }}>
          {euros(GASTO)}
        </div>
      </div>
      <AhorroBox value={euros(AHORRO)} full />
    </Stage>
  );
};

export const W4703 = () => (
  <Series>
    <Series.Sequence durationInFrames={sec(3)} name="Hook">
      <Hook />
    </Series.Sequence>
    <Series.Sequence durationInFrames={sec(3)} name="Segundo gancho">
      <Stage gap={60}>
        <Title size={84} instant>
          No es cuánto cobras.
          <br />
          <span style={{ color: COLORS.gold }}>Es el orden.</span>
        </Title>
        <Order />
      </Stage>
    </Series.Sequence>
    <Series.Sequence durationInFrames={sec(4)} name="Orden de siempre">
      <Reparto />
    </Series.Sequence>
    <Series.Sequence durationInFrames={sec(3)} name="Día 25">
      <Dia25 />
    </Series.Sequence>
    <Series.Sequence durationInFrames={sec(4)} name="WOW">
      <Wow />
    </Series.Sequence>
    <Series.Sequence durationInFrames={sec(3)} name="Día 1">
      <Transfer />
    </Series.Sequence>
    <Series.Sequence durationInFrames={sec(3)} name="Vives con lo que queda">
      <Vives />
    </Series.Sequence>
    <Series.Sequence durationInFrames={sec(4)} name="CTA">
      <KeywordCta word="SISTEMA" />
    </Series.Sequence>
    <Series.Sequence durationInFrames={sec(3)} name="Cierre">
      <BrandOutro
        line={
          <>
            Y lo que sobra,
            <br />
            <span style={{ color: COLORS.green }}>para gastar sin culpa.</span>
          </>
        }
        visual={<AhorroBox value={euros(AHORRO)} full />}
      />
    </Series.Sequence>
  </Series>
);
