import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
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

// W49-19 · «El millón de Don Chema (y los tres ceros)» · Reel · Historia con enigma de un objeto + giro · H15
// Datos: 1 ene 1993, $1,000 viejos = N$1 (Banxico; DOF 22 jun 1992). Inflación 1987: 159,2 % (INEGI).
// Don Chema: frijol café con bigote y sombrero de palma. La polilla «INFLACIÓN», morada. Billetes genéricos, sin rostros.
// Todo DIBUJO. Cierre en bucle al fajo del inicio.

export const EXTRA_W4919: Record<string, number> = { hook: 0.15, calendario: 0.2, linterna: 0.5, polilla: 0.3, cta: 0.8 };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (x: number) => 1 - (1 - x) ** 3;
const CAFE = "#A16207";
const MORADO = "#9333EA";
const CHEMA = { color: CAFE, accesorio: "sombrero" as const, colorAccesorio: "#FDE68A", bigote: true, semilla: 3 };

const useSeg = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

const Extra: React.FC<{ s: string; en?: number; volumen?: number; rate?: number }> = ({ s, en = 0, volumen = 0.45, rate = 1 }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.round(en * fps)} layout="none">
      <Audio src={staticFile(`sfx/extra/${s}.wav`)} volume={volumen} playbackRate={rate} />
    </Sequence>
  );
};

/* ---------- Objetos ---------- */

/** Billete genérico (sin rostros): rectángulo verde con un círculo y su valor. */
const Billete: React.FC<{ x: number; y: number; valor: string; rot?: number; escala?: number; color?: string; gris?: number }> = ({
  x,
  y,
  valor,
  rot = 0,
  escala = 1,
  color = "#86EFAC",
  gris = 0,
}) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", rotate: `${rot}deg`, scale: String(escala), filter: `grayscale(${gris}) brightness(${1 - gris * 0.25})` }}>
    <svg width={260} height={130} viewBox="0 0 260 130" style={{ overflow: "visible", filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.35))" }}>
      <rect x={4} y={4} width={252} height={122} rx={14} fill={color} stroke={COLORS.navy} strokeWidth={6} />
      <rect x={18} y={18} width={224} height={94} rx={8} fill="none" stroke="#166534" strokeWidth={3} opacity={0.6} />
      <circle cx={62} cy={65} r={28} fill="none" stroke="#166534" strokeWidth={5} />
      <text x={62} y={76} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={32} fill="#166534">
        $
      </text>
      <text x={160} y={80} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={valor.length > 7 ? 34 : 44} fill={COLORS.navy}>
        {valor}
      </text>
    </svg>
  </div>
);

/** Fajo de billetes con etiqueta grande de valor. */
const Fajo: React.FC<{ x: number; y: number; texto: string; escala?: number; golpe?: number; color?: string }> = ({ x, y, texto, escala = 1, golpe = 0, color = COLORS.gold }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(escala * (1 + golpe * 0.1)) }}>
    <svg width={420} height={220} viewBox="0 0 420 220" style={{ overflow: "visible", filter: "drop-shadow(0 16px 24px rgba(0,0,0,0.4))" }}>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={20 + i * 4} y={120 - i * 18} width={380} height={86} rx={14} fill={i % 2 ? "#4ADE80" : "#86EFAC"} stroke={COLORS.navy} strokeWidth={5} />
      ))}
      <rect x={170} y={60} width={56} height={150} fill={COLORS.paper} stroke={COLORS.navy} strokeWidth={4} />
    </svg>
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: -54,
        translate: "-50% 0",
        background: COLORS.white,
        border: `6px solid ${COLORS.navy}`,
        borderRadius: 18,
        padding: "4px 24px",
        fontFamily,
        fontWeight: 900,
        fontSize: 82,
        color,
        whiteSpace: "nowrap",
        WebkitTextStroke: `2px ${COLORS.navy}`,
        boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
      }}
    >
      {texto}
    </div>
  </div>
);

/** Sello de goma rojo «−000», con caritas opcionales (se encoge de hombros). */
const Sello: React.FC<{ x: number; y: number; escala?: number; cara?: boolean; encoge?: number; rot?: number }> = ({ x, y, escala = 1, cara = false, encoge = 0, rot = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -100%", scale: String(escala), rotate: `${rot}deg`, transformOrigin: "50% 100%" }}>
    <svg width={260} height={300} viewBox="0 0 260 300" style={{ overflow: "visible", filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.4))" }}>
      <ellipse cx={130} cy={50} rx={52} ry={44} fill={COLORS.choco} stroke={COLORS.navy} strokeWidth={6} />
      <rect x={108} y={80} width={44} height={100} rx={12} fill={COLORS.chocoLight} stroke={COLORS.navy} strokeWidth={6} />
      <rect x={20} y={176} width={220} height={62} rx={12} fill="#6B7280" stroke={COLORS.navy} strokeWidth={6} />
      <rect x={14} y={236} width={232} height={58} rx={10} fill={COLORS.red} stroke={COLORS.navy} strokeWidth={6} />
      <text x={130} y={281} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={50} fill={COLORS.white}>
        −000
      </text>
      {cara ? (
        <g>
          <circle cx={112} cy={46} r={7} fill={COLORS.white} />
          <circle cx={148} cy={46} r={7} fill={COLORS.white} />
          <circle cx={112} cy={47} r={3.5} fill={COLORS.navy} />
          <circle cx={148} cy={47} r={3.5} fill={COLORS.navy} />
          <path d="M116 66 Q130 60 144 66" stroke={COLORS.white} strokeWidth={5} fill="none" strokeLinecap="round" />
          {/* bracitos encogiéndose de hombros */}
          <path d={`M20 206 L${-20} ${190 - encoge * 40} L${-40} ${170 - encoge * 30}`} stroke={COLORS.navy} strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d={`M240 206 L${280} ${190 - encoge * 40} L${300} ${170 - encoge * 30}`} stroke={COLORS.navy} strokeWidth={10} fill="none" strokeLinecap="round" />
        </g>
      ) : null}
    </svg>
  </div>
);

/** Colchón con billetes asomando; cruje (se aplasta) con el seno. */
const Colchon: React.FC<{ x: number; y: number; billetes?: number; aplasta?: number }> = ({ x, y, billetes = 6, aplasta = 0 }) => {
  const t = useSeg();
  return (
    <div style={{ position: "absolute", left: x - 330, top: y - 190, width: 660, height: 190 }}>
      {Array.from({ length: billetes }, (_, i) => (
        <Billete key={i} x={70 + i * 100} y={40 + Math.sin(t * 3 + i) * 6} valor="100,000" rot={-20 + i * 9} escala={0.55} />
      ))}
      <svg width={660} height={190} viewBox="0 0 660 190" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g transform={`translate(0 ${aplasta * 10}) scale(1 ${1 - aplasta * 0.08})`} style={{ transformOrigin: "330px 190px" }}>
          <rect x={10} y={50} width={640} height={120} rx={46} fill="#E0E7FF" stroke={COLORS.navy} strokeWidth={6} />
          {[120, 230, 340, 450, 560].map((cx) => (
            <circle key={cx} cx={cx} cy={110} r={8} fill={COLORS.light} stroke={COLORS.navy} strokeWidth={3} />
          ))}
          <path d="M30 80 Q330 60 630 80" stroke={COLORS.light} strokeWidth={6} fill="none" />
        </g>
        <rect x={40} y={170} width={20} height={20} fill={COLORS.choco} />
        <rect x={600} y={170} width={20} height={20} fill={COLORS.choco} />
      </svg>
    </div>
  );
};

const Banco: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={300} height={260} viewBox="0 0 300 260" style={{ position: "absolute", left: x - 150, top: y - 260, opacity: 0.9 }}>
    <path d="M20 90 L150 20 L280 90 Z" fill={COLORS.light} stroke={COLORS.navy} strokeWidth={6} strokeLinejoin="round" />
    {[50, 105, 160, 215].map((cx) => (
      <rect key={cx} x={cx} y={100} width={34} height={120} rx={6} fill={COLORS.white} stroke={COLORS.navy} strokeWidth={5} />
    ))}
    <rect x={14} y={220} width={272} height={30} rx={6} fill={COLORS.light} stroke={COLORS.navy} strokeWidth={6} />
    <text x={150} y={78} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={30} fill={COLORS.navy}>
      BANCO
    </text>
  </svg>
);

/** Polilla «INFLACIÓN»: aletea, se infla con `infla` (0–1). */
const Polilla: React.FC<{ x: number; y: number; escala?: number; infla?: number; saluda?: boolean; boca?: boolean }> = ({ x, y, escala = 1, infla = 0, saluda = false, boca = false }) => {
  const frame = useCurrentFrame();
  const ala = Math.sin(frame * 1.1) * 28;
  const s = escala * (1 + infla * 0.7);
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(s) }}>
      <svg width={360} height={300} viewBox="-180 -150 360 300" style={{ overflow: "visible", filter: "drop-shadow(0 14px 20px rgba(0,0,0,0.4))" }}>
        <g transform={`rotate(${-ala})`}>
          <ellipse cx={-90} cy={-30} rx={90} ry={60} fill="#C084FC" stroke={COLORS.navy} strokeWidth={5} />
          <circle cx={-100} cy={-36} r={18} fill={MORADO} opacity={0.7} />
        </g>
        <g transform={`rotate(${ala})`}>
          <ellipse cx={90} cy={-30} rx={90} ry={60} fill="#C084FC" stroke={COLORS.navy} strokeWidth={5} />
          <circle cx={100} cy={-36} r={18} fill={MORADO} opacity={0.7} />
        </g>
        <ellipse cx={0} cy={20} rx={58 + infla * 20} ry={82 + infla * 10} fill={MORADO} stroke={COLORS.navy} strokeWidth={5} />
        <rect x={-52 - infla * 16} y={14} width={104 + infla * 32} height={36} rx={8} fill={COLORS.white} stroke={COLORS.navy} strokeWidth={3} />
        <text x={0} y={41} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={20 + infla * 4} fill={MORADO}>
          INFLACIÓN
        </text>
        <circle cx={0} cy={-70} r={42} fill={MORADO} stroke={COLORS.navy} strokeWidth={5} />
        <path d="M-16 -106 Q-30 -140 -46 -136 M16 -106 Q30 -140 46 -136" stroke={COLORS.navy} strokeWidth={5} fill="none" strokeLinecap="round" />
        <circle cx={-15} cy={-76} r={11} fill={COLORS.white} />
        <circle cx={15} cy={-76} r={11} fill={COLORS.white} />
        <circle cx={-13} cy={-74} r={5} fill={COLORS.navy} />
        <circle cx={17} cy={-74} r={5} fill={COLORS.navy} />
        {boca ? <ellipse cx={0} cy={-50} rx={14} ry={11} fill={COLORS.navy} /> : <path d="M-14 -54 Q0 -42 14 -54" stroke={COLORS.navy} strokeWidth={5} fill="none" strokeLinecap="round" />}
        {saluda ? <path d={`M50 0 L100 ${-50 + Math.sin(frame * 0.5) * 16}`} stroke={COLORS.navy} strokeWidth={9} strokeLinecap="round" /> : null}
      </svg>
    </div>
  );
};

/* ---------- Escenas ---------- */

/** El gancho: Don Chema abraza su millón y el sello cae. También es el final del bucle. */
const Gancho: React.FC<{ congelar?: boolean }> = ({ congelar }) => {
  const t = useSeg();
  const CAE = congelar ? -1 : 0.35;
  const cae = congelar ? 0 : interpolate(t, [0, CAE], [0, 1], { ...clamp, easing: (x) => x * x });
  const golpe = !congelar && t > CAE && t < CAE + 0.3 ? Math.sin(((t - CAE) / 0.3) * Math.PI) : 0;
  const pegado = !congelar && t >= CAE;
  const sube = pegado ? interpolate(t, [CAE + 0.25, CAE + 0.7], [0, 1], { ...clamp, easing: easeOut }) : 0;
  const selloY = pegado ? 880 - sube * 260 : interpolate(cae, [0, 1], [740, 880]);
  return (
    <>
      <Escenario tipo="interior" />
      <Rotulo texto="En 1993 a este señor le quitaron **tres ceros**" delay={congelar ? -2 : -0.5} size={58} />
      <Personaje x={330} y={SUELO_Y} escala={1.75} {...CHEMA} expresion={pegado ? "sorpresa" : "feliz"} pose="abraza" mirar="der" />
      <Fajo x={680} y={980} texto={pegado ? "$1,000" : "$1,000,000"} golpe={golpe} color={pegado ? COLORS.red : "#16A34A"} escala={0.95} />
      <Sello x={680} y={selloY} escala={0.9} rot={pegado ? 0 : -8 + cae * 8} />
    </>
  );
};

const Hook = () => {
  const t = useSeg();
  return (
    <Escena sinEntrada luz="#7C2D12" sacudidas={[0.35]}>
      <Gancho />
      <Sfx s="impacto" volumen={0.55} en={0.35} />
      <Chispas en={0.35} x={680} y={960} color={COLORS.red} n={12} />
      {t > 1.1 ? <Bocadillo texto="¿¡Y mis ceros!?" x={330} y={560} ancho={380} size={44} delay={1.1} colaX={-30} /> : null}
    </Escena>
  );
};

const ColchonEsc = () => {
  const t = useSeg();
  const brinca = Math.abs(Math.sin(t * Math.PI * 1.6));
  return (
    <Escena luz="#1E3A8A" sonidoEntrada="swoosh">
      <Escenario tipo="interior" />
      <Rotulo texto="«Mi lana, **en mi colchón**»" size={62} />
      <Banco x={860} y={820} />
      <Colchon x={420} y={SUELO_Y} aplasta={brinca} />
      <Personaje x={400} y={SUELO_Y - 120 - brinca * 40} escala={1.45} {...CHEMA} expresion="feliz" pose="senala" mirar="der" />
      {t > 0.9 ? <Bocadillo texto="¡Bancos, bah! 😝" x={790} y={460} ancho={400} size={44} delay={0.9} colaX={-140} /> : null}
      <Sfx s="pop" volumen={0.35} en={0.9} />
      <Extra s="rayon" en={0.4} volumen={0.18} rate={1.6} />
    </Escena>
  );
};

const Calendario = () => {
  const t = useSeg();
  const ARRANCA = 0.6;
  const vuela = interpolate(t, [ARRANCA, ARRANCA + 0.7], [0, 1], { ...clamp, easing: (x) => x * x });
  const ENCOGE = 1.6;
  const enc = interpolate(t, [ENCOGE, ENCOGE + 0.7], [0, 1], { ...clamp, easing: easeOut });
  const temblor = enc > 0 && enc < 1 ? Math.sin(t * 70) * 10 : 0;
  return (
    <Escena luz="#7C2D12" sonidoEntrada="whoosh">
      <Escenario tipo="interior" />
      <Rotulo texto="1 ene 1993: **$1,000** viejos = **N$1**" size={58} />
      {/* calendario */}
      <div style={{ position: "absolute", left: 540, top: 470, translate: "-50% 0", width: 420, height: 300 }}>
        <div style={{ position: "absolute", inset: 0, background: COLORS.white, border: `6px solid ${COLORS.navy}`, borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 900, fontSize: 54, color: COLORS.navy, textAlign: "center" }}>
          ¡NUEVO PESO!
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: COLORS.paper,
            border: `6px solid ${COLORS.navy}`,
            borderRadius: 22,
            overflow: "hidden",
            fontFamily,
            textAlign: "center",
            translate: `${vuela * 520}px ${vuela * 900}px`,
            rotate: `${vuela * 70}deg`,
            opacity: 1 - vuela * 0.3,
          }}
        >
          <div style={{ background: COLORS.red, color: COLORS.white, fontSize: 52, fontWeight: 900, padding: "6px 0" }}>ENE 1993</div>
          <div style={{ fontSize: 170, fontWeight: 900, color: COLORS.navy, lineHeight: 1.1 }}>1</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, translate: `${temblor}px 0px` }}>
        <Fajo x={620} y={1010} texto={enc < 0.5 ? "$1,000,000" : "N$1,000"} escala={1 - enc * 0.35} color={enc < 0.5 ? "#16A34A" : COLORS.blue} />
      </div>
      <Personaje x={230} y={SUELO_Y} escala={1.4} {...CHEMA} expresion={t < ENCOGE ? "neutral" : "sorpresa"} pose={t < ENCOGE ? "quieto" : "brazos-arriba"} mirar="der" />
      <Sfx s="swoosh" volumen={0.4} en={ARRANCA} />
      <Extra s="rebobina" en={ENCOGE} volumen={0.35} rate={0.7} />
    </Escena>
  );
};

const Linterna = () => {
  const t = useSeg();
  const barre = Math.sin(t * 2.6) * 22;
  const ENCOGE = 1.5;
  const encoge = interpolate(t, [ENCOGE, ENCOGE + 0.3, ENCOGE + 0.9, ENCOGE + 1.2], [0, 1, 1, 0], clamp);
  const sello = interpolate(t, [ENCOGE - 0.6, ENCOGE - 0.2], [0, 1], { ...clamp, easing: easeOut });
  return (
    <Escena luz="#0F172A" sonidoEntrada="whoosh">
      <Escenario tipo="interior" />
      <AbsoluteFill style={{ background: "rgba(2,6,23,0.72)" }} />
      <Rotulo texto="Con **N$1,000** compraba **lo mismo**" size={60} />
      <Colchon x={540} y={SUELO_Y - 20} billetes={0} />
      {/* haz de luz */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="haz" cx="0" cy="0.5" r="1">
            <stop offset="0" stopColor="#FEF3C7" stopOpacity={0.85} />
            <stop offset="1" stopColor="#FEF3C7" stopOpacity={0} />
          </radialGradient>
        </defs>
        <g transform={`rotate(${barre + 18} 330 1010)`}>
          <path d="M330 1010 L860 900 L860 1140 Z" fill="url(#haz)" />
        </g>
      </svg>
      <Personaje x={230} y={SUELO_Y} escala={1.4} {...CHEMA} expresion="preocupado" pose="senala" mirar="der" />
      <div style={{ position: "absolute", left: 300, top: 990, width: 70, height: 34, background: "#374151", border: `4px solid ${COLORS.navy}`, borderRadius: 8, rotate: `${barre + 18}deg` }} />
      {t > 0.4 ? <Bocadillo texto="¿Dónde quedaron?" x={330} y={560} ancho={380} size={42} delay={0.4} piensa colaX={-40} /> : null}
      <div style={{ opacity: sello }}>
        <Sello x={830} y={880} escala={0.75 + sello * 0.1} cara encoge={encoge} rot={Math.sin(t * 3) * 4} />
      </div>
      {t > ENCOGE ? <Bocadillo texto="Yo solo cambié el número 🤷" x={760} y={470} ancho={430} size={40} delay={ENCOGE} colaX={60} /> : null}
      <Sfx s="pop" volumen={0.4} en={ENCOGE - 0.5} />
      <Sfx s="pop" volumen={0.35} en={ENCOGE} />
    </Escena>
  );
};

const PolillaEsc = () => {
  const t = useSeg();
  const SALE = 0.3;
  const sale = interpolate(t, [SALE, SALE + 0.6], [0, 1], { ...clamp, easing: easeOut });
  const COME = [0.9, 1.3, 1.7, 2.1, 2.5];
  const comidos = COME.filter((c) => t > c).length;
  const infla = interpolate(t, [0.9, 2.8], [0, 1], clamp);
  const ERUCTA = 3.3;
  const px = 640 + Math.sin(t * 2) * 30;
  const py = interpolate(sale, [0, 1], [1150, 760]) + Math.sin(t * 4) * 14;
  const masca = t > 0.8 && t < 2.8 && Math.floor(t * 8) % 2 === 0;
  return (
    <Escena luz="#581C87" sacudidas={[ERUCTA]}>
      <Escenario tipo="interior" />
      <AbsoluteFill style={{ background: "rgba(59,7,100,0.35)" }} />
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", fontFamily }}>
        <div style={{ fontSize: 50, fontWeight: 900, color: COLORS.white, background: "rgba(15,23,42,0.8)", padding: "8px 26px", borderRadius: 18 }}>1987: los precios en un año</div>
        <div style={{ fontSize: 150, fontWeight: 900, color: "#F87171", lineHeight: 1.05, background: "rgba(15,23,42,0.85)", borderRadius: 30, padding: "0 36px", marginTop: 14, textShadow: "0 0 40px rgba(220,38,38,0.6)", scale: String(1 + (t > 2.8 && t < 3.1 ? 0.1 : 0)) }}>
          +{Math.round(interpolate(t, [0.9, 2.8], [0, 159], clamp))} %
        </div>
      </div>
      <Colchon x={540} y={SUELO_Y} billetes={5 - comidos} />
      <Personaje x={170} y={SUELO_Y} escala={1.2} {...CHEMA} expresion={t < ERUCTA ? "sorpresa" : "triste"} pose="brazos-arriba" mirar="der" />
      <Polilla x={px} y={py} escala={0.9 * (0.4 + sale * 0.6)} infla={infla} boca={masca || (t > ERUCTA && t < ERUCTA + 0.6)} />
      {t > ERUCTA ? <Bocadillo texto="¡BURP!" x={820} y={560} ancho={260} size={56} delay={ERUCTA} colaX={-60} /> : null}
      {COME.map((c) => (
        <Sfx key={c} s="pop" volumen={0.3} en={c} />
      ))}
      <Extra s="bombo" en={ERUCTA} volumen={0.5} rate={0.6} />
      <Chispas en={ERUCTA} x={700} y={640} color="#C084FC" n={12} />
    </Escena>
  );
};

const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const CORTE = Math.round(2.4 * fps);
  const CAE = 0.5;
  const cae = interpolate(t, [0, CAE], [0, 1], { ...clamp, easing: (x) => x * x });
  const pegado = t >= CAE;
  const gris = interpolate(t, [CAE, CAE + 1.6], [0, 0.45], clamp);
  const vuelta = interpolate(frame, [dur - 10, dur - 2], [0, 1], clamp);
  return (
    <>
      <Sequence durationInFrames={CORTE} layout="none">
        <Escena luz="#7C2D12" sonidoEntrada="swoosh" sacudidas={[CAE]}>
          <Escenario tipo="interior" />
          <Rotulo texto="Te los quita **la inflación**, poquito a poco" size={58} />
          <Billete x={540} y={960} valor="$500" escala={1.9} gris={gris} />
          <Sello x={540} y={pegado ? 860 - interpolate(t, [CAE + 0.2, CAE + 0.6], [0, 300], clamp) : interpolate(cae, [0, 1], [500, 860])} escala={0.75} />
          <Polilla x={860} y={640} escala={0.55} saluda />
          <Sfx s="impacto" volumen={0.45} en={CAE} />
        </Escena>
      </Sequence>
      <Sequence from={CORTE} layout="none">
        <CtaCrecer tipo="comentar" boton="¿Se acuerdan? 👇" linea="Pregúntale a tus papás por el billete de **100 mil**" />
        <div style={{ position: "absolute", top: 1272, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 28, fontWeight: 700, color: COLORS.navy }}>
          Contenido informativo, no es asesoramiento financiero.
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
  { id: "colchon", render: () => <ColchonEsc /> },
  { id: "calendario", render: () => <Calendario /> },
  { id: "linterna", render: () => <Linterna /> },
  { id: "polilla", render: () => <PolillaEsc /> },
  { id: "cta", subtitulosClaros: true, render: ({ dur }) => <Cta dur={dur} /> },
];

export const W4919: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4919} pista="quiet-courtyard.mp3" /> : null;
