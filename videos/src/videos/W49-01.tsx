import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../brand";
import { Chispas, CtaCrecer, DefEscena, Escena, Montaje, PropsVoz, Sfx, useSpring } from "../kit";

// W49-01 · «Las 4 fugas de tu cuenta» · LISTA personificada · ilustración plana en código · CTA GUARDAR
// Un solo objeto todo el vídeo: el depósito (tu cuenta). Cuatro fugas, cuatro obreros que las tapan.
// Sin cifras. Música: lofi-polaroids. Fondo dominante: azul cobalto (Escena fondo="azul").
export const EXTRA_W4901: Record<string, number> = { hook: 0.2, rehook: 0.3, wow: 1.2, cta: 0.5, cierre: 0.6 };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useSeg = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

/* ---------- Geometría del depósito ---------- */
const TQ = { x: 300, y: 650, w: 480, h: 550 }; // tanque
const SUELO = 1250;
type Lado = "izq" | "der";
const AGUJEROS: { x: number; y: number; lado: Lado; grosor: number }[] = [
  { x: TQ.x + 6, y: 770, lado: "izq", grosor: 22 },
  { x: TQ.x + TQ.w - 6, y: 880, lado: "der", grosor: 22 },
  { x: TQ.x + 6, y: 990, lado: "izq", grosor: 40 },
  { x: TQ.x + TQ.w - 6, y: 1100, lado: "der", grosor: 24 },
];
const chorroPath = (i: number) => {
  const a = AGUJEROS[i];
  const s = a.lado === "izq" ? -1 : 1;
  const alto = SUELO - a.y;
  return `M${a.x} ${a.y} Q${a.x + s * (90 + alto * 0.25)} ${a.y + 10} ${a.x + s * (120 + alto * 0.35)} ${SUELO}`;
};

/* Chorro de agua con flujo animado; `corte` (0–1) lo apaga */
const Chorro: React.FC<{ i: number; corte: number }> = ({ i, corte }) => {
  const f = useCurrentFrame();
  const a = AGUJEROS[i];
  if (corte >= 1) return null;
  const g = a.grosor * (1 - corte);
  return (
    <g opacity={1 - corte * 0.3}>
      <path d={chorroPath(i)} stroke={COLORS.blue} strokeWidth={g} fill="none" strokeLinecap="round" />
      <path
        d={chorroPath(i)}
        stroke={COLORS.light}
        strokeWidth={g * 0.35}
        fill="none"
        strokeLinecap="round"
        strokeDasharray="30 46"
        strokeDashoffset={-f * 9}
        opacity={0.9}
      />
      {/* salpicadura en el suelo */}
      {[0, 1, 2].map((k) => {
        const p = ((f / 14 + k / 3) % 1);
        const s = a.lado === "izq" ? -1 : 1;
        const bx = a.x + s * (120 + (SUELO - a.y) * 0.35);
        return <circle key={k} cx={bx + (k - 1) * 26 * p} cy={SUELO - 30 * Math.sin(p * Math.PI)} r={(1 - p) * 9 * (1 - corte)} fill={COLORS.light} />;
      })}
    </g>
  );
};

/* Tapón (con brillo opcional) */
const Tapon: React.FC<{ i: number; s: number; brillo?: number }> = ({ i, s, brillo = 0 }) => {
  if (s <= 0.01) return null;
  const a = AGUJEROS[i];
  const r = (a.grosor * 0.75 + 12) * s;
  return (
    <g>
      {brillo > 0 ? <circle cx={a.x} cy={a.y} r={r * (1.8 + brillo)} fill={COLORS.gold} opacity={0.25 * brillo} /> : null}
      <circle cx={a.x} cy={a.y} r={r} fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={5} />
      <circle cx={a.x - r * 0.3} cy={a.y - r * 0.3} r={r * 0.25} fill={COLORS.white} opacity={0.7} />
    </g>
  );
};

/* El depósito: cristal, agua con superficie ondulada, agujeros */
const Deposito: React.FC<{ nivel: number; tapados: number[]; cortes: number[]; brilloTapones?: number; agitado?: number }> = ({
  nivel,
  tapados,
  cortes,
  brilloTapones = 0,
  agitado = 1,
}) => {
  const f = useCurrentFrame();
  const top = TQ.y + (1 - nivel) * TQ.h;
  const ola = Array.from({ length: 13 }, (_, k) => {
    const x = TQ.x + (k / 12) * TQ.w;
    const y = top + Math.sin(f / 7 + k * 0.9) * 9 * agitado;
    return `${k === 0 ? "M" : "L"}${x} ${y}`;
  }).join(" ");
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <clipPath id="tq">
          <rect x={TQ.x} y={TQ.y} width={TQ.w} height={TQ.h} rx={60} />
        </clipPath>
        <linearGradient id="agua" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B6BFF" />
          <stop offset="1" stopColor={COLORS.blue} />
        </linearGradient>
      </defs>
      {/* charco */}
      <ellipse cx={540} cy={SUELO + 8} rx={420} ry={26} fill={COLORS.deep} opacity={0.45} />
      {/* patas */}
      <rect x={TQ.x + 40} y={TQ.y + TQ.h - 10} width={34} height={SUELO - (TQ.y + TQ.h) + 10} rx={8} fill={COLORS.navy} />
      <rect x={TQ.x + TQ.w - 74} y={TQ.y + TQ.h - 10} width={34} height={SUELO - (TQ.y + TQ.h) + 10} rx={8} fill={COLORS.navy} />
      {/* cuerpo */}
      <rect x={TQ.x} y={TQ.y} width={TQ.w} height={TQ.h} rx={60} fill={COLORS.light} fillOpacity={0.18} />
      <g clipPath="url(#tq)">
        <path d={`${ola} L${TQ.x + TQ.w} ${TQ.y + TQ.h + 20} L${TQ.x} ${TQ.y + TQ.h + 20} Z`} fill="url(#agua)" />
        <path d={ola} stroke={COLORS.light} strokeWidth={6} fill="none" opacity={0.8} />
        {/* burbujas */}
        {Array.from({ length: 7 }, (_, k) => {
          const p = ((f / 60 + k / 7) % 1);
          const y = TQ.y + TQ.h - p * (TQ.y + TQ.h - top);
          return <circle key={k} cx={TQ.x + 60 + ((k * 67) % (TQ.w - 120))} cy={y} r={6 + (k % 3) * 3} fill={COLORS.white} opacity={0.35 * (1 - p)} />;
        })}
      </g>
      <rect x={TQ.x} y={TQ.y} width={TQ.w} height={TQ.h} rx={60} fill="none" stroke={COLORS.white} strokeWidth={8} opacity={0.9} />
      <path d={`M${TQ.x + 40} ${TQ.y + 70} Q${TQ.x + 30} ${TQ.y + 300} ${TQ.x + 44} ${TQ.y + 540}`} stroke={COLORS.white} strokeOpacity={0.5} strokeWidth={14} fill="none" strokeLinecap="round" />
      {/* tapa con etiqueta */}
      <rect x={TQ.x + 80} y={TQ.y - 40} width={TQ.w - 160} height={52} rx={20} fill={COLORS.navy} stroke={COLORS.white} strokeWidth={5} />
      <text x={540} y={TQ.y - 4} textAnchor="middle" fontSize={34} fontWeight={900} fill={COLORS.gold} fontFamily="Inter, sans-serif" letterSpacing={3}>
        TU CUENTA
      </text>
      {/* agujeros y chorros */}
      {AGUJEROS.map((a, i) => (
        <circle key={`h${i}`} cx={a.x} cy={a.y} r={a.grosor * 0.6 + 4} fill={COLORS.deep} />
      ))}
      {AGUJEROS.map((_, i) => (tapados.includes(i) ? null : <Chorro key={`c${i}`} i={i} corte={cortes[i] ?? 0} />))}
      {AGUJEROS.map((_, i) => (
        <Tapon key={`t${i}`} i={i} s={tapados.includes(i) ? 1 : Math.min(1, (cortes[i] ?? 0) * 1.6)} brillo={tapados.includes(i) ? brilloTapones : 0} />
      ))}
    </svg>
  );
};

/* ---------- Obrero: cuerpo redondo periwinkle, casco cobalto con número ---------- */
type Herramienta = "tapon" | "llave" | "cinta" | "posit" | null;
const Obrero: React.FC<{
  x: number;
  y: number; // pies
  n: number;
  escala?: number;
  herramienta?: Herramienta;
  mirar?: "izq" | "der" | "frente";
  anda?: boolean;
  brazo?: number; // 0 abajo … 1 arriba
  feliz?: boolean;
  sorpresa?: boolean;
  semilla?: number;
}> = ({ x, y, n, escala = 1, herramienta = null, mirar = "frente", anda = false, brazo = 0.3, feliz = true, sorpresa = false, semilla = 0 }) => {
  const f = useCurrentFrame() + semilla * 11;
  const bote = anda ? Math.abs(Math.sin(f / 4)) * 14 : Math.sin(f / 18) * 3;
  const pierna = anda ? Math.sin(f / 4) * 14 : 0;
  const parpadeo = f % 97 < 4 ? 0.15 : 1;
  const ojo = mirar === "izq" ? -7 : mirar === "der" ? 7 : 0;
  const angBrazo = -20 - brazo * 120;
  const dirB = mirar === "izq" ? -1 : 1;
  return (
    <div style={{ position: "absolute", left: x - 70 * escala, top: y - 170 * escala - bote * escala, width: 140 * escala, height: 170 * escala }}>
      <svg width={140 * escala} height={170 * escala} viewBox="-70 -170 140 170" style={{ overflow: "visible" }}>
        <ellipse cx={0} cy={-2 + bote} rx={40} ry={7} fill="#000" opacity={0.22} />
        {/* piernas */}
        <path d={`M-14 -36 L${-16 - pierna} -4`} stroke={COLORS.navy} strokeWidth={12} strokeLinecap="round" />
        <path d={`M14 -36 L${16 + pierna} -4`} stroke={COLORS.navy} strokeWidth={12} strokeLinecap="round" />
        {/* brazo libre */}
        <path d={`M${-34 * dirB} -80 L${-50 * dirB} -52`} stroke={COLORS.light} strokeWidth={12} strokeLinecap="round" />
        {/* cuerpo */}
        <circle cx={0} cy={-82} r={48} fill={COLORS.light} stroke={COLORS.navy} strokeWidth={5} />
        {/* cara */}
        <ellipse cx={-14 + ojo} cy={-88} rx={7} ry={9 * parpadeo} fill={COLORS.navy} />
        <ellipse cx={14 + ojo} cy={-88} rx={7} ry={9 * parpadeo} fill={COLORS.navy} />
        {sorpresa ? (
          <ellipse cx={ojo} cy={-62} rx={8} ry={10} fill={COLORS.navy} />
        ) : feliz ? (
          <path d={`M${-14 + ojo} -66 Q${ojo} -52 ${14 + ojo} -66`} stroke={COLORS.navy} strokeWidth={5} fill="none" strokeLinecap="round" />
        ) : (
          <path d={`M${-12 + ojo} -62 H${12 + ojo}`} stroke={COLORS.navy} strokeWidth={5} strokeLinecap="round" />
        )}
        <circle cx={-30} cy={-72} r={7} fill={COLORS.red} opacity={0.35} />
        <circle cx={30} cy={-72} r={7} fill={COLORS.red} opacity={0.35} />
        {/* casco */}
        <path d="M-50 -110 Q-48 -156 0 -158 Q48 -156 50 -110 Z" fill={COLORS.blue} stroke={COLORS.navy} strokeWidth={5} />
        <rect x={-58} y={-114} width={116} height={12} rx={6} fill={COLORS.blue} stroke={COLORS.navy} strokeWidth={4} />
        <text x={0} y={-122} textAnchor="middle" fontSize={34} fontWeight={900} fill={COLORS.white} fontFamily="Inter, sans-serif">
          {n}
        </text>
        {/* brazo con herramienta */}
        <g transform={`translate(${34 * dirB} -80) rotate(${angBrazo * dirB})`}>
          <path d={`M0 0 L${0} 36`} stroke={COLORS.light} strokeWidth={12} strokeLinecap="round" />
          <g transform="translate(0 46)">
            {herramienta === "tapon" ? <circle r={16} fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={4} /> : null}
            {herramienta === "llave" ? (
              <g>
                <rect x={-5} y={-4} width={10} height={40} rx={4} fill={COLORS.grey} stroke={COLORS.navy} strokeWidth={3} />
                <path d="M-14 36 A14 14 0 1 0 14 36 L6 36 L6 44 L-6 44 L-6 36 Z" fill={COLORS.grey} stroke={COLORS.navy} strokeWidth={3} />
              </g>
            ) : null}
            {herramienta === "cinta" ? (
              <g>
                <circle r={16} fill={COLORS.white} stroke={COLORS.navy} strokeWidth={4} />
                <circle r={6} fill={COLORS.light} stroke={COLORS.navy} strokeWidth={3} />
              </g>
            ) : null}
            {herramienta === "posit" ? <rect x={-16} y={-16} width={32} height={32} rx={3} fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={3} /> : null}
          </g>
        </g>
      </svg>
    </div>
  );
};

/* Escalera junto a un agujero */
const Escalera: React.FC<{ i: number; s?: number }> = ({ i, s = 1 }) => {
  const a = AGUJEROS[i];
  const xs = a.lado === "izq" ? 150 : 930;
  const alto = (SUELO - a.y + 60) * s;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <g opacity={Math.min(1, s * 1.3)}>
        <line x1={xs - 40} y1={SUELO} x2={xs - 40} y2={SUELO - alto} stroke={COLORS.chocoLight} strokeWidth={10} strokeLinecap="round" />
        <line x1={xs + 40} y1={SUELO} x2={xs + 40} y2={SUELO - alto} stroke={COLORS.chocoLight} strokeWidth={10} strokeLinecap="round" />
        {Array.from({ length: Math.floor(alto / 60) }, (_, k) => (
          <line key={k} x1={xs - 40} x2={xs + 40} y1={SUELO - 30 - k * 60} y2={SUELO - 30 - k * 60} stroke={COLORS.chocoLight} strokeWidth={8} />
        ))}
      </g>
    </svg>
  );
};
const posEscalera = (i: number) => {
  const a = AGUJEROS[i];
  return { x: a.lado === "izq" ? 150 : 930, y: a.y + 85, mirar: (a.lado === "izq" ? "der" : "izq") as "izq" | "der" };
};

/* ---------- Cartel de la lista (arriba) + marcador de 4 fugas ---------- */
const Cartel: React.FC<{ n?: number; texto: string; tapados: number[]; nuevo?: number; color?: string; delay?: number }> = ({
  n,
  texto,
  tapados,
  nuevo,
  color = COLORS.white,
  delay = 0.05,
}) => {
  const s = useSpring(delay, 12, 0.6);
  const sn = useSpring(nuevo !== undefined ? 0.6 : 99, 9, 0.6);
  return (
    <div style={{ position: "absolute", top: 240, left: 90, right: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          background: color,
          borderRadius: 30,
          padding: "16px 34px 16px 18px",
          boxShadow: "0 18px 40px rgba(0,0,0,0.3)",
          translate: `${(1 - s) * -200}px 0px`,
          opacity: Math.min(1, s * 1.5),
          rotate: `${(1 - s) * -4 - 1}deg`,
          maxWidth: 870,
        }}
      >
        {n !== undefined ? (
          <div style={{ minWidth: 86, height: 86, borderRadius: 43, background: COLORS.blue, color: COLORS.white, fontSize: 56, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {n}
          </div>
        ) : null}
        <div style={{ fontSize: 54, fontWeight: 900, color: COLORS.navy, lineHeight: 1.08 }}>{texto}</div>
      </div>
      <div style={{ display: "flex", gap: 18 }}>
        {[0, 1, 2, 3].map((k) => {
          const ok = tapados.includes(k) || (nuevo === k && sn > 0.5);
          const sc = nuevo === k ? 1 + 0.3 * Math.sin(Math.min(1, sn) * Math.PI) : 1;
          return (
            <div
              key={k}
              style={{
                width: 62,
                height: 62,
                borderRadius: 31,
                background: ok ? COLORS.green : "rgba(255,255,255,0.15)",
                border: `4px solid ${ok ? COLORS.white : COLORS.light}`,
                color: COLORS.white,
                fontSize: 34,
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                scale: String(sc),
              }}
            >
              {ok ? "✓" : k + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* Zoom suave hacia un agujero (el cartel queda fuera) */
const Enfoque: React.FC<{ i?: number; z?: number; children: React.ReactNode }> = ({ i, z = 1.14, children }) => {
  const t = useSeg();
  if (i === undefined) return <>{children}</>;
  const a = AGUJEROS[i];
  const p = interpolate(t, [0, 1.2], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  const zz = 1 + (z - 1) * p;
  return <div style={{ position: "absolute", inset: 0, scale: String(zz), transformOrigin: `${a.x}px 600px` }}>{children}</div>;
};

/* Iconos que salen del chorro (play / nota / moneda) */
const Arrastre: React.FC<{ i: number; tipo: "suscripcion" | "moneda" }> = ({ i, tipo }) => {
  const f = useCurrentFrame();
  const a = AGUJEROS[i];
  const s = a.lado === "izq" ? -1 : 1;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {Array.from({ length: 4 }, (_, k) => {
        const p = ((f / 40 + k / 4) % 1);
        const alto = SUELO - a.y;
        const x = a.x + s * (p * (120 + alto * 0.35));
        const y = a.y + alto * p * p + 10 * Math.sin(p * 3);
        const rot = p * 200 * s;
        return (
          <g key={k} transform={`translate(${x} ${y}) rotate(${rot})`} opacity={p < 0.9 ? 1 : (1 - p) * 10}>
            {tipo === "moneda" ? (
              <>
                <circle r={22} fill={COLORS.gold} stroke={COLORS.choco} strokeWidth={4} />
                <text y={9} textAnchor="middle" fontSize={24} fontWeight={900} fill={COLORS.choco} fontFamily="Inter, sans-serif">€</text>
              </>
            ) : k % 2 ? (
              <>
                <rect x={-26} y={-20} width={52} height={40} rx={10} fill={COLORS.red} stroke={COLORS.navy} strokeWidth={4} />
                <path d="M-6 -9 L10 0 L-6 9 Z" fill={COLORS.white} />
              </>
            ) : (
              <>
                <circle r={24} fill={COLORS.green} stroke={COLORS.navy} strokeWidth={4} />
                <path d="M-6 8 V-10 L10 -14 V4" stroke={COLORS.white} strokeWidth={4} fill="none" />
                <circle cx={-9} cy={8} r={4} fill={COLORS.white} />
                <circle cx={7} cy={4} r={4} fill={COLORS.white} />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};

/* Calendario que pasa hojas solo */
const Calendario: React.FC<{ x: number; y: number; posit?: number }> = ({ x, y, posit = 0 }) => {
  const f = useCurrentFrame();
  const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  const parado = posit > 0;
  const k = parado ? 10 : Math.floor(f / 9) % 12;
  const hoja = parado ? 0 : (f % 9) / 9;
  return (
    <div style={{ position: "absolute", left: x - 100, top: y - 120, width: 200, height: 220 }}>
      <svg width={200} height={220} viewBox="0 0 200 220" style={{ overflow: "visible" }}>
        <rect x={10} y={20} width={180} height={190} rx={18} fill={COLORS.white} stroke={COLORS.navy} strokeWidth={5} />
        <rect x={10} y={20} width={180} height={56} rx={18} fill={COLORS.red} stroke={COLORS.navy} strokeWidth={5} />
        <text x={100} y={62} textAnchor="middle" fontSize={34} fontWeight={900} fill={COLORS.white} fontFamily="Inter, sans-serif">{meses[k]}</text>
        <text x={100} y={168} textAnchor="middle" fontSize={78} fontWeight={900} fill={COLORS.navy} fontFamily="Inter, sans-serif">↻</text>
        {!parado ? (
          <path d={`M14 ${76 + 130 * hoja} H186 V206 H14 Z`} fill={COLORS.paper} opacity={0.9 * (1 - hoja)} />
        ) : null}
        {posit > 0 ? (
          <g transform={`translate(120 120) rotate(8) scale(${posit})`}>
            <rect x={-46} y={-46} width={92} height={92} rx={6} fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={4} />
            <circle r={26} fill="none" stroke={COLORS.red} strokeWidth={6} />
          </g>
        ) : null}
        <rect x={46} y={6} width={14} height={34} rx={6} fill={COLORS.navy} />
        <rect x={140} y={6} width={14} height={34} rx={6} fill={COLORS.navy} />
      </svg>
    </div>
  );
};

/* Móvil con tarjeta y botón «comprar» que se pulsa solo */
const Movil: React.FC<{ x: number; y: number; sacar?: number }> = ({ x, y, sacar = 0 }) => {
  const f = useCurrentFrame();
  const pulsa = sacar > 0 ? 0 : (f % 24) < 5 ? 1 : 0;
  return (
    <div style={{ position: "absolute", left: x - 110, top: y - 200, width: 220, height: 400 }}>
      <svg width={220} height={400} viewBox="0 0 220 400" style={{ overflow: "visible" }}>
        <rect x={10} y={0} width={200} height={380} rx={34} fill={COLORS.navy} stroke={COLORS.white} strokeWidth={5} />
        <rect x={26} y={30} width={168} height={320} rx={18} fill={COLORS.paper} />
        <g transform={`translate(${sacar * 260} ${-sacar * 40}) rotate(${sacar * 20} 110 120)`}>
          <rect x={40} y={70} width={140} height={90} rx={12} fill={COLORS.blue} stroke={COLORS.navy} strokeWidth={4} />
          <rect x={56} y={96} width={32} height={24} rx={4} fill={COLORS.gold} />
          <rect x={56} y={134} width={100} height={8} rx={4} fill={COLORS.light} />
        </g>
        <rect x={36} y={250 + pulsa * 4} width={148} height={62} rx={31} fill={sacar > 0 ? COLORS.grey : COLORS.green} />
        <text x={110} y={292 + pulsa * 4} textAnchor="middle" fontSize={24} fontWeight={900} fill={COLORS.white} fontFamily="Inter, sans-serif">
          COMPRAR
        </text>
        {pulsa ? <circle cx={150} cy={286} r={22} fill={COLORS.white} opacity={0.5} /> : null}
      </svg>
    </div>
  );
};

/* ---------- Nivel del agua a lo largo del vídeo ---------- */
const bajando = (t: number, de: number, a: number, dur = 3) => interpolate(t, [0, dur], [de, a], clamp);

/* ---------- Escenas ---------- */
const Hook: React.FC = () => {
  const t = useSeg();
  return (
    <Escena sinEntrada fondo="azul">
      <Sfx s="impacto" volumen={0.5} />
      <Cartel texto="Tu cuenta pierde agua por 4 sitios" tapados={[]} delay={-1} />
      <Deposito nivel={bajando(t, 0.92, 0.82)} tapados={[]} cortes={[]} />
    </Escena>
  );
};

const Gancho2: React.FC = () => {
  const t = useSeg();
  return (
    <Escena fondo="azul">
      <Cartel texto="No son caprichos. Van solas" tapados={[]} />
      <Deposito nivel={bajando(t, 0.82, 0.76)} tapados={[]} cortes={[]} />
      {[0, 1, 2, 3].map((k) => {
        const x = interpolate(t, [0, 2], [-200 - k * 150, 330 + k * 140], clamp);
        return <Obrero key={k} x={x} y={SUELO + 20} n={k + 1} anda={t < 2} mirar={t < 2 ? "der" : "frente"} semilla={k} escala={1.05} />;
      })}
      {[0.3, 0.8, 1.3].map((s) => (
        <Sfx key={s} s="pop" volumen={0.2} en={s} />
      ))}
    </Escena>
  );
};

const Fuga: React.FC<{
  i: number;
  texto: string;
  tapados: number[];
  nivel: [number, number];
  herramienta: Herramienta;
  sella?: number; // segundo en que tapa la fuga
  extra?: React.ReactNode;
  zoom?: boolean;
}> = ({ i, texto, tapados, nivel, herramienta, sella, extra, zoom = true }) => {
  const t = useSeg();
  const corte = sella !== undefined ? interpolate(t, [sella, sella + 0.35], [0, 1], clamp) : 0;
  const cortes = [0, 0, 0, 0];
  cortes[i] = corte;
  const pe = posEscalera(i);
  const sub = useSpring(0.1, 13, 0.6);
  const y = pe.y + (1 - sub) * 300;
  const brazo = sella !== undefined ? interpolate(t, [sella - 0.4, sella], [0.3, 1], clamp) : 0.4;
  return (
    <Escena fondo="azul">
      <Enfoque i={zoom ? i : undefined}>
        <Deposito nivel={bajando(t, nivel[0], nivel[1])} tapados={tapados} cortes={cortes} />
        <Escalera i={i} />
        <Obrero x={pe.x} y={y} n={i + 1} herramienta={corte > 0.2 ? null : herramienta} mirar={pe.mirar} brazo={brazo} feliz={corte > 0.5} />
        {extra}
      </Enfoque>
      <Cartel n={i + 1} texto={texto} tapados={tapados} nuevo={sella !== undefined ? i : undefined} />
      {sella !== undefined ? <Sfx s="pop" volumen={0.45} en={sella} /> : null}
    </Escena>
  );
};

const Rehook: React.FC = () => {
  const t = useSeg();
  return (
    <Escena fondo="azul">
      <Enfoque i={2} z={1.08}>
        <Deposito nivel={bajando(t, 0.66, 0.6)} tapados={[0, 1]} cortes={[]} agitado={1.6} />
        {[2, 3].map((k, j) => (
          <Obrero key={k} x={430 + j * 220} y={SUELO + 20} n={k + 1} mirar={t < 0.6 ? "izq" : "frente"} sorpresa={t > 0.6} semilla={k} escala={1.1} />
        ))}
        <Obrero x={940} y={SUELO + 20} n={1} mirar="izq" feliz semilla={1} escala={0.9} />
        <Obrero x={820} y={SUELO + 20} n={2} mirar="izq" feliz semilla={2} escala={0.9} />
      </Enfoque>
      <Cartel texto="La 3ª la tiene casi todo el mundo" tapados={[0, 1]} color={COLORS.gold} />
      <Sfx s="riser" volumen={0.35} en={0.2} />
    </Escena>
  );
};

const Wow: React.FC = () => {
  const t = useSeg();
  const { fps } = useVideoConfig();
  const f = useCurrentFrame();
  const sube = interpolate(f, [0.6 * fps, 2.6 * fps], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  const nivel = 0.5 + 0.45 * sube + Math.sin(Math.min(1, sube) * Math.PI) * 0.03;
  const brillo = 0.5 + 0.5 * Math.sin(t * 6);
  return (
    <Escena fondo="azul" sacudidas={[2.6]}>
      <Deposito nivel={nivel} tapados={[0, 1, 2, 3]} cortes={[]} brilloTapones={brillo} agitado={1 - sube * 0.6} />
      {[0, 1, 2, 3].map((k) => {
        const choque = Math.max(0, Math.sin((t - 0.4 - k * 0.35) * 8));
        return (
          <Obrero
            key={k}
            x={250 + k * 190}
            y={SUELO + 20 - (t > 0.4 + k * 0.35 && t < 0.8 + k * 0.35 ? 40 * choque : 0)}
            n={k + 1}
            brazo={t > 0.4 + k * 0.35 ? 1 : 0.3}
            mirar={k % 2 ? "izq" : "der"}
            semilla={k}
          />
        );
      })}
      <Cartel texto="4 fugas tapadas" tapados={[0, 1, 2, 3]} color={COLORS.gold} />
      <Chispas en={2.6} x={540} y={700} color={COLORS.gold} />
      {[0.4, 0.75, 1.1, 1.45].map((s) => (
        <Sfx key={s} s="pop" volumen={0.3} en={s} />
      ))}
      <Sfx s="ding" volumen={0.4} en={2.6} />
    </Escena>
  );
};

const Cierre: React.FC = () => {
  const s = useSpring(0.5, 14, 0.7);
  return (
    <Escena fondo="azul">
      <Deposito nivel={0.95} tapados={[0, 1, 2, 3]} cortes={[]} agitado={0.3} />
      <div style={{ position: "absolute", top: 250, left: 90, right: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: s }}>
        <div style={{ fontSize: 70, fontWeight: 900, letterSpacing: 6, color: COLORS.white }}>
          ALIGN <span style={{ fontWeight: 500, color: COLORS.light }}>by ADB</span>
        </div>
        <div style={{ fontSize: 30, color: COLORS.light }}>Contenido informativo, no es asesoramiento financiero.</div>
      </div>
    </Escena>
  );
};

const ESCENAS: DefEscena[] = [
  { id: "hook", render: () => <Hook /> },
  { id: "gancho2", render: () => <Gancho2 /> },
  {
    id: "f1",
    render: () => <Fuga i={0} texto="Suscripciones que no usas" tapados={[]} nivel={[0.76, 0.72]} herramienta="tapon" extra={<Arrastre i={0} tipo="suscripcion" />} />,
  },
  { id: "f1b", render: () => <Fuga i={0} texto="Revisa los cobros → baja" tapados={[]} nivel={[0.72, 0.7]} herramienta="tapon" sella={0.9} /> },
  {
    id: "f2",
    render: () => <Fuga i={1} texto="Comisiones de la cuenta" tapados={[0]} nivel={[0.7, 0.68]} herramienta="llave" extra={<Arrastre i={1} tipo="moneda" />} />,
  },
  { id: "f2b", render: () => <Fuga i={1} texto="¿Pagas por tenerla? Compara" tapados={[0]} nivel={[0.68, 0.66]} herramienta="llave" sella={0.8} /> },
  { id: "rehook", render: () => <Rehook /> },
  {
    id: "f3",
    render: () => <Fuga i={2} texto="Seguros que se renuevan solos" tapados={[0, 1]} nivel={[0.6, 0.56]} herramienta="cinta" extra={<Calendario x={560} y={830} />} />,
  },
  {
    id: "f3b",
    render: () => <F3b />,
  },
  {
    id: "f4",
    render: () => <Fuga i={3} texto="Tarjeta guardada en las apps" tapados={[0, 1, 2]} nivel={[0.53, 0.51]} herramienta={null} extra={<Movil x={540} y={900} />} />,
  },
  { id: "f4b", render: () => <F4b /> },
  { id: "wow", render: () => <Wow /> },
  {
    id: "cta",
    subtitulosClaros: true,
    render: () => <CtaCrecer tipo="guardar" boton="GUÁRDALO" linea="Y tapa una fuga **el día que cobres**" />,
  },
  { id: "cierre", render: () => <Cierre /> },
];

function F3b() {
  const t = useSeg();
  const posit = interpolate(t, [0.3, 0.7], [0, 1], clamp);
  return (
    <Fuga
      i={2}
      texto="Compara un mes antes"
      tapados={[0, 1]}
      nivel={[0.56, 0.53]}
      herramienta="posit"
      sella={1.0}
      extra={<Calendario x={560} y={830} posit={posit} />}
    />
  );
}

function F4b() {
  const t = useSeg();
  const sacar = interpolate(t, [0.3, 1.0], [0, 1], clamp);
  return <Fuga i={3} texto="Bórrala: menos impulso" tapados={[0, 1, 2]} nivel={[0.51, 0.5]} herramienta={null} sella={1.1} extra={<Movil x={540} y={900} sacar={sacar} />} />;
}

export const W4901: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4901} pista="lofi-polaroids.mp3" /> : null;
