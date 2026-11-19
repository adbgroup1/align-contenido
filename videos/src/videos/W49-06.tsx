import React from "react";
import { Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../brand";
import { Chispas, CtaCrecer, DefEscena, Escena, Montaje, Pildora, PropsVoz, Sfx, useSpring } from "../kit";

// W49-06 · «Lo que llevas gastado en Lotería de Navidad» · CONTADOR con sonificación · tipográfico + dibujo · CTA COMENTAR
// Datos: 72,5 € por persona en 2025 (SELAE vía Newtral); 1 posibilidad entre 100.000 (números 00000–99999, SELAE).
// Cálculo: 72,5 € × 22 años (de los 18 a los 40) = 1.595 €. Suma simple, sin premios ni intereses.
// Sonificación: un tono por año que sube un semitono (public/sfx/tono/t00–t22.wav, generados por código con ffmpeg).
// Música: minimal-ambient-tech. Fondo dominante: claro (papel), cifra de cobalto a dorado.
export const EXTRA_W4906: Record<string, number> = { hook: 0.2, wow: 1.2, rehook: 0.6, bolas: 0.6, cta: 0.4, cierre: 0.6 };

const GASTO = 72.5;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useSeg = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};
const eur = (v: number) => {
  const r = Math.round(v * 10) / 10;
  const ent = Math.floor(r);
  const dec = Math.round((r - ent) * 10);
  const miles = String(ent).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${miles}${dec ? `,${dec}` : ""} €`;
};
const mezcla = (a: string, b: string, p: number) => {
  const h = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [x, y] = [h(a), h(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * p)).join(",")})`;
};

/* ---------- Tono por año ---------- */
const Tono: React.FC<{ i: number; en: number; volumen?: number }> = ({ i, en, volumen = 0.32 }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.round(en * fps)} layout="none" durationInFrames={Math.round(0.4 * fps)}>
      <Audio src={staticFile(`sfx/tono/t${String(Math.max(0, Math.min(22, i))).padStart(2, "0")}.wav`)} volume={volumen} />
    </Sequence>
  );
};

/* ---------- Décimo genérico (sin logos) ---------- */
const Decimo: React.FC<{ x: number; y: number; rot: number; n: number; s?: number }> = ({ x, y, rot, n, s = 1 }) => (
  <div style={{ position: "absolute", left: x - 130, top: y - 70, width: 260, height: 140, rotate: `${rot}deg`, scale: String(s) }}>
    <svg width={260} height={140} viewBox="0 0 260 140">
      <rect x={4} y={4} width={252} height={132} rx={10} fill={COLORS.paper} stroke={COLORS.navy} strokeWidth={4} />
      <rect x={14} y={14} width={232} height={112} rx={6} fill="none" stroke={COLORS.gold} strokeWidth={3} strokeDasharray="8 6" />
      <line x1={190} y1={10} x2={190} y2={130} stroke={COLORS.grey} strokeWidth={3} strokeDasharray="6 6" />
      <text x={100} y={86} textAnchor="middle" fontSize={44} fontWeight={900} fill={COLORS.navy} fontFamily="Inter, sans-serif" letterSpacing={3}>
        {String((n * 37813 + 4271) % 100000).padStart(5, "0")}
      </text>
      <circle cx={222} cy={70} r={18} fill={COLORS.red} opacity={0.7} />
    </svg>
  </div>
);

/* Pila de décimos detrás del contador: `n` décimos */
const Pila: React.FC<{ n: number }> = ({ n }) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({ length: Math.min(22, Math.floor(n)) }, (_, k) => {
        const lado = k % 2 ? 1 : -1;
        const x = 540 + lado * (230 + ((k * 29) % 60)) + Math.sin(f / 30 + k) * 3;
        const y = 1230 - Math.floor(k / 2) * 24;
        return <Decimo key={k} x={x} y={y} rot={lado * (4 + ((k * 17) % 14))} n={k} s={0.8} />;
      })}
    </>
  );
};

/* ---------- Contador de años ---------- */
// La cifra es (edad − 18) × 72,5. Cada escena mueve la edad de `de` a `a` en `dur` segundos, con un tono por año.
const Contador: React.FC<{ de: number; a: number; t0?: number; dur: number; titulo?: React.ReactNode; nota?: React.ReactNode; final?: boolean }> = ({
  de,
  a,
  t0 = 0.1,
  dur,
  titulo,
  nota,
  final = false,
}) => {
  const t = useSeg();
  const p = interpolate(t, [t0, t0 + dur], [0, 1], clamp);
  const edad = Math.floor(de + (a - de) * p + 1e-6);
  const v = (edad - 18) * GASTO;
  const color = mezcla(COLORS.blue, "#D99A06", Math.min(1, v / 1595));
  const llegada = useSpring(t0 + dur, 8, 0.7);
  const golpe = final ? 1 + 0.12 * Math.sin(Math.min(1, llegada) * Math.PI) : 1;
  const pasos = Array.from({ length: a - de }, (_, k) => ({ en: t0 + ((k + 1) * dur) / (a - de), i: de + k + 1 - 18 }));
  return (
    <>
      <Pila n={edad - 18} />
      <div style={{ position: "absolute", top: 250, left: 90, right: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {titulo}
      </div>
      <div style={{ position: "absolute", top: 560, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div
          style={{
            background: COLORS.white,
            border: `6px solid ${color}`,
            borderRadius: 999,
            padding: "8px 34px",
            fontSize: 56,
            fontWeight: 900,
            color: COLORS.navy,
            boxShadow: "0 12px 30px rgba(15,23,42,0.15)",
          }}
        >
          {edad} años
        </div>
        <div
          style={{
            fontSize: v >= 1000 ? 210 : 230,
            fontWeight: 900,
            color,
            letterSpacing: -8,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
            scale: String(golpe),
            textShadow: `0 0 40px ${color}55, 0 14px 30px rgba(15,23,42,0.2)`,
          }}
        >
          {eur(v)}
        </div>
        {nota}
      </div>
      {pasos.map((s) => (
        <Tono key={s.i} i={s.i} en={s.en} />
      ))}
    </>
  );
};

const Titulo: React.FC<{ texto: string; color?: string; size?: number; delay?: number }> = ({ texto, color = COLORS.navy, size = 64, delay = 0.05 }) => {
  const s = useSpring(delay, 12, 0.6);
  return (
    <div style={{ fontSize: size, fontWeight: 900, color, textAlign: "center", lineHeight: 1.08, translate: `0px ${(1 - s) * -60}px`, opacity: Math.min(1, s * 1.5) }}>
      {texto.split(/(\*\*[^*]+\*\*)/).map((p, i) =>
        p.startsWith("**") ? (
          <span key={i} style={{ color: COLORS.blue }}>
            {p.replace(/\*\*/g, "")}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </div>
  );
};

const Nota: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0.3 }) => (
  <Pildora delay={delay} bg={COLORS.navy} color={COLORS.gold} size={34}>
    {children}
  </Pildora>
);

/* ---------- Escenas ---------- */
const Hook: React.FC = () => (
  <Escena sinEntrada fondo="claro">
    <Sfx s="impacto" volumen={0.45} />
    <Contador de={18} a={20} t0={0.4} dur={2.2} titulo={<Titulo texto="Desde los 18, llevas esto en **Lotería**" delay={-1} size={70} />} />
  </Escena>
);

const Gancho2: React.FC = () => (
  <Escena fondo="claro">
    <Contador
      de={20}
      a={23}
      dur={3.6}
      titulo={<Titulo texto="**72,5 €** al año de media" />}
      nota={<Nota>Gasto medio por persona, 2025 · SELAE vía Newtral</Nota>}
    />
  </Escena>
);

const Sube: React.FC = () => (
  <Escena fondo="claro">
    <Contador de={23} a={25} dur={1.6} titulo={<Titulo texto="Cada diciembre, **un poco más**" />} />
  </Escena>
);

const Edades: React.FC = () => (
  <Escena fondo="claro">
    <Contador de={25} a={35} dur={3.0} titulo={<Titulo texto="30 · 35 años…" />} />
  </Escena>
);

const Wow: React.FC = () => (
  <Escena fondo="claro" sacudidas={[2.2]}>
    <Contador
      de={35}
      a={40}
      dur={2.1}
      final
      titulo={<Titulo texto="A los 40" size={80} />}
      nota={<Nota delay={2.3}>Cálculo: 72,5 € × 22 años</Nota>}
    />
    <Chispas en={2.2} x={540} y={760} color={COLORS.gold} />
    <Sfx s="ding" volumen={0.45} en={2.2} />
  </Escena>
);

const Rehook: React.FC = () => {
  const s = useSpring(0.5, 10, 0.7);
  const t = useSeg();
  return (
    <Escena fondo="noche" sonidoEntrada={null}>
      <div style={{ position: "absolute", top: 520, left: 90, right: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ fontSize: 60, fontWeight: 800, color: COLORS.light, opacity: interpolate(t, [0, 0.4], [0, 1], clamp) }}>Y ahora, la otra cifra:</div>
        <div style={{ fontSize: 110, fontWeight: 900, color: COLORS.white, textAlign: "center", lineHeight: 1.02, scale: String(0.6 + 0.4 * s), opacity: s }}>
          tus <span style={{ color: COLORS.gold }}>posibilidades</span>
        </div>
      </div>
      <Sfx s="riser" volumen={0.35} en={0.5} />
    </Escena>
  );
};

/* Mar de bolas: una cobalto en el centro, la cámara se aleja */
const COLS = 41;
const FILAS = 61;
const Bolas: React.FC<{ alejar: number; parpadeo?: boolean }> = ({ alejar, parpadeo = false }) => {
  const f = useCurrentFrame();
  const paso = 28;
  const z = 14 - 13 * alejar; // de muy cerca a toda la pantalla
  const cx = 540;
  const cy = 860;
  const on = parpadeo ? Math.floor(f / 8) % 2 === 0 : true;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <g transform={`translate(${cx} ${cy}) scale(${z})`}>
        {Array.from({ length: COLS * FILAS }, (_, k) => {
          const c = (k % COLS) - (COLS - 1) / 2;
          const r = Math.floor(k / COLS) - (FILAS - 1) / 2;
          const centro = c === 0 && r === 0;
          if (centro) return null;
          return <circle key={k} cx={c * paso} cy={r * paso} r={11} fill={COLORS.grey} opacity={0.55} />;
        })}
        <circle cx={0} cy={0} r={on ? 12 : 11} fill={on ? COLORS.blue : COLORS.grey} stroke={on ? COLORS.white : "none"} strokeWidth={3 / Math.max(1, z / 4)} />
      </g>
    </svg>
  );
};

const BolasEscena: React.FC = () => {
  const t = useSeg();
  const alejar = interpolate(t, [0.5, 3.8], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  return (
    <Escena fondo="noche">
      <Bolas alejar={alejar} />
      <div style={{ position: "absolute", top: 250, left: 90, right: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ background: COLORS.white, borderRadius: 30, padding: "10px 40px", fontSize: 92, fontWeight: 900, color: COLORS.navy, boxShadow: "0 18px 40px rgba(0,0,0,0.4)" }}>
          1 entre <span style={{ color: COLORS.blue }}>100.000</span>
        </div>
        <Nota delay={0.6}>Posibilidad de que un décimo lleve el Gordo · SELAE</Nota>
      </div>
      <Sfx s="swoosh" volumen={0.25} en={0.5} />
    </Escena>
  );
};

const Giro: React.FC = () => (
  <Escena fondo="noche">
    <Bolas alejar={0.82} parpadeo />
    <div style={{ position: "absolute", top: 250, left: 90, right: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ background: COLORS.gold, borderRadius: 30, padding: "12px 40px", fontSize: 76, fontWeight: 900, color: COLORS.navy }}>Sabe qué compras</div>
    </div>
  </Escena>
);

const Tarjeta: React.FC<{ texto: string; ok: boolean; delay: number }> = ({ texto, ok, delay }) => {
  const s = useSpring(delay, 10, 0.6);
  const c = ok ? COLORS.green : COLORS.red;
  return (
    <div
      style={{
        width: 400,
        height: 400,
        background: COLORS.white,
        border: `8px solid ${c}`,
        borderRadius: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        scale: String(0.5 + 0.5 * s),
        opacity: Math.min(1, s * 1.5),
        rotate: `${(ok ? -4 : 4) * s}deg`,
        boxShadow: "0 20px 50px rgba(15,23,42,0.18)",
      }}
    >
      <svg width={150} height={150} viewBox="0 0 100 100">
        <circle cx={50} cy={50} r={46} fill={c} />
        {ok ? (
          <path d="M28 52 L44 68 L74 34" stroke={COLORS.white} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M32 32 L68 68 M68 32 L32 68" stroke={COLORS.white} strokeWidth={12} fill="none" strokeLinecap="round" />
        )}
      </svg>
      <div style={{ fontSize: 68, fontWeight: 900, color: COLORS.navy }}>{texto}</div>
    </div>
  );
};

const Moraleja: React.FC = () => (
  <Escena fondo="claro">
    <div style={{ position: "absolute", top: 250, left: 90, right: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
      <Titulo texto="Una **ilusión**, no un plan" size={70} />
      <div style={{ display: "flex", gap: 30 }}>
        <Tarjeta texto="Ilusión" ok delay={0.2} />
        <Tarjeta texto="Plan" ok={false} delay={0.9} />
      </div>
    </div>
    <Sfx s="pop" volumen={0.4} en={0.2} />
    <Sfx s="pop" volumen={0.4} en={0.9} />
  </Escena>
);

const Cierre: React.FC = () => {
  const t = useSeg();
  const v = (1 - interpolate(t, [0.2, 1.0], [0, 1], clamp)) * 1595;
  const s = useSpring(1.0, 8, 0.7);
  return (
    <Escena fondo="claro">
      <div style={{ position: "absolute", top: 250, left: 90, right: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 70, fontWeight: 900, letterSpacing: 6, color: COLORS.navy }}>
          ALIGN <span style={{ fontWeight: 500, color: COLORS.blue }}>by ADB</span>
        </div>
        <div style={{ fontSize: 30, color: COLORS.navy }}>Contenido informativo, no es asesoramiento financiero.</div>
      </div>
      <div style={{ position: "absolute", top: 600, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ background: COLORS.white, border: `6px solid ${COLORS.blue}`, borderRadius: 999, padding: "8px 34px", fontSize: 56, fontWeight: 900, color: COLORS.navy }}>
          {t > 1 ? "Este diciembre" : "…"}
        </div>
        <div style={{ fontSize: 230, fontWeight: 900, color: COLORS.blue, letterSpacing: -8, lineHeight: 1, scale: String(t > 1 ? 0.9 + 0.1 * s : 1) }}>
          {eur(Math.round(v / GASTO) * GASTO)}
        </div>
      </div>
      <Tono i={0} en={1.0} />
    </Escena>
  );
};

const ESCENAS: DefEscena[] = [
  { id: "hook", subtitulosClaros: true, render: () => <Hook /> },
  { id: "gancho2", subtitulosClaros: true, render: () => <Gancho2 /> },
  { id: "sube", subtitulosClaros: true, render: () => <Sube /> },
  { id: "edades", subtitulosClaros: true, render: () => <Edades /> },
  { id: "wow", subtitulosClaros: true, render: () => <Wow /> },
  { id: "rehook", render: () => <Rehook /> },
  { id: "bolas", render: () => <BolasEscena /> },
  { id: "giro", render: () => <Giro /> },
  { id: "moraleja", subtitulosClaros: true, render: () => <Moraleja /> },
  {
    id: "cta",
    subtitulosClaros: true,
    render: () => <CtaCrecer tipo="comentar" boton="¿CUÁNTO LLEVAS TÚ?" linea="Te leo en **comentarios**" />,
  },
  { id: "cierre", subtitulosClaros: true, render: () => <Cierre /> },
];

export const W4906: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4906} pista="minimal-ambient-tech.mp3" /> : null;
