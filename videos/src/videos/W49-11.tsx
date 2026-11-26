import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../brand";

// W49-11 · «¿Cuántos meses sin intereses aguanta tu quincena?» · CARRUSEL · Guía / calculadora en láminas · H3
// 7 láminas de 1080×1350: lámina n = fotograma n-1. Todo DIBUJO y tipografía.
// Fuentes: regla del 30 % y «que quede registrada la promoción» = CONDUSEF (El Imparcial, 4 feb 2026).
// Ejemplo hipotético (cálculo propio): 12,000 × 0.30 = 3,600; 9,600/12 = 800; 10,800/18 = 600; 2,400/6 = 400;
// 1,800/3 = 600; 800+600+400+600 = 2,400 (20 %); 2,400 + 1,500 = 3,900 (32.5 %).

export const LAMINAS_W4911 = 7;
const W = 1080;
const H = 1350;
const pesos = (v: number) => "$" + String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/* ---------- La barra: la misma de la lámina 2 a la 6 ---------- */
const ESCALA_MAX = 4800; // la barra llega al 40 % de $12,000, para que la raya del 30 % se vea bien
const LIMITE = 3600;
type Tramo = { n: string; v: number; c: string };
const TRAMOS: Tramo[] = [
  { n: "Celular", v: 800, c: COLORS.accent },
  { n: "Pantalla", v: 600, c: "#60A5FA" },
  { n: "Tenis", v: 400, c: COLORS.green },
  { n: "Freidora", v: 600, c: COLORS.gold },
  { n: "Tarjeta depa.", v: 1500, c: COLORS.red },
];

const Barra: React.FC<{ hasta: number; y: number; rebasa?: boolean }> = ({ hasta, y, rebasa }) => {
  const BW = 880;
  const x0 = (W - BW) / 2;
  const px = (v: number) => (v / ESCALA_MAX) * BW;
  let acc = 0;
  const total = TRAMOS.slice(0, hasta).reduce((s, t) => s + t.v, 0);
  return (
    <div style={{ position: "absolute", left: x0, top: y, width: BW }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 800, color: COLORS.light, marginBottom: 12 }}>
        <span>Tus pagos a meses, al mes</span>
        <span style={{ color: rebasa ? COLORS.red : COLORS.white }}>{pesos(total)}</span>
      </div>
      <div style={{ position: "relative", height: 110, borderRadius: 24, background: "rgba(255,255,255,0.08)", border: `4px solid ${rebasa ? COLORS.red : "rgba(199,215,254,0.35)"}`, overflow: "visible", boxShadow: rebasa ? `0 0 50px ${COLORS.red}66` : "none" }}>
        {TRAMOS.slice(0, hasta).map((t, i) => {
          const left = px(acc);
          acc += t.v;
          const nuevo = i === hasta - 1 || (hasta === 4 && i === 2) || (hasta === 2 && i === 0);
          return (
            <div
              key={t.n}
              style={{
                position: "absolute",
                left: left + 4,
                top: 6,
                width: px(t.v) - 6,
                height: 90,
                borderRadius: 16,
                background: t.c,
                border: nuevo ? `4px solid ${COLORS.white}` : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: px(t.v) < 100 ? 20 : 26,
                fontWeight: 900,
                color: COLORS.navy,
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {pesos(t.v)}
            </div>
          );
        })}
        {/* raya del 30 % */}
        <div style={{ position: "absolute", left: px(LIMITE), top: -34, bottom: -34, width: 8, marginLeft: -4, background: COLORS.red, borderRadius: 4, boxShadow: `0 0 20px ${COLORS.red}` }} />
      </div>
      <div style={{ position: "relative", height: 70 }}>
        <div style={{ position: "absolute", left: px(LIMITE), top: 30, translate: "-50% 0", fontSize: 32, fontWeight: 900, color: COLORS.red, whiteSpace: "nowrap" }}>
          30 % = {pesos(LIMITE)}
        </div>
        <div style={{ position: "absolute", left: 0, top: 30, fontSize: 28, fontWeight: 800, color: COLORS.grey }}>$0</div>
      </div>
    </div>
  );
};

/* ---------- Piezas comunes ---------- */
const Fondo: React.FC<{ tono?: string }> = ({ tono = "#1E3A8A" }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 15%, ${tono} 0%, ${COLORS.navy} 55%, ${COLORS.deep} 100%)` }} />
);

const Pie: React.FC<{ n: number; desliza?: boolean; hipo?: boolean }> = ({ n, desliza = true, hipo }) => (
  <>
    <div style={{ position: "absolute", top: 50, right: 60, fontSize: 30, fontWeight: 800, color: COLORS.light, opacity: 0.8 }}>
      {n}/{LAMINAS_W4911}
    </div>
    <div style={{ position: "absolute", top: 48, left: 60, fontSize: 30, fontWeight: 900, color: COLORS.white, letterSpacing: 4, opacity: 0.85 }}>ALIGN</div>
    {hipo ? (
      <div style={{ position: "absolute", bottom: 56, left: 60, fontSize: 28, fontWeight: 800, color: COLORS.gold, background: "rgba(251,191,36,0.14)", border: `2px solid ${COLORS.gold}66`, borderRadius: 999, padding: "8px 24px" }}>
        Ejemplo hipotético
      </div>
    ) : null}
    {desliza ? (
      <div style={{ position: "absolute", bottom: 50, right: 60, fontSize: 36, fontWeight: 900, color: COLORS.white, background: COLORS.blue, borderRadius: 999, padding: "10px 30px" }}>Desliza →</div>
    ) : null}
  </>
);

const Titulo: React.FC<{ children: React.ReactNode; size?: number; top?: number }> = ({ children, size = 86, top = 150 }) => (
  <div style={{ position: "absolute", top, left: 70, right: 70, fontSize: size, fontWeight: 900, color: COLORS.white, lineHeight: 1.04, letterSpacing: -1.5 }}>{children}</div>
);

const Texto: React.FC<{ children: React.ReactNode; top: number; size?: number }> = ({ children, top, size = 46 }) => (
  <div style={{ position: "absolute", top, left: 70, right: 70, fontSize: size, fontWeight: 700, color: COLORS.light, lineHeight: 1.25 }}>{children}</div>
);

const Am: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c = COLORS.gold }) => <span style={{ color: c }}>{children}</span>;

/** Recibo de meses sin intereses. */
const Recibo: React.FC<{ x: number; y: number; rot: number; txt: string; ancho?: number }> = ({ x, y, rot, txt, ancho = 380 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: ancho,
      height: 92,
      translate: "-50% 0",
      rotate: `${rot}deg`,
      background: COLORS.paper,
      border: `5px solid ${COLORS.navy}`,
      borderRadius: 12,
      boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      fontSize: 34,
      fontWeight: 900,
      color: COLORS.navy,
    }}
  >
    <span>{txt}</span>
    <span style={{ color: COLORS.red, fontSize: 28 }}>MSI</span>
  </div>
);

const TORRE = ["Celular · 12", "Pantalla · 18", "Tenis · 6", "Freidora · 3", "Tarjeta depa.", "¿Y esto?"];

const Torre: React.FC<{ x: number; base: number; cae?: boolean }> = ({ x, base, cae }) => (
  <>
    {TORRE.map((t, i) => {
      const rot = cae ? [-8, 14, -22, 35, -48, 70][i] : [-2, 3, -4, 5, -7, 9][i];
      const dx = cae ? [0, 40, -60, 120, -150, 230][i] : [0, 12, -10, 22, -18, 30][i];
      const y = cae ? base - 80 - i * 40 + (i > 2 ? i * 30 : 0) : base - 92 - i * 86;
      return <Recibo key={t} x={x + dx} y={y} rot={rot} txt={t} ancho={i === 5 ? 300 : 380} />;
    })}
  </>
);

const Gota: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg width={60 * s} height={84 * s} viewBox="0 0 60 84" style={{ position: "absolute", left: x, top: y }}>
    <path d="M30 4 Q56 46 54 58 Q50 80 30 80 Q10 80 6 58 Q4 46 30 4 Z" fill="#7DD3FC" stroke={COLORS.navy} strokeWidth={4} />
    <ellipse cx={22} cy={56} rx={6} ry={10} fill={COLORS.white} opacity={0.7} />
  </svg>
);

/** Freidora de aire con cara de «yo ni quería venir». */
const Freidora: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: "absolute", left: x, top: y }}>
    <svg width={260} height={300} viewBox="0 0 260 300" style={{ overflow: "visible", filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.4))" }}>
      <rect x={20} y={20} width={220} height={250} rx={60} fill="#334155" stroke={COLORS.navy} strokeWidth={6} />
      <rect x={50} y={150} width={160} height={100} rx={20} fill="#1E293B" stroke={COLORS.navy} strokeWidth={5} />
      <rect x={105} y={190} width={50} height={18} rx={9} fill={COLORS.grey} />
      <circle cx={130} cy={50} r={10} fill={COLORS.gold} />
      {/* cara: ojos de flojera y boca torcida */}
      <g>
        <ellipse cx={95} cy={100} rx={22} ry={18} fill={COLORS.white} stroke={COLORS.navy} strokeWidth={3} />
        <ellipse cx={165} cy={100} rx={22} ry={18} fill={COLORS.white} stroke={COLORS.navy} strokeWidth={3} />
        <rect x={72} y={82} width={46} height={16} fill="#334155" />
        <rect x={142} y={82} width={46} height={16} fill="#334155" />
        <line x1={72} y1={98} x2={118} y2={98} stroke={COLORS.navy} strokeWidth={4} />
        <line x1={142} y1={98} x2={188} y2={98} stroke={COLORS.navy} strokeWidth={4} />
        <circle cx={100} cy={106} r={7} fill={COLORS.navy} />
        <circle cx={170} cy={106} r={7} fill={COLORS.navy} />
        <path d="M110 134 Q130 128 152 138" stroke={COLORS.white} strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>
      <rect x={250} y={120} width={14} height={60} rx={7} fill="#475569" />
    </svg>
  </div>
);

const Bocadillo: React.FC<{ x: number; y: number; ancho: number; children: React.ReactNode }> = ({ x, y, ancho, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: ancho, background: COLORS.white, color: COLORS.navy, border: `5px solid ${COLORS.navy}`, borderRadius: 36, padding: "18px 26px", fontSize: 38, fontWeight: 900, textAlign: "center", lineHeight: 1.1, rotate: "-3deg" }}>
    {children}
    <svg width={50} height={40} style={{ position: "absolute", left: 30, bottom: -38 }}>
      <path d="M4 0 L14 36 L46 0" fill={COLORS.white} stroke={COLORS.navy} strokeWidth={5} strokeLinejoin="round" />
      <rect x={6} y={-6} width={38} height={9} fill={COLORS.white} />
    </svg>
  </div>
);

/* ---------- Láminas ---------- */
const L1 = () => (
  <>
    <Fondo tono="#7F1D1D" />
    <div style={{ position: "absolute", top: 120, left: 70, right: 70 }}>
      <div style={{ display: "inline-block", fontSize: 38, fontWeight: 900, color: COLORS.navy, background: COLORS.gold, padding: "8px 26px", borderRadius: 14, rotate: "-2deg" }}>Después del Buen Fin</div>
      <div style={{ marginTop: 26, fontSize: 112, fontWeight: 900, color: COLORS.white, lineHeight: 0.98, letterSpacing: -3 }}>
        Tus <Am>meses sin intereses</Am>, sumados
      </div>
    </div>
    <Torre x={720} base={1230} />
    <Gota x={930} y={620} s={1.3} />
    <Gota x={980} y={760} s={0.8} />
    <div style={{ position: "absolute", left: 70, top: 930, width: 360, fontSize: 46, fontWeight: 900, color: COLORS.light, lineHeight: 1.1 }}>
      ¿Cuántos aguanta <Am c={COLORS.white}>tu quincena?</Am>
    </div>
    <Pie n={1} />
  </>
);

const L2 = () => (
  <>
    <Fondo />
    <Titulo>
      La regla del <Am c={COLORS.red}>30 %</Am>
    </Titulo>
    <Texto top={300}>
      Todas tus deudas juntas: como mucho el <b style={{ color: COLORS.white }}>30 % de lo que ganas</b>. Vamos a sumar un ejemplo.
    </Texto>
    <Barra hasta={0} y={680} />
    <div style={{ position: "absolute", top: 1000, left: 70, right: 70, fontSize: 30, fontWeight: 700, color: COLORS.grey }}>Fuente: CONDUSEF (citada en El Imparcial, 4 feb 2026).</div>
    <Pie n={2} />
  </>
);

const L3 = () => (
  <>
    <Fondo />
    <Titulo>
      Ganas <Am>$12,000</Am> al mes
    </Titulo>
    <Texto top={290}>
      Tu límite para pagar deudas: <b style={{ color: COLORS.red, fontSize: 60 }}>$3,600</b> al mes.
    </Texto>
    <div style={{ position: "absolute", top: 470, left: 70, fontSize: 34, fontWeight: 800, color: COLORS.grey }}>$12,000 × 30 % = $3,600</div>
    <Barra hasta={0} y={680} />
    <Pie n={3} hipo />
  </>
);

const L4 = () => (
  <>
    <Fondo />
    <Titulo>Celular + pantalla</Titulo>
    <Texto top={280}>
      Celular a 12 MSI: <Am>$800</Am>
      <br />
      Pantalla a 18 MSI: <Am>$600</Am>
      <br />
      Vas en <b style={{ color: COLORS.white }}>$1,400</b>.
    </Texto>
    <Barra hasta={2} y={680} />
    <Pie n={4} hipo />
  </>
);

const L5 = () => (
  <>
    <Fondo />
    <Titulo size={76}>Tenis + freidora de aire</Titulo>
    <Texto top={370} size={44}>
      Tenis a 6 MSI: <Am>$400</Am> · Freidora a 3 MSI: <Am>$600</Am>
      <br />
      Vas en <b style={{ color: COLORS.white }}>$2,400</b>: el 20 %. Todo bien… ¿no?
    </Texto>
    <Barra hasta={4} y={600} />
    <Freidora x={600} y={890} />
    <Bocadillo x={170} y={910} ancho={420}>
      Yo ni quería venir 🙄
    </Bocadillo>
    <Pie n={5} hipo />
  </>
);

const L6 = () => (
  <>
    <Fondo tono="#7F1D1D" />
    <Titulo size={78}>
      Y la tarjeta departamental: <Am c={COLORS.red}>$1,500</Am>
    </Titulo>
    <Texto top={350} size={44}>
      Total: <b style={{ color: COLORS.red, fontSize: 58 }}>$3,900 al mes = 32.5 %</b>
      <br />
      Te pasaste del 30 %… sin comprar nada más.
    </Texto>
    <Barra hasta={5} y={620} rebasa />
    <Torre x={600} base={1120} cae />
    <Pie n={6} hipo />
  </>
);

const Casilla: React.FC<{ n: number; children: React.ReactNode }> = ({ n, children }) => (
  <div style={{ display: "flex", gap: 26, alignItems: "flex-start" }}>
    <div style={{ flex: "0 0 74px", height: 74, borderRadius: 18, border: `5px solid ${COLORS.blue}`, background: COLORS.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 900, color: COLORS.blue }}>{n}</div>
    <div style={{ fontSize: 46, fontWeight: 800, color: COLORS.navy, lineHeight: 1.15, paddingTop: 6 }}>{children}</div>
  </div>
);

const L7 = () => (
  <>
    <AbsoluteFill style={{ background: `linear-gradient(170deg, ${COLORS.paper} 0%, #DCE6FF 100%)` }} />
    <div style={{ position: "absolute", top: 110, left: 70, right: 70, fontSize: 76, fontWeight: 900, color: COLORS.navy, lineHeight: 1.04, letterSpacing: -1.5 }}>
      Antes de comprar a meses, <span style={{ color: COLORS.blue }}>3 preguntas</span>
    </div>
    <div style={{ position: "absolute", top: 380, left: 70, right: 70, display: "flex", flexDirection: "column", gap: 34 }}>
      <Casilla n={1}>¿Me va a durar más que los pagos?</Casilla>
      <Casilla n={2}>¿Cabe en mi 30 %?</Casilla>
      <Casilla n={3}>¿La promoción quedó registrada?</Casilla>
    </div>
    <div style={{ position: "absolute", top: 900, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ fontSize: 96, fontWeight: 900, color: COLORS.white, background: `linear-gradient(160deg, #3B6BFF, ${COLORS.blue})`, padding: "14px 60px", borderRadius: 40, rotate: "-3deg", boxShadow: `0 24px 60px ${COLORS.blue}66` }}>GUÁRDALO</div>
      <div style={{ fontSize: 36, fontWeight: 800, color: COLORS.navy }}>o mándaselo a quien se llevó todo el Buen Fin</div>
    </div>
    <div style={{ position: "absolute", bottom: 50, left: 70, right: 70, textAlign: "center", fontSize: 26, fontWeight: 700, color: COLORS.grey }}>
      Ejemplo hipotético. Contenido informativo, no es asesoramiento financiero.
    </div>
    <div style={{ position: "absolute", top: 50, right: 60, fontSize: 30, fontWeight: 800, color: COLORS.grey }}>7/7</div>
  </>
);

const LAMINAS = [L1, L2, L3, L4, L5, L6, L7];

export const W4911: React.FC = () => {
  const frame = useCurrentFrame();
  const L = LAMINAS[Math.min(frame, LAMINAS.length - 1)];
  return (
    <AbsoluteFill style={{ fontFamily, width: W, height: H, overflow: "hidden" }}>
      <L />
    </AbsoluteFill>
  );
};
