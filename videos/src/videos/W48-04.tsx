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
}> = ({ de, a, inicio = 0, fin = 0.01, color, etiqueta, ticks = 0, ding = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [inicio * fps, fin * fps], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 2.2 });
  const v = de + (a - de) * p;
  const c = color ?? colorDe(v);
  const llegada = frame - fin * fps;
  const golpe = llegada >= 0 && llegada < 10 ? Math.sin((llegada / 10) * Math.PI) * 0.1 : 0;
  const pulso = 1 + 0.015 * Math.sin(frame / 5);
  const len = eur(v).length;
  const size = len >= 8 ? 172 : len === 7 ? 205 : 250;
  return (
    <div style={{ position: "absolute", top: 600, left: 90, right: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ position: "absolute", top: -170, width: 760, height: 760, borderRadius: "50%", background: `radial-gradient(circle, ${c}55 0%, ${c}11 50%, transparent 70%)` }} />
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
        <div style={{ fontSize: 54, fontWeight: 800, color: COLORS.white, background: `${c}33`, border: `3px solid ${c}`, borderRadius: 999, padding: "8px 34px" }}>
          {etiqueta(v)}
        </div>
      ) : null}
      {Array.from({ length: ticks }, (_, i) => (
        <Sfx key={i} s="tick" volumen={0.12} en={inicio + ((fin - inicio) * i) / Math.max(1, ticks)} />
      ))}
      {ding ? <Sfx s="ding" volumen={0.4} en={fin} /> : null}
    </div>
  );
};

const dias = (v: number) => {
  const d = Math.max(1, Math.round(v / 3));
  return d >= 365 ? `${Math.round(d / 365) === 1 ? "1 año" : `${Math.round(d / 365)} años`}` : `Día ${d}`;
};

/* iconos de gastos pequeños que salen alrededor del contador */
const Icono: React.FC<{ tipo: "cafe" | "galleta" | "app"; x: number; y: number; delay: number }> = ({ tipo, x, y, delay }) => {
  const s = useSpring(delay, 9, 0.6);
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x - 90, top: y - 90 + Math.sin(frame / 12 + x) * 10, scale: String(s), opacity: Math.min(1, s * 2) }}>
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
        <Contador de={3} a={3} etiqueta={() => "Día 1"} />
      </Escena>
    ),
  },
  {
    id: "gancho2",
    render: () => (
      <Escena luz={COLORS.green} sonidoEntrada="swoosh">
        <Rotulo texto="No pares el **contador**" />
        <Contador de={3} a={30} inicio={0.1} fin={2.1} etiqueta={dias} ticks={10} />
      </Escena>
    ),
  },
  {
    id: "hormiga",
    render: () => (
      <Escena luz={COLORS.green} sonidoEntrada={null}>
        <Contador de={30} a={300} inicio={0} fin={3.5} etiqueta={dias} ticks={14} />
        <Icono tipo="cafe" x={250} y={420} delay={0.2} />
        <Icono tipo="galleta" x={830} y={420} delay={1.1} />
        <Icono tipo="app" x={540} y={1130} delay={2.0} />
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
        <Contador de={300} a={900} inicio={0} fin={3} etiqueta={dias} ticks={14} />
        <Sfx s="riser" volumen={0.35} en={1.6} />
      </Escena>
    ),
  },
  {
    id: "wow",
    render: () => (
      <Escena luz={COLORS.red} sacudidas={[1.0]} sonidoEntrada={null}>
        <Contador de={900} a={1095} inicio={0} fin={1.0} etiqueta={(v) => (v >= 1094 ? "1 año" : dias(v))} ticks={6} ding />
        <div style={{ position: "absolute", top: 1080, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
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
        <Contador de={1095} a={10950} inicio={0.2} fin={2.2} etiqueta={(v) => `${Math.max(1, Math.min(10, Math.round(v / 1095)))} años`} ticks={12} ding />
        <div style={{ position: "absolute", top: 1080, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
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
            <Contador de={10950} a={10950} color={COLORS.light} />
            <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative", fontSize: 80, fontWeight: 900, color: COLORS.grey }}>
                Quitarlo
                <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 10, background: COLORS.red, transformOrigin: "left", scale: `${tacha} 1` }} />
              </div>
            </div>
            <div style={{ position: "absolute", top: 900, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
              <div style={{ fontSize: 110, fontWeight: 900, color: COLORS.navy, background: COLORS.gold, borderRadius: 30, padding: "6px 44px", rotate: "-3deg", scale: String(elige) }}>
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
          <div style={{ width: 860, display: "flex", alignItems: "center", gap: 26, background: `${c}22`, border: `4px solid ${c}`, borderRadius: 30, padding: "22px 30px", opacity: s, translate: `${(1 - s) * 300}px 0px` }}>
            <div style={{ fontSize: 70, fontWeight: 900, color: c, width: 120 }}>{txt}</div>
            <div style={{ fontSize: 54, fontWeight: 800, color: COLORS.white }}>{sub}</div>
          </div>
        );
        return (
          <Escena luz={COLORS.blue}>
            <div style={{ position: "absolute", top: 280, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 60, fontWeight: 900, color: COLORS.light }}>¿Te compensa?</div>
            </div>
            <Contador de={10950} a={10950} color={COLORS.accent} />
            <div style={{ position: "absolute", top: 900, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
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
        <Contador de={3} a={3} etiqueta={() => "nunca son solo 3 €"} />
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
