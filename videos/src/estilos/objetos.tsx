// OBJETOS CON CARA: el reparto de las series (telenovela, noticiero, juicio, entrevista a un objeto…).
// Un objeto con cara se lee como un rostro y el conflicto se entiende en un segundo (investigacion/MEXICO-VIRAL.md,
// A5). Siempre el mismo diseño para cada personaje: así la gente los reconoce de un vídeo a otro.
//   La Tarjeta (villana seductora) · El Aguinaldo (billete galán e ingenuo) · El Cochinito (alcancía dramática)
//   · La Quincena (bolsa de dinero, celebridad que se va en 2 días)
import React from "react";
import { useCurrentFrame } from "remotion";

export type Gesto = "feliz" | "coqueta" | "sorpresa" | "llora" | "enojo" | "triste" | "malvada" | "neutral";

/** Cara genérica: ojos, cejas, pestañas y boca que habla. Se pone encima de cualquier forma. */
export const Cara: React.FC<{ x: number; y: number; escala?: number; gesto?: Gesto; habla?: boolean; pestanas?: boolean; semilla?: number }> = ({
  x,
  y,
  escala = 1,
  gesto = "neutral",
  habla = false,
  pestanas = false,
  semilla = 0,
}) => {
  const f = useCurrentFrame() + semilla * 17;
  const parpadeo = f % 97 < 4 ? 0.15 : 1;
  const boca = habla ? 0.35 + 0.65 * Math.abs(Math.sin(f * 0.55)) : 0;
  const ojoY = gesto === "sorpresa" ? 1.25 : gesto === "malvada" || gesto === "coqueta" ? 0.6 : 1;
  const ceja: Record<Gesto, number> = { feliz: 0, coqueta: -8, sorpresa: -14, llora: 12, enojo: 18, triste: 12, malvada: 16, neutral: 0 };
  const c = ceja[gesto];
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      {/* ojos */}
      {[-38, 38].map((dx, i) => (
        <g key={i}>
          <ellipse cx={dx} cy={0} rx={22} ry={28 * ojoY * parpadeo} fill="#fff" stroke="#111" strokeWidth={5} />
          <circle cx={dx + (gesto === "coqueta" ? 6 : 2)} cy={4 * ojoY} r={11 * Math.min(1, parpadeo * 2)} fill="#111" />
          <circle cx={dx + 6} cy={-2} r={4 * Math.min(1, parpadeo * 2)} fill="#fff" />
          <path d={`M ${dx - 24} ${-40 - (i ? -c : c) * 0.4} L ${dx + 24} ${-40 + (i ? -c : c) * 0.4}`} stroke="#111" strokeWidth={7} strokeLinecap="round" transform={i ? "" : `scale(-1 1) translate(${-2 * dx} 0)`} />
          {pestanas ? <path d={`M ${dx - 22} -18 l -12 -12 M ${dx} -28 l 0 -14 M ${dx + 22} -18 l 12 -12`} stroke="#111" strokeWidth={5} strokeLinecap="round" /> : null}
        </g>
      ))}
      {gesto === "llora" ? (
        <>
          <path d={`M -38 30 q -6 ${20 + (f % 20)} 0 ${40 + (f % 20)}`} stroke="#60A5FA" strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d={`M 38 30 q 6 ${20 + ((f + 9) % 20)} 0 ${40 + ((f + 9) % 20)}`} stroke="#60A5FA" strokeWidth={10} fill="none" strokeLinecap="round" />
        </>
      ) : null}
      {/* boca */}
      {habla || gesto === "sorpresa" ? (
        <ellipse cx={0} cy={58} rx={gesto === "sorpresa" ? 18 : 24} ry={gesto === "sorpresa" ? 22 : 4 + 18 * boca} fill="#7F1D1D" stroke="#111" strokeWidth={5} />
      ) : gesto === "triste" || gesto === "llora" ? (
        <path d="M -26 66 Q 0 44 26 66" stroke="#111" strokeWidth={7} fill="none" strokeLinecap="round" />
      ) : gesto === "enojo" ? (
        <path d="M -24 60 L 24 60" stroke="#111" strokeWidth={8} strokeLinecap="round" />
      ) : (
        <path d={gesto === "malvada" ? "M -30 50 Q 0 78 34 46" : "M -26 50 Q 0 76 26 50"} stroke="#111" strokeWidth={7} fill="none" strokeLinecap="round" />
      )}
    </g>
  );
};

type PropsObjeto = { x: number; y: number; escala?: number; gesto?: Gesto; habla?: boolean; rot?: number };

const Svg: React.FC<{ x: number; y: number; w: number; h: number; escala: number; rot: number; children: React.ReactNode }> = ({ x, y, w, h, escala, rot, children }) => (
  <svg
    width={w}
    height={h}
    viewBox={`0 0 ${w} ${h}`}
    style={{ position: "absolute", left: x - (w * escala) / 2, top: y - (h * escala) / 2, width: w * escala, height: h * escala, rotate: `${rot}deg`, overflow: "visible", filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.35))" }}
  >
    {children}
  </svg>
);

/** La Tarjeta: dorada, con pestañas, siempre coqueta o malvada. */
export const Tarjeta: React.FC<PropsObjeto> = ({ x, y, escala = 1, gesto = "coqueta", habla, rot = -6 }) => (
  <Svg x={x} y={y} w={460} h={300} escala={escala} rot={rot}>
    <rect x={5} y={5} width={450} height={290} rx={32} fill="url(#oroT)" stroke="#111" strokeWidth={8} />
    <defs>
      <linearGradient id="oroT" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FDE68A" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <rect x={40} y={50} width={70} height={52} rx={10} fill="#FEF3C7" stroke="#111" strokeWidth={5} />
    <text x={40} y={262} fontFamily="monospace" fontWeight={900} fontSize={26} fill="#78350F">
      •••• 0000
    </text>
    <text x={200} y={262} fontFamily="Arial, sans-serif" fontWeight={900} fontSize={24} fill="#7C2D12">
      ¡SIN INTERESES!*
    </text>
    <Cara x={300} y={120} escala={0.9} gesto={gesto} habla={habla} pestanas semilla={1} />
  </Svg>
);

/** El Aguinaldo: billete verde, galán ingenuo con copete. */
export const Aguinaldo: React.FC<PropsObjeto> = ({ x, y, escala = 1, gesto = "feliz", habla, rot = 4 }) => (
  <Svg x={x} y={y} w={460} h={260} escala={escala} rot={rot}>
    <rect x={5} y={5} width={450} height={250} rx={18} fill="#86EFAC" stroke="#111" strokeWidth={8} />
    <rect x={28} y={28} width={404} height={204} rx={12} fill="none" stroke="#15803D" strokeWidth={5} strokeDasharray="14 10" />
    <text x={44} y={86} fontFamily="Georgia, serif" fontWeight={900} fontSize={54} fill="#14532D">
      $
    </text>
    <text x={420} y={218} textAnchor="end" fontFamily="Georgia, serif" fontWeight={900} fontSize={30} fill="#14532D">
      AGUINALDO
    </text>
    <path d="M 190 40 q 40 -60 90 -10 q -40 -10 -60 20" fill="#111" />
    <Cara x={235} y={125} escala={0.85} gesto={gesto} habla={habla} semilla={2} />
  </Svg>
);

/** El Cochinito: alcancía rosa, dramática, con ranura. */
export const Cochinito: React.FC<PropsObjeto> = ({ x, y, escala = 1, gesto = "triste", habla, rot = 0 }) => (
  <Svg x={x} y={y} w={420} h={360} escala={escala} rot={rot}>
    <ellipse cx={210} cy={200} rx={190} ry={140} fill="#F9A8D4" stroke="#111" strokeWidth={8} />
    <path d="M 90 90 L 70 20 L 140 70 Z" fill="#F472B6" stroke="#111" strokeWidth={7} strokeLinejoin="round" />
    <path d="M 330 90 L 350 20 L 280 70 Z" fill="#F472B6" stroke="#111" strokeWidth={7} strokeLinejoin="round" />
    <rect x={170} y={66} width={80} height={14} rx={7} fill="#111" />
    <ellipse cx={210} cy={250} rx={58} ry={40} fill="#F472B6" stroke="#111" strokeWidth={6} />
    <circle cx={190} cy={250} r={9} fill="#111" />
    <circle cx={230} cy={250} r={9} fill="#111" />
    {[90, 160, 260, 330].map((px) => (
      <rect key={px} x={px - 22} y={318} width={44} height={40} rx={10} fill="#F472B6" stroke="#111" strokeWidth={6} />
    ))}
    <Cara x={210} y={160} escala={0.8} gesto={gesto} habla={habla} semilla={3} />
  </Svg>
);

/** La Quincena: bolsa de dinero con lentes de sol, celebridad. */
export const Quincena: React.FC<PropsObjeto & { lentes?: boolean }> = ({ x, y, escala = 1, gesto = "feliz", habla, rot = 0, lentes = true }) => (
  <Svg x={x} y={y} w={380} h={440} escala={escala} rot={rot}>
    <path d="M 120 110 Q 40 200 50 320 Q 70 430 190 430 Q 310 430 330 320 Q 340 200 260 110 Z" fill="#D6A35C" stroke="#111" strokeWidth={8} />
    <path d="M 130 110 Q 190 60 250 110" fill="none" stroke="#111" strokeWidth={8} />
    <path d="M 150 60 Q 190 0 230 60 Z" fill="#D6A35C" stroke="#111" strokeWidth={7} />
    <text x={150} y={390} fontFamily="Georgia, serif" fontWeight={900} fontSize={80} fill="#78350F">
      $
    </text>
    <Cara x={190} y={240} escala={0.85} gesto={gesto} habla={habla} semilla={4} />
    {lentes ? (
      <g>
        <rect x={120} y={214} width={60} height={40} rx={10} fill="#111" />
        <rect x={200} y={214} width={60} height={40} rx={10} fill="#111" />
        <line x1={180} y1={226} x2={200} y2={226} stroke="#111" strokeWidth={6} />
      </g>
    ) : null}
  </Svg>
);
