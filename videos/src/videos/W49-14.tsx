import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../brand";
import { Chispas, CtaCrecer, DefEscena, Escena, Fondo, Montaje, Pildora, PropsVoz, Rotulo, Sfx } from "../kit";

// W49-14 · «Para ahorrar necesito tener dinero» · Reel · Ironía relatable + reto de casillas · H10 (+ H7)
// Cálculo propio: 10 + 20 + … + 200 = 2,100. Sin otras cifras ni promesas.
// El cochinito (alcancía rosa con una oreja doblada) y el plumón rojo. Todo DIBUJO.

export const EXTRA_W4914: Record<string, number> = { hook: 0.15, tablero: 0.2, dias: 0.2, wow: 0.8, cta: 0.9 };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pesos = (v: number) => "$" + String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const ROSA = "#F9A8D4";
const ROSA_OSC = "#EC4899";
const ROJO = "#E11D48";

const useSeg = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/* ---------- El cochinito ---------- */
const Cochinito: React.FC<{
  x: number;
  y: number;
  escala?: number;
  bocaAbajo?: number; // 0–1
  cara?: "abandonado" | "atento" | "feliz";
  oreja?: number; // 0 = doblada, 1 = levantada
  lleno?: number;
  baila?: boolean;
}> = ({ x, y, escala = 1, bocaAbajo = 0, cara = "abandonado", oreja = 0, lleno = 0, baila = false }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const parpadeo = frame % 85 < 4 ? 0.1 : 1;
  const resp = Math.sin(t * 3) * 3;
  const bai = baila ? Math.sin(t * 9) : 0;
  const N = COLORS.navy;
  const gordo = 1 + lleno * 0.1;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 200 * escala,
        top: y - 300 * escala + (baila ? -Math.abs(bai) * 30 : 0),
        width: 400 * escala,
        height: 300 * escala,
        rotate: `${bocaAbajo * 180 + bai * 10}deg`,
        transformOrigin: "50% 55%",
      }}
    >
      <svg width={400 * escala} height={300 * escala} viewBox="0 0 400 300" style={{ overflow: "visible", filter: "drop-shadow(0 18px 26px rgba(0,0,0,0.35))" }}>
        {/* patas */}
        {[110, 160, 240, 290].map((lx, i) => (
          <rect key={lx} x={lx - 18} y={226 + (baila ? (i % 2 ? bai : -bai) * 10 : 0)} width={36} height={52} rx={12} fill={ROSA_OSC} stroke={N} strokeWidth={5} />
        ))}
        {/* cola */}
        <path d={`M352 150 q30 -10 24 -30 q-6 -18 -20 -4 q-10 14 10 20`} stroke={ROSA_OSC} strokeWidth={8} fill="none" strokeLinecap="round" />
        {/* cuerpo */}
        <g transform={`translate(200 160) scale(${gordo} ${gordo + resp * 0.004}) translate(-200 -160)`}>
          <ellipse cx={200} cy={160} rx={160} ry={110} fill={ROSA} stroke={N} strokeWidth={6} />
          <ellipse cx={150} cy={110} rx={50} ry={24} fill={COLORS.white} opacity={0.35} transform="rotate(-20 150 110)" />
          {/* ranura */}
          <rect x={170} y={52} width={70} height={14} rx={7} fill={N} />
          {/* orejas */}
          <path d="M96 80 L84 18 L140 58 Z" fill={ROSA_OSC} stroke={N} strokeWidth={5} strokeLinejoin="round" />
          <g transform={`rotate(${(1 - oreja) * 70} 262 66)`}>
            <path d="M250 62 L282 8 L300 74 Z" fill={ROSA_OSC} stroke={N} strokeWidth={5} strokeLinejoin="round" />
          </g>
          {/* hocico */}
          <ellipse cx={80} cy={180} rx={46} ry={36} fill={ROSA_OSC} stroke={N} strokeWidth={5} />
          <ellipse cx={66} cy={180} rx={7} ry={11} fill={N} />
          <ellipse cx={94} cy={180} rx={7} ry={11} fill={N} />
          {/* ojos */}
          {[110, 168].map((ex) => (
            <g key={ex} transform={`translate(${ex} 126) scale(1 ${parpadeo})`}>
              <ellipse rx={18} ry={cara === "atento" ? 22 : 18} fill={COLORS.white} stroke={N} strokeWidth={4} />
              <circle cx={cara === "abandonado" ? -4 : 0} cy={cara === "abandonado" ? 6 : 0} r={9} fill={N} />
              <circle cx={3} cy={-4} r={3} fill={COLORS.white} />
            </g>
          ))}
          {cara === "abandonado" ? (
            <>
              <path d="M90 100 L126 110 M150 110 L186 100" stroke={N} strokeWidth={6} strokeLinecap="round" />
              <path d={`M100 ${150 + ((t * 40) % 60)} q-8 12 0 18 q8 -6 0 -18 Z`} fill="#7DD3FC" opacity={1 - ((t * 40) % 60) / 60} />
              <path d="M120 228 Q140 214 160 228" stroke={N} strokeWidth={6} fill="none" strokeLinecap="round" />
            </>
          ) : null}
          {cara === "atento" ? <ellipse cx={140} cy={226} rx={10} ry={12} fill={N} /> : null}
          {cara === "feliz" ? (
            <>
              <path d="M116 216 Q140 246 166 216" stroke={N} strokeWidth={6} fill={COLORS.red} strokeLinecap="round" />
              <ellipse cx={100} cy={150} rx={14} ry={8} fill={COLORS.red} opacity={0.35} />
              <ellipse cx={180} cy={150} rx={14} ry={8} fill={COLORS.red} opacity={0.35} />
            </>
          ) : null}
        </g>
      </svg>
    </div>
  );
};

/* ---------- Tablero 4 × 5 ---------- */
const VALORES = Array.from({ length: 20 }, (_, i) => (i + 1) * 10);
const Tablero: React.FC<{ aparece?: number; tachadas: (number | [number, number])[]; top?: number; escala?: number; dobla?: number }> = ({ aparece = 1, tachadas, top = 560, escala = 1, dobla = 0 }) => {
  const tach = new Map<number, number>();
  tachadas.forEach((x) => (Array.isArray(x) ? tach.set(x[0], x[1]) : tach.set(x, 1)));
  return (
    <div
      style={{
        position: "absolute",
        left: 540,
        top,
        translate: "-50% 0",
        scale: String(escala),
        transformOrigin: "50% 0%",
        transform: `perspective(1400px) rotateX(${dobla * 75}deg) scaleY(${1 - dobla * 0.8})`,
        opacity: 1 - Math.max(0, dobla - 0.85) * 6,
        background: COLORS.paper,
        border: `6px solid ${COLORS.navy}`,
        borderRadius: 30,
        padding: 18,
        display: "grid",
        gridTemplateColumns: "repeat(4, 190px)",
        gap: 12,
        boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
        fontFamily,
      }}
    >
      {VALORES.map((v, i) => {
        const s = interpolate(aparece, [i / 24, i / 24 + 0.2], [0, 1], clamp);
        const k = tach.get(v) ?? 0;
        return (
          <div
            key={v}
            style={{
              position: "relative",
              height: 100,
              borderRadius: 16,
              border: `4px solid ${k > 0.5 ? COLORS.green : "#CBD5E1"}`,
              background: k > 0.5 ? "#DCFCE7" : COLORS.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 50,
              fontWeight: 900,
              color: COLORS.navy,
              scale: String(s),
              opacity: s,
            }}
          >
            ${v}
            {k > 0 ? (
              <svg width={190} height={100} style={{ position: "absolute", left: -4, top: -4 }}>
                <path d={`M24 20 L${24 + 140 * Math.min(1, k * 2)} ${20 + 60 * Math.min(1, k * 2)}`} stroke={ROJO} strokeWidth={12} strokeLinecap="round" />
                {k > 0.5 ? <path d={`M164 20 L${164 - 140 * (k - 0.5) * 2} ${20 + 60 * (k - 0.5) * 2}`} stroke={ROJO} strokeWidth={12} strokeLinecap="round" /> : null}
              </svg>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

/** Pelusa que cae de la ranura. */
const Pelusa: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 0 }) => (
  <svg width={90} height={70} viewBox="0 0 90 70" style={{ position: "absolute", left: x - 45, top: y - 35, rotate: `${r}deg` }}>
    <path d="M14 40 Q4 20 24 18 Q30 2 48 10 Q66 0 72 20 Q90 26 78 44 Q80 62 58 58 Q44 70 30 58 Q8 60 14 40 Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth={4} />
    <path d="M30 34 q8 -8 16 0 M50 30 q6 -6 12 2" stroke="#94A3B8" strokeWidth={3} fill="none" />
  </svg>
);

/* ---------- Escenas ---------- */
const Gancho: React.FC<{ congelar?: boolean }> = ({ congelar }) => {
  const t = useSeg();
  const tt = congelar ? 0.15 : t;
  const cae = interpolate(tt, [0, 0.55], [0.25, 1], { ...clamp, easing: (x) => x * x });
  const reb = tt > 0.55 ? Math.abs(Math.sin((tt - 0.55) * 10)) * Math.max(0, 1 - (tt - 0.55) * 2.5) * 40 : 0;
  return (
    <>
      <Rotulo texto="«Para ahorrar necesito **tener dinero**»" delay={congelar ? -2 : -0.5} size={60} />
      <Cochinito x={540} y={1020} escala={1.55} bocaAbajo={1} cara="abandonado" />
      <Pelusa x={560} y={interpolate(cae, [0, 1], [900, 1240]) - reb} r={tt * 120} />
      <div style={{ position: "absolute", left: 90, right: 120, top: 1270, height: 10, borderRadius: 5, background: "rgba(255,255,255,0.15)" }} />
    </>
  );
};

const Hook = () => (
  <Escena sinEntrada luz="#831843">
    <Gancho />
    <Sfx s="pop" volumen={0.5} en={0.55} />
    <Sfx s="tick" volumen={0.4} en={0.8} />
  </Escena>
);

const TableroEsc = () => {
  const t = useSeg();
  const aparece = interpolate(t, [0.15, 1.9], [0, 1], clamp);
  const tacha10 = interpolate(t, [3.2, 3.6], [0, 1], clamp);
  return (
    <Escena luz="#1E3A8A">
      <Rotulo texto="Empieza con **$10**" size={64} />
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Pildora size={34} bg="rgba(199,215,254,0.14)" color={COLORS.light}>
          20 casillas · de $10 a $200 · sin orden
        </Pildora>
      </div>
      <Tablero aparece={aparece} tachadas={[[10, tacha10]]} top={480} escala={0.92} />
      <Cochinito x={880} y={1300} escala={0.6} cara="atento" oreja={interpolate(t, [3.4, 3.7], [0, 1], clamp)} />
      {Array.from({ length: 6 }, (_, i) => (
        <Sfx key={i} s="pop" volumen={0.22} en={0.2 + i * 0.3} />
      ))}
      <Sfx s="swoosh" volumen={0.4} en={3.2} />
    </Escena>
  );
};

const Calendario: React.FC<{ x: number; dia: number; on: number; coma?: boolean }> = ({ x, dia, on, coma }) => {
  const t = useSeg();
  return (
    <div style={{ position: "absolute", left: x, top: 520, width: 380, translate: "-50% 0", opacity: 0.3 + 0.7 * on, scale: String(0.85 + 0.15 * on), fontFamily }}>
      <div style={{ borderRadius: 26, overflow: "hidden", border: `6px solid ${COLORS.navy}`, background: coma ? "#E2E8F0" : COLORS.paper, boxShadow: "0 20px 40px rgba(0,0,0,0.35)" }}>
        <div style={{ height: 70, background: coma ? COLORS.grey : COLORS.green, color: COLORS.white, fontSize: 36, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{coma ? "quincena en coma" : "¡día de quincena!"}</div>
        <div style={{ fontSize: 170, fontWeight: 900, color: coma ? COLORS.grey : COLORS.navy, textAlign: "center", lineHeight: "230px" }}>{dia}</div>
      </div>
      {coma ? (
        <>
          {/* suero */}
          <div style={{ position: "absolute", right: -40, top: -120, width: 70, height: 100, borderRadius: 16, background: "rgba(199,215,254,0.6)", border: `4px solid ${COLORS.light}` }} />
          <div style={{ position: "absolute", right: -8, top: -20, width: 6, height: 120, background: COLORS.light }} />
          <div style={{ position: "absolute", right: -14, top: -20 + ((t * 80) % 110), width: 14, height: 18, borderRadius: 9, background: "#7DD3FC" }} />
        </>
      ) : null}
    </div>
  );
};

const Casilla: React.FC<{ v: number; x: number; k: number }> = ({ v, x, k }) => (
  <div style={{ position: "absolute", left: x, top: 920, translate: "-50% 0", width: 230, height: 120, borderRadius: 20, background: k > 0.5 ? "#DCFCE7" : COLORS.white, border: `5px solid ${k > 0.5 ? COLORS.green : COLORS.navy}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontSize: 64, fontWeight: 900, color: COLORS.navy }}>
    ${v}
    {k > 0 ? (
      <svg width={230} height={120} style={{ position: "absolute", left: -5, top: -5 }}>
        <path d={`M30 24 L${30 + 170 * Math.min(1, k * 2)} ${24 + 72 * Math.min(1, k * 2)}`} stroke={ROJO} strokeWidth={14} strokeLinecap="round" />
        {k > 0.5 ? <path d={`M200 24 L${200 - 170 * (k - 0.5) * 2} ${24 + 72 * (k - 0.5) * 2}`} stroke={ROJO} strokeWidth={14} strokeLinecap="round" /> : null}
      </svg>
    ) : null}
  </div>
);

const Dias = () => {
  const t = useSeg();
  const QUINCE = 3.5;
  const on13 = interpolate(t, [0, 0.3, QUINCE - 0.2, QUINCE], [0, 1, 1, 0.4], clamp);
  const on15 = interpolate(t, [QUINCE - 0.2, QUINCE], [0, 1], clamp);
  return (
    <Escena luz="#312E81">
      <Rotulo texto="Día 13 → **$10** · Día 15 → **$200**" size={56} />
      <Calendario x={290} dia={13} on={on13} coma />
      <Calendario x={790} dia={15} on={on15} />
      <Casilla v={10} x={290} k={interpolate(t, [2.4, 2.8], [0, 1], clamp)} />
      <Casilla v={200} x={790} k={interpolate(t, [4.9, 5.3], [0, 1], clamp)} />
      {t > QUINCE
        ? Array.from({ length: 18 }, (_, i) => {
            const k = (t - QUINCE) * 1.2;
            return <div key={i} style={{ position: "absolute", left: 640 + ((i * 53) % 300), top: 420 + k * (300 + (i % 5) * 80), width: 18, height: 30, background: [COLORS.gold, COLORS.green, COLORS.accent, COLORS.red][i % 4], rotate: `${k * 300 + i * 40}deg`, opacity: Math.max(0, 1 - k * 0.6) }} />;
          })
        : null}
      <Sfx s="swoosh" volumen={0.35} en={2.4} />
      <Sfx s="ding" volumen={0.35} en={QUINCE} />
      <Sfx s="swoosh" volumen={0.35} en={4.9} />
    </Escena>
  );
};

const Wow = () => {
  const t = useSeg();
  // tachones rápidos: de 0.1 a 1.0 s se tachan las 20 en orden aleatorio
  const orden = [70, 30, 150, 10, 200, 90, 120, 40, 180, 60, 20, 110, 160, 50, 140, 80, 190, 100, 170, 130];
  const tach: [number, number][] = orden.map((v, i) => [v, interpolate(t, [0.1 + i * 0.045, 0.2 + i * 0.045], [0, 1], clamp)]);
  const suma = orden.reduce((s, v, i) => s + (t > 0.2 + i * 0.045 ? v : 0), 0);
  const DOBLA = 1.25;
  const dobla = interpolate(t, [DOBLA, DOBLA + 0.4], [0, 1], clamp);
  const sobre = interpolate(t, [DOBLA + 0.3, DOBLA + 0.6], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  return (
    <Escena luz="#14532D">
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 120, color: COLORS.gold, lineHeight: 1, textShadow: `0 0 40px ${COLORS.gold}`, fontVariantNumeric: "tabular-nums" }}>
        {pesos(suma)}
      </div>
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 52, color: COLORS.white, opacity: interpolate(t, [2.9, 3.2], [0, 1], clamp) }}>
        …y empezaste con <span style={{ color: COLORS.gold }}>$10</span>
      </div>
      {dobla < 1 ? <Tablero tachadas={tach} top={500} escala={0.86} dobla={dobla} /> : null}
      {/* sobre */}
      {sobre > 0 ? (
        <div style={{ position: "absolute", left: 540, top: 560, translate: "-50% 0", scale: String(sobre), rotate: `${(1 - sobre) * -20 - 4}deg` }}>
          <svg width={440} height={280} viewBox="0 0 440 280">
            <rect x={6} y={6} width={428} height={268} rx={22} fill="#FDE68A" stroke={COLORS.navy} strokeWidth={8} />
            <path d="M6 20 L220 150 L434 20" fill="none" stroke={COLORS.navy} strokeWidth={8} strokeLinejoin="round" />
            <text x={220} y={240} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={70} fill={COLORS.navy}>
              $2,100
            </text>
          </svg>
        </div>
      ) : null}
      <Cochinito x={540} y={1310} escala={0.75 + 0.15 * sobre} cara={sobre > 0.5 ? "feliz" : "atento"} oreja={1} lleno={sobre} baila={sobre > 0.5} />
      {orden.map((_, i) => (i % 3 === 0 ? <Sfx key={i} s="tick" volumen={0.35} en={0.15 + i * 0.045} /> : null))}
      <Sfx s="swoosh" volumen={0.4} en={DOBLA} />
      <Sfx s="ding" volumen={0.45} en={DOBLA + 0.5} />
      <Chispas en={DOBLA + 0.5} x={540} y={700} color={COLORS.gold} n={20} />
    </Escena>
  );
};

const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const vuelta = interpolate(frame, [dur - 10, dur - 2], [0, 1], clamp);
  return (
    <>
      <CtaCrecer tipo="comentar" boton="PON EL NÚMERO" linea="¿Cuál casilla tachas **primero**? 👇" />
      <div style={{ position: "absolute", top: 1272, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 28, fontWeight: 700, color: COLORS.navy }}>
        Contenido informativo, no es asesoramiento financiero.
      </div>
      {vuelta > 0 ? (
        <AbsoluteFill style={{ opacity: vuelta, fontFamily }}>
          <Fondo luz="#831843" />
          <Gancho congelar />
        </AbsoluteFill>
      ) : null}
    </>
  );
};

const ESCENAS: DefEscena[] = [
  { id: "hook", render: () => <Hook /> },
  { id: "tablero", render: () => <TableroEsc /> },
  { id: "dias", render: () => <Dias /> },
  { id: "wow", render: () => <Wow /> },
  { id: "cta", subtitulosClaros: true, render: ({ dur }) => <Cta dur={dur} /> },
];

export const W4914: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4914} pista="sunlight.mp3" /> : null;
