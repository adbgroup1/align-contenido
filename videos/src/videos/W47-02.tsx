import React from "react";
import { interpolate, Series, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, euros, futureValueAt } from "../brand";
import { BrandOutro, CountUp, KeywordCta, Pill, Stage, Title, useIn } from "../Scenes";

// Ejemplo hipotético del guion: 100 €/mes al 6 % anual, capitalización mensual
const RATE = 0.06;
const fv = (months: number) => futureValueAt(100, RATE, months);
const lucia = (age: number) => fv((age - 25) * 12);
const marcos = (age: number) => fv((age - 35) * 12);
const MAX = lucia(65); // 199.149 €

const LUCIA = COLORS.accent;
const MARCOS = COLORS.gold;
const EJEMPLO = "Ejemplo hipotético · 6 % anual";

/* Hucha dibujada en código */
const Hucha: React.FC<{ age: number | string; color: string; name?: string; delay?: number; instant?: boolean }> = ({
  age,
  color,
  name,
  delay = 0,
  instant = false,
}) => {
  const p = useIn(delay, instant);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: p, scale: String(0.85 + 0.15 * p) }}>
      <div
        style={{
          width: 170,
          height: 170,
          borderRadius: 999,
          backgroundColor: color,
          color: COLORS.navy,
          fontSize: 86,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {age}
      </div>
      {name ? <div style={{ fontSize: 52, fontWeight: 800, color }}>{name}</div> : null}
      <svg width={260} height={190} viewBox="0 0 260 190">
        <ellipse cx={130} cy={105} rx={115} ry={78} fill={color} />
        <rect x={95} y={30} width={70} height={12} rx={6} fill={COLORS.navy} />
        <rect x={45} y={160} width={30} height={30} rx={6} fill={color} />
        <rect x={185} y={160} width={30} height={30} rx={6} fill={color} />
        <circle cx={70} cy={90} r={9} fill={COLORS.navy} />
      </svg>
      <div style={{ fontSize: 46, fontWeight: 800, color: COLORS.white }}>100 €/mes</div>
    </div>
  );
};

/* Gráfico de las dos curvas */
const W = 860;
const H = 640;
const x = (age: number) => ((age - 25) / 40) * W;
const y = (v: number) => H - (v / MAX) * (H - 20);
const path = (f: (a: number) => number, from: number, to: number) => {
  const pts: string[] = [];
  for (let a = from; a <= to + 1e-6; a += 0.25) pts.push(`${x(a).toFixed(1)},${y(Math.max(0, f(a))).toFixed(1)}`);
  return "M" + pts.join(" L");
};

const Curves: React.FC<{ fromAge: number; toAge: number; startSec?: number; endSec: number; clock?: boolean }> = ({
  fromAge,
  toAge,
  startSec = 0,
  endSec,
  clock = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const age = interpolate(frame, [startSec * fps, endSec * fps], [fromAge, toAge], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ang = (frame / fps) * 360;
  return (
    <svg width={W} height={H + 70} viewBox={`0 0 ${W} ${H + 70}`} style={{ overflow: "visible" }}>
      <line x1={0} y1={H} x2={W} y2={H} stroke={COLORS.grey} strokeWidth={4} />
      {[25, 35, 45, 55, 65].map((a) => (
        <text key={a} x={x(a)} y={H + 55} fill={COLORS.light} fontSize={36} fontWeight={700} textAnchor="middle">
          {a}
        </text>
      ))}
      <path d={path(lucia, 25, age)} fill="none" stroke={LUCIA} strokeWidth={14} strokeLinecap="round" />
      <path d={path(marcos, 25, age)} fill="none" stroke={MARCOS} strokeWidth={14} strokeLinecap="round" />
      {clock ? (
        <g transform={`translate(${x(age)}, ${y(lucia(age)) + 10})`}>
          <circle r={50} fill={COLORS.white} stroke={COLORS.navy} strokeWidth={6} />
          <line x1={0} y1={0} x2={0} y2={-34} stroke={COLORS.navy} strokeWidth={7} strokeLinecap="round" transform={`rotate(${ang * 2})`} />
          <line x1={0} y1={0} x2={22} y2={0} stroke={COLORS.navy} strokeWidth={7} strokeLinecap="round" transform={`rotate(${ang / 4})`} />
        </g>
      ) : null}
    </svg>
  );
};

const Legend = () => (
  <div style={{ display: "flex", gap: 50 }}>
    <span style={{ fontSize: 46, fontWeight: 800, color: LUCIA }}>● Lucía</span>
    <span style={{ fontSize: 46, fontWeight: 800, color: MARCOS }}>● Marcos</span>
  </div>
);

/* Barras de aportación y final */
const Bars: React.FC<{ a: number; b: number; max: number; labelA: string; labelB: string; highlight?: "diff" | "half"; delay?: number }> = ({
  a,
  b,
  max,
  labelA,
  labelB,
  highlight,
  delay = 0.2,
}) => {
  const p = useIn(delay);
  const hl = useIn(delay + 0.9);
  const HB = 620;
  const hA = (a / max) * HB * p;
  const hB = (b / max) * HB * p;
  const Bar = ({ h, color, label, name, children }: { h: number; color: string; label: string; name: string; children?: React.ReactNode }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: HB + 160, width: 300 }}>
      <div style={{ position: "relative", width: 260, height: h, backgroundColor: color, borderRadius: "24px 24px 0 0" }}>
        <div style={{ position: "absolute", top: 18, left: 0, right: 0, textAlign: "center", fontSize: 46, fontWeight: 900, color: COLORS.navy, whiteSpace: "nowrap", opacity: h > 80 ? 1 : 0 }}>{label}</div>
        {children}
      </div>
      <div style={{ fontSize: 46, fontWeight: 800, color, marginTop: 16 }}>{name}</div>
    </div>
  );
  return (
    <div style={{ display: "flex", gap: 80, alignItems: "flex-end" }}>
      <Bar h={hA} color={LUCIA} label={labelA} name="Lucía">
        {highlight === "half" ? (
          <div
            style={{
              position: "absolute",
              left: -20,
              right: -20,
              top: "50%",
              borderTop: `6px dashed ${COLORS.white}`,
              opacity: hl,
            }}
          />
        ) : null}
      </Bar>
      <Bar h={hB} color={MARCOS} label={labelB} name="Marcos">
        {highlight === "diff" ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: "100%",
              boxSizing: "border-box",
              height: hA - hB,
              border: `6px dashed ${COLORS.red}`,
              borderBottom: "none",
              borderRadius: "24px 24px 0 0",
              opacity: hl,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLORS.red,
              fontSize: 42,
              fontWeight: 900,
              whiteSpace: "nowrap",
            }}
          >
            −12.000 €
          </div>
        ) : null}
      </Bar>
    </div>
  );
};

const S = 30; // fps
const sec = (s: number) => Math.round(s * S);
const roundK = (v: number) => euros(Math.round(v / 1000) * 1000);

export const W4702 = () => (
  <Series>
    {/* 1 · HOOK 0–3 */}
    <Series.Sequence durationInFrames={sec(3)} name="Hook">
      <Stage gap={70}>
        <Title size={76} instant>
          Mismos 100 € al mes.
          <br />
          <span style={{ color: COLORS.gold }}>Diez años de diferencia.</span>
        </Title>
        <div style={{ display: "flex", gap: 90 }}>
          <Hucha age={25} color={LUCIA} instant />
          <Hucha age={35} color={MARCOS} instant />
        </div>
      </Stage>
    </Series.Sequence>
    {/* 2 · SEGUNDO GANCHO 3–6 */}
    <Series.Sequence durationInFrames={sec(3)} name="Segundo gancho">
      <SecondHook />
    </Series.Sequence>
    {/* 3 · 6–9 */}
    <Series.Sequence durationInFrames={sec(3)} name="Hasta los 65">
      <Timeline />
    </Series.Sequence>
    {/* 4 · 9–12 */}
    <Series.Sequence durationInFrames={sec(3)} name="Quién acaba con más">
      <Stage bg={COLORS.deep} gap={40}>
        <Title size={96} instant>
          ¿Quién acaba con más?
        </Title>
        <Pill instant>{EJEMPLO}</Pill>
        <Legend />
        <Curves fromAge={25} toAge={42} endSec={3} />
      </Stage>
    </Series.Sequence>
    {/* 5 · WOW 12–16 */}
    <Series.Sequence durationInFrames={sec(4)} name="WOW curvas">
      <Stage bg={COLORS.deep} gap={30}>
        <div style={{ display: "flex", gap: 30, width: "100%", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: LUCIA }}>Lucía: unos</div>
            <CountUp to={199000} end={3.2} size={76} color={LUCIA} format={roundK} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: MARCOS }}>Marcos: unos</div>
            <CountUp to={100000} end={3.2} size={76} color={MARCOS} format={roundK} />
          </div>
        </div>
        <Pill instant>{EJEMPLO}</Pill>
        <Curves fromAge={42} toAge={65} endSec={3.2} />
      </Stage>
    </Series.Sequence>
    {/* 6 · RE-HOOK 16–19 */}
    <Series.Sequence durationInFrames={sec(3)} name="Re-hook aportación">
      <Stage gap={30}>
        <Title size={84} instant>
          Marcos aportó solo <span style={{ color: COLORS.red }}>12.000 € menos…</span>
        </Title>
        <Pill instant>{EJEMPLO}</Pill>
        <Bars a={48000} b={36000} max={48000} labelA="48.000 €" labelB="36.000 €" highlight="diff" delay={0} />
      </Stage>
    </Series.Sequence>
    {/* 7 · 19–22 */}
    <Series.Sequence durationInFrames={sec(3)} name="La mitad">
      <Stage gap={30}>
        <Title size={92} instant>
          …y acaba con <span style={{ color: COLORS.gold }}>la mitad</span>
        </Title>
        <Pill instant>{EJEMPLO}</Pill>
        <Bars a={lucia(65)} b={marcos(65)} max={lucia(65)} labelA="199.000 €" labelB="100.000 €" highlight="half" delay={0} />
      </Stage>
    </Series.Sequence>
    {/* 8 · 22–25 */}
    <Series.Sequence durationInFrames={sec(3)} name="El tiempo">
      <Stage bg={COLORS.deep} gap={50}>
        <Title size={92} instant>
          El tiempo hace
          <br />
          <span style={{ color: LUCIA }}>el trabajo pesado</span>
        </Title>
        <Curves fromAge={45} toAge={65} endSec={2.6} clock />
      </Stage>
    </Series.Sequence>
    {/* 9 · CTA 25–29 */}
    <Series.Sequence durationInFrames={sec(4)} name="CTA">
      <KeywordCta word="CURSO" />
    </Series.Sequence>
    {/* 10 · CIERRE 29–32 */}
    <Series.Sequence durationInFrames={sec(3)} name="Cierre">
      <BrandOutro
        line={
          <>
            La diferencia no fue el dinero.
            <br />
            <span style={{ color: COLORS.gold }}>Fueron diez años.</span>
          </>
        }
        visual={
          <div style={{ display: "flex", gap: 90, scale: "0.8" }}>
            <Hucha age={25} color={LUCIA} delay={0.3} />
            <Hucha age={35} color={MARCOS} delay={0.3} />
          </div>
        }
      />
    </Series.Sequence>
  </Series>
);

const SecondHook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ageM = Math.round(interpolate(frame, [0.6 * fps, 2.2 * fps], [25, 35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <Stage gap={60}>
      <Title size={74} instant>
        <span style={{ color: LUCIA }}>Lucía</span> empieza a los 25.
        <br />
        <span style={{ color: MARCOS }}>Marcos</span>, a los 35.
      </Title>
      <div style={{ display: "flex", gap: 90 }}>
        <Hucha age={25} color={LUCIA} name="Lucía" instant />
        <Hucha age={ageM} color={MARCOS} name="Marcos" instant />
      </div>
    </Stage>
  );
};

const Timeline = () => {
  const p = useIn(0.2);
  const Row = ({ from, color, name }: { from: number; color: string; name: string }) => (
    <div style={{ width: 860 }}>
      <div style={{ fontSize: 44, fontWeight: 800, color, marginBottom: 10 }}>{name}</div>
      <div style={{ position: "relative", height: 50, backgroundColor: "#1E293B", borderRadius: 25 }}>
        <div
          style={{
            position: "absolute",
            left: `${((from - 25) / 40) * 100}%`,
            width: `${((65 - from) / 40) * 100 * p}%`,
            top: 0,
            bottom: 0,
            backgroundColor: color,
            borderRadius: 25,
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 36, fontWeight: 700, color: COLORS.light, marginTop: 8 }}>
        <span>25</span>
        <span>35</span>
        <span>65</span>
      </div>
    </div>
  );
  return (
    <Stage gap={50}>
      <Title size={92} instant>
        Los dos aportan
        <br />
        <span style={{ color: COLORS.gold }}>hasta los 65</span>
      </Title>
      <Pill instant>{EJEMPLO}</Pill>
      <Row from={25} color={LUCIA} name="Lucía · desde los 25" />
      <Row from={35} color={MARCOS} name="Marcos · desde los 35" />
    </Stage>
  );
};

