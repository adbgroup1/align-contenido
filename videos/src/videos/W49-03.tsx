import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../brand";
import {
  Bocadillo,
  Chispas,
  Cifra,
  CtaCrecer,
  DefEscena,
  Escena,
  Escenario,
  Expresion,
  Montaje,
  Personaje,
  Pildora,
  Pose,
  PropsVoz,
  Rotulo,
  Sfx,
  SUELO_Y,
  useSpring,
} from "../kit";

// W49-03 · «Tres ardillas y una paga extra» · FÁBULA CON PERSONAJES · ilustración plana en código · CTA COMENTAR
// Lola (1, bufanda cobalto, se la come), Bruno (2, gafas, la entierra), Nina (3, hoja en la oreja, planta).
// Cálculo hipotético: 300 €/año al 5 % anual, aportación al inicio de cada año, 10 años: s = (s + 300) × 1,05 → 3.962,04 €.
// Música: piano-strings-light. Fondo dominante: campo de día (cielo periwinkle y verde).
export const EXTRA_W4903: Record<string, number> = { hook: 0.2, rehook: 0.5, wow: 1.0, cta: 0.4, cierre: 0.6 };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useSeg = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};
const miles = (v: number) => {
  const n = Math.round(v);
  return n >= 1000 ? `${Math.floor(n / 1000)}.${String(n % 1000).padStart(3, "0")}` : String(n);
};

/* ---------- Ardillas: Personaje del kit + orejas, cola y accesorio ---------- */
type Quien = "lola" | "bruno" | "nina";
const ARDILLAS: Record<Quien, { color: string; n: number; nombre: string }> = {
  lola: { color: COLORS.chocoLight, n: 1, nombre: "Lola" },
  bruno: { color: COLORS.grey, n: 2, nombre: "Bruno" },
  nina: { color: COLORS.gold, n: 3, nombre: "Nina" },
};

const Ardilla: React.FC<{
  quien: Quien;
  x: number;
  y?: number;
  escala?: number;
  expresion?: Expresion;
  pose?: Pose;
  mirar?: "izq" | "der" | "frente";
  salto?: number;
  barriga?: number; // 0–1, Lola tras el banquete
  entra?: "izq" | "der" | "abajo" | null;
  delay?: number;
  numero?: boolean;
}> = ({ numero = true, quien, x, y = SUELO_Y, escala = 1.15, expresion = "feliz", pose = "quieto", mirar = "frente", salto, barriga = 0, entra = null, delay = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = ARDILLAS[quien];
  let brinco = 0;
  if (salto !== undefined) {
    const k = f - Math.round(salto * fps);
    if (k >= 0 && k < 14) brinco = Math.sin((k / 14) * Math.PI) * 50;
  }
  const s = useSpring(delay, 13, 0.7);
  const ent = entra ? s : 1;
  const offX = entra === "izq" ? -(1 - ent) * 700 : entra === "der" ? (1 - ent) * 700 : 0;
  const offY = entra === "abajo" ? (1 - ent) * 500 : 0;
  const colaOnda = Math.sin(f / 9 + a.n) * 6;
  const caja = { left: x - 100 * escala, top: y - 260 * escala, width: 200 * escala, height: 260 * escala };
  const lado = quien === "bruno" ? -1 : 1; // la cola de Bruno, a la izquierda
  return (
    <div style={{ position: "absolute", inset: 0, translate: `${offX}px ${offY - brinco}px`, opacity: Math.min(1, ent * 1.4) }}>
      {/* cola (detrás) */}
      <svg style={{ position: "absolute", ...caja, overflow: "visible" }} viewBox="0 0 200 260">
        <g transform={`translate(${100 + lado * 50} 200) scale(${lado} 1) rotate(${colaOnda})`}>
          <path d="M0 0 C70 10 110 -60 80 -140 C60 -190 0 -190 10 -140 C20 -100 60 -90 40 -40 C30 -15 10 -5 0 0 Z" fill={a.color} stroke={COLORS.navy} strokeWidth={5} strokeLinejoin="round" />
          <path d="M60 -120 C70 -90 60 -60 46 -40" stroke={COLORS.white} strokeOpacity={0.35} strokeWidth={8} fill="none" strokeLinecap="round" />
        </g>
        {/* orejas */}
        {[62, 138].map((ox) => (
          <g key={ox}>
            <path d={`M${ox - 18} 72 L${ox} 26 L${ox + 18} 72 Z`} fill={a.color} stroke={COLORS.navy} strokeWidth={5} strokeLinejoin="round" />
            <path d={`M${ox - 8} 66 L${ox} 42 L${ox + 8} 66 Z`} fill={COLORS.red} opacity={0.5} />
          </g>
        ))}
      </svg>
      <Personaje
        x={x}
        y={y}
        escala={escala}
        color={a.color}
        expresion={expresion}
        pose={pose}
        mirar={mirar}
        accesorio={quien === "bruno" ? "gafas" : null}
        semilla={a.n}
      />
      {/* delante: barriga, bufanda, hoja */}
      <svg style={{ position: "absolute", ...caja, overflow: "visible" }} viewBox="0 0 200 260">
        {barriga > 0 ? <ellipse cx={100} cy={178} rx={44 + barriga * 30} ry={34 + barriga * 14} fill={a.color} stroke={COLORS.navy} strokeWidth={4} /> : null}
        {quien === "lola" ? (
          <g>
            <path d="M44 176 Q100 196 156 176 L156 196 Q100 216 44 196 Z" fill={COLORS.blue} stroke={COLORS.navy} strokeWidth={4} />
            <path d={`M130 196 L${142 + Math.sin(f / 7) * 5} 240 L120 240 Z`} fill={COLORS.blue} stroke={COLORS.navy} strokeWidth={4} strokeLinejoin="round" />
          </g>
        ) : null}
        {quien === "nina" ? (
          <path d="M138 30 Q170 10 182 30 Q160 50 138 30 Z" fill={COLORS.green} stroke={COLORS.navy} strokeWidth={4} transform={`rotate(${Math.sin(f / 11) * 8} 138 30)`} />
        ) : null}
      </svg>
      {/* número */}
      {numero ? <div
        style={{
          position: "absolute",
          left: x - 26,
          top: y - 260 * escala - 70,
          width: 52,
          height: 52,
          borderRadius: 26,
          background: COLORS.navy,
          color: COLORS.white,
          fontSize: 32,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {a.n}
      </div> : null}
    </div>
  );
};

/* ---------- Objetos ---------- */
const BellotaIcono: React.FC<{ t?: number }> = ({ t = 52 }) => (
  <svg width={t} height={t} viewBox="-26 -30 52 60">
    <Bellota x={0} y={0} />
  </svg>
);
const Bellota: React.FC<{ x: number; y: number; r?: number; rot?: number; o?: number }> = ({ x, y, r = 22, rot = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${r / 22})`} opacity={o}>
    <ellipse cx={0} cy={6} rx={17} ry={20} fill={COLORS.chocoLight} stroke={COLORS.navy} strokeWidth={3} />
    <path d="M-21 -4 Q0 -22 21 -4 Q0 4 -21 -4 Z" fill={COLORS.choco} stroke={COLORS.navy} strokeWidth={3} />
    <line x1={0} y1={-14} x2={3} y2={-24} stroke={COLORS.navy} strokeWidth={4} strokeLinecap="round" />
  </g>
);

const Bolsa: React.FC<{ x: number; y: number; vacia?: number; caer?: number }> = ({ x, y, vacia = 0, caer = 1 }) => {
  const yy = y - (1 - caer) * 420;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <g transform={`translate(${x} ${yy}) scale(${1 - vacia * 0.25} ${1 - vacia * 0.5})`} opacity={Math.min(1, caer * 2)}>
        <path d="M-60 0 Q-70 -80 -26 -96 L26 -96 Q70 -80 60 0 Z" fill={COLORS.paper} stroke={COLORS.navy} strokeWidth={5} />
        <path d="M-30 -96 Q0 -116 30 -96" fill="none" stroke={COLORS.red} strokeWidth={8} strokeLinecap="round" />
        <Bellota x={0} y={-46} r={20} />
      </g>
    </svg>
  );
};

/* Montón de tierra (Bruno) con cartel */
const Monton: React.FC<{ x: number; cartel?: React.ReactNode; s?: number }> = ({ x, cartel, s = 1 }) => (
  <>
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <g transform={`translate(${x} ${SUELO_Y - 10}) scale(${s})`}>
        <path d="M-130 20 Q-110 -70 0 -80 Q110 -70 130 20 Z" fill={COLORS.choco} stroke={COLORS.navy} strokeWidth={5} />
        <circle cx={-40} cy={-30} r={8} fill={COLORS.chocoLight} />
        <circle cx={30} cy={-50} r={6} fill={COLORS.chocoLight} />
        <circle cx={60} cy={-10} r={7} fill={COLORS.chocoLight} />
      </g>
    </svg>
    {cartel ? (
      <div style={{ position: "absolute", left: x - 160, width: 320, top: SUELO_Y - 330, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ background: COLORS.paper, border: `5px solid ${COLORS.navy}`, borderRadius: 22, padding: "6px 24px", display: "flex", alignItems: "center", gap: 10 }}>
          {cartel}
        </div>
        <div style={{ width: 12, height: 150, background: COLORS.choco, border: `3px solid ${COLORS.navy}` }} />
      </div>
    ) : null}
  </>
);

/* Árbol de Nina: g = 0 (semilla) … 1 (árbol grande); bellotas = 0–1 */
const Arbol: React.FC<{ x: number; g: number; bellotas?: number }> = ({ x, g, bellotas = 0 }) => {
  const f = useCurrentFrame();
  const h = 40 + g * 520;
  const copa = Math.max(0, (g - 0.25) / 0.75);
  const balanceo = Math.sin(f / 25) * 2;
  const pos = [
    [-90, -40], [-30, -90], [50, -70], [100, -20], [-110, 30], [0, -10], [70, 40], [-50, 50], [20, 80], [-20, -140], [90, -110], [-100, -100],
  ];
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <g transform={`translate(${x} ${SUELO_Y - 10}) rotate(${balanceo})`}>
        <ellipse cx={0} cy={10} rx={90} ry={14} fill={COLORS.choco} />
        <path d={`M-${8 + g * 22} 10 L-${4 + g * 10} ${-h} L${4 + g * 10} ${-h} L${8 + g * 22} 10 Z`} fill={COLORS.choco} stroke={COLORS.navy} strokeWidth={4} />
        {g < 0.3 ? (
          <g transform={`translate(0 ${-h})`}>
            <ellipse cx={-22} cy={-6} rx={24} ry={11} fill={COLORS.green} stroke={COLORS.navy} strokeWidth={3} transform="rotate(-25 -22 -6)" />
            <ellipse cx={22} cy={-10} rx={24} ry={11} fill={COLORS.green} stroke={COLORS.navy} strokeWidth={3} transform="rotate(25 22 -10)" />
          </g>
        ) : null}
        {copa > 0 ? (
          <g transform={`translate(0 ${-h}) scale(${copa})`}>
            <circle cx={-80} cy={10} r={110} fill={COLORS.green} stroke={COLORS.navy} strokeWidth={5} />
            <circle cx={80} cy={0} r={110} fill={COLORS.green} stroke={COLORS.navy} strokeWidth={5} />
            <circle cx={0} cy={-70} r={130} fill={COLORS.green} stroke={COLORS.navy} strokeWidth={5} />
            <circle cx={0} cy={30} r={100} fill={COLORS.green} />
            <circle cx={-50} cy={-90} r={40} fill={COLORS.white} opacity={0.18} />
            {pos.map(([px, py], i) => {
              const v = Math.max(0, Math.min(1, bellotas * pos.length - i));
              return v > 0 ? <Bellota key={i} x={px} y={py} r={20 * v} rot={(i * 37) % 40 - 20} /> : null;
            })}
          </g>
        ) : null}
      </g>
    </svg>
  );
};

const HojaDic: React.FC<{ x: number; y: number; texto?: string; s?: number; rot?: number }> = ({ x, y, texto = "DIC", s = 1, rot = 0 }) => (
  <div style={{ position: "absolute", left: x - 70, top: y - 80, width: 140, scale: String(s), rotate: `${rot}deg` }}>
    <div style={{ background: COLORS.red, color: COLORS.white, fontSize: 34, fontWeight: 900, textAlign: "center", borderRadius: "16px 16px 0 0", border: `4px solid ${COLORS.navy}`, borderBottom: "none" }}>
      {texto}
    </div>
    <div style={{ background: COLORS.white, height: 90, borderRadius: "0 0 16px 16px", border: `4px solid ${COLORS.navy}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, fontWeight: 900, color: COLORS.navy }}>
      <BellotaIcono t={64} />
    </div>
  </div>
);

/* ---------- Escenas ---------- */
const POS: Record<Quien, number> = { lola: 220, bruno: 540, nina: 860 };

const Hook: React.FC = () => {
  return (
    <Escena sinEntrada>
      <Escenario tipo="campo" />
      <Sfx s="impacto" volumen={0.5} />
      <Rotulo texto="3 ardillas, 1 paga extra. **Solo una acierta**" delay={-1} size={58} />
      {(["lola", "bruno", "nina"] as Quien[]).map((q, i) => (
        <React.Fragment key={q}>
          <Ardilla quien={q} x={POS[q]} salto={0.9 + i * 0.25} expresion={i === 2 ? "feliz" : "sorpresa"} pose="brazos-arriba" />
          <BolsaCae x={POS[q] + 70} delay={0.4 + i * 0.25} />
          <Sfx s="pop" volumen={0.35} en={0.9 + i * 0.25} />
        </React.Fragment>
      ))}
    </Escena>
  );
};
const BolsaCae: React.FC<{ x: number; delay: number; vacia?: number }> = ({ x, delay, vacia = 0 }) => {
  const s = useSpring(delay, 10, 0.6);
  return <Bolsa x={x} y={SUELO_Y} caer={s} vacia={vacia} />;
};

const Gancho2: React.FC = () => {
  const t = useSeg();
  const f = useCurrentFrame();
  const pala = Math.sin(t * 9) * 20;
  return (
    <Escena>
      <Escenario tipo="campo" />
      <Rotulo texto="Lola **come** · Bruno **entierra** · Nina **planta**" size={50} />
      <Ardilla quien="lola" x={POS.lola} expresion="feliz" pose="abraza" />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {[0, 1, 2, 3].map((k) => {
          const p = ((f / 22 + k / 4) % 1);
          return <Bellota key={k} x={POS.lola - 40 + k * 26} y={SUELO_Y - 330 - p * 140} rot={p * 300} o={1 - p} />;
        })}
        {/* pala de Bruno */}
        <g transform={`translate(${POS.bruno + 110} ${SUELO_Y - 120}) rotate(${-30 + pala})`}>
          <line x1={0} y1={0} x2={0} y2={-160} stroke={COLORS.choco} strokeWidth={12} strokeLinecap="round" />
          <path d="M-28 0 H28 L20 60 Q0 76 -20 60 Z" fill={COLORS.grey} stroke={COLORS.navy} strokeWidth={4} />
        </g>
        {/* tierra que salta */}
        {[0, 1, 2].map((k) => {
          const p = ((f / 15 + k / 3) % 1);
          return <circle key={k} cx={POS.bruno + 150 + p * 60} cy={SUELO_Y - 20 - Math.sin(p * Math.PI) * 90} r={9} fill={COLORS.choco} />;
        })}
        {/* hoyo y bellota de Nina */}
        <ellipse cx={POS.nina - 120} cy={SUELO_Y} rx={46} ry={14} fill={COLORS.choco} />
        <Bellota x={POS.nina - 120} y={interpolate(t, [0.8, 1.6], [SUELO_Y - 200, SUELO_Y - 8], clamp)} />
      </svg>
      <Ardilla quien="bruno" x={POS.bruno} expresion="neutral" pose="senala" mirar="der" />
      <Ardilla quien="nina" x={POS.nina} expresion="feliz" pose="senala" mirar="izq" />
      <Sfx s="pop" volumen={0.3} en={0.3} />
      <Sfx s="swoosh" volumen={0.25} en={1.3} />
      <Sfx s="pop" volumen={0.35} en={2.6} />
    </Escena>
  );
};

const Lola: React.FC = () => {
  const t = useSeg();
  const barriga = interpolate(t, [0.2, 1.4], [0, 1], clamp);
  const f = useCurrentFrame();
  return (
    <Escena>
      <Escenario tipo="interior" />
      <Rotulo texto="Lola: **banquete**" />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {Array.from({ length: 9 }, (_, k) => (
          <path key={k} d={`M${260 + k * 70} ${SUELO_Y + 4} q14 -22 28 0 Z`} fill={COLORS.choco} stroke={COLORS.navy} strokeWidth={3} transform={`rotate(${(k * 41) % 50 - 25} ${274 + k * 70} ${SUELO_Y})`} />
        ))}
        {[0, 1, 2].map((k) => {
          const p = ((f / 18 + k / 3) % 1);
          return <path key={`v${k}`} d="M0 0 q10 -16 20 0 Z" fill={COLORS.choco} transform={`translate(${540 + (k - 1) * 80 + p * 60 * (k - 1)} ${SUELO_Y - 360 + p * 300}) rotate(${p * 360})`} />;
        })}
      </svg>
      <Ardilla quien="lola" x={540} escala={1.5} expresion="feliz" pose="abraza" barriga={barriga} />
      <BolsaCae x={820} delay={0.8} vacia={1} />
      <Sfx s="pop" volumen={0.35} en={0.9} />
    </Escena>
  );
};

const Bruno: React.FC = () => (
  <Escena>
    <Escenario tipo="campo" tarde={0.2} />
    <Rotulo texto="Bruno: **300** bajo tierra" />
    <Monton x={700} cartel={<><BellotaIcono /><Cifra a={300} inicio={0.4} fin={1.6} formato={(v) => miles(v)} size={80} color={COLORS.navy} brillo={false} /></>} />
    <Ardilla quien="bruno" x={330} expresion="feliz" pose="senala" mirar="der" salto={1.7} />
    <Sfx s="pop" volumen={0.35} en={1.7} />
  </Escena>
);

const Quietas: React.FC = () => {
  const t = useSeg();
  const tarde = 0.5 - 0.5 * Math.cos(t * Math.PI * 1.2);
  return (
    <Escena>
      <Escenario tipo="campo" tarde={tarde} />
      <Rotulo texto="Quietas." />
      <Monton x={700} cartel={<><BellotaIcono /><span style={{ fontSize: 80, fontWeight: 900, color: COLORS.navy }}>300</span></>} />
      <Ardilla quien="bruno" x={330} expresion="neutral" pose="quieto" mirar="der" />
    </Escena>
  );
};

const Nina: React.FC = () => {
  const t = useSeg();
  const pasos = Math.min(3, Math.floor(t / 0.8));
  const g = useSpring(0.8 * pasos, 10, 0.6);
  const crecer = 0.04 + (pasos - 1 + g) * 0.06;
  return (
    <Escena>
      <Escenario tipo="campo" />
      <Rotulo texto="Nina: **300** plantadas" />
      <Arbol x={700} g={Math.max(0.02, crecer)} />
      <HojaDic x={880} y={560} texto={`DIC ${pasos + 1}`} s={0.9 + 0.1 * g} rot={(1 - g) * 10} />
      <Ardilla quien="nina" x={380} expresion="feliz" pose="senala" mirar="der" />
      {[0.8, 1.6, 2.4].map((s) => (
        <Sfx key={s} s="pop" volumen={0.3} en={s} />
      ))}
    </Escena>
  );
};

const Crece: React.FC = () => {
  const t = useSeg();
  const g = interpolate(t, [0, 1.8], [0.22, 0.55], { ...clamp, easing: (x) => 1 - (1 - x) ** 2 });
  const b = interpolate(t, [1.2, 2.4], [0, 0.35], clamp);
  return (
    <Escena>
      <Escenario tipo="campo" />
      <Rotulo texto="Cada año, **un poco más**" />
      <Arbol x={680} g={g} bellotas={b} />
      <Ardilla quien="nina" x={290} expresion="sorpresa" pose="brazos-arriba" mirar="der" salto={1.4} />
      <Sfx s="swoosh" volumen={0.25} en={0.3} />
      <Sfx s="pop" volumen={0.35} en={1.4} />
    </Escena>
  );
};

const Rehook: React.FC = () => {
  const t = useSeg();
  const anio = Math.min(10, 1 + Math.floor(t / 0.16));
  return (
    <Escena>
      <Escenario tipo="campo" tarde={0.35} />
      {Array.from({ length: 10 }, (_, k) => {
        const p = interpolate(t, [k * 0.16, k * 0.16 + 0.7], [0, 1], clamp);
        if (p <= 0 || p >= 1) return null;
        return <HojaDic key={k} x={540 + (k % 2 ? 1 : -1) * p * 600} y={760 - p * 420} rot={p * 120 * (k % 2 ? 1 : -1)} />;
      })}
      <div style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", zIndex: 5 }}>
        <div style={{ fontSize: 80, fontWeight: 900, color: COLORS.white, textShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>10 años después…</div>
        <div style={{ fontSize: 200, fontWeight: 900, color: COLORS.gold, lineHeight: 1, textShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>Año {anio}</div>
      </div>
      {Array.from({ length: 9 }, (_, k) => (
        <Sfx key={k} s="tick" volumen={0.12} en={k * 0.16} />
      ))}
      <Sfx s="riser" volumen={0.35} en={0.2} />
    </Escena>
  );
};

const Wow: React.FC = () => (
  <Escena sacudidas={[2.6]} sonidoEntrada="impacto">
    <Escenario tipo="campo" />
    <Monton x={330} s={1} cartel={<><BellotaIcono /><span style={{ fontSize: 66, fontWeight: 900, color: COLORS.navy }}>3.000</span></>} />
    <Arbol x={760} g={1} bellotas={1} />
    <div style={{ position: "absolute", top: 240, left: 90, right: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ background: COLORS.white, border: `6px solid ${COLORS.green}`, borderRadius: 30, padding: "4px 36px", display: "flex", alignItems: "center", gap: 18 }}>
        <span style={{ fontSize: 56, fontWeight: 900, color: COLORS.navy }}>Nina</span>
        <Cifra a={3962} de={3000} inicio={0.8} fin={2.6} formato={miles} size={130} color={COLORS.green} brillo={false} />
      </div>
      <Pildora delay={0.3} bg={COLORS.navy} color={COLORS.gold}>
        Ejemplo hipotético · 5 % anual
      </Pildora>
    </div>
    <Ardilla quien="bruno" x={150} y={SUELO_Y + 10} escala={0.85} expresion="sorpresa" mirar="der" numero={false} />
    <Ardilla quien="nina" x={560} y={SUELO_Y + 10} escala={0.95} expresion="feliz" pose="brazos-arriba" salto={2.6} numero={false} />
    <Chispas en={2.6} x={540} y={420} color={COLORS.green} />
    <Sfx s="ding" volumen={0.4} en={2.6} />
  </Escena>
);

const Lola2: React.FC = () => {
  const t = useSeg();
  return (
    <Escena>
      <Escenario tipo="interior" />
      <Rotulo texto="Lola: **esperando**" />
      <HojaDic x={760} y={640} texto="DIC" s={1.4} rot={Math.sin(t * 3) * 4} />
      <Ardilla quien="lola" x={380} escala={1.4} expresion="triste" pose="encoge" mirar="der" />
      <Bocadillo texto="¿Ya?" x={520} y={560} ancho={200} size={56} piensa colaX={-60} delay={0.8} />
    </Escena>
  );
};

const Moraleja: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Escena>
      <Escenario tipo="campo" />
      <Rotulo texto="Lo plantado **crece solo**" />
      <Arbol x={740} g={0.85} bellotas={0.9} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {/* regadera y gotas */}
        <g transform={`translate(470 ${SUELO_Y - 240}) rotate(${20 + Math.sin(f / 10) * 5})`}>
          <rect x={-50} y={-30} width={100} height={70} rx={14} fill={COLORS.blue} stroke={COLORS.navy} strokeWidth={4} />
          <path d="M50 -10 L110 -40 L114 -30 L56 6 Z" fill={COLORS.blue} stroke={COLORS.navy} strokeWidth={4} />
        </g>
        {[0, 1, 2, 3].map((k) => {
          const p = ((f / 14 + k / 4) % 1);
          return <ellipse key={k} cx={590 + p * 30} cy={SUELO_Y - 270 + p * 250} rx={6} ry={10} fill={COLORS.blue} opacity={1 - p} />;
        })}
      </svg>
      <Ardilla quien="nina" x={330} expresion="feliz" pose="senala" mirar="der" />
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Pildora delay={1.2} bg={COLORS.navy} color={COLORS.gold} size={44}>
          Y cuanto antes, mejor
        </Pildora>
      </div>
    </Escena>
  );
};

const Cierre: React.FC = () => {
  const s = useSpring(0.6, 14, 0.7);
  return (
    <Escena>
      <Escenario tipo="campo" />
      <div style={{ position: "absolute", top: 250, left: 90, right: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: s }}>
        <div style={{ fontSize: 70, fontWeight: 900, letterSpacing: 6, color: COLORS.navy }}>
          ALIGN <span style={{ fontWeight: 500, color: COLORS.blue }}>by ADB</span>
        </div>
        <div style={{ fontSize: 30, color: COLORS.navy }}>Contenido informativo, no es asesoramiento financiero.</div>
      </div>
      {(["lola", "bruno", "nina"] as Quien[]).map((q, i) => (
        <React.Fragment key={q}>
          <Ardilla quien={q} x={POS[q]} salto={0.9 + i * 0.25} expresion="sorpresa" pose="brazos-arriba" />
          <BolsaCae x={POS[q] + 70} delay={0.4 + i * 0.25} />
        </React.Fragment>
      ))}
      <Sfx s="pop" volumen={0.35} en={0.9} />
    </Escena>
  );
};

const ESCENAS: DefEscena[] = [
  { id: "hook", render: () => <Hook /> },
  { id: "gancho2", render: () => <Gancho2 /> },
  { id: "lola", render: () => <Lola /> },
  { id: "bruno", render: () => <Bruno /> },
  { id: "quietas", render: () => <Quietas /> },
  { id: "nina", render: () => <Nina /> },
  { id: "crece", render: () => <Crece /> },
  { id: "rehook", render: () => <Rehook /> },
  { id: "wow", render: () => <Wow /> },
  { id: "lola2", render: () => <Lola2 /> },
  { id: "moraleja", render: () => <Moraleja /> },
  {
    id: "cta",
    subtitulosClaros: true,
    render: () => <CtaCrecer tipo="comentar" boton="¿1, 2 o 3?" linea="¿Lola, Bruno o **Nina**? Te leo" />,
  },
  { id: "cierre", render: () => <Cierre /> },
];

export const W4903: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4903} pista="piano-strings-light.mp3" /> : null;
