import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../brand";
import { Chispas, CtaCrecer, DefEscena, Escena, Montaje, Pildora, PropsVoz, Rotulo, Sfx, useSpring } from "../kit";

// W48-04 · «Tres euros al día» · CONTADOR · CTA COMENTAR
// Un único contador que crece todo el vídeo y cambia de color (verde → dorado → rojo → azul).
// Cálculo propio: 3 € × 365 días = 1.095 €; × 10 años = 10.950 € (sin intereses ni inflación).
const NB = " ";
const eur = (v: number) => {
  const n = Math.round(v);
  return (n >= 1000 ? `${Math.floor(n / 1000)}.${String(n % 1000).padStart(3, "0")}` : String(n)) + NB + "€";
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EJ = `Ejemplo · 3${NB}€ × 365 días · sin intereses`;

export const EXTRA_W4804: Record<string, number> = { hook: 0.3, wow: 0.6, diez: 0.6, cta: 0.6, cierre: 0.7 };

/* color del contador según el valor */
const colorDe = (v: number) => (v < 300 ? COLORS.green : v < 1000 ? COLORS.gold : COLORS.red);

const useSeg = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/* El contador: cifra enorme con anillo de brillo, etiqueta de tiempo debajo y ticks */
const Contador: React.FC<{
  de: number;
  a: number;
  inicio?: number;
  fin?: number;
  color?: string;
  etiqueta?: (v: number) => string;
  ticks?: number;
  ding?: boolean;
  hucha?: EstadoHucha;
  nivelFijo?: number;
  rebosa?: boolean;
}> = ({ de, a, inicio = 0, fin = 0.01, color, etiqueta, ticks = 0, ding = false, hucha = "confiada", nivelFijo, rebosa = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [inicio * fps, fin * fps], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 2.2 });
  const v = de + (a - de) * p;
  const c = color ?? colorDe(v);
  const llegada = frame - fin * fps;
  const golpe = llegada >= 0 && llegada < 10 ? Math.sin((llegada / 10) * Math.PI) * 0.1 : 0;
  const pulso = 1 + 0.015 * Math.sin(frame / 5);
  const len = eur(v).length;
  const size = len >= 8 ? 120 : len === 7 ? 140 : 165;
  const nivel = nivelFijo ?? (v <= 3 ? 0.04 : 0.1 + 0.9 * Math.pow(Math.min(1, v / 10950), 0.42));
  return (
    <>
      <Bote nivel={nivel} rebosa={rebosa} />
      <Hucha estado={hucha} />
      {Array.from({ length: Math.min(ticks, 14) }, (_, i) => (
        <Moneda key={i} en={inicio + ((fin - inicio) * i) / Math.max(1, ticks)} dx={((i * 37) % 120) - 60} />
      ))}
    <div style={{ position: "absolute", top: 380, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ position: "absolute", top: -150, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${c}44 0%, ${c}11 50%, transparent 70%)` }} />
      <div
        style={{
          fontSize: size,
          fontWeight: 900,
          letterSpacing: -size * 0.04,
          color: c,
          fontVariantNumeric: "tabular-nums",
          textShadow: `0 0 60px ${c}AA, 0 12px 40px rgba(0,0,0,0.5)`,
          scale: String(pulso + golpe),
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        {eur(v)}
      </div>
      {etiqueta ? (
        <div style={{ fontSize: 46, fontWeight: 800, color: COLORS.white, background: `${c}33`, border: `3px solid ${c}`, borderRadius: 999, padding: "8px 34px" }}>
          {etiqueta(v)}
        </div>
      ) : null}
      {Array.from({ length: ticks }, (_, i) => (
        <Sfx key={i} s="tick" volumen={0.12} en={inicio + ((fin - inicio) * i) / Math.max(1, ticks)} />
      ))}
      {ding ? <Sfx s="ding" volumen={0.4} en={fin} /> : null}
    </div>
    </>
  );
};


/* ---------- La hucha (personaje fijo de la serie) y el bote que se llena ---------- */
type EstadoHucha = "confiada" | "sorpresa" | "platos" | "niega" | "guino" | "feliz";
const Hucha: React.FC<{ estado: EstadoHucha; x?: number; y?: number; escala?: number }> = ({ estado, x = 270, y = 1230, escala = 1 }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const resp = Math.sin(t * 4) * 3;
  const niega = estado === "niega" ? Math.sin(t * 14) * 10 : 0;
  const ojoR = estado === "platos" ? 26 : estado === "sorpresa" ? 20 : 14;
  const parpadeo = Math.floor(t * 2.2) % 5 === 0 && f % 66 < 4;
  const guino = estado === "guino" && t % 1.4 > 0.5;
  const PINK = "#F5A3B7";
  const DARK = "#D9738C";
  return (
    <div style={{ position: "absolute", left: x - 190 * escala, top: y - 300 * escala, width: 380, height: 320, scale: String(escala), transformOrigin: "0 0", translate: `0px ${resp}px`, rotate: `${niega}deg` }}>
      <svg width={380} height={320} viewBox="0 0 380 320">
        <ellipse cx={190} cy={306} rx={130} ry={12} fill="#0F172A" opacity={0.25} />
        <rect x={110} y={250} width={34} height={56} rx={12} fill={DARK} />
        <rect x={236} y={250} width={34} height={56} rx={12} fill={DARK} />
        <ellipse cx={190} cy={170} rx={150} ry={112} fill={PINK} />
        <path d="M110 80 L128 30 L170 66 Z" fill={DARK} />
        <path d="M250 80 L232 30 L190 66 Z" fill={DARK} />
        <path d="M338 160 q34 -8 30 22" fill="none" stroke={DARK} strokeWidth={10} strokeLinecap="round" />
        <rect x={158} y={64} width={64} height={10} rx={5} fill="#0F172A" opacity={0.55} />
        <ellipse cx={270} cy={190} rx={52} ry={40} fill={DARK} />
        <circle cx={254} cy={190} r={7} fill="#0F172A" />
        <circle cx={286} cy={190} r={7} fill="#0F172A" />
        {/* ojos */}
        {[140, 220].map((cx, i) => (
          <g key={i}>
            <circle cx={cx} cy={140} r={ojoR + 8} fill="#FFFFFF" />
            {(parpadeo || (guino && i === 1)) ? (
              <path d={`M${cx - 14} 142 q14 12 28 0`} stroke="#0F172A" strokeWidth={6} fill="none" strokeLinecap="round" />
            ) : (
              <circle cx={cx + 3} cy={142} r={estado === "platos" ? 6 : 10} fill="#0F172A" />
            )}
            {estado === "confiada" ? <rect x={cx - ojoR - 8} y={140 - ojoR - 10} width={(ojoR + 8) * 2} height={ojoR + 6} fill={PINK} /> : null}
          </g>
        ))}
        <path
          d={estado === "platos" || estado === "sorpresa" ? "M150 222 q40 24 80 0 q-40 -10 -80 0" : estado === "niega" ? "M150 232 q40 -18 80 0" : "M150 222 q40 24 80 0"}
          fill={estado === "platos" || estado === "sorpresa" ? "#7A1F3A" : "none"}
          stroke="#7A1F3A"
          strokeWidth={6}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

/* Bote transparente: nivel `nivel` (0–1); monedas que caen en cada tick. */
const Bote: React.FC<{ nivel: number; x?: number; y?: number; rebosa?: boolean }> = ({ nivel, x = 740, y = 1230, rebosa = false }) => {
  const f = useCurrentFrame();
  const W = 300;
  const H = 520;
  const h = Math.max(0, Math.min(1, nivel)) * (H - 40);
  const monedas = Math.floor(nivel * 60);
  return (
    <div style={{ position: "absolute", left: x - W / 2, top: y - H }}>
      <svg width={W} height={H + 60} viewBox={`0 0 ${W} ${H + 60}`} overflow="visible">
        <rect x={10} y={30} width={W - 20} height={H - 30} rx={36} fill="#FFFFFF" opacity={0.1} stroke={COLORS.white} strokeWidth={6} strokeOpacity={0.7} />
        <rect x={0} y={10} width={W} height={26} rx={13} fill={COLORS.white} opacity={0.8} />
        <clipPath id="botecl">
          <rect x={14} y={34} width={W - 28} height={H - 36} rx={32} />
        </clipPath>
        <g clipPath="url(#botecl)">
          {Array.from({ length: monedas }, (_, k) => {
            const col = k % 4;
            const fila = Math.floor(k / 4);
            return <circle key={k} cx={46 + col * 70 + (fila % 2) * 12} cy={H - 24 - fila * 32} r={27} fill={COLORS.gold} stroke="#B57A00" strokeWidth={4} />;
          })}
        </g>
        {rebosa
          ? Array.from({ length: 6 }, (_, k) => (
              <circle key={k} cx={60 + k * 38} cy={20 - Math.abs(Math.sin(f / 6 + k)) * 40} r={26} fill={COLORS.gold} stroke="#B57A00" strokeWidth={4} />
            ))
          : null}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: H - 40 - h - 10, height: 0 }} />
    </div>
  );
};

/* Moneda que cae al bote */
const Moneda: React.FC<{ en: number; dx?: number }> = ({ en, dx = 0 }) => {
  const f = useCurrentFrame();
  const t = f / 30 - en;
  if (t < 0 || t > 0.55) return null;
  const p = t / 0.55;
  return <div style={{ position: "absolute", left: 740 + dx - 26, top: 300 + p * p * 480, width: 52, height: 52, borderRadius: "50%", background: COLORS.gold, border: "4px solid #B57A00", opacity: 1 - Math.max(0, p - 0.85) * 6 }} />;
};

const dias = (v: number) => {
  const d = Math.max(1, Math.round(v / 3));
  return d >= 365 ? `${Math.round(d / 365) === 1 ? "1 año" : `${Math.round(d / 365)} años`}` : `Día ${d}`;
};

/* iconos de gastos pequeños que salen alrededor del contador */
const Icono: React.FC<{ tipo: "cafe" | "galleta" | "app"; x: number; y: number; delay: number }> = ({ tipo, x, y, delay }) => {
  const s = useSpring(delay, 9, 0.6);
  const frame = useCurrentFrame();
  const vuelo = interpolate(frame / 30, [delay + 0.7, delay + 1.3], [0, 1], { ...clamp, easing: (q) => q * q });
  const px = x + (740 - x) * vuelo;
  const py = y + (780 - y) * vuelo;
  return (
    <div style={{ position: "absolute", left: px - 90, top: py - 90 + Math.sin(frame / 12 + x) * 10 * (1 - vuelo), scale: String(s * (1 - 0.6 * vuelo)), opacity: Math.min(1, s * 2) * (1 - Math.max(0, vuelo - 0.9) * 10) }}>
      <svg width={180} height={180} viewBox="0 0 100 100">
        <circle cx={50} cy={50} r={46} fill={COLORS.white} opacity={0.12} />
        {tipo === "cafe" ? (
          <>
            <path d="M24 40 H70 V66 Q70 80 56 80 H38 Q24 80 24 66 Z" fill={COLORS.white} />
            <path d="M70 46 Q84 46 84 56 Q84 66 70 66" fill="none" stroke={COLORS.white} strokeWidth={6} />
            <path d="M38 30 Q34 22 40 16 M52 30 Q48 22 54 16" fill="none" stroke={COLORS.light} strokeWidth={4} strokeLinecap="round" />
          </>
        ) : tipo === "galleta" ? (
          <>
            <circle cx={50} cy={52} r={30} fill={COLORS.chocoLight} />
            {[
              [40, 42],
              [58, 48],
              [46, 62],
              [62, 64],
            ].map(([a, b], i) => (
              <circle key={i} cx={a} cy={b} r={5} fill={COLORS.choco} />
            ))}
          </>
        ) : (
          <>
            <rect x={30} y={18} width={40} height={66} rx={8} fill={COLORS.white} />
            <rect x={36} y={28} width={28} height={44} rx={4} fill={COLORS.accent} />
            <circle cx={50} cy={50} r={8} fill={COLORS.gold} />
          </>
        )}
      </svg>
      <div style={{ position: "absolute", top: -8, right: -12, background: COLORS.red, color: COLORS.white, fontSize: 34, fontWeight: 900, borderRadius: 999, padding: "2px 14px" }}>
        −1{NB}€
      </div>
    </div>
  );
};

const ESCENAS: DefEscena[] = [
  {
    id: "hook",
    render: () => (
      <Escena sinEntrada luz={COLORS.green}>
        <Sfx s="impacto" volumen={0.5} />
        <Rotulo texto="Tres euros al día" delay={-1} fondo={COLORS.green} color={COLORS.navy} />
        <Contador de={3} a={3} etiqueta={() => "Día 1"} hucha="confiada" />
      </Escena>
    ),
  },
  {
    id: "gancho2",
    render: () => (
      <Escena luz={COLORS.green} sonidoEntrada="swoosh">
        <Rotulo texto="No pares el **contador**" />
        <Contador de={3} a={30} inicio={0.1} fin={2.1} etiqueta={dias} ticks={10} hucha="confiada" />
      </Escena>
    ),
  },
  {
    id: "hormiga",
    render: () => (
      <Escena luz={COLORS.green} sonidoEntrada={null}>
        <Contador de={30} a={300} inicio={0} fin={3.5} etiqueta={dias} ticks={14} hucha="sorpresa" />
        <Icono tipo="cafe" x={160} y={660} delay={0.2} />
        <Icono tipo="galleta" x={400} y={640} delay={1.1} />
        <Icono tipo="app" x={270} y={760} delay={2.0} />
        <Sfx s="pop" volumen={0.3} en={0.2} />
        <Sfx s="pop" volumen={0.3} en={1.1} />
        <Sfx s="pop" volumen={0.3} en={2.0} />
      </Escena>
    ),
  },
  {
    id: "rehook",
    render: () => (
      <Escena luz={COLORS.gold} sonidoEntrada={null}>
        <Rotulo texto="El contador **no duerme**" fondo={COLORS.gold} color={COLORS.navy} />
        <Contador de={300} a={900} inicio={0} fin={3} etiqueta={dias} ticks={14} hucha="sorpresa" />
        <Sfx s="riser" volumen={0.35} en={1.6} />
      </Escena>
    ),
  },
  {
    id: "wow",
    render: () => (
      <Escena luz={COLORS.red} sacudidas={[1.0]} sonidoEntrada={null}>
        <Contador de={900} a={1095} inicio={0} fin={1.0} etiqueta={(v) => (v >= 1094 ? "1 año" : dias(v))} ticks={6} ding hucha="platos" />
        <div style={{ position: "absolute", top: 1290, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Pildora delay={0.6} bg={COLORS.navy}>
            {EJ}
          </Pildora>
        </div>
        <Chispas en={1.0} x={540} y={680} color={COLORS.red} />
      </Escena>
    ),
  },
  {
    id: "diez",
    render: () => (
      <Escena luz={COLORS.red} sacudidas={[2.2]} sonidoEntrada={null}>
        <Rotulo texto="En **10 años**" fondo={COLORS.red} color={COLORS.white} />
        <Contador de={1095} a={10950} inicio={0.2} fin={2.2} etiqueta={(v) => `${Math.max(1, Math.min(10, Math.round(v / 1095)))} años`} ticks={12} ding hucha="platos" rebosa />
        <div style={{ position: "absolute", top: 1290, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Pildora delay={-1} bg={COLORS.navy}>
            {EJ}
          </Pildora>
        </div>
        <Chispas en={2.2} x={540} y={680} color={COLORS.gold} />
      </Escena>
    ),
  },
  {
    id: "giro",
    render: () => {
      const Giro: React.FC = () => {
        const t = useSeg();
        const tacha = interpolate(t, [0.3, 0.9], [0, 1], clamp);
        const elige = useSpring(1.3, 10, 0.6);
        return (
          <Escena luz={COLORS.accent}>
            <Contador de={10950} a={10950} color={COLORS.light} nivelFijo={1} rebosa hucha={t > 1.2 ? "guino" : "niega"} />
            <div style={{ position: "absolute", top: 235, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative", fontSize: 76, fontWeight: 900, color: COLORS.grey }}>
                Quitarlo
                <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 10, background: COLORS.red, transformOrigin: "left", scale: `${tacha} 1` }} />
              </div>
            </div>
            <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
              <div style={{ fontSize: 100, fontWeight: 900, color: COLORS.navy, background: COLORS.gold, borderRadius: 30, padding: "6px 44px", rotate: "-3deg", scale: String(elige) }}>
                ELEGIRLO
              </div>
            </div>
            <Sfx s="swoosh" volumen={0.25} en={0.3} />
            <Sfx s="pop" volumen={0.4} en={1.3} />
          </Escena>
        );
      };
      return <Giro />;
    },
  },
  {
    id: "sistema",
    render: () => {
      const Sistema: React.FC = () => {
        const si = useSpring(0.3, 12, 0.6);
        const no = useSpring(1.8, 12, 0.6);
        const fila = (s: number, txt: string, sub: string, c: string) => (
          <div style={{ width: 590, display: "flex", alignItems: "center", gap: 16, background: `${c}55`, border: `4px solid ${c}`, borderRadius: 30, padding: "18px 24px", opacity: s, translate: `${(1 - s) * 300}px 0px` }}>
            <div style={{ fontSize: 56, fontWeight: 900, color: COLORS.white, width: 100 }}>{txt}</div>
            <div style={{ fontSize: 38, fontWeight: 800, color: COLORS.white }}>{sub}</div>
          </div>
        );
        return (
          <Escena luz={COLORS.blue}>
            <div style={{ position: "absolute", top: 280, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 60, fontWeight: 900, color: COLORS.light }}>¿Te compensa?</div>
            </div>
            <Contador de={10950} a={10950} color={COLORS.accent} nivelFijo={1} hucha="feliz" />
            <div style={{ position: "absolute", top: 760, left: 460, right: 30, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
              {fila(si, "SÍ", "Adelante, disfrútalo", COLORS.green)}
              {fila(no, "NO", "A tu colchón", COLORS.accent)}
            </div>
            <Sfx s="pop" volumen={0.35} en={0.3} />
            <Sfx s="pop" volumen={0.35} en={1.8} />
          </Escena>
        );
      };
      return <Sistema />;
    },
  },
  {
    id: "cta",
    subtitulosClaros: true,
    render: () => <CtaCrecer tipo="comentar" boton="¿Y EL TUYO?" linea={`Cuéntame tu **gasto de 3${NB}€ al día**`} />,
  },
  {
    id: "cierre",
    subtitulos: false,
    render: () => (
      <Escena luz={COLORS.green}>
        <Contador de={3} a={3} etiqueta={() => "nunca son solo 3 €"} hucha="confiada" />
        <div style={{ position: "absolute", top: 1330, left: 90, right: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: 6, color: COLORS.white }}>
            ALIGN <span style={{ fontWeight: 500, color: COLORS.light }}>by ADB</span>
          </div>
          <div style={{ fontSize: 28, color: COLORS.light }}>Contenido informativo, no es asesoramiento financiero.</div>
        </div>
      </Escena>
    ),
  },
];

export const W4804: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4804} pista="sunlight.mp3" /> : null;
