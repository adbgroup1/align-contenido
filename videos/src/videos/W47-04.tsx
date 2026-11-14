import React from "react";
import { interpolate, Series, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, euros } from "../brand";
import { BrandOutro, CountUp, KeywordCta, Pill, Stage, Title, useIn } from "../Scenes";

// Ejemplo hipotético del guion (bruto anual): 24.000 € / 12 = 2.000 €; / 14 = 1.714 €
const TOTAL = 24000;
const sec = (s: number) => Math.round(s * 30);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BAR_W = 840;

/* Nómina dibujada */
const Payslip: React.FC<{ n: number; color: string; scale?: number }> = ({ n, color, scale = 1 }) => (
  <div style={{ width: 300 * scale, height: 380 * scale, borderRadius: 24 * scale, backgroundColor: COLORS.white, padding: 26 * scale, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 14 * scale }}>
    <div style={{ fontSize: 30 * scale, fontWeight: 800, color: COLORS.grey }}>NÓMINA</div>
    {[0.9, 0.7, 0.8].map((w, i) => (
      <div key={i} style={{ height: 14 * scale, width: `${w * 100}%`, backgroundColor: "#E2E8F0", borderRadius: 7 }} />
    ))}
    <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ fontSize: 130 * scale, fontWeight: 900, color, lineHeight: 1 }}>{n}</div>
    </div>
    <div style={{ fontSize: 28 * scale, fontWeight: 800, color, textAlign: "center" }}>pagas</div>
  </div>
);

const Payslips: React.FC<{ scale?: number; delay?: number; instant?: boolean }> = ({ scale = 1, delay = 0, instant = false }) => {
  const p = useIn(delay, instant);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wob = Math.sin((frame / fps) * Math.PI * 2) * 6;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 30 * scale, opacity: p }}>
      <Payslip n={12} color={COLORS.blue} scale={scale} />
      <div style={{ fontSize: 220 * scale, fontWeight: 900, color: COLORS.gold, rotate: `${wob}deg` }}>?</div>
      <Payslip n={14} color={COLORS.choco} scale={scale} />
    </div>
  );
};

/* Tableta de chocolate: n trozos, mismo ancho total */
const Tableta: React.FC<{ n: number; grow?: number; label?: string; labelOpacity?: number; hidden?: number[] }> = ({
  n,
  grow = 1,
  label,
  labelOpacity = 1,
  hidden = [],
}) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
    <div style={{ fontSize: 46, fontWeight: 800, color: COLORS.white }}>{n} trozos</div>
    <div style={{ width: BAR_W, height: 150, display: "flex", gap: 6, padding: 10, boxSizing: "border-box", backgroundColor: COLORS.choco, borderRadius: 18, scale: `${grow} 1`, transformOrigin: "left" }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{ flex: 1, backgroundColor: COLORS.chocoLight, borderRadius: 8, opacity: hidden.includes(i) ? 0.15 : 1 }} />
      ))}
    </div>
    {label ? <div style={{ fontSize: 52, fontWeight: 900, color: COLORS.gold, opacity: labelOpacity }}>{label}</div> : null}
  </div>
);

const Tabletas = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g1 = interpolate(frame, [0.2 * fps, 0.9 * fps], [0, 1], clamp);
  const g2 = interpolate(frame, [0.6 * fps, 1.3 * fps], [0, 1], clamp);
  return (
    <Stage gap={50}>
      <Title size={84} instant>
        Spoiler: <span style={{ color: COLORS.red }}>no.</span>
        <br />
        Mira las dos tabletas.
      </Title>
      <Tableta n={12} grow={g1} />
      <Tableta n={14} grow={g2} />
    </Stage>
  );
};

const Importes = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l1 = interpolate(frame, [0.5 * fps, 0.9 * fps], [0, 1], clamp);
  const l2 = interpolate(frame, [1.3 * fps, 1.7 * fps], [0, 1], clamp);
  return (
    <Stage gap={40}>
      <Title size={76} instant>
        12 pagas de 2.000 €
        <br />
        <span style={{ color: COLORS.gold }}>o 14 de 1.714 €</span>
      </Title>
      <Pill instant>Ejemplo · bruto anual</Pill>
      <Tableta n={12} label="2.000 € cada trozo" labelOpacity={l1} />
      <Tableta n={14} label="1.714 € cada trozo" labelOpacity={l2} />
    </Stage>
  );
};

const Wow = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 0.3 * fps, fps, config: { damping: 15 }, durationInFrames: 30 });
  const eq = spring({ frame: frame - 1.2 * fps, fps, config: { damping: 10 } });
  return (
    <Stage gap={30}>
      <Title size={92} instant>
        Mismo total:
        <br />
        <span style={{ color: COLORS.gold }}>{euros(TOTAL)}</span>
      </Title>
      <div style={{ position: "relative", height: 520, width: BAR_W }}>
        <div style={{ position: "absolute", top: 0, left: 0 }}>
          <Tableta n={12} />
        </div>
        <div style={{ position: "absolute", top: 320 - t * 100, left: 0 }}>
          <Tableta n={14} />
        </div>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: -6, borderLeft: `6px dashed ${COLORS.gold}`, opacity: eq }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, right: -6, borderRight: `6px dashed ${COLORS.gold}`, opacity: eq }} />
      </div>
      <div style={{ fontSize: 200, fontWeight: 900, color: COLORS.gold, lineHeight: 0.8, scale: String(eq) }}>=</div>
    </Stage>
  );
};

const Regalo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const open = interpolate(frame, [0.6 * fps, 1.3 * fps], [0, 1], clamp);
  const rise = interpolate(frame, [1.0 * fps, 1.8 * fps], [0, 1], clamp);
  return (
    <Stage gap={60}>
      <Title size={84} instant>
        La paga extra
        <br />
        <span style={{ color: COLORS.red }}>no es dinero extra</span>
      </Title>
      <div style={{ position: "relative", width: 420, height: 720 }}>
        <div style={{ position: "absolute", left: 60, bottom: 60 + rise * 260, opacity: rise }}>
          <Payslip n={14} color={COLORS.choco} scale={1} />
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 20, width: 380, height: 260, backgroundColor: COLORS.red, borderRadius: 16 }}>
          <div style={{ position: "absolute", left: 165, top: 0, bottom: 0, width: 50, backgroundColor: COLORS.gold }} />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 250,
            left: 0,
            width: 420,
            height: 70,
            backgroundColor: "#DC2626",
            borderRadius: 14,
            transformOrigin: "left bottom",
            rotate: `${-open * 12}deg`,
            translate: `${-open * 60}px ${-open * 30}px`,
            opacity: 1 - open,
          }}
        >
          <div style={{ position: "absolute", left: 185, top: 0, bottom: 0, width: 50, backgroundColor: COLORS.gold }} />
        </div>
      </div>
    </Stage>
  );
};

const Trozo: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 90 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: 110, backgroundColor: COLORS.chocoLight, border: `6px solid ${COLORS.choco}`, borderRadius: 10 }} />
);

const Calendario = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 0.5 * fps, fps, config: { damping: 16 }, durationInFrames: 36 });
  const piece = (BAR_W - 20 - 13 * 6) / 14;
  const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  const cellW = 200;
  const cellH = 90;
  const cell = (i: number) => ({ x: (i % 4) * (cellW + 13), y: 330 + Math.floor(i / 4) * (cellH + 14) });
  const jun = cell(5);
  const dic = cell(11);
  const fromX = (i: number) => 10 + i * (piece + 6);
  return (
    <Stage gap={40}>
      <Title size={80} instant>
        Es tu sueldo,
        <br />
        <span style={{ color: COLORS.gold }}>que llega más tarde</span>
      </Title>
      <div style={{ position: "relative", width: BAR_W, height: 640 }}>
        <div style={{ position: "absolute", top: 60 }}>
          <div style={{ width: BAR_W, height: 150, display: "flex", gap: 6, padding: 10, boxSizing: "border-box", backgroundColor: COLORS.choco, borderRadius: 18 }}>
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: COLORS.chocoLight, borderRadius: 8, opacity: i >= 12 ? 0.15 : 1 }} />
            ))}
          </div>
        </div>
        {months.map((m, i) => {
          const c = cell(i);
          const hot = i === 5 || i === 11;
          return (
            <div key={m} style={{ position: "absolute", left: c.x, top: c.y, width: cellW, height: cellH, borderRadius: 14, backgroundColor: hot ? COLORS.gold : "#1E293B", color: hot ? COLORS.navy : COLORS.light, fontSize: 36, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "flex-start", paddingLeft: 24, boxSizing: "border-box" }}>
              {m}
            </div>
          );
        })}
        <Trozo x={interpolate(t, [0, 1], [fromX(12), jun.x + cellW - piece - 12])} y={interpolate(t, [0, 1], [70, jun.y - 10])} w={piece} />
        <Trozo x={interpolate(t, [0, 1], [fromX(13), dic.x + cellW - piece - 12])} y={interpolate(t, [0, 1], [70, dic.y - 10])} w={piece} />
      </div>
    </Stage>
  );
};

const Planifica = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pots = [
    { name: "Colchón", color: COLORS.green },
    { name: "Gastos del año", color: COLORS.accent },
    { name: "Capricho", color: COLORS.gold },
  ];
  return (
    <Stage gap={50}>
      <Title size={84} instant>
        Planifícala
        <br />
        <span style={{ color: COLORS.green }}>antes de que llegue</span>
      </Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 30, width: 840 }}>
        {pots.map((p, i) => {
          const a = spring({ frame: frame - (0.3 + i * 0.5) * fps, fps, config: { damping: 14 } });
          return (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 30, opacity: a, translate: `${(1 - a) * -200}px 0px` }}>
              <div style={{ width: 120, height: 100, backgroundColor: COLORS.chocoLight, border: `6px solid ${COLORS.choco}`, borderRadius: 10 }} />
              <div style={{ fontSize: 60, fontWeight: 900, color: COLORS.navy, backgroundColor: p.color, padding: "16px 34px", borderRadius: 20 }}>{p.name}</div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

export const W4704 = () => (
  <Series>
    <Series.Sequence durationInFrames={sec(3)} name="Hook">
      <Stage gap={70}>
        <Title size={88} instant>
          ¿Con 14 pagas cobras
          <br />
          <span style={{ color: COLORS.gold }}>más que con 12?</span>
        </Title>
        <Payslips instant />
      </Stage>
    </Series.Sequence>
    <Series.Sequence durationInFrames={sec(3)} name="Segundo gancho">
      <Tabletas />
    </Series.Sequence>
    <Series.Sequence durationInFrames={sec(3)} name="Ejemplo 24.000">
      <Stage gap={50}>
        <Title size={84} instant>
          Ejemplo:
        </Title>
        <CountUp to={TOTAL} end={2} size={170} color={COLORS.gold} format={(v) => euros(Math.round(v / 100) * 100)} />
        <Title size={72} instant>
          brutos al año
        </Title>
        <Pill instant>Ejemplo</Pill>
      </Stage>
    </Series.Sequence>
    <Series.Sequence durationInFrames={sec(4)} name="Importes">
      <Importes />
    </Series.Sequence>
    <Series.Sequence durationInFrames={sec(4)} name="WOW">
      <Wow />
    </Series.Sequence>
    <Series.Sequence durationInFrames={sec(3)} name="Regalo">
      <Regalo />
    </Series.Sequence>
    <Series.Sequence durationInFrames={sec(3)} name="Calendario">
      <Calendario />
    </Series.Sequence>
    <Series.Sequence durationInFrames={sec(3)} name="Planifícala">
      <Planifica />
    </Series.Sequence>
    <Series.Sequence durationInFrames={sec(4)} name="CTA">
      <KeywordCta word="CURSO" />
    </Series.Sequence>
    <Series.Sequence durationInFrames={sec(3)} name="Cierre">
      <BrandOutro
        line={
          <>
            Así que ya sabes:
            <br />
            <span style={{ color: COLORS.gold }}>¿12 o 14?</span>
          </>
        }
        visual={<Payslips scale={0.75} delay={0.2} />}
      />
    </Series.Sequence>
  </Series>
);
