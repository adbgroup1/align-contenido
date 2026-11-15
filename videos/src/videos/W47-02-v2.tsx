import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, euros, futureValueAt } from "../brand";
import {
  Chispas,
  Cifra,
  Cristal,
  DefEscena,
  Escena,
  Montaje,
  Palabras,
  Pildora,
  PropsVoz,
  Sfx,
  useSpring,
  Zona,
} from "../kit";

// W47-02 v2 · «Empezar a los 25 o a los 35» · CTA CURSO
// Ejemplo hipotético: 100 €/mes al 6 % anual, capitalización mensual
const RATE = 0.06;
const fv = (m: number) => futureValueAt(100, RATE, m);
const lucia = (age: number) => fv((age - 25) * 12);
const marcos = (age: number) => fv((age - 35) * 12);
const MAX = lucia(65);
const LUCIA = COLORS.accent;
const MARCOS = COLORS.gold;
const EJEMPLO = "Ejemplo hipotético · 6 % anual";
const k = (v: number) => euros(Math.round(v / 1000) * 1000);

export const EXTRA_W4702: Record<string, number> = { wow: 0.8, mitad: 0.6, cta: 0.6, cierre: 0.8 };

/* Persona: círculo con la edad y nombre */
const Persona: React.FC<{ edad: number | string; color: string; nombre: string }> = ({ edad, color, nombre }) => (
  <>
    <div
      style={{
        width: 190,
        height: 190,
        borderRadius: 999,
        background: `radial-gradient(circle at 35% 30%, ${COLORS.white} 0%, ${color} 45%, ${color}AA 100%)`,
        boxShadow: `0 0 60px ${color}88`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 92,
        fontWeight: 900,
        color: COLORS.navy,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {edad}
    </div>
    <div style={{ fontSize: 54, fontWeight: 900, color }}>{nombre}</div>
  </>
);

/* Gráfico de curvas con relleno y punto brillante */
const W = 860;
const H = 600;
const x = (age: number) => ((age - 25) / 40) * W;
const y = (v: number) => H - (v / MAX) * (H - 30);
const linea = (f: (a: number) => number, from: number, to: number) => {
  const pts: string[] = [];
  for (let a = from; a <= to + 1e-6; a += 0.25) pts.push(`${x(a).toFixed(1)},${y(Math.max(0, f(a))).toFixed(1)}`);
  return pts;
};
const Curvas: React.FC<{ hasta: number }> = ({ hasta }) => {
  const frame = useCurrentFrame();
  const pulso = 1 + 0.15 * Math.sin(frame / 4);
  const serie = (f: (a: number) => number, color: string, idg: string) => {
    const pts = linea(f, 25, hasta);
    const d = "M" + pts.join(" L");
    const area = `${d} L${x(hasta)},${H} L0,${H} Z`;
    const yy = y(Math.max(0, f(hasta)));
    return (
      <g>
        <defs>
          <linearGradient id={idg} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.45" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${idg})`} />
        <path d={d} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 14px ${color})` }} />
        <circle cx={x(hasta)} cy={yy} r={18 * pulso} fill={COLORS.white} style={{ filter: `drop-shadow(0 0 20px ${color})` }} />
      </g>
    );
  };
  return (
    <svg width={W} height={H + 70} viewBox={`0 0 ${W} ${H + 70}`} style={{ overflow: "visible" }}>
      {[0.25, 0.5, 0.75].map((p) => (
        <line key={p} x1={0} x2={W} y1={H * p} y2={H * p} stroke={COLORS.light} strokeOpacity={0.12} strokeWidth={2} strokeDasharray="8 12" />
      ))}
      <line x1={0} y1={H} x2={W} y2={H} stroke={COLORS.light} strokeOpacity={0.4} strokeWidth={4} />
      {[25, 35, 45, 55, 65].map((a) => (
        <text key={a} x={x(a)} y={H + 56} fill={COLORS.light} fontSize={36} fontWeight={800} textAnchor="middle">
          {a}
        </text>
      ))}
      {serie(marcos, MARCOS, "gM")}
      {serie(lucia, LUCIA, "gL")}
    </svg>
  );
};

/* Barra que crece con etiqueta */
const Barra: React.FC<{ valor: number; max: number; color: string; nombre: string; etiqueta: string; delay?: number; alto?: number }> = ({
  valor,
  max,
  color,
  nombre,
  etiqueta,
  delay = 0,
  alto = 560,
}) => {
  const s = useSpring(delay, 15, 0.9);
  const h = (valor / max) * alto * s;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: alto + 150, width: 300 }}>
      <div style={{ fontSize: 50, fontWeight: 900, color: COLORS.white, marginBottom: 14, opacity: s, whiteSpace: "nowrap" }}>{etiqueta}</div>
      <div
        style={{
          width: 240,
          height: h,
          borderRadius: "28px 28px 8px 8px",
          background: `linear-gradient(180deg, ${COLORS.white}CC 0%, ${color} 18%, ${color}99 100%)`,
          boxShadow: `0 0 50px ${color}66`,
        }}
      />
      <div style={{ fontSize: 48, fontWeight: 900, color, marginTop: 16 }}>{nombre}</div>
    </div>
  );
};

const ESCENAS: DefEscena[] = [
  {
    id: "hook",
    render: () => (
      <Escena sinEntrada sacudidas={[0.05]}>
        <Sfx s="impacto" volumen={0.55} />
        <Zona gap={60}>
          <Palabras texto="Mismos 100 € al mes. **10 años** de diferencia." size={96} stagger={0.05} />
          <div style={{ display: "flex", gap: 60 }}>
            <Cristal color={LUCIA} w={360} desde="izq" delay={0}>
              <Persona edad={25} color={LUCIA} nombre="Lucía" />
            </Cristal>
            <Cristal color={MARCOS} w={360} desde="der" delay={0.08}>
              <Persona edad={35} color={MARCOS} nombre="Marcos" />
            </Cristal>
          </div>
        </Zona>
      </Escena>
    ),
  },
  {
    id: "gancho2",
    render: () => <Gancho2 />,
  },
  {
    id: "reglas",
    render: () => (
      <Escena fondo="azul">
        <Zona gap={44}>
          <Palabras texto="Los dos: **100 €/mes** hasta los 65" size={88} />
          <Pildora delay={0.5}>{EJEMPLO}</Pildora>
          <Pistas />
        </Zona>
      </Escena>
    ),
  },
  {
    id: "pregunta",
    render: ({ dur }) => (
      <Escena luz="#4C1D95">
        <Sfx s="riser" volumen={0.35} en={Math.max(0, dur / 30 - 1.5)} />
        <Zona gap={30}>
          <Interrogante />
          <Palabras texto="¿Quién acaba con **más?**" size={110} stagger={0.08} />
        </Zona>
      </Escena>
    ),
  },
  {
    id: "wow",
    render: ({ dur }) => <Wow dur={dur} />,
  },
  {
    id: "rehook",
    render: () => (
      <Escena fondo="noche">
        <Zona gap={30}>
          <Palabras texto="Marcos puso solo **12.000 € menos…**" size={84} resalta={COLORS.red} />
          <Pildora delay={0.3}>{EJEMPLO}</Pildora>
          <div style={{ display: "flex", gap: 70, alignItems: "flex-end" }}>
            <Barra valor={48000} max={48000} color={LUCIA} nombre="Lucía" etiqueta="48.000 €" delay={0.15} alto={460} />
            <Barra valor={36000} max={48000} color={MARCOS} nombre="Marcos" etiqueta="36.000 €" delay={0.3} alto={460} />
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: COLORS.light }}>Lo que aportó cada uno</div>
        </Zona>
      </Escena>
    ),
  },
  {
    id: "mitad",
    render: () => (
      <Escena fondo="noche" sacudidas={[0.45]} sonidoEntrada="impacto">
        <Zona gap={30}>
          <Palabras texto="…y acaba con **la mitad**" size={100} marcador />
          <Pildora delay={0.2}>{EJEMPLO}</Pildora>
          <div style={{ position: "relative", display: "flex", gap: 70, alignItems: "flex-end" }}>
            <Barra valor={lucia(65)} max={lucia(65)} color={LUCIA} nombre="Lucía" etiqueta={k(lucia(65))} delay={0} alto={500} />
            <Barra valor={marcos(65)} max={lucia(65)} color={MARCOS} nombre="Marcos" etiqueta={k(marcos(65))} delay={0.1} alto={500} />
            <Sello />
          </div>
        </Zona>
      </Escena>
    ),
  },
  {
    id: "tiempo",
    render: () => (
      <Escena fondo="azul">
        <Zona gap={50}>
          <Reloj />
          <Palabras texto="El tiempo hace **el trabajo pesado**" size={96} resalta={LUCIA} />
        </Zona>
      </Escena>
    ),
  },
  {
    id: "cta",
    subtitulosClaros: true,
    render: () => <Cta />,
  },
  {
    id: "cierre",
    render: () => (
      <Escena>
        <Zona gap={50}>
          <Palabras texto="La diferencia no fue el dinero. **Fueron 10 años.**" size={88} />
          <div style={{ display: "flex", gap: 50, scale: "0.8" }}>
            <Cristal color={LUCIA} w={330} desde="zoom" delay={0.6}>
              <Persona edad={25} color={LUCIA} nombre="Lucía" />
            </Cristal>
            <Cristal color={MARCOS} w={330} desde="zoom" delay={0.7}>
              <Persona edad={35} color={MARCOS} nombre="Marcos" />
            </Cristal>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 60, fontWeight: 900, letterSpacing: 6, color: COLORS.white }}>
              ALIGN <span style={{ fontWeight: 500, color: COLORS.light }}>by ADB</span>
            </div>
            <div style={{ fontSize: 28, color: COLORS.light }}>Contenido informativo, no es asesoramiento financiero.</div>
          </div>
        </Zona>
      </Escena>
    ),
    subtitulos: false,
  },
];

const Gancho2 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const edadM = Math.round(interpolate(frame, [1.6 * fps, 3.2 * fps], [25, 35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <Escena>
      <Zona gap={60}>
        <Palabras texto="**Lucía** empieza a los 25. **Marcos,** a los 35." size={82} resalta={COLORS.white} />
        <div style={{ display: "flex", gap: 60 }}>
          <Cristal color={LUCIA} w={360} desde="izq">
            <Persona edad={25} color={LUCIA} nombre="Lucía" />
            <Pildora bg="rgba(34,197,94,0.18)" color={COLORS.green} delay={0.5}>
              ▶ Invirtiendo
            </Pildora>
          </Cristal>
          <Cristal color={MARCOS} w={360} desde="der" delay={0.1}>
            <Persona edad={edadM} color={MARCOS} nombre="Marcos" />
            <Pildora bg="rgba(248,113,113,0.16)" color={COLORS.red} delay={0.6}>
              ⏸ Esperando
            </Pildora>
          </Cristal>
        </div>
      </Zona>
    </Escena>
  );
};

/* Dos pistas de tiempo 25→65 */
const Pistas = () => {
  const s = useSpring(0.6, 20, 1);
  const Fila = ({ desde, color, nombre }: { desde: number; color: string; nombre: string }) => (
    <div style={{ width: 860 }}>
      <div style={{ fontSize: 44, fontWeight: 900, color, marginBottom: 12 }}>{nombre}</div>
      <div style={{ position: "relative", height: 56, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 28, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: `${((desde - 25) / 40) * 100}%`,
            width: `${((65 - desde) / 40) * 100 * s}%`,
            top: 0,
            bottom: 0,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            borderRadius: 28,
            boxShadow: `0 0 30px ${color}`,
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 34, fontWeight: 800, color: COLORS.light, marginTop: 8 }}>
        <span>25</span>
        <span>35</span>
        <span>65</span>
      </div>
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
      <Fila desde={25} color={LUCIA} nombre="Lucía · desde los 25" />
      <Fila desde={35} color={MARCOS} nombre="Marcos · desde los 35" />
    </div>
  );
};

const Interrogante = () => {
  const frame = useCurrentFrame();
  const s = useSpring(0, 8, 0.8);
  return (
    <div
      style={{
        fontSize: 420,
        fontWeight: 900,
        lineHeight: 0.9,
        background: `linear-gradient(160deg, ${LUCIA}, ${MARCOS})`,
        WebkitBackgroundClip: "text",
        color: "transparent",
        scale: String(s),
        rotate: `${Math.sin(frame / 8) * 6}deg`,
        filter: `drop-shadow(0 0 60px ${LUCIA}88)`,
      }}
    >
      ?
    </div>
  );
};

const Wow: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const finCurva = dur / fps - 1.1;
  const edad = interpolate(frame, [0.2 * fps, finCurva * fps], [25, 65], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Escena fondo="noche" sacudidas={[finCurva]}>
      <Sfx s="ding" volumen={0.4} en={finCurva} />
      <Zona gap={26}>
        <div style={{ display: "flex", gap: 70, justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 44, fontWeight: 900, color: LUCIA }}>Lucía</div>
            <Cifra a={MAX} inicio={0.2} fin={finCurva} size={74} color={LUCIA} formato={k} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 44, fontWeight: 900, color: MARCOS }}>Marcos</div>
            <Cifra a={marcos(65)} inicio={0.2} fin={finCurva} size={74} color={MARCOS} formato={k} ticks={false} />
          </div>
        </div>
        <Pildora>{EJEMPLO}</Pildora>
        <Curvas hasta={edad} />
      </Zona>
      <Chispas en={finCurva} x={90 + 860} y={360} color={LUCIA} />
    </Escena>
  );
};

const Sello = () => {
  const s = useSpring(0.45, 9, 0.7);
  return (
    <div
      style={{
        position: "absolute",
        right: -110,
        top: 40,
        width: 220,
        height: 220,
        borderRadius: 999,
        border: `10px solid ${COLORS.red}`,
        color: COLORS.red,
        fontSize: 110,
        fontWeight: 900,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        rotate: `${-14 + (1 - s) * 30}deg`,
        scale: String(2.2 - 1.2 * s),
        opacity: Math.min(1, s * 2),
        backgroundColor: "rgba(11,18,36,0.75)",
        boxShadow: `0 0 40px ${COLORS.red}88`,
      }}
    >
      ½
    </div>
  );
};

const Reloj = () => {
  const frame = useCurrentFrame();
  const s = useSpring(0, 12);
  return (
    <svg width={420} height={420} viewBox="-210 -210 420 420" style={{ scale: String(s), filter: `drop-shadow(0 0 40px ${LUCIA}88)` }}>
      <circle r={190} fill="rgba(255,255,255,0.06)" stroke={LUCIA} strokeWidth={10} />
      <circle r={190} fill="none" stroke={COLORS.gold} strokeWidth={10} strokeDasharray={`${(frame * 14) % 1194} 1194`} transform="rotate(-90)" strokeLinecap="round" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={0} y1={-160} x2={0} y2={-140} stroke={COLORS.light} strokeWidth={8} strokeLinecap="round" transform={`rotate(${i * 30})`} />
      ))}
      <line x1={0} y1={0} x2={0} y2={-120} stroke={COLORS.white} strokeWidth={12} strokeLinecap="round" transform={`rotate(${frame * 18})`} />
      <line x1={0} y1={0} x2={0} y2={-80} stroke={COLORS.white} strokeWidth={14} strokeLinecap="round" transform={`rotate(${frame * 1.5})`} />
      <circle r={16} fill={COLORS.gold} />
    </svg>
  );
};

const Cta = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSpring(0.35, 8, 0.8);
  const pulso = 1 + 0.035 * Math.sin((frame / fps) * Math.PI * 2.2);
  return (
    <Escena fondo="claro">
      <Sfx s="pop" volumen={0.4} en={0.35} />
      <Sfx s="click" volumen={0.4} en={1.2} />
      <Zona gap={50}>
        <Palabras texto="Comenta" size={100} color={COLORS.navy} />
        <div
          style={{
            fontSize: 170,
            fontWeight: 900,
            color: COLORS.white,
            background: `linear-gradient(160deg, #3B6BFF, ${COLORS.blue})`,
            padding: "26px 70px",
            borderRadius: 44,
            letterSpacing: 6,
            rotate: "-3deg",
            scale: String(s * pulso),
            boxShadow: `0 30px 80px ${COLORS.blue}66, inset 0 -10px 0 rgba(0,0,0,0.2)`,
          }}
        >
          CURSO
        </div>
        <Palabras texto="y te mando **el curso** para aprender desde cero" size={64} color={COLORS.navy} resalta={COLORS.blue} delay={0.8} />
      </Zona>
    </Escena>
  );
};

export const W4702v2: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4702} pista="piano-strings-light.mp3" /> : null;
