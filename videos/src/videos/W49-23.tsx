import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../brand";
import { Bocadillo, Chispas, CtaCrecer, DefEscena, Escena, Fondo, Montaje, Pildora, PropsVoz, Rotulo, Sfx } from "../kit";

// W49-23 · «Construye tu primera inversión desde cero (con $100)» · Reel · Construye desde cero · H2
// Ejemplo hipotético al 6 % anual, antes de impuestos (cálculo propio): 100 × 0,06 × 28/360 = $0.47;
// 24 quincenas de $100 reinvertidas al 0,25 % por quincena ≈ $2,476. CETE nombrado como concepto, sin app ni plataforma.
// Plano fijo cenital: una mesa; cada pieza entra en el mismo encuadre y se queda. Cierre en bucle a la mesa con una moneda.

export const EXTRA_W4923: Record<string, number> = { centavos: 0.3, torre: 0.2, wow: 0.5, cta: 1.0 };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (x: number) => 1 - (1 - x) ** 3;
const MADERA = "#B7794A";

const useSeg = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** Entrada «cae sobre la mesa» de una pieza: 0 = fuera, 1 = en su sitio (con rebote). */
const usePieza = (en: number) => {
  const t = useSeg();
  const k = interpolate(t, [en, en + 0.35], [0, 1], clamp);
  const rebote = k >= 1 ? 1 : 1 - Math.cos(k * Math.PI * 1.5) * (1 - k);
  return { k, y: (1 - Math.min(1, rebote)) * -500, s: 1.4 - 0.4 * k, o: Math.min(1, k * 3) };
};

/* ---------- Mesa y piezas ---------- */

const Mesa: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: `repeating-linear-gradient(90deg, ${MADERA} 0px, ${MADERA} 170px, #A86B3F 172px, #A86B3F 176px)` }} />
    <AbsoluteFill style={{ background: "radial-gradient(70% 50% at 50% 45%, rgba(255,230,180,0.25), rgba(0,0,0,0.45) 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 0%, transparent 70%, rgba(15,23,42,0.75) 82%, rgba(15,23,42,0.95) 100%)" }} />
  </AbsoluteFill>
);

const Moneda: React.FC<{ x: number; y: number; r?: number; texto?: string; brillo?: number }> = ({ x, y, r = 90, texto = "$100", brillo = 0 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r }}>
    <svg width={2 * r} height={2 * r} viewBox="0 0 200 200" style={{ overflow: "visible", filter: `drop-shadow(0 12px 14px rgba(0,0,0,0.45)) drop-shadow(0 0 ${brillo * 30}px #FDE68A)` }}>
      <circle cx={100} cy={100} r={94} fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={7} />
      <circle cx={100} cy={100} r={72} fill="none" stroke="#B45309" strokeWidth={5} strokeDasharray="9 7" />
      {texto ? (
        <text x={100} y={116} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={texto.length > 4 ? 40 : 50} fill="#78350F">
          {texto}
        </text>
      ) : null}
    </svg>
  </div>
);

/** Edificio genérico con cúpula y ventanilla. */
const Edificio: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={420} height={380} viewBox="0 0 420 380" style={{ position: "absolute", left: x - 210, top: y - 380, overflow: "visible", filter: "drop-shadow(0 16px 20px rgba(0,0,0,0.45))" }}>
    <path d="M140 110 Q210 10 280 110 Z" fill="#94A3B8" stroke={COLORS.navy} strokeWidth={6} />
    <rect x={200} y={20} width={20} height={30} fill={COLORS.navy} />
    <rect x={40} y={110} width={340} height={30} rx={6} fill={COLORS.light} stroke={COLORS.navy} strokeWidth={6} />
    {[70, 140, 250, 320].map((cx) => (
      <rect key={cx} x={cx} y={140} width={30} height={180} fill={COLORS.white} stroke={COLORS.navy} strokeWidth={5} />
    ))}
    <rect x={175} y={200} width={70} height={60} rx={8} fill={COLORS.navy} stroke={COLORS.navy} strokeWidth={5} />
    <text x={210} y={290} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={26} fill={COLORS.navy}>
      GOBIERNO
    </text>
    <rect x={20} y={320} width={380} height={40} rx={8} fill={COLORS.light} stroke={COLORS.navy} strokeWidth={6} />
  </svg>
);

const Calendario: React.FC<{ x: number; y: number; dia: number }> = ({ x, y, dia }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", width: 230, background: COLORS.paper, border: `6px solid ${COLORS.navy}`, borderRadius: 20, overflow: "hidden", fontFamily, textAlign: "center", boxShadow: "0 16px 24px rgba(0,0,0,0.4)", rotate: "-4deg" }}>
    <div style={{ background: COLORS.red, color: COLORS.white, fontWeight: 900, fontSize: 32, padding: "4px 0" }}>DÍA</div>
    <div style={{ fontWeight: 900, fontSize: 110, color: COLORS.navy, lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>{dia}</div>
  </div>
);

const Etiqueta: React.FC<{ x: number; y: number; texto: string; color?: string; s?: number; rot?: number }> = ({ x, y, texto, color = COLORS.white, s = 1, rot = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(s), rotate: `${rot}deg`, background: "rgba(15,23,42,0.88)", border: `4px solid ${color}`, borderRadius: 16, padding: "4px 18px", fontFamily, fontWeight: 900, fontSize: 46, color, whiteSpace: "nowrap" }}>
    {texto}
  </div>
);

/** La vocecita fuera de cuadro: un bocadillo que asoma desde el borde derecho. */
const Voz: React.FC<{ texto: string; en: number; y?: number }> = ({ texto, en, y = 1150 }) => {
  const t = useSeg();
  if (t < en) return null;
  return <Bocadillo texto={texto} x={800} y={y} ancho={360} size={40} delay={en} colaX={150} />;
};

/* ---------- Composición acumulada ---------- */
// Cada escena dibuja todas las piezas anteriores ya colocadas (plano fijo) y anima la suya.

const MONEDA = { x: 540, y: 1080 };

const Base: React.FC<{ hasta: number; dia?: number }> = ({ hasta, dia = 28 }) => (
  <>
    {hasta >= 2 ? <Edificio x={540} y={1000} /> : null}
    {hasta >= 3 ? <Calendario x={200} y={1150} dia={dia} /> : null}
    {hasta >= 4 ? (
      <>
        <Moneda x={370} y={1215} r={26} texto="" />
        <Moneda x={415} y={1195} r={22} texto="" />
      </>
    ) : null}
  </>
);

const Gancho: React.FC<{ congelar?: boolean }> = ({ congelar }) => {
  const p = usePieza(congelar ? -1 : -0.12);
  return (
    <>
      <Mesa />
      <Rotulo texto="Pon **$100** aquí y tienes tu primera inversión" delay={congelar ? -2 : -0.5} size={56} />
      <div style={{ position: "absolute", inset: 0, translate: `0px ${p.y}px`, scale: String(p.s), opacity: p.o, transformOrigin: `${MONEDA.x}px ${MONEDA.y}px` }}>
        <Moneda x={MONEDA.x} y={MONEDA.y} r={120} />
      </div>
    </>
  );
};

const Hook = () => (
  <Escena sinEntrada luz="#B45309" sonidoEntrada={null}>
    <Gancho />
    <Voz texto="¿Y eso qué? 🤨" en={1.4} />
    <Sfx s="impacto" volumen={0.45} en={0.3} />
    <Sfx s="pop" volumen={0.35} en={1.4} />
  </Escena>
);

const Cete = () => {
  const t = useSeg();
  const p = usePieza(0.0);
  const entra = interpolate(t, [1.2, 1.7], [0, 1], { ...clamp, easing: easeOut });
  return (
    <Escena luz="#B45309" sonidoEntrada={null}>
      <Mesa />
      <Rotulo texto="Le prestas al gobierno = **CETE**" size={60} />
      <div style={{ translate: `0px ${p.y}px`, opacity: p.o }}>
        <Edificio x={540} y={1000} />
      </div>
      <div style={{ opacity: 1 - entra }}>
        <Moneda x={MONEDA.x} y={interpolate(entra, [0, 1], [MONEDA.y, 850])} r={interpolate(entra, [0, 1], [120, 40])} />
      </div>
      <Sfx s="impacto" volumen={0.4} en={0.3} />
      <Sfx s="swoosh" volumen={0.35} en={1.2} />
      <Sfx s="click" volumen={0.4} en={1.7} />
    </Escena>
  );
};

const Plazo = () => {
  const t = useSeg();
  const p = usePieza(0.0);
  const dia = Math.round(interpolate(t, [0.35, 1.6], [1, 28], { ...clamp, easing: (x) => x * x }));
  return (
    <Escena luz="#B45309" sonidoEntrada={null}>
      <Mesa />
      <Rotulo texto="Plazo: **28 días**" size={64} />
      <Base hasta={2} />
      <div style={{ translate: `0px ${p.y}px`, opacity: p.o }}>
        <Calendario x={200} y={1150} dia={dia} />
      </div>
      {[0.5, 0.8, 1.05, 1.25, 1.4, 1.5].map((en) => (
        <Sfx key={en} s="tick" volumen={0.35} en={en} />
      ))}
    </Escena>
  );
};

const Centavos = () => {
  const t = useSeg();
  const a = usePieza(0.9);
  const b = usePieza(1.05);
  return (
    <Escena luz="#B45309" sonidoEntrada={null} sacudidas={[2.2]}>
      <Mesa />
      <Rotulo texto="**+$0.47** de intereses" size={64} />
      <Base hasta={3} />
      <div style={{ translate: `0px ${a.y}px`, opacity: a.o }}>
        <Moneda x={370} y={1215} r={26} texto="" />
      </div>
      <div style={{ translate: `0px ${b.y}px`, opacity: b.o }}>
        <Moneda x={415} y={1195} r={22} texto="" />
      </div>
      {t > 1.3 ? <Etiqueta x={400} y={1100} texto="+$0.47" color="#4ADE80" s={0.9} /> : null}
      <div style={{ position: "absolute", left: 90, top: 1300 }}>
        <Pildora size={34}>Ejemplo hipotético · 6 % anual</Pildora>
      </div>
      <Voz texto="¡JAJAJA! 🤣 ¿47 centavos?" en={2.1} y={440} />
      <Sfx s="ding" volumen={0.4} en={1.15} />
      <Sfx s="pop" volumen={0.4} en={2.1} />
    </Escena>
  );
};

/** Torre de monedas que crece hasta `n` pisos. */
const Torre: React.FC<{ n: number; x?: number; base?: number; bandera?: number }> = ({ n, x = 820, base = 1170, bandera = 0 }) => (
  <>
    {Array.from({ length: n }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: x - 110, top: base - i * 22, width: 220, height: 44, borderRadius: "50%", background: i % 2 ? "#F59E0B" : COLORS.gold, border: `5px solid ${COLORS.navy}`, boxShadow: "0 6px 8px rgba(0,0,0,0.25)" }} />
    ))}
    {bandera > 0 ? (
      <svg width={140} height={170} viewBox="0 0 140 170" style={{ position: "absolute", left: x - 10, top: base - n * 22 - 160 + (1 - bandera) * 60, opacity: bandera }}>
        <line x1={10} y1={10} x2={10} y2={170} stroke={COLORS.navy} strokeWidth={8} />
        <path d="M14 12 L130 38 L14 66 Z" fill="#4ADE80" stroke={COLORS.navy} strokeWidth={5} />
      </svg>
    ) : null}
  </>
);

const TorreEsc = () => {
  const t = useSeg();
  const giro = interpolate(t, [0.1, 1.2], [0, 360], clamp);
  const pisos = Math.round(interpolate(t, [1.6, 3.9], [1, 12], clamp));
  const q = Math.round(interpolate(t, [1.6, 3.9], [1, 12], clamp));
  return (
    <Escena luz="#15803D" sonidoEntrada={null}>
      <Mesa />
      <Rotulo texto="Reinvierte · **+$100 cada quincena**" size={56} />
      <Base hasta={4} />
      <Torre n={pisos} />
      {t < 1.5 ? (
        <svg width={420} height={420} viewBox="0 0 420 420" style={{ position: "absolute", left: 610, top: 960, rotate: `${giro}deg`, scale: "0.55" }}>
          <path d="M210 30 A180 180 0 1 1 40 150" fill="none" stroke="#4ADE80" strokeWidth={16} strokeLinecap="round" />
          <path d="M14 140 L48 112 L62 160 Z" fill="#4ADE80" />
        </svg>
      ) : null}
      {t > 1.6 ? <Etiqueta x={820} y={1260} texto={`Quincena ${q}`} color={COLORS.gold} s={0.75} /> : null}
      <Sfx s="swoosh" volumen={0.35} en={0.1} />
      {[1.7, 2.1, 2.5, 2.9, 3.3, 3.7].map((en) => (
        <Sfx key={en} s="tick" volumen={0.35} en={en} />
      ))}
    </Escena>
  );
};

const Wow = () => {
  const t = useSeg();
  const pisos = Math.round(interpolate(t, [0, 1.6], [12, 24], clamp));
  const v = interpolate(t, [0.6, 2.9], [1200, 2476], { ...clamp, easing: easeOut });
  const bandera = interpolate(t, [2.9, 3.3], [0, 1], { ...clamp, easing: easeOut });
  return (
    <Escena luz="#15803D" sonidoEntrada={null}>
      <Mesa />
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, textAlign: "center", fontFamily }}>
        <div style={{ display: "inline-block", fontSize: 44, fontWeight: 900, color: COLORS.white, background: "rgba(15,23,42,0.85)", padding: "6px 24px", borderRadius: 16 }}>Al año</div>
        <div style={{ fontSize: 160, fontWeight: 900, color: "#4ADE80", lineHeight: 1.05, WebkitTextStroke: `5px ${COLORS.navy}`, fontVariantNumeric: "tabular-nums" }}>
          ${Math.round(v).toLocaleString("en-US")}
        </div>
      </div>
      <Base hasta={4} />
      <Torre n={pisos} bandera={bandera} />
      <div style={{ position: "absolute", left: 90, top: 1300 }}>
        <Pildora size={34}>Ejemplo hipotético · antes de impuestos</Pildora>
      </div>
      {t > 4.4 ? <Voz texto="…oye, ¿me prestas? 🥺" en={4.4} y={560} /> : null}
      <Sfx s="riser" volumen={0.3} en={1.4} />
      <Sfx s="ding" volumen={0.5} en={2.9} />
      <Chispas en={2.9} x={540} y={420} color="#4ADE80" n={16} />
      <Sfx s="pop" volumen={0.4} en={4.4} />
    </Escena>
  );
};

const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const vuelta = interpolate(frame, [dur - 10, dur - 2], [0, 1], clamp);
  return (
    <>
      <CtaCrecer tipo="compartir" boton="MÁNDASELO 🪙" linea="a quien cree que **invertir es de ricos**" />
      <div style={{ position: "absolute", top: 1240, left: 60, right: 60, textAlign: "center", fontFamily, fontSize: 26, fontWeight: 700, color: COLORS.navy, lineHeight: 1.35 }}>
        Así funciona; no es una recomendación. Las tasas cambian cada semana.
        <br />
        Contenido informativo, no es asesoramiento financiero.
      </div>
      {vuelta > 0 ? (
        <AbsoluteFill style={{ opacity: vuelta, fontFamily }}>
          <Fondo luz="#B45309" />
          <Gancho congelar />
        </AbsoluteFill>
      ) : null}
    </>
  );
};

const ESCENAS: DefEscena[] = [
  { id: "hook", render: () => <Hook /> },
  { id: "cete", render: () => <Cete /> },
  { id: "plazo", render: () => <Plazo /> },
  { id: "centavos", render: () => <Centavos /> },
  { id: "torre", render: () => <TorreEsc /> },
  { id: "wow", render: () => <Wow /> },
  { id: "cta", subtitulosClaros: true, render: ({ dur }) => <Cta dur={dur} /> },
];

export const W4923: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4923} pista="piano-strings-light.mp3" /> : null;
