import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../brand";
import { Chispas, CtaCrecer, DefEscena, framesEscena, Montaje, Personaje, PropsVoz, Rotulo, Sfx, useSpring, Voz } from "../kit";

// W49-08 · «Construye tu colchón desde cero» · Reel · Construye desde cero · H2 · CTA COMPARTIR
// Plano fijo todo el vídeo: un catre que se convierte pieza a pieza en un colchón (= fondo de emergencia).
// Sin entradas con zoom ni whoosh entre escenas: solo cae una pieza por frase, con pop y rebote.
// Fuente: CONDUSEF (3 a 6 meses de gastos; al menos el 10 % del ingreso). Todo DIBUJO.

export const EXTRA_W4908: Record<string, number> = { sabana: 0.5, wow: 0.9, cta: 0.4 };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CX = 540;
const BASE_Y = 1080; // larguero del catre
const ANCHO = 640;
const L = CX - ANCHO / 2;
const CAPA = 58;

/** Fondo fijo con luz lenta (usa el tiempo absoluto: no salta entre escenas). */
const FondoFijo: React.FC<{ abs: number }> = ({ abs }) => {
  const t = abs / 30;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, #1E2A55 0%, ${COLORS.navy} 55%, ${COLORS.deep} 100%)` }}>
      <div
        style={{
          position: "absolute",
          left: 540 - 450 + Math.sin(t * 0.4) * 80,
          top: 700 + Math.cos(t * 0.3) * 60,
          width: 900,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.blue}44 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
      {/* suelo */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1236, height: 6, background: `${COLORS.light}22` }} />
      <div style={{ position: "absolute", left: CX - 380, width: 760, top: 1222, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.35)", filter: "blur(10px)" }} />
    </AbsoluteFill>
  );
};

/** Pop y rebote de una pieza que cae desde arriba. */
const useCae = (delay = 0.05) => {
  const s = useSpring(delay, 8, 0.55);
  return { y: (1 - s) * -520, sq: 1 + (s > 1 ? (s - 1) * 0.6 : 0), op: Math.min(1, s * 4) };
};

const Catre: React.FC<{ fantasma?: boolean }> = ({ fantasma }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: fantasma ? 0.3 : 1 }}>
    <g stroke="#94A3B8" strokeWidth={14} strokeLinecap="round" fill="none">
      <line x1={L + 20} y1={BASE_Y} x2={L + 20} y2={1232} />
      <line x1={L + ANCHO - 20} y1={BASE_Y} x2={L + ANCHO - 20} y2={1232} />
      <line x1={L} y1={BASE_Y} x2={L + ANCHO} y2={BASE_Y} />
      <line x1={L + 20} y1={BASE_Y} x2={L + 20} y2={BASE_Y - 170} />
      <line x1={L + 20} y1={BASE_Y - 170} x2={L + 20} y2={BASE_Y - 170} strokeWidth={26} />
      {[1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={L + 20 + i * 100} y1={BASE_Y} x2={L + 20 + i * 100} y2={BASE_Y + 40} strokeWidth={8} />
      ))}
    </g>
  </svg>
);

/** Tabla gris (= cuenta aparte). */
const Tabla: React.FC<{ y?: number; sq?: number; etiqueta?: boolean }> = ({ y = 0, sq = 1, etiqueta = true }) => (
  <div
    style={{
      position: "absolute",
      left: L + 10,
      top: BASE_Y - 34 + y,
      width: ANCHO - 20,
      height: 30,
      borderRadius: 8,
      background: "linear-gradient(180deg, #CBD5E1, #64748B)",
      border: `4px solid ${COLORS.navy}`,
      scale: `1 ${sq}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily,
      fontWeight: 900,
      fontSize: 22,
      color: COLORS.navy,
      letterSpacing: 2,
    }}
  >
    {etiqueta ? "CUENTA APARTE" : ""}
  </div>
);

const COLOR_CAPA = ["#93C5FD", "#60A5FA", "#3B82F6"];
const Capa: React.FC<{ i: number; y?: number; op?: number; bote?: number }> = ({ i, y = 0, op = 1, bote = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: L + 6,
      top: BASE_Y - 34 - CAPA * (i + 1) + y - bote,
      width: ANCHO - 12,
      height: CAPA - 4,
      borderRadius: 26,
      background: `linear-gradient(180deg, ${COLOR_CAPA[i]}, ${COLOR_CAPA[i]}CC)`,
      border: `4px solid ${COLORS.navy}`,
      opacity: op,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily,
      fontWeight: 900,
      fontSize: 30,
      color: COLORS.navy,
      boxShadow: "inset 0 -8px 0 rgba(0,0,0,0.12)",
    }}
  >
    MES {i + 1}
  </div>
);

/** Resortes bajo el catre. `fase` = rebote 0–1. */
const Resortes: React.FC<{ alto: number; fase: number; op?: number }> = ({ alto, fase, op = 1 }) => {
  const h = alto * (0.8 + 0.2 * fase);
  const zig = (x: number) => {
    const n = 6;
    const pts = Array.from({ length: n + 1 }, (_, k) => `${x + (k % 2 ? 18 : -18)},${BASE_Y + 46 + (k * h) / n}`);
    return `M${x},${BASE_Y + 46} L${pts.join(" L")}`;
  };
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: op }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={zig(L + 120 + i * 100)} stroke={COLORS.gold} strokeWidth={8} fill="none" strokeLinejoin="round" />
      ))}
    </svg>
  );
};

const Almohada: React.FC<{ y?: number; sq?: number; op?: number }> = ({ y = 0, sq = 1, op = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: L + 40,
      top: BASE_Y - 34 - CAPA * 3 - 78 + y,
      width: 210,
      height: 78,
      borderRadius: 40,
      background: `linear-gradient(180deg, ${COLORS.white}, ${COLORS.light})`,
      border: `4px solid ${COLORS.navy}`,
      scale: `${2 - sq} ${sq}`,
      transformOrigin: "50% 100%",
      opacity: op,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily,
      fontWeight: 900,
      fontSize: 22,
      color: COLORS.blue,
    }}
  >
    AGUINALDO
  </div>
);

const Sabana: React.FC<{ p: number; jalon?: number }> = ({ p, jalon = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: L + 260,
      top: BASE_Y - 34 - CAPA * 3 - 14,
      width: (ANCHO - 260) * p,
      height: CAPA * 3 + 40,
      borderRadius: "18px 30px 18px 18px",
      background: `repeating-linear-gradient(135deg, #FDE68A 0 22px, #FCD34D 22px 44px)`,
      border: `4px solid ${COLORS.navy}`,
      rotate: `${jalon * -4}deg`,
      transformOrigin: "0% 50%",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 64,
    }}
  >
    {p > 0.6 ? "🔒" : ""}
  </div>
);

/** Gato gris «Ahorita lo hago». */
const Gato: React.FC<{ x: number; y: number; rot?: number; letrero?: boolean }> = ({ x, y, rot = 0, letrero = true }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -100%", rotate: `${rot}deg` }}>
    {letrero ? (
      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: "50%",
          translate: "-50% 0",
          whiteSpace: "nowrap",
          background: COLORS.white,
          border: `4px solid ${COLORS.navy}`,
          borderRadius: 14,
          padding: "6px 14px",
          fontFamily,
          fontWeight: 900,
          fontSize: 32,
          color: COLORS.navy,
          rotate: "-5deg",
        }}
      >
        «Ahorita lo hago»
      </div>
    ) : null}
    <svg width={180} height={140} viewBox="0 0 180 140" style={{ overflow: "visible" }}>
      <path d="M150 90 Q190 60 168 30" stroke="#6B7280" strokeWidth={14} fill="none" strokeLinecap="round" />
      <ellipse cx={100} cy={100} rx={62} ry={36} fill="#9CA3AF" stroke={COLORS.navy} strokeWidth={4} />
      <circle cx={46} cy={70} r={36} fill="#9CA3AF" stroke={COLORS.navy} strokeWidth={4} />
      <path d="M20 50 L22 20 L44 40 Z M54 38 L72 16 L76 46 Z" fill="#9CA3AF" stroke={COLORS.navy} strokeWidth={4} strokeLinejoin="round" />
      <path d="M30 68 Q36 62 42 68 M52 68 Q58 62 64 68" stroke={COLORS.navy} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M42 82 Q47 86 52 82" stroke={COLORS.navy} strokeWidth={3} fill="none" />
      {[70, 120].map((lx) => (
        <rect key={lx} x={lx} y={124} width={16} height={16} rx={6} fill="#9CA3AF" stroke={COLORS.navy} strokeWidth={3} />
      ))}
    </svg>
  </div>
);

/** Lista de piezas (izquierda arriba): se van marcando. */
const PIEZAS = ["Cuenta aparte", "Meta: 3 meses", "10 % por quincena", "Aguinaldo", "Solo emergencias"];
const Lista: React.FC<{ hechas: number; nueva?: boolean }> = ({ hechas, nueva = false }) => {
  const s = useSpring(0.15, 10, 0.6);
  return (
    <div style={{ position: "absolute", left: 96, top: 445, display: "flex", flexDirection: "column", gap: 8, fontFamily }}>
      {PIEZAS.map((p, i) => {
        const ok = i < hechas;
        const esNueva = nueva && i === hechas - 1;
        return (
          <div key={p} style={{ display: "flex", alignItems: "center", gap: 12, opacity: ok ? 1 : 0.4, fontSize: 36, fontWeight: 800, color: ok ? COLORS.white : COLORS.light }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: `4px solid ${ok ? COLORS.green : COLORS.light}`,
                background: ok ? COLORS.green : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                color: COLORS.navy,
                scale: esNueva ? String(0.4 + 0.6 * s) : "1",
              }}
            >
              {ok ? "✓" : ""}
            </div>
            {i + 1} · {p}
          </div>
        );
      })}
    </div>
  );
};

/* ---------- Estado de la cama en cada escena ---------- */
type Etapa = 0 | 1 | 2 | 3 | 4 | 5 | 6;
const Cama: React.FC<{ etapa: Etapa; abs: number }> = ({ etapa, abs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cae = useCae(0.05);
  const resp = Math.max(0, Math.sin((abs / 30) * Math.PI * 2.4));
  // etapa 0: la tabla cae (gancho); 1: encaja; 2: capas; 3: resortes; 4: almohada; 5: sábana; 6: completa
  const capas = (n: number, animar: boolean) =>
    Array.from({ length: n }, (_, i) => {
      if (!animar) return <Capa key={i} i={i} />;
      const s = interpolate(t, [0.25 + i * 0.5, 0.55 + i * 0.5], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
      const bote = t > 0.55 + i * 0.5 && t < 0.8 + i * 0.5 ? Math.sin(((t - 0.55 - i * 0.5) / 0.25) * Math.PI) * 18 : 0;
      return <Capa key={i} i={i} y={(1 - s) * -560} op={Math.min(1, s * 4)} bote={bote} />;
    });
  const rebote = etapa >= 3 ? (etapa === 3 ? resp : resp * 0.3) : 0;
  const sube = etapa >= 3 ? -16 * rebote : 0;
  return (
    <>
      {etapa >= 3 ? <Resortes alto={130} fase={rebote} op={etapa === 3 ? Math.min(1, t * 4) : 1} /> : null}
      <Catre />
      <div style={{ position: "absolute", inset: 0, translate: `0px ${sube}px` }}>
        {etapa === 0 ? <Tabla y={-170 + Math.min(1, t / 0.4) * 110} etiqueta={false} /> : etapa === 1 ? <Tabla y={cae.y * 0.3} sq={cae.sq} /> : <Tabla />}
        {etapa >= 2 ? capas(3, etapa === 2) : null}
        {etapa === 4 ? <Almohada y={cae.y} op={cae.op} sq={Math.min(1.15, cae.sq)} /> : etapa > 4 ? <Almohada /> : null}
        {etapa === 5 ? null : etapa > 5 ? <Sabana p={1} /> : null}
      </div>
    </>
  );
};

/* ---------- Escenas ---------- */
const Plano: React.FC<{ abs: number; children: React.ReactNode }> = ({ abs, children }) => (
  <AbsoluteFill style={{ fontFamily, overflow: "hidden" }}>
    <FondoFijo abs={abs} />
    {children}
  </AbsoluteFill>
);

const useAbs = (desde: number) => useCurrentFrame() + desde;

/** Agranda todo el «escenario» de la cama desde el suelo. */
const Grande: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ scale: "1.3", transformOrigin: "540px 1236px" }}>{children}</AbsoluteFill>
);

const Hook: React.FC<{ desde: number }> = ({ desde }) => {
  const abs = useAbs(desde);
  return (
    <Plano abs={abs}>
      <Sfx s="impacto" volumen={0.45} />
      <Sfx s="pop" volumen={0.45} en={0.4} />
      <Rotulo texto="Tu **primer colchón**" delay={-0.4} size={72} />
      <Lista hechas={0} />
      <Grande>
        <Cama etapa={0} abs={abs} />
      </Grande>
    </Plano>
  );
};

const Paso: React.FC<{ desde: number; etapa: Etapa; rotulo: string; sfx?: Parameters<typeof Sfx>[0]["s"] }> = ({ desde, etapa, rotulo, sfx = "pop" }) => {
  const abs = useAbs(desde);
  return (
    <Plano abs={abs}>
      <Sfx s={sfx} volumen={0.42} en={0.15} />
      <Rotulo texto={rotulo} delay={0.05} size={62} />
      <Lista hechas={Math.min(5, etapa)} nueva />
      <Grande>
        <Cama etapa={etapa} abs={abs} />
      </Grande>
    </Plano>
  );
};

const Meta: React.FC<{ desde: number }> = ({ desde }) => {
  const abs = useAbs(desde);
  return (
    <Plano abs={abs}>
      {[0, 1, 2].map((i) => (
        <Sfx key={i} s="pop" volumen={0.4} en={0.55 + i * 0.5} />
      ))}
      <Rotulo texto="2 · META: **3 MESES** DE GASTOS" delay={0.05} size={60} />
      <Lista hechas={2} nueva />
      <Grande>
        <Cama etapa={2} abs={abs} />
      </Grande>
    </Plano>
  );
};

const Calendario: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const s = useSpring(0.2, 10, 0.6);
  return (
    <div style={{ position: "absolute", left: 700, top: 430, scale: String(s), fontFamily }}>
      <div style={{ width: 230, background: COLORS.white, borderRadius: 20, overflow: "hidden", border: `4px solid ${COLORS.navy}` }}>
        <div style={{ background: COLORS.blue, color: COLORS.white, fontWeight: 900, fontSize: 28, textAlign: "center", padding: 6 }}>QUINCENAS</div>
        <div style={{ display: "flex", justifyContent: "space-around", padding: "12px 0" }}>
          {["15", "30"].map((d, i) => {
            const on = t > 1.2 + i * 1.0;
            return (
              <div key={d} style={{ position: "relative", fontSize: 62, fontWeight: 900, color: COLORS.navy }}>
                {d}
                {on ? <div style={{ position: "absolute", inset: -6, border: `6px solid ${COLORS.green}`, borderRadius: "50%" }} /> : null}
              </div>
            );
          })}
        </div>
        <div style={{ background: `${COLORS.green}33`, color: COLORS.navy, fontWeight: 900, fontSize: 26, textAlign: "center", padding: 6 }}>→ 10 % al colchón</div>
      </div>
    </div>
  );
};

const ResortesEsc: React.FC<{ desde: number }> = ({ desde }) => {
  const abs = useAbs(desde);
  return (
    <Plano abs={abs}>
      <Sfx s="pop" volumen={0.4} en={0.15} />
      <Sfx s="ding" volumen={0.3} en={1.2} />
      <Sfx s="ding" volumen={0.3} en={2.2} />
      <Rotulo texto="3 · **10 %** DE CADA QUINCENA" delay={0.05} size={60} />
      <Lista hechas={3} nueva />
      <Calendario />
      <Grande>
        <Cama etapa={3} abs={abs} />
      </Grande>
    </Plano>
  );
};

const AlmohadaEsc: React.FC<{ desde: number }> = ({ desde }) => {
  const abs = useAbs(desde);
  return (
    <Plano abs={abs}>
      <Sfx s="pop" volumen={0.45} en={0.35} />
      <Rotulo texto="4 · UN PEDAZO DEL **AGUINALDO**" delay={0.05} size={58} />
      <Lista hechas={4} nueva />
      <Grande>
        <Cama etapa={4} abs={abs} />
      </Grande>
    </Plano>
  );
};

const SabanaEsc: React.FC<{ desde: number }> = ({ desde }) => {
  const abs = useAbs(desde);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const p = interpolate(t, [0.1, 0.7], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  // el gato entra, se sube y la sábana lo saca de un jalón
  const JALON = 2.2;
  const xg = interpolate(t, [0.6, 1.5], [1150, 760], clamp);
  const yTop = 1080 - 34 - CAPA * 3 - 14;
  const sube = interpolate(t, [1.5, 1.8], [0, 1], clamp);
  const vuela = interpolate(t, [JALON, JALON + 0.7], [0, 1], clamp);
  const yg = interpolate(sube, [0, 1], [1236, yTop]) - Math.sin(sube * Math.PI) * 120 - Math.sin(vuela * Math.PI) * 300 + vuela * 250;
  const xFinal = xg - vuela * 900;
  const jalon = t > JALON && t < JALON + 0.3 ? Math.sin(((t - JALON) / 0.3) * Math.PI) : 0;
  return (
    <Plano abs={abs}>
      <Sfx s="swoosh" volumen={0.35} en={0.1} />
      <Sfx s="pop" volumen={0.35} en={1.6} />
      <Sfx s="swoosh" volumen={0.5} en={JALON} />
      <Sfx s="impacto" volumen={0.35} en={JALON + 0.6} />
      <Rotulo texto="5 · SOLO **EMERGENCIAS** 🔒" delay={0.05} size={60} />
      <Lista hechas={5} nueva />
      <Grande>
        <Cama etapa={5} abs={abs} />
        <Sabana p={p} jalon={jalon} />
        <Gato x={xFinal} y={yg} rot={-vuela * 540} letrero={vuela < 0.2} />
      </Grande>
    </Plano>
  );
};

const Cae: React.FC<{ en: number; lado: 1 | -1; children: React.ReactNode }> = ({ en, lado, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - en;
  if (t < 0) return null;
  const TOPE = 590; // rebota en un escudo invisible por encima del colchón
  const caida = Math.min(1, t / 0.35);
  const despues = Math.max(0, t - 0.35);
  const y = 120 + (TOPE - 120) * caida ** 2 - despues * 900 + despues * despues * 1400;
  const x = CX + lado * despues * 700;
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", rotate: `${lado * despues * 300}deg` }}>
      {children}
    </div>
  );
};

const Etiqueta: React.FC<{ emoji: string; texto: string; color?: string }> = ({ emoji, texto, color = COLORS.red }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
    <div style={{ fontSize: 110 }}>{emoji}</div>
    <div style={{ background: color, color: COLORS.white, fontFamily, fontWeight: 900, fontSize: 36, padding: "6px 16px", borderRadius: 14, whiteSpace: "nowrap", border: `4px solid ${COLORS.navy}` }}>
      {texto}
    </div>
  </div>
);

const Tio: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
    <svg width={150} height={150} viewBox="0 0 150 150">
      <ellipse cx={75} cy={46} rx={72} ry={14} fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={4} />
      <path d="M40 46 Q42 6 75 6 Q108 6 110 46 Z" fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={4} />
      <circle cx={75} cy={92} r={46} fill="#F5C08A" stroke={COLORS.navy} strokeWidth={4} />
      <circle cx={60} cy={84} r={6} fill={COLORS.navy} />
      <circle cx={90} cy={84} r={6} fill={COLORS.navy} />
      <path d="M44 108 Q60 96 75 104 Q90 96 106 108 Q90 116 75 110 Q60 116 44 108 Z" fill={COLORS.navy} />
    </svg>
    <div style={{ background: COLORS.red, color: COLORS.white, fontFamily, fontWeight: 900, fontSize: 32, padding: "6px 14px", borderRadius: 14, whiteSpace: "nowrap", border: `4px solid ${COLORS.navy}`, textAlign: "center" }}>
      El tío que te
      <br />
      pide prestado
    </div>
  </div>
);

const Wow: React.FC<{ desde: number }> = ({ desde }) => {
  const abs = useAbs(desde);
  const s = useSpring(0.05, 12, 0.7);
  const yTop = 1080 - 34 - CAPA * 3;
  const escudo = (en: number) => {
    const frame = useCurrentFrame();
    const t = frame / 30 - en - 0.35;
    return t > 0 && t < 0.35 ? 1 - t / 0.35 : 0;
  };
  const e1 = escudo(0.6);
  const e2 = escudo(1.2);
  const e3 = escudo(1.8);
  const brillo = Math.max(e1, e2, e3);
  return (
    <Plano abs={abs}>
      <Rotulo texto="Que caiga **lo que caiga**" delay={0.05} size={66} />
      <Grande>
      <Cama etapa={6} abs={abs} />
      {/* personaje acostado */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `${CX - 60}px ${yTop}px`, rotate: "-90deg", opacity: s, translate: `0px ${(1 - s) * -200}px` }}>
        <Personaje x={CX - 60} y={yTop + 150} escala={1.0} color={COLORS.accent} expresion="feliz" pose="abraza" mirar="frente" />
      </div>
      {/* escudo invisible que se ve al rebotar */}
      <div
        style={{
          position: "absolute",
          left: L - 40,
          width: ANCHO + 80,
          top: 760,
          height: 300,
          borderRadius: "50% 50% 0 0",
          border: `8px solid ${COLORS.gold}`,
          borderBottom: "none",
          opacity: brillo * 0.8,
          boxShadow: `0 0 60px ${COLORS.gold}`,
        }}
      />
      </Grande>
      <Cae en={0.6} lado={-1}>
        <Etiqueta emoji="🛞" texto="Llanta ponchada" />
      </Cae>
      <Cae en={1.2} lado={1}>
        <Etiqueta emoji="🦷" texto="Dentista" />
      </Cae>
      <Cae en={1.8} lado={-1}>
        <Tio />
      </Cae>
      <Sfx s="impacto" volumen={0.4} en={0.95} />
      <Sfx s="impacto" volumen={0.4} en={1.55} />
      <Sfx s="impacto" volumen={0.45} en={2.15} />
      <Sfx s="ding" volumen={0.4} en={2.6} />
      <Chispas en={2.15} x={CX} y={600} color={COLORS.gold} />
    </Plano>
  );
};

const Cta: React.FC<{ desde: number; dur: number }> = ({ desde, dur }) => {
  const frame = useCurrentFrame();
  const vuelta = interpolate(frame, [dur - 10, dur - 2], [0, 1], clamp);
  return (
    <>
      <CtaCrecer tipo="compartir" boton="MÁNDASELO" linea="¿Cuál te falta? Mándaselo a quien vive a **una emergencia de la quiebra**" />
      <div style={{ position: "absolute", top: 1272, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 28, fontWeight: 700, color: COLORS.navy }}>
        Contenido informativo, no es asesoramiento financiero.
      </div>
      {vuelta > 0 ? (
        <AbsoluteFill style={{ opacity: vuelta }}>
          <Plano abs={frame + desde}>
            <Rotulo texto="Tu **primer colchón**" delay={-2} size={72} />
            <Lista hechas={0} />
            <Grande>
              <Catre />
            </Grande>
          </Plano>
        </AbsoluteFill>
      ) : null}
    </>
  );
};

const escenas = (voz: Voz): DefEscena[] => {
  const desde: Record<string, number> = {};
  let off = 0;
  voz.escenas.forEach((e, i) => {
    desde[e.id] = off;
    off += framesEscena(e, i, EXTRA_W4908);
  });
  return [
    { id: "hook", render: () => <Hook desde={desde.hook} /> },
    { id: "cuenta", render: () => <Paso desde={desde.cuenta} etapa={1} rotulo="1 · **CUENTA APARTE**" sfx="click" /> },
    { id: "meta", render: () => <Meta desde={desde.meta} /> },
    { id: "resortes", render: () => <ResortesEsc desde={desde.resortes} /> },
    { id: "almohada", render: () => <AlmohadaEsc desde={desde.almohada} /> },
    { id: "sabana", render: () => <SabanaEsc desde={desde.sabana} /> },
    { id: "wow", render: () => <Wow desde={desde.wow} /> },
    { id: "cta", subtitulosClaros: true, render: ({ dur }) => <Cta desde={desde.cta} dur={dur} /> },
  ];
};

export const W4908: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={escenas(voz)} extra={EXTRA_W4908} pista="sunlight.mp3" /> : null;
