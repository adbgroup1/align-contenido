import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../brand";
import { Chispas, CtaCrecer, DefEscena, Escena, Escenario, Fondo, Montaje, Pildora, PropsVoz, Rotulo, Sfx, SUELO_Y } from "../kit";

// W49-15 · «Las hormigas de tu quincena» · Reel · Fábula con personajes · H13
// Ejemplo (cálculo propio, por quincena): café $45 × 10 días hábiles = $450; Oxxo $30 × 15 = $450;
// envíos $40 × 4 = $160; suscripción $139 al mes ≈ $70; total $1,130 × 24 quincenas = $27,120 al año.
// El Oxxo solo como lugar, sin logotipo. Hormigas siempre las mismas: café, bolsa, repartidor y pijama. Todo DIBUJO.

export const EXTRA_W4915: Record<string, number> = { hook: 0.1, nosola: 0.3, sub: 0.3, wow: 0.7, cta: 0.9 };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pesos = (v: number) => "$" + String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const PISO = SUELO_Y - 10;

const useSeg = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/* ---------- Hormiga ---------- */
type Tipo = "cafe" | "bolsa" | "repartidor" | "pijama" | "simple";
const Hormiga: React.FC<{
  x: number;
  y?: number;
  escala?: number;
  tipo?: Tipo;
  anda?: boolean;
  mira?: 1 | -1; // 1 = derecha
  miga?: boolean;
  saluda?: boolean;
  semilla?: number;
  ojos?: "abiertos" | "dormida";
}> = ({ x, y = PISO, escala = 1, tipo = "simple", anda = true, mira = -1, miga = false, saluda = false, semilla = 0, ojos = "abiertos" }) => {
  const frame = useCurrentFrame();
  const t = frame / 30 + semilla;
  const paso = anda ? Math.sin(t * 16) : 0;
  const bote = anda ? Math.abs(Math.sin(t * 16)) * 5 : 0;
  const parpadeo = (frame + semilla * 31) % 90 < 4 ? 0.1 : 1;
  const N = COLORS.navy;
  const cuerpo = "#1F2937";
  const brazo = saluda ? Math.sin(t * 12) * 25 : 0;
  return (
    <div style={{ position: "absolute", left: x - 110 * escala, top: y - 190 * escala - bote, width: 220 * escala, height: 190 * escala, transform: `scaleX(${mira})` }}>
      <svg width={220 * escala} height={190 * escala} viewBox="0 0 220 190" style={{ overflow: "visible" }}>
        <ellipse cx={110} cy={186} rx={80} ry={6} fill="#000" opacity={0.2} />
        {/* patas */}
        <g stroke={cuerpo} strokeWidth={7} strokeLinecap="round" fill="none">
          {[60, 100, 140].map((lx, i) => {
            const d = (i % 2 ? paso : -paso) * 14;
            return (
              <g key={lx}>
                <path d={`M${lx} 140 L${lx - 12 + d} 162 L${lx - 18 + d} 184`} />
                <path d={`M${lx + 6} 140 L${lx + 16 - d} 162 L${lx + 22 - d} 184`} />
              </g>
            );
          })}
        </g>
        {/* abdomen, tórax y cabeza */}
        <ellipse cx={168} cy={128} rx={46} ry={38} fill={cuerpo} stroke={N} strokeWidth={4} />
        <ellipse cx={112} cy={132} rx={28} ry={24} fill={cuerpo} stroke={N} strokeWidth={4} />
        <circle cx={60} cy={100} r={44} fill={cuerpo} stroke={N} strokeWidth={4} />
        <ellipse cx={160} cy={112} rx={16} ry={9} fill={COLORS.white} opacity={0.2} />
        {/* antenas */}
        <path d={`M50 60 Q36 ${24 + Math.sin(t * 5) * 6} 20 22`} stroke={cuerpo} strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d={`M72 58 Q78 ${20 + Math.cos(t * 5) * 6} 94 16`} stroke={cuerpo} strokeWidth={6} fill="none" strokeLinecap="round" />
        <circle cx={20} cy={22} r={7} fill={cuerpo} />
        <circle cx={94} cy={16} r={7} fill={cuerpo} />
        {/* ojos */}
        {ojos === "dormida" ? (
          <g stroke={COLORS.white} strokeWidth={5} strokeLinecap="round" fill="none">
            <path d="M30 98 Q40 106 50 98" />
            <path d="M62 98 Q72 106 82 98" />
          </g>
        ) : (
          [40, 74].map((ex) => (
            <g key={ex} transform={`translate(${ex} 96) scale(1 ${parpadeo})`}>
              <ellipse rx={15} ry={17} fill={COLORS.white} />
              <circle cx={-5} cy={2} r={7.5} fill={N} />
              <circle cx={-2} cy={-2} r={2.5} fill={COLORS.white} />
            </g>
          ))
        )}
        <path d="M44 124 Q56 132 68 124" stroke={COLORS.white} strokeWidth={4} fill="none" strokeLinecap="round" />
        {/* accesorios */}
        {tipo === "cafe" ? (
          <g transform={`rotate(${brazo} 30 150)`}>
            <line x1={40} y1={140} x2={10} y2={128} stroke={cuerpo} strokeWidth={7} strokeLinecap="round" />
            <path d="M-12 92 L22 92 L18 132 L-8 132 Z" fill={COLORS.paper} stroke={N} strokeWidth={4} />
            <rect x={-14} y={84} width={38} height={10} rx={4} fill={COLORS.choco} stroke={N} strokeWidth={3} />
            <rect x={-10} y={104} width={30} height={12} fill={COLORS.chocoLight} />
          </g>
        ) : null}
        {tipo === "bolsa" ? (
          <g>
            <line x1={40} y1={140} x2={14} y2={150} stroke={cuerpo} strokeWidth={7} strokeLinecap="round" />
            <path d="M-20 140 L30 140 L26 190 L-16 190 Z" fill={COLORS.white} stroke={N} strokeWidth={4} />
            <path d="M-8 140 Q5 118 18 140" stroke={N} strokeWidth={4} fill="none" />
            <rect x={-14} y={156} width={36} height={10} fill={COLORS.red} />
            <rect x={-14} y={168} width={36} height={8} fill={COLORS.gold} />
          </g>
        ) : null}
        {tipo === "repartidor" ? (
          <g>
            <path d="M18 70 Q60 22 104 70 Z" fill={COLORS.red} stroke={N} strokeWidth={4} />
            <rect x={12} y={64} width={98} height={12} rx={6} fill={COLORS.red} stroke={N} strokeWidth={3} />
            <rect x={140} y={40} width={70} height={60} rx={8} fill={COLORS.gold} stroke={N} strokeWidth={4} />
            <path d="M150 60 H200" stroke={N} strokeWidth={4} />
          </g>
        ) : null}
        {tipo === "pijama" ? (
          <g>
            <path d="M14 66 Q50 20 104 62 L120 30 Q126 22 132 34 Z" fill="#818CF8" stroke={N} strokeWidth={4} strokeLinejoin="round" />
            <circle cx={128} cy={30} r={10} fill={COLORS.white} stroke={N} strokeWidth={3} />
            <path d="M14 66 Q60 54 104 62" stroke={COLORS.white} strokeWidth={8} fill="none" strokeLinecap="round" />
          </g>
        ) : null}
        {miga ? (
          <g transform={`translate(54 ${44 + Math.sin(t * 16) * 3})`}>
            <path d="M-26 0 Q-30 -26 -4 -32 Q22 -36 28 -10 Q30 8 0 8 Q-24 8 -26 0 Z" fill="#E8B06A" stroke={N} strokeWidth={4} />
            <circle cx={-6} cy={-16} r={3} fill="#C2853F" />
            <circle cx={10} cy={-8} r={3} fill="#C2853F" />
          </g>
        ) : null}
      </svg>
    </div>
  );
};

/* ---------- El bolillo de la quincena ---------- */
const Bolillo: React.FC<{ x: number; y?: number; escala?: number; mordidas?: number; rot?: number }> = ({ x, y = PISO, escala = 1, mordidas = 0, rot = 0 }) => (
  <div style={{ position: "absolute", left: x - 230 * escala, top: y - 230 * escala, width: 460 * escala, height: 230 * escala, rotate: `${rot}deg` }}>
    <svg width={460 * escala} height={230 * escala} viewBox="0 0 460 230" style={{ overflow: "visible", filter: "drop-shadow(0 20px 26px rgba(0,0,0,0.35))" }}>
      <path d="M30 170 Q10 90 110 50 Q230 0 350 50 Q450 90 430 170 Q420 224 230 224 Q40 224 30 170 Z" fill="#E8B06A" stroke={COLORS.navy} strokeWidth={6} />
      <path d="M120 70 Q230 40 340 70" stroke="#F5D29A" strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.7} />
      <path d="M160 60 Q230 110 300 60" stroke="#C2853F" strokeWidth={8} fill="none" strokeLinecap="round" />
      {/* mordidas */}
      {[0, 1, 2, 3].map((i) =>
        mordidas > i ? <circle key={i} cx={[40, 70, 430, 20][i]} cy={[150, 80, 140, 190][i]} r={34} fill="#4D7C0F" opacity={0} /> : null,
      )}
      {[0, 1, 2, 3].map((i) =>
        mordidas > i ? (
          <path key={`m${i}`} d={["M18 120 Q50 140 30 175", "M70 60 Q100 90 130 52", "M440 110 Q400 140 432 175", "M60 214 Q90 190 130 222"][i]} stroke={COLORS.navy} strokeWidth={6} fill="#B9843F" />
        ) : null,
      )}
      <text x={230} y={168} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={66} fill="#7C4A2D">
        $6,000
      </text>
    </svg>
    <div style={{ position: "absolute", left: 0, right: 0, top: 230 * escala + 6, textAlign: "center", fontFamily, fontWeight: 800, fontSize: 30, color: COLORS.white, textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
      tu quincena
    </div>
  </div>
);

/* ---------- Contador arriba a la izquierda ---------- */
const Contador: React.FC<{ pasos: [number, number][] }> = ({ pasos }) => {
  const t = useSeg();
  let v = pasos[0][1];
  let golpe = 0;
  pasos.forEach(([en, a], i) => {
    if (i === 0) return;
    const de = pasos[i - 1][1];
    const k = interpolate(t, [en, en + 0.4], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
    if (t >= en) v = de + (a - de) * k;
    if (t > en && t < en + 0.6) golpe = Math.sin(((t - en) / 0.6) * Math.PI);
  });
  return (
    <div style={{ position: "absolute", left: 90, top: 420, transformOrigin: "left top", scale: String(1 + golpe * 0.12), background: "rgba(15,23,42,0.85)", border: `5px solid ${COLORS.gold}`, borderRadius: 26, padding: "10px 26px 12px", fontFamily, boxShadow: `0 0 ${16 + golpe * 40}px ${COLORS.gold}88` }}>
      <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.light, letterSpacing: 2 }}>SE LLEVAN POR QUINCENA</div>
      <div style={{ fontSize: 80, fontWeight: 900, color: COLORS.gold, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{pesos(v)}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.grey }}>Ejemplo</div>
    </div>
  );
};

/* ---------- Escenas ---------- */
const Gancho: React.FC<{ congelar?: boolean }> = ({ congelar }) => {
  const t = useSeg();
  const tt = congelar ? 0.4 : t;
  return (
    <>
      <Escenario tipo="campo" />
      <Rotulo texto="Los gastos hormiga son **literales** 🐜" delay={congelar ? -2 : -0.5} size={58} />
      <Bolillo x={760} mordidas={1} />
      <Hormiga x={interpolate(tt, [0, 2.5], [520, 230])} tipo="cafe" miga escala={1.3} />
    </>
  );
};

const Hook = () => (
  <Escena sinEntrada luz="#166534">
    <Gancho />
    <Sfx s="pop" volumen={0.4} en={0.05} />
    <Sfx s="swoosh" volumen={0.3} en={1.2} />
  </Escena>
);

const Cafe = () => {
  const t = useSeg();
  return (
    <Escena luz="#166534">
      <Escenario tipo="campo" />
      <Rotulo texto="☕ **$45** al día" size={66} />
      <Hormiga x={560} escala={2.3} tipo="cafe" anda={false} mira={1} saluda />
      <Contador pasos={[[0, 0], [1.2, 450]]} />
      <div style={{ position: "absolute", left: 90, top: 600, opacity: interpolate(t, [1.2, 1.5], [0, 1], clamp) }}>
        <Pildora size={30}>× 10 días hábiles</Pildora>
      </div>
      <Sfx s="ding" volumen={0.35} en={1.2} />
    </Escena>
  );
};

const NoSola = () => {
  const t = useSeg();
  return (
    <Escena luz="#78350F" sacudidas={[0.15, 0.6, 1.0]} sonidoEntrada="impacto">
      <Escenario tipo="campo" tarde={0.3} />
      <Rotulo texto="Y no viene **sola**…" size={66} />
      <Bolillo x={760} mordidas={1} />
      {/* ejército en el horizonte */}
      {Array.from({ length: 14 }, (_, i) => (
        <Hormiga key={i} x={-200 + i * 70 + t * 160} y={1020 + (i % 3) * 14} escala={0.35} tipo="simple" mira={1} semilla={i * 0.37} />
      ))}
      {/* polvo */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ position: "absolute", left: 60 + i * 150 + t * 120, top: 960 - i * 8, width: 140, height: 80, borderRadius: "50%", background: "#E7D7B5", opacity: 0.35 + 0.1 * Math.sin(t * 9 + i) }} />
      ))}
      <Contador pasos={[[0, 450]]} />
      <Sfx s="impacto" volumen={0.35} en={0.6} />
      <Sfx s="impacto" volumen={0.3} en={1.0} />
    </Escena>
  );
};

const Oxxo = () => {
  const t = useSeg();
  return (
    <Escena luz="#166534">
      <Escenario tipo="campo" tarde={0.3} />
      <Rotulo texto="🏪 **$30** al día · 🛵 **$40** por envío" size={52} />
      <Bolillo x={830} mordidas={2} escala={0.85} />
      <Hormiga x={interpolate(t, [0, 0.8], [1250, 560], { ...clamp, easing: (x) => 1 - (1 - x) ** 2 }) - Math.max(0, t - 1.5) * 90} tipo="bolsa" escala={1.4} miga={t > 0.8} />
      <Hormiga x={interpolate(t, [1.6, 2.4], [1300, 760], { ...clamp, easing: (x) => 1 - (1 - x) ** 2 })} y={PISO - 30} tipo="repartidor" escala={1.3} semilla={2} miga={t > 2.4} />
      <Contador pasos={[[0, 450], [0.85, 900], [2.85, 1060]]} />
      <Sfx s="pop" volumen={0.4} en={0.85} />
      <Sfx s="pop" volumen={0.4} en={2.85} />
    </Escena>
  );
};

const Sub = () => {
  const t = useSeg();
  return (
    <Escena luz="#312E81">
      <Escenario tipo="campo" tarde={0.6} />
      <Rotulo texto="😴 la suscripción que **ni usas**" size={58} />
      <Bolillo x={830} mordidas={3} escala={0.85} />
      <Hormiga x={interpolate(t, [0, 3], [700, 380])} tipo="pijama" escala={1.6} ojos="dormida" miga={t > 0.3} semilla={3} />
      {[0, 1, 2].map((i) => {
        const k = ((t * 0.8 + i / 3) % 1);
        return (
          <div key={i} style={{ position: "absolute", left: interpolate(t, [0, 3], [700, 380]) - 60 - k * 80, top: 980 - k * 220, fontFamily, fontWeight: 900, fontSize: 40 + k * 30, color: COLORS.white, opacity: 1 - k }}>
            Z
          </div>
        );
      })}
      <Contador pasos={[[0, 1060], [1.6, 1130]]} />
      <div style={{ position: "absolute", left: 90, top: 600, opacity: interpolate(t, [1.6, 1.9], [0, 1], clamp) }}>
        <Pildora size={28}>$139 al mes ≈ $70 por quincena</Pildora>
      </div>
      <Sfx s="pop" volumen={0.4} en={1.6} />
    </Escena>
  );
};

const Wow = () => {
  const t = useSeg();
  const avanza = interpolate(t, [0.2, 4.4], [0, 1], clamp);
  const anio = interpolate(t, [2.0, 2.2], [0, 1], clamp);
  return (
    <Escena luz="#7C2D12">
      <Escenario tipo="campo" tarde={1} />
      {/* fila de hormigas llevándose el bolillo hacia el horizonte */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, scale: String(1 - avanza * 0.35), transformOrigin: "20% 60%" }}>
        <Bolillo x={720 - avanza * 520} y={PISO - 70} escala={0.75} mordidas={4} rot={Math.sin(t * 8) * 2} />
        {Array.from({ length: 7 }, (_, i) => (
          <Hormiga key={i} x={560 + i * 60 - avanza * 520} y={PISO} escala={0.55} tipo={(["cafe", "bolsa", "repartidor", "pijama", "simple", "simple", "simple"] as Tipo[])[i]} semilla={i * 0.4} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <Hormiga key={`f${i}`} x={1000 + i * 110 - avanza * 900} y={PISO + 40} escala={0.45} miga semilla={i * 0.6} />
        ))}
      </div>
      <div style={{ position: "absolute", top: 300, left: 90, right: 120, textAlign: "center", fontFamily }}>
        <div style={{ fontSize: 54, fontWeight: 900, color: COLORS.white, textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
          <span style={{ color: COLORS.gold }}>$1,130</span> por quincena
        </div>
        <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.light, marginTop: 10, opacity: anio }}>× 24 quincenas =</div>
        <div style={{ fontSize: 150, fontWeight: 900, color: COLORS.gold, lineHeight: 1, opacity: anio, scale: String(0.6 + 0.4 * anio), textShadow: `0 0 50px ${COLORS.gold}` }}>$27,120</div>
        <div style={{ fontSize: 50, fontWeight: 900, color: COLORS.white, opacity: anio }}>al año</div>
        <div style={{ marginTop: 18, display: "flex", justifyContent: "center", opacity: anio }}>
          <Pildora size={28}>Ejemplo</Pildora>
        </div>
      </div>
      <Chispas en={2.1} x={540} y={560} color={COLORS.gold} n={20} />
      <Sfx s="riser" volumen={0.3} en={0.6} />
      <Sfx s="ding" volumen={0.45} en={2.1} />
    </Escena>
  );
};

const Fila = () => {
  const t = useSeg();
  const tipos: [Tipo, string][] = [
    ["cafe", "Café"],
    ["bolsa", "Oxxo"],
    ["repartidor", "Envíos"],
    ["pijama", "Suscripción"],
  ];
  return (
    <Escena luz="#166534" sonidoEntrada="swoosh">
      <Escenario tipo="campo" />
      <Rotulo texto="¿Cuál hormiga vive **en tu casa**?" size={58} />
      {tipos.map(([tp, n], i) => {
        const s = interpolate(t, [0.1 + i * 0.12, 0.35 + i * 0.12], [0, 1], clamp);
        return (
          <React.Fragment key={tp}>
            <Hormiga x={190 + i * 230} y={PISO - 40} escala={0.8 * s} tipo={tp} anda={false} mira={1} saluda={tp === "cafe"} ojos={tp === "pijama" ? "dormida" : "abiertos"} semilla={i} />
            <div style={{ position: "absolute", left: 190 + i * 230, top: PISO - 10, translate: "-50% 0", fontFamily, fontWeight: 900, fontSize: 32, color: COLORS.white, background: "rgba(15,23,42,0.75)", padding: "4px 14px", borderRadius: 12, opacity: s }}>
              {n}
            </div>
          </React.Fragment>
        );
      })}
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} s="pop" volumen={0.3} en={0.15 + i * 0.12} />
      ))}
    </Escena>
  );
};

const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const CORTE = Math.round(1.35 * fps);
  const vuelta = interpolate(frame, [dur - 10, dur - 2], [0, 1], clamp);
  return (
    <>
      <Sequence durationInFrames={CORTE} layout="none">
        <Fila />
      </Sequence>
      <Sequence from={CORTE} layout="none">
        <CtaCrecer tipo="comentar" boton="¿CUÁL? 👇" linea="Etiqueta a la del **café** de la oficina ☕" />
        <div style={{ position: "absolute", top: 1272, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 28, fontWeight: 700, color: COLORS.navy }}>
          Ejemplo · Contenido informativo, no es asesoramiento financiero.
        </div>
      </Sequence>
      {vuelta > 0 ? (
        <AbsoluteFill style={{ opacity: vuelta, fontFamily }}>
          <Fondo luz="#166534" />
          <Gancho congelar />
        </AbsoluteFill>
      ) : null}
    </>
  );
};

const ESCENAS: DefEscena[] = [
  { id: "hook", render: () => <Hook /> },
  { id: "cafe", render: () => <Cafe /> },
  { id: "nosola", render: () => <NoSola /> },
  { id: "oxxo", render: () => <Oxxo /> },
  { id: "sub", render: () => <Sub /> },
  { id: "wow", render: () => <Wow /> },
  { id: "cta", subtitulosClaros: true, render: ({ dur }) => <Cta dur={dur} /> },
];

export const W4915: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4915} pista="lay-back.mp3" /> : null;
