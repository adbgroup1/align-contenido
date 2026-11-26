import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../brand";
import {
  Bocadillo,
  Chispas,
  CtaCrecer,
  DefEscena,
  Escena,
  Escenario,
  Fondo,
  Montaje,
  Personaje,
  PropsVoz,
  Rotulo,
  Sfx,
  SUELO_Y,
} from "../kit";

// W49-17 · «El intercambio de $300 que te costó $1,800» · Reel · Historia con personaje + Contador · H9
// Ejemplo (cálculo propio): 300 + 200 + 800 + 350 + 150 = 1,800. Sin otras cifras.
// Lalo (frijol naranja con gorro de Santa) y el jefe (frijol gris con corbata, genérico). Todo DIBUJO.
// El contador vive arriba a la izquierda todo el vídeo y se pone rojo al pasar de $1,000.

export const EXTRA_W4917: Record<string, number> = { hook: 0.1, uber: 0.2, jefe: 0.5, cta: 0.9 };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pesos = (v: number) => "$" + String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const NARANJA = "#FB923C";
const LALO = { color: NARANJA, accesorio: "santa" as const, colorAccesorio: "#DC2626", semilla: 1 };
const JEFE = { color: "#94A3B8", accesorio: "corbata" as const, colorAccesorio: COLORS.blue, semilla: 2 };
const LX = 430; // dónde está Lalo
const LE = 1.75; // escala de Lalo

const useSeg = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/* ---------- Contador fijo arriba a la izquierda ---------- */
const Contador: React.FC<{ de: number; a: number; en: number; dur?: number; grande?: number }> = ({ de, a, en, dur = 0.5, grande = 0 }) => {
  const t = useSeg();
  const k = interpolate(t, [en, en + dur], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  const v = de + (a - de) * k;
  const golpe = t > en && t < en + dur + 0.3 ? Math.sin(((t - en) / (dur + 0.3)) * Math.PI) : 0;
  const tiembla = Math.sin(t * 60) * (2 + golpe * 6) * (v >= 1000 ? 1.6 : 1);
  const rojo = v >= 1000;
  const color = rojo ? COLORS.red : v > 300 ? COLORS.gold : COLORS.white;
  // grande: 0 = esquina, 1 = centro de la pantalla
  const left = interpolate(grande, [0, 1], [90, 540]);
  const top = interpolate(grande, [0, 1], [450, 700]);
  const escala = interpolate(grande, [0, 1], [1, 2.3]);
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        translate: grande > 0 ? `${-50 * grande}% ${-50 * grande}%` : undefined,
        scale: String(escala * (1 + golpe * 0.12)),
        transformOrigin: grande > 0 ? "center" : "left top",
        rotate: `${tiembla * 0.4}deg`,
        background: "rgba(15,23,42,0.82)",
        border: `5px solid ${color}`,
        borderRadius: 30,
        padding: "12px 30px 16px",
        boxShadow: `0 0 ${20 + golpe * 50}px ${color}88`,
        fontFamily,
        zIndex: 5,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.light, letterSpacing: 2 }}>LLEVAS GASTADO</div>
      <div style={{ fontSize: 92, fontWeight: 900, color, lineHeight: 1, fontVariantNumeric: "tabular-nums", translate: `${tiembla}px 0px` }}>{pesos(v)}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.grey }}>Ejemplo</div>
    </div>
  );
};

/* ---------- Objetos ---------- */
const Regalo: React.FC<{ x: number; y: number; escala?: number; etiqueta?: string; abre?: number }> = ({ x, y, escala = 1, etiqueta, abre = 0 }) => {
  const t = useSeg();
  const bota = Math.sin(t * 5) * 4;
  return (
    <div style={{ position: "absolute", left: x - 110 * escala, top: y - 200 * escala + bota, width: 220 * escala, height: 200 * escala }}>
      <svg width={220 * escala} height={200 * escala} viewBox="0 0 220 200" style={{ overflow: "visible", filter: "drop-shadow(0 14px 20px rgba(0,0,0,0.35))" }}>
        <rect x={20} y={70} width={180} height={126} rx={14} fill="#16A34A" stroke={COLORS.navy} strokeWidth={6} />
        <rect x={98} y={70} width={24} height={126} fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={4} />
        <g transform={`rotate(${-abre * 25} 10 70) translate(0 ${-abre * 30})`}>
          <rect x={10} y={44} width={200} height={34} rx={10} fill="#22C55E" stroke={COLORS.navy} strokeWidth={6} />
          <rect x={98} y={44} width={24} height={34} fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={4} />
          <path d="M110 44 Q70 0 60 30 Q58 46 110 44 Q150 0 160 30 Q162 46 110 44 Z" fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={5} />
        </g>
      </svg>
      {etiqueta ? (
        <div
          style={{
            position: "absolute",
            left: 170 * escala,
            top: 40 * escala,
            background: COLORS.paper,
            color: COLORS.navy,
            fontFamily,
            fontWeight: 900,
            fontSize: 58,
            padding: "6px 20px",
            borderRadius: 14,
            border: `5px solid ${COLORS.navy}`,
            rotate: `${10 + Math.sin(t * 3) * 4}deg`,
            whiteSpace: "nowrap",
          }}
        >
          {etiqueta}
        </div>
      ) : null}
    </div>
  );
};

const Billete: React.FC<{ x: number; y: number; rot?: number; escala?: number }> = ({ x, y, rot = 0, escala = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", rotate: `${rot}deg`, scale: String(escala) }}>
    <svg width={150} height={80} viewBox="0 0 150 80">
      <rect x={3} y={3} width={144} height={74} rx={10} fill="#86EFAC" stroke={COLORS.navy} strokeWidth={5} />
      <circle cx={75} cy={40} r={20} fill="none" stroke="#166534" strokeWidth={5} />
      <text x={75} y={50} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={28} fill="#166534">
        $
      </text>
    </svg>
  </div>
);

const Alcancia: React.FC<{ x: number; y: number; lleno?: number }> = ({ x, y, lleno = 0 }) => (
  <div style={{ position: "absolute", left: x - 130, top: y - 300, width: 260, height: 300 }}>
    <svg width={260} height={300} viewBox="0 0 260 300" style={{ overflow: "visible", filter: "drop-shadow(0 16px 24px rgba(0,0,0,0.35))" }}>
      <rect x={20} y={40} width={220} height={250} rx={40} fill="rgba(199,215,254,0.25)" stroke={COLORS.light} strokeWidth={8} />
      <rect x={28} y={290 - 240 * lleno} width={204} height={240 * lleno} rx={30} fill="#86EFAC" opacity={0.85} />
      <rect x={70} y={22} width={120} height={26} rx={10} fill={COLORS.navy} stroke={COLORS.light} strokeWidth={5} />
      <rect x={60} y={110} width={140} height={70} rx={16} fill={COLORS.white} stroke={COLORS.navy} strokeWidth={5} />
      <text x={130} y={158} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={38} fill={COLORS.navy}>
        COOPE
      </text>
    </svg>
  </div>
);

/** Suéter navideño con reno (la nariz parpadea). Se dibuja encima del cuerpo de Lalo. */
const Sueter: React.FC<{ x: number; y: number; escala: number; cae?: number }> = ({ x, y, escala, cae = 1 }) => {
  const frame = useCurrentFrame();
  const nariz = Math.floor(frame / 6) % 2 === 0;
  const offY = (1 - cae) * -1100;
  return (
    <div style={{ position: "absolute", left: x - 100 * escala, top: y - 260 * escala + offY, width: 200 * escala, height: 260 * escala, rotate: `${(1 - cae) * 30}deg` }}>
      <svg width={200 * escala} height={260 * escala} viewBox="0 0 200 260" style={{ overflow: "visible" }}>
        <path d="M38 150 Q40 120 70 118 L130 118 Q160 120 162 150 L162 190 Q160 216 100 216 Q40 216 38 190 Z" fill="#DC2626" stroke={COLORS.navy} strokeWidth={4} />
        <path d="M40 132 H160" stroke={COLORS.white} strokeWidth={8} strokeDasharray="10 8" />
        <path d="M40 200 H160" stroke={COLORS.white} strokeWidth={8} strokeDasharray="10 8" />
        {/* reno */}
        <g transform="translate(100 168)">
          <path d="M-18 -22 L-28 -40 M-28 -40 L-38 -34 M-28 -40 L-30 -52 M18 -22 L28 -40 M28 -40 L38 -34 M28 -40 L30 -52" stroke={COLORS.choco} strokeWidth={5} strokeLinecap="round" />
          <ellipse rx={20} ry={24} fill={COLORS.chocoLight} stroke={COLORS.navy} strokeWidth={3} />
          <circle cx={-7} cy={-6} r={3.5} fill={COLORS.navy} />
          <circle cx={7} cy={-6} r={3.5} fill={COLORS.navy} />
          <circle cy={12} r={8} fill={nariz ? "#FF1F1F" : "#7F1D1D"} stroke={COLORS.navy} strokeWidth={2} />
          {nariz ? <circle cy={12} r={16} fill="#FF1F1F" opacity={0.3} /> : null}
        </g>
      </svg>
    </div>
  );
};

const Carro: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const frame = useCurrentFrame();
  const r = frame * 20;
  return (
    <div style={{ position: "absolute", left: x - 200, top: y - 190 }}>
      <svg width={400} height={190} viewBox="0 0 400 190" style={{ overflow: "visible" }}>
        <path d="M20 120 Q24 80 70 78 L120 30 Q130 20 150 20 L270 20 Q290 20 300 34 L340 80 Q384 84 386 120 L386 140 L20 140 Z" fill={COLORS.blue} stroke={COLORS.navy} strokeWidth={6} />
        <path d="M134 38 L270 38 L310 80 L100 80 Z" fill={COLORS.light} stroke={COLORS.navy} strokeWidth={5} />
        <line x1={205} y1={38} x2={205} y2={80} stroke={COLORS.navy} strokeWidth={5} />
        <rect x={360} y={100} width={24} height={14} rx={4} fill={COLORS.gold} />
        {[100, 300].map((cx) => (
          <g key={cx} transform={`rotate(${r} ${cx} 144)`}>
            <circle cx={cx} cy={144} r={36} fill={COLORS.navy} stroke="#334155" strokeWidth={6} />
            <line x1={cx - 20} y1={144} x2={cx + 20} y2={144} stroke={COLORS.grey} strokeWidth={6} />
          </g>
        ))}
      </svg>
    </div>
  );
};

const PlatoTacos: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => {
  const t = useSeg();
  return (
    <div style={{ position: "absolute", left: x - 150, top: y - 110, scale: String(s), rotate: `${(1 - s) * 20}deg` }}>
      <svg width={300} height={140} viewBox="0 0 300 140" style={{ overflow: "visible" }}>
        <ellipse cx={150} cy={110} rx={140} ry={26} fill={COLORS.paper} stroke={COLORS.navy} strokeWidth={5} />
        {[70, 150, 230].map((cx, i) => (
          <g key={cx} transform={`translate(${cx} ${96 + Math.sin(t * 6 + i) * 2})`}>
            <path d="M-50 0 Q0 -90 50 0 Z" fill="#FCD34D" stroke={COLORS.navy} strokeWidth={5} />
            <path d="M-38 -10 Q0 -62 38 -10" fill="none" stroke="#16A34A" strokeWidth={9} strokeLinecap="round" />
            <path d="M-30 -22 Q0 -58 30 -22" fill="none" stroke="#B45309" strokeWidth={7} strokeLinecap="round" />
          </g>
        ))}
      </svg>
      {/* vapor */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 80 + i * 70, top: -40 - ((t * 60 + i * 30) % 80), width: 18, height: 40, borderRadius: 20, background: COLORS.white, opacity: 0.35 * (1 - ((t * 60 + i * 30) % 80) / 80) }} />
      ))}
    </div>
  );
};

const Luna: React.FC = () => (
  <svg width={200} height={200} style={{ position: "absolute", left: 760, top: 560 }}>
    <circle cx={100} cy={100} r={70} fill="#FEF3C7" />
    <circle cx={130} cy={80} r={62} fill="#0B1224" opacity={0.9} />
  </svg>
);

const Papelito: React.FC<{ x: number; y: number; abre: number; texto: string }> = ({ x, y, abre, texto }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(0.6 + 0.4 * abre), rotate: `${(1 - abre) * -14 + 3}deg` }}>
    <div
      style={{
        background: COLORS.paper,
        border: `6px solid ${COLORS.navy}`,
        borderRadius: 16,
        padding: "18px 34px",
        transform: `scaleY(${0.15 + 0.85 * abre})`,
        fontFamily,
        textAlign: "center",
        boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 800, color: COLORS.grey }}>Te tocó:</div>
      <div style={{ fontSize: 84, fontWeight: 900, color: COLORS.red, lineHeight: 1 }}>{texto}</div>
    </div>
  </div>
);

const Llavero: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => {
  const t = useSeg();
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(s), rotate: `${Math.sin(t * 4) * 14}deg`, transformOrigin: "50% 0%" }}>
      <svg width={90} height={130} viewBox="0 0 90 130">
        <circle cx={45} cy={18} r={14} fill="none" stroke={COLORS.light} strokeWidth={6} />
        <line x1={45} y1={32} x2={45} y2={56} stroke={COLORS.light} strokeWidth={5} />
        <path d="M45 56 L70 90 L45 124 L20 90 Z" fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={4} />
      </svg>
    </div>
  );
};

/* ---------- Escenas ---------- */

/** Composición del gancho (se repite al final para el bucle). */
const Gancho: React.FC<{ congelar?: boolean }> = ({ congelar }) => (
  <>
    <Escenario tipo="interior" />
    <Rotulo texto="«El intercambio es de **$300**», dijeron" delay={congelar ? -2 : -0.5} size={58} />
    <Personaje x={LX} y={SUELO_Y} escala={LE} {...LALO} expresion="feliz" pose="abraza" mirar="der" />
    <Regalo x={LX + 40} y={SUELO_Y + 5} escala={1.1} etiqueta="$300" />
    <Contador de={300} a={300} en={0} />
  </>
);

const Hook = () => (
  <Escena sinEntrada luz="#7C2D12">
    <Sfx s="pop" volumen={0.45} en={0.05} />
    <Sfx s="swoosh" volumen={0.3} en={1.3} />
    <Gancho />
  </Escena>
);

const Coope = () => {
  const t = useSeg();
  const entra = interpolate(t, [0, 0.5], [1300, 820], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  const vuela = interpolate(t, [0.6, 1.2], [0, 1], clamp);
  const bx = interpolate(vuela, [0, 1], [LX + 90, 820]);
  const by = interpolate(vuela, [0, 1], [1000, 900]) - Math.sin(vuela * Math.PI) * 220;
  return (
    <Escena luz="#7C2D12" sonidoEntrada="swoosh">
      <Escenario tipo="interior" />
      <Rotulo texto="Cooperación **+$200**" size={64} />
      <Personaje x={LX - 40} y={SUELO_Y} escala={LE} {...LALO} expresion="neutral" pose="senala" mirar="der" />
      <Alcancia x={entra} y={SUELO_Y - 20} lleno={interpolate(t, [1.1, 1.5], [0.3, 0.55], clamp)} />
      {vuela > 0 && vuela < 1 ? <Billete x={bx} y={by} rot={vuela * 360} /> : null}
      <Contador de={300} a={500} en={1.15} />
      <Sfx s="pop" volumen={0.4} en={1.15} />
    </Escena>
  );
};

const SueterEsc = () => {
  const t = useSeg();
  const CAE = 0.9;
  const cae = interpolate(t, [0.2, CAE], [0, 1], { ...clamp, easing: (x) => x * x });
  return (
    <Escena luz="#991B1B" sacudidas={[CAE]}>
      <Escenario tipo="interior" />
      <Rotulo texto="Suéter «obligatorio» **+$800**" size={60} />
      <Personaje x={LX} y={SUELO_Y} escala={LE} {...LALO} expresion={t < CAE ? "sorpresa" : "preocupado"} pose={t < CAE ? "brazos-arriba" : "encoge"} mirar="frente" />
      <Sueter x={LX} y={SUELO_Y} escala={LE} cae={cae} />
      {t > CAE + 0.2 ? <Bocadillo texto="¿Ochocientos?" x={790} y={720} ancho={380} size={46} delay={CAE + 0.2} colaX={-120} /> : null}
      <Contador de={500} a={1300} en={CAE} dur={0.6} />
      <Sfx s="impacto" volumen={0.5} en={CAE} />
      <Chispas en={CAE} x={LX} y={SUELO_Y - 200} color={COLORS.red} n={12} />
    </Escena>
  );
};

const Uber = () => {
  const t = useSeg();
  const CORTE = 1.35;
  const carroX = interpolate(t, [0, CORTE], [-260, 1400]);
  const plato = interpolate(t, [CORTE, CORTE + 0.35], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  return (
    <Escena luz="#1E1B4B" sonidoEntrada="whoosh">
      <Escenario tipo="calle" />
      {t < CORTE ? (
        <>
          <Rotulo texto="Uber **+$350**" size={64} />
          <Carro x={carroX} y={SUELO_Y - 10} />
          <Sfx s="swoosh" volumen={0.4} en={0.2} />
        </>
      ) : (
        <>
          <Luna />
          <Rotulo texto="Tacos de madrugada **+$150**" size={58} delay={CORTE} />
          <Personaje x={LX} y={SUELO_Y} escala={LE} {...LALO} expresion="feliz" pose="abraza" mirar="der" />
          <Sueter x={LX} y={SUELO_Y} escala={LE} />
          <PlatoTacos x={LX + 20} y={SUELO_Y - 150} s={plato} />
        </>
      )}
      <Contador de={1300} a={1650} en={0.5} dur={0.5} />
      {t >= CORTE ? <Contador de={1650} a={1800} en={CORTE + 0.2} dur={0.4} /> : null}
      <Sfx s="pop" volumen={0.4} en={CORTE + 0.2} />
    </Escena>
  );
};

const Jefe: React.FC = () => {
  const t = useSeg();
  const grande = interpolate(t, [0, 0.35, 1.1, 1.4], [0, 1, 1, 0], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  const ABRE = 1.5;
  const abre = interpolate(t, [ABRE, ABRE + 0.35], [0, 1], clamp);
  const JEFE_T = 2.9;
  const llav = interpolate(t, [JEFE_T + 0.3, JEFE_T + 0.6], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  return (
    <Escena luz="#450A0A" sacudidas={[0.35, JEFE_T]}>
      <Escenario tipo="interior" />
      {t > ABRE - 0.1 ? <Papelito x={540} y={330} abre={abre} texto="EL JEFE" /> : null}
      <Personaje x={LX - 80} y={SUELO_Y} escala={LE} {...LALO} expresion={t < JEFE_T ? "sorpresa" : "triste"} pose={t < JEFE_T ? "quieto" : "encoge"} mirar="der" />
      <Sueter x={LX - 80} y={SUELO_Y} escala={LE} />
      {t > JEFE_T - 0.6 ? (
        <Personaje x={860} y={SUELO_Y} escala={1.9} {...JEFE} expresion="feliz" pose="senala" mirar="izq" entra="der" delay={JEFE_T - 0.6} />
      ) : null}
      {llav > 0 ? <Llavero x={640} y={980} s={llav * 1.6} /> : null}
      {t > JEFE_T + 0.6 ? <Bocadillo texto="Feliz Navidad 🙂" x={830} y={640} ancho={400} size={44} delay={JEFE_T + 0.6} colaX={20} /> : null}
      <Contador de={1800} a={1800} en={0} grande={grande} />
      <Sfx s="ding" volumen={0.4} en={0.35} />
      <Sfx s="pop" volumen={0.45} en={ABRE} />
      <Sfx s="impacto" volumen={0.5} en={JEFE_T} />
      <Chispas en={ABRE + 0.2} x={540} y={330} color={COLORS.gold} n={14} />
    </Escena>
  );
};

const Fila: React.FC<{ txt: string; v: string; on: number }> = ({ txt, v, on }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 46, fontWeight: 800, color: COLORS.navy, opacity: 0.25 + 0.75 * on, translate: `${(1 - on) * 40}px 0px` }}>
    <span>
      <span style={{ display: "inline-block", width: 52, color: COLORS.green }}>{on > 0.5 ? "✓" : "□"}</span>
      {txt}
    </span>
    <span style={{ fontWeight: 900 }}>{v}</span>
  </div>
);

const Lista = () => {
  const t = useSeg();
  const items: [string, string][] = [
    ["Regalo", "$300"],
    ["Comida", "$200"],
    ["Suéter", "$800"],
    ["Transporte", "$350"],
    ["Tacos", "$150"],
  ];
  return (
    <Escena luz="#7C2D12" sonidoEntrada="swoosh">
      <Escenario tipo="interior" />
      <Rotulo texto="Presupuesta **el día**, no el regalo" size={58} />
      <div style={{ position: "absolute", left: 330, top: 450, width: 640, background: COLORS.paper, borderRadius: 26, border: `6px solid ${COLORS.navy}`, padding: "26px 34px", display: "flex", flexDirection: "column", gap: 14, rotate: "2deg", fontFamily, boxShadow: "0 24px 50px rgba(0,0,0,0.35)" }}>
        {items.map(([a, b], i) => (
          <Fila key={a} txt={a} v={b} on={interpolate(t, [0.15 + i * 0.25, 0.35 + i * 0.25], [0, 1], clamp)} />
        ))}
        <div style={{ borderTop: `4px dashed ${COLORS.grey}`, paddingTop: 10, display: "flex", justifyContent: "space-between", fontSize: 54, fontWeight: 900, color: COLORS.red }}>
          <span>Total del día</span>
          <span>$1,800</span>
        </div>
      </div>
      <Personaje x={210} y={SUELO_Y} escala={1.35} {...LALO} expresion="pensativo" pose="senala" mirar="der" />
      <Sueter x={210} y={SUELO_Y} escala={1.35} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={i} s="tick" volumen={0.3} en={0.3 + i * 0.25} />
      ))}
    </Escena>
  );
};

const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const CORTE = Math.round(1.95 * fps);
  const vuelta = interpolate(frame, [dur - 10, dur - 2], [0, 1], clamp);
  return (
    <>
      <Sequence durationInFrames={CORTE} layout="none">
        <Lista />
      </Sequence>
      <Sequence from={CORTE} layout="none">
        <CtaCrecer tipo="compartir" boton="MÁNDASELO 🎁" linea="a quien **organiza** el intercambio" />
        <div style={{ position: "absolute", top: 1272, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 28, fontWeight: 700, color: COLORS.navy }}>
          Ejemplo · Contenido informativo, no es asesoramiento financiero.
        </div>
      </Sequence>
      {vuelta > 0 ? (
        <AbsoluteFill style={{ opacity: vuelta, fontFamily }}>
          <Fondo luz="#7C2D12" />
          <Gancho congelar />
        </AbsoluteFill>
      ) : null}
    </>
  );
};

const ESCENAS: DefEscena[] = [
  { id: "hook", render: () => <Hook /> },
  { id: "coope", render: () => <Coope /> },
  { id: "sueter", render: () => <SueterEsc /> },
  { id: "uber", render: () => <Uber /> },
  { id: "jefe", render: () => <Jefe /> },
  { id: "cta", subtitulosClaros: true, render: ({ dur }) => <Cta dur={dur} /> },
];

export const W4917: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4917} pista="lofi-polaroids.mp3" /> : null;
