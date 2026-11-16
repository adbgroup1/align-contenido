import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, euros } from "../brand";
import {
  Chispas,
  Cifra,
  Cristal,
  DefEscena,
  Escena,
  Foto,
  Montaje,
  Palabras,
  Pildora,
  PropsVoz,
  Sfx,
  useSpring,
  Zona,
} from "../kit";

// W47-03 v2 · «Ahorro lo que me sobra (y nunca sobra)» · CTA SISTEMA
// Kit v2 + imágenes (public/img/W47-03/). Ejemplo hipotético: nómina 1.600 €; ahorro 10 % = 160 €; resto 1.440 €
const IMG = (n: string) => `img/W47-03/${n}.jpg`;
const NOMINA = 1600;
const AHORRO = 160;
const GASTO = NOMINA - AHORRO;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const EXTRA_W4703: Record<string, number> = { wow: 0.8, transfer: 0.5, cta: 0.8, cierre: 0.8 };

// Texto arriba, encima de la imagen
const Arriba: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 26 }) => (
  <Zona top={250} bottom={1050} justify="flex-start" gap={gap}>
    {children}
  </Zona>
);

/* Casilla «AHORRO» */
const Casilla: React.FC<{ valor: string; llena: boolean; delay?: number }> = ({ valor, llena, delay = 0 }) => {
  const s = useSpring(delay, 10, 0.7);
  const c = llena ? COLORS.green : COLORS.red;
  return (
    <div
      style={{
        fontSize: 60,
        fontWeight: 900,
        padding: "18px 40px",
        borderRadius: 24,
        border: `6px solid ${c}`,
        backgroundColor: llena ? c : "rgba(11,18,36,0.7)",
        color: llena ? COLORS.navy : c,
        whiteSpace: "nowrap",
        scale: String(s),
        boxShadow: `0 0 50px ${c}66`,
      }}
    >
      AHORRO: {valor}
    </div>
  );
};

/* Bloques Cobrar / Gastar / Ahorrar que pueden intercambiarse */
const Orden: React.FC<{ cambiar?: boolean; delay?: number }> = ({ cambiar = false, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = cambiar ? spring({ frame: frame - delay * fps, fps, config: { damping: 13 }, durationInFrames: 30 }) : 0;
  const PASO = 150;
  const items = [
    { txt: "Cobrar", color: COLORS.light, pos: 0 },
    { txt: "Gastar", color: COLORS.red, pos: 1 + t },
    { txt: "Ahorrar", color: COLORS.green, pos: 2 - t },
  ];
  return (
    <div style={{ position: "relative", width: 640, height: PASO * 3 }}>
      {items.map((it, i) => (
        <div key={it.txt} style={{ position: "absolute", top: it.pos * PASO, left: 0 }}>
          <Cristal color={it.color} w={640} desde={i % 2 ? "der" : "izq"} delay={0.1 + i * 0.12}>
            <div style={{ fontSize: 66, fontWeight: 900, color: it.color }}>
              {Math.round(it.pos) + 1}. {it.txt}
            </div>
          </Cristal>
        </div>
      ))}
    </div>
  );
};

const ESCENAS: DefEscena[] = [
  {
    id: "hook",
    render: () => <Hook />,
  },
  {
    id: "gancho2",
    render: () => (
      <Escena fondo="azul">
        <Zona gap={50}>
          <Palabras texto="No es cuánto cobras. **Es el orden.**" size={92} resalta={COLORS.gold} />
          <Orden />
        </Zona>
      </Escena>
    ),
  },
  {
    id: "reparto",
    render: () => <Reparto />,
  },
  {
    id: "dia25",
    render: () => <Dia25 />,
  },
  {
    id: "wow",
    render: ({ dur }) => (
      <Escena fondo="noche" sacudidas={[0.9]} sonidoEntrada="impacto">
        <Sfx s="ding" volumen={0.4} en={0.9} />
        <Zona gap={40}>
          <Palabras texto="Cambia el orden: **ahorra primero**" size={88} resalta={COLORS.green} />
          <Orden cambiar delay={0.4} />
          <div style={{ display: "flex", gap: 30 }}>
            <Pildora bg="rgba(34,197,94,0.18)" color={COLORS.green} size={44} delay={1.2}>
              Ahorro fijo {euros(AHORRO)}
            </Pildora>
            <Pildora bg="rgba(248,113,113,0.16)" color={COLORS.red} size={44} delay={1.4}>
              Gasto {euros(GASTO)}
            </Pildora>
          </div>
        </Zona>
        <Chispas en={Math.min(1, dur / 30 - 0.5)} x={540} y={860} color={COLORS.green} />
      </Escena>
    ),
  },
  {
    id: "transfer",
    render: () => <Transfer />,
  },
  {
    id: "vives",
    render: () => <Vives />,
  },
  {
    id: "cta",
    subtitulosClaros: true,
    render: () => <Cta />,
  },
  {
    id: "cierre",
    subtitulos: false,
    render: () => (
      <Escena sonidoEntrada="whoosh">
        <Foto src={IMG("04-cerdito-lleno")} zoom={[1.15, 1.0]} />
        <Arriba gap={30}>
          <Palabras texto="Y lo que sobra, **para gastar sin culpa.**" size={84} resalta={COLORS.green} />
          <Casilla valor={euros(AHORRO)} llena delay={0.6} />
        </Arriba>
        <Zona top={1300} bottom={300} gap={12}>
          <div style={{ fontSize: 60, fontWeight: 900, letterSpacing: 6, color: COLORS.white }}>
            ALIGN <span style={{ fontWeight: 500, color: COLORS.light }}>by ADB</span>
          </div>
          <div style={{ fontSize: 28, color: COLORS.light }}>Contenido informativo, no es asesoramiento financiero.</div>
        </Zona>
      </Escena>
    ),
  },
];

const Hook = () => {
  return (
    <Escena sinEntrada sacudidas={[1.1]}>
      <Foto src={IMG("01-cerdito-vacio")} zoom={[1.18, 1.02]} />
      <Sfx s="impacto" volumen={0.5} />
      <Arriba gap={24}>
        <Palabras texto="«Ahorro lo que me sobra.»" size={88} stagger={0.05} />
        <Palabras texto="**Por eso nunca sobra.**" size={88} delay={0.6} resalta={COLORS.red} />
        <Casilla valor="0 €" llena={false} delay={1.1} />
      </Arriba>
    </Escena>
  );
};

const Reparto = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const trozos = [0.32, 0.22, 0.18, 0.16, 0.12];
  return (
    <Escena fondo="noche">
      <Zona gap={44}>
        <Palabras texto="Cobrar → gastar → **ahorrar lo que quede**" size={80} resalta={COLORS.red} />
        <Pildora delay={0.3}>Ejemplo hipotético</Pildora>
        <Cifra a={NOMINA} inicio={0.2} fin={0.9} size={140} formato={(v) => euros(Math.round(v / 10) * 10)} />
        <div style={{ width: 840, height: 110, borderRadius: 28, backgroundColor: COLORS.accent, overflow: "hidden", display: "flex", boxShadow: `0 0 40px ${COLORS.accent}55` }}>
          {trozos.map((w, i) => {
            const p = interpolate(frame, [(0.9 + i * 0.35) * fps, (1.15 + i * 0.35) * fps], [0, 1], clamp);
            return <div key={i} style={{ width: `${w * 100 * p}%`, height: "100%", backgroundColor: i % 2 ? "#DC2626" : COLORS.red, borderRight: p > 0 ? `4px solid ${COLORS.navy}` : "none" }} />;
          })}
        </div>
        <Palabras texto="alquiler, súper, planes…" size={52} color={COLORS.red} delay={1.2} />
      </Zona>
    </Escena>
  );
};

const Dia25 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dia = Math.round(interpolate(frame, [0.1 * fps, 1.1 * fps], [1, 25], clamp));
  return (
    <Escena sonidoEntrada="swoosh">
      <Foto src={IMG("02-cartera-vacia")} zoom={[1.0, 1.14]} subir={20} />
      <Arriba gap={20}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ width: 210, borderRadius: 26, overflow: "hidden", backgroundColor: COLORS.white, textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
            <div style={{ backgroundColor: COLORS.red, color: COLORS.white, fontSize: 34, fontWeight: 800, padding: 8 }}>DÍA</div>
            <div style={{ fontSize: 120, fontWeight: 900, color: COLORS.navy, fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>{dia}</div>
          </div>
        </div>
        <Palabras texto="**Nada** que ahorrar" size={96} resalta={COLORS.red} delay={0.9} />
      </Arriba>
      <Sfx s="pop" volumen={0.35} en={1.1} />
    </Escena>
  );
};

const Transfer = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [0.7 * fps, 1.6 * fps], [0, 1], clamp);
  return (
    <Escena sonidoEntrada="whoosh">
      <Foto src={IMG("03-chorro")} zoom={[1.0, 1.15]} />
      <Sfx s="ding" volumen={0.35} en={1.6} />
      <Arriba gap={22}>
        <Palabras texto="Día 1: **automático**" size={100} resalta={COLORS.green} />
        <Palabras texto="a otra cuenta" size={70} color={COLORS.light} delay={0.5} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 10 }}>
          <Pildora size={44}>Nómina</Pildora>
          <div style={{ width: 200, height: 10, borderRadius: 5, backgroundColor: COLORS.green, transformOrigin: "left", scale: `${t} 1`, boxShadow: `0 0 20px ${COLORS.green}` }} />
          <Pildora bg="rgba(34,197,94,0.2)" color={COLORS.green} size={44}>
            {t >= 1 ? `+${euros(AHORRO)}` : "Ahorro"}
          </Pildora>
        </div>
      </Arriba>
    </Escena>
  );
};

const Vives = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dia = Math.round(interpolate(frame, [0.2 * fps, 2.2 * fps], [1, 30], clamp));
  return (
    <Escena fondo="azul">
      <Zona gap={50}>
        <Palabras texto="Vives con lo que queda, **sin pensarlo**" size={86} resalta={COLORS.light} />
        <Cristal color={COLORS.accent} w={820} desde="abajo" delay={0.2}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: 42, fontWeight: 800, color: COLORS.light }}>
            <span>Para gastar</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>Día {dia}</span>
          </div>
          <div style={{ fontSize: 110, fontWeight: 900, color: COLORS.white }}>{euros(GASTO)}</div>
        </Cristal>
        <Casilla valor={euros(AHORRO)} llena delay={0.8} />
      </Zona>
    </Escena>
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
      <Zona gap={46}>
        <Palabras texto="Comenta" size={100} color={COLORS.navy} />
        <div
          style={{
            fontSize: 150,
            fontWeight: 900,
            color: COLORS.white,
            background: `linear-gradient(160deg, #3B6BFF, ${COLORS.blue})`,
            padding: "26px 60px",
            borderRadius: 44,
            letterSpacing: 4,
            rotate: "-3deg",
            scale: String(s * pulso),
            boxShadow: `0 30px 80px ${COLORS.blue}66, inset 0 -10px 0 rgba(0,0,0,0.2)`,
          }}
        >
          SISTEMA
        </div>
        <Palabras texto="y te enseño a **montarlo** en una llamada gratis" size={60} color={COLORS.navy} resalta={COLORS.blue} delay={0.8} />
      </Zona>
    </Escena>
  );
};

export const W4703v2: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4703} pista="lofi-polaroids.mp3" /> : null;
