import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { COLORS, fontFamily } from "../brand";
import {
  Chispas,
  CtaCrecer,
  DefEscena,
  ease,
  ENTRADA_VOZ,
  FPS,
  Fondo,
  framesEscena,
  Montaje,
  PropsVoz,
  Sfx,
  Subtitulos,
  Voz,
} from "../kit";

// W48-01-v2 · Black Friday · formato «Construye desde cero» (prueba de las reglas nuevas, 19 nov).
// UN SOLO PLANO FIJO: cada escena pinta el mismo <Plano> con el tiempo global, así no hay cortes.
// Cifras ilustrativas («-70 %», «48 horas»), sin datos externos.

export const EXTRA_W4801v2: Record<string, number> = { sobra: 0.35, cta: 0.95 };
const CIERRE = 1.25; // segundos finales de la escena cta (marca + aviso)

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (t: number, a: number, b: number, v0 = 0, v1 = 1, e = ease) =>
  interpolate(t, [a, b], [v0, v1], { ...cl, easing: e });
const muelle = (t: number, t0: number, damping = 10, mass = 0.6) =>
  t < t0 ? 0 : spring({ frame: Math.round((t - t0) * FPS), fps: FPS, config: { damping, mass, stiffness: 170 } });

/* ---------- Tiempos globales sacados de la voz ---------- */
type Tiempos = { S: (id: string) => number; W: (id: string, i: number) => number; total: number };
const tiempos = (voz: Voz): Tiempos => {
  const ini: Record<string, number> = {};
  const vz: Record<string, Voz["escenas"][number]> = {};
  let off = 0;
  voz.escenas.forEach((e, i) => {
    ini[e.id] = off;
    vz[e.id] = e;
    off += framesEscena(e, i, EXTRA_W4801v2);
  });
  return {
    S: (id) => (ini[id] ?? 0) / FPS,
    W: (id, i) => ((ini[id] ?? 0) + (id === voz.escenas[0].id ? 0 : ENTRADA_VOZ)) / FPS + (vz[id]?.palabras[i]?.inicio ?? 0),
    total: off / FPS,
  };
};

/* ---------- Colores del cartón ---------- */
const CARTON = { claro: "#E9B97C", medio: "#D49A5C", oscuro: "#A9713A", lado: "#8E5A2B", tinta: "#4A2A12" };

/* ---------- Ojos con párpado (0 abierto · 0,5 «meh» · 1 cerrado) ---------- */
const Ojo: React.FC<{ id: string; cx: number; cy: number; parpado: number; mx: number; my: number; guino?: number }> = ({
  id,
  cx,
  cy,
  parpado,
  mx,
  my,
  guino = 0,
}) => {
  const rx = 34;
  const ry = 40;
  if (guino > 0.5) {
    return (
      <path
        d={`M ${cx - 30} ${cy + 4} Q ${cx} ${cy - 26} ${cx + 30} ${cy + 4}`}
        stroke={CARTON.tinta}
        strokeWidth={9}
        fill="none"
        strokeLinecap="round"
      />
    );
  }
  const lidY = cy - ry + 2 * ry * Math.min(1, parpado);
  return (
    <g>
      <clipPath id={`clip-${id}`}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
      </clipPath>
      <ellipse cx={cx} cy={cy + 4} rx={rx + 3} ry={ry + 3} fill="rgba(74,42,18,0.25)" />
      <g clipPath={`url(#clip-${id})`}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#FFFFFF" />
        <circle cx={cx + mx * 12} cy={cy + 6 + my * 12} r={18} fill={COLORS.navy} />
        <circle cx={cx + mx * 12 + 6} cy={cy + my * 12 - 2} r={6} fill="#FFFFFF" />
        {parpado > 0.02 ? (
          <>
            <rect x={cx - rx - 2} y={cy - ry - 2} width={2 * rx + 4} height={lidY - (cy - ry) + 2} fill="url(#cara)" />
            <line x1={cx - rx} y1={lidY} x2={cx + rx} y2={lidY} stroke={CARTON.tinta} strokeWidth={6} />
          </>
        ) : null}
      </g>
    </g>
  );
};

/* ---------- Pegatina «-70 %» (estrella redondeada) ---------- */
const estrella = (n: number, R: number, r: number) =>
  Array.from({ length: n * 2 }, (_, i) => {
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const k = i % 2 ? r : R;
    return `${(Math.cos(a) * k).toFixed(1)},${(Math.sin(a) * k).toFixed(1)}`;
  }).join(" ");

const Pegatina: React.FC = () => (
  <g>
    <polygon points={estrella(14, 96, 82)} fill="rgba(0,0,0,0.25)" transform="translate(4 8)" />
    <polygon points={estrella(14, 96, 82)} fill="url(#rojo)" stroke="#B91C1C" strokeWidth={3} strokeLinejoin="round" />
    <circle r={70} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={3} strokeDasharray="6 8" />
    <text y={20} textAnchor="middle" fontSize={58} fontWeight={900} fill="#FFFFFF" letterSpacing={-2}>
      -70%
    </text>
  </g>
);

/* ---------- Banner «SOLO HOY» ---------- */
const Banner: React.FC<{ abre: number }> = ({ abre }) => (
  <g transform={`scale(${Math.max(0.001, abre)} 1)`}>
    <rect x={-185} y={-34} width={370} height={78} rx={8} fill="rgba(0,0,0,0.22)" transform="translate(0 8)" />
    <rect x={-185} y={-38} width={370} height={78} rx={8} fill="url(#amarillo)" />
    <rect x={-185} y={-38} width={370} height={12} rx={6} fill="rgba(255,255,255,0.45)" />
    <text y={18} textAnchor="middle" fontSize={48} fontWeight={900} fill={COLORS.navy} letterSpacing={3}>
      SOLO HOY
    </text>
  </g>
);

/* ---------- Reloj de cuenta atrás ---------- */
const RelojDigital: React.FC<{ texto: string; flash: number }> = ({ texto, flash }) => (
  <g>
    <rect x={-138} y={-38} width={276} height={84} rx={18} fill="rgba(0,0,0,0.3)" transform="translate(0 8)" />
    <rect x={-138} y={-42} width={276} height={84} rx={18} fill="url(#pantalla)" stroke="#334155" strokeWidth={5} />
    <rect x={-124} y={-30} width={248} height={60} rx={10} fill={`rgba(248,113,113,${0.08 + 0.25 * flash})`} />
    <text
      y={17}
      textAnchor="middle"
      fontSize={50}
      fontWeight={800}
      fill={flash > 0.3 ? "#FFFFFF" : COLORS.red}
      style={{ fontVariantNumeric: "tabular-nums" }}
      letterSpacing={1}
    >
      {texto}
    </text>
    {/* cinta que lo pega */}
    <rect x={-160} y={-58} width={60} height={26} rx={4} fill="rgba(255,240,200,0.7)" transform="rotate(-24 -130 -45)" />
    <rect x={100} y={-58} width={60} height={26} rx={4} fill="rgba(255,240,200,0.7)" transform="rotate(24 130 -45)" />
  </g>
);

const Moneda: React.FC = () => (
  <g>
    <circle r={42} fill="rgba(0,0,0,0.25)" cx={3} cy={6} />
    <circle r={42} fill="url(#oro)" stroke="#B45309" strokeWidth={4} />
    <circle r={31} fill="none" stroke="rgba(180,83,9,0.6)" strokeWidth={3} />
    <text y={17} textAnchor="middle" fontSize={46} fontWeight={900} fill="#92400E">
      €
    </text>
  </g>
);

/* ---------- Título grande arriba ---------- */
type Linea = { t: number; texto: string; color?: string };
const Titulo: React.FC<{ tg: number; lineas: Linea[][] }> = ({ tg, lineas }) => {
  // lineas: lista de «pantallas»; cada una con sus líneas que entran en su segundo
  let idx = -1;
  lineas.forEach((p, i) => {
    if (tg >= p[0].t) idx = i;
  });
  if (idx < 0) return null;
  const pant = lineas[idx];
  return (
    <div
      style={{
        position: "absolute",
        top: 250,
        left: 90,
        right: 120,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        fontFamily,
      }}
    >
      {pant.map((l, i) => {
        const s = idx === 0 ? 1 : muelle(tg, l.t, 11, 0.55);
        if (s <= 0) return null;
        return (
          <div
            key={i}
            style={{
              fontSize: l.texto.length > 16 ? 88 : 108,
              fontWeight: 900,
              lineHeight: 1.02,
              textAlign: "center",
              letterSpacing: -2,
              color: l.color ?? COLORS.white,
              scale: String(0.6 + 0.4 * s),
              opacity: Math.min(1, s * 1.5),
              textShadow: "0 6px 0 rgba(5,9,20,0.45), 0 10px 40px rgba(0,0,0,0.5)",
            }}
          >
            {l.texto}
          </div>
        );
      })}
    </div>
  );
};

/* ---------- El plano fijo ---------- */
const Plano: React.FC<{ T: Tiempos }> = ({ T }) => {
  const frame = useCurrentFrame(); // global (ver <Fijo>)
  const tg = frame / FPS;
  const { S, W } = T;

  // momentos clave
  const tAterriza = W("caja", 2) + 0.05;
  const tPegatina = W("caja", 6);
  const tBanner = W("soloHoy", 2);
  const tReloj = S("reloj") + 0.08;
  const tDing = W("reloj", 3);
  const tReinicio = W("reloj", 5);
  const tGuino = W("reloj", 7) - 0.05;
  const tMon = [W("plazos", 1), W("plazos", 2), W("plazos", 3)];
  const tWow = S("wow") + 0.1;
  const t48 = W("prisa", 4) - 0.1;
  const caidas = [0, 1, 2, 3, 4].map((i) => S("prisa") + 1.55 + i * 0.4); // aureola, monedas, reloj, banner, pegatina
  const tMeh = S("sobra") + 0.15;
  const tHombros = W("sobra", 2) - 0.1;
  const tSeVa = W("sobra", 4) + 0.35;
  const tCheck = W("sobra", 9);

  // caída de una pieza (desplazamiento en px y giro)
  const cae = (t0: number, giro = 1) => {
    const d = Math.max(0, tg - t0);
    return { dy: 0.5 * 5200 * d * d - 260 * d * (d > 0 ? 1 : 0), rot: giro * 260 * d, vivo: d < 0.9 };
  };

  /* --- caja: cae, aplasta y rebota --- */
  const tCae0 = tAterriza - 0.38;
  const enAire = tg < tAterriza;
  const yCaida = enAire ? -1100 * (1 - Math.max(0, (tg - tCae0) / 0.38) ** 2) : 0;
  const visibleCaja = tg >= tCae0;
  const golpe = tg >= tAterriza ? Math.exp(-(tg - tAterriza) * 7) * Math.cos((tg - tAterriza) * 26) : 0;
  let sx = 1 + 0.14 * golpe;
  let sy = 1 - 0.16 * golpe;
  // pequeño salto al pegar cada pieza
  const saltos = [tPegatina, tBanner, tReloj, ...tMon];
  saltos.forEach((ts) => {
    if (tg >= ts) {
      const g = Math.exp(-(tg - ts) * 9) * Math.sin((tg - ts) * 30);
      sx += 0.04 * g;
      sy -= 0.05 * g;
    }
  });
  // respiración
  const resp = Math.sin(tg * 3.2) * 0.012;
  sy += resp;
  sx -= resp * 0.5;
  // wow: crece un poco
  const wowK = lerp(tg, tWow, tWow + 0.5) * (1 - lerp(tg, caidas[0], caidas[0] + 0.5));
  sx += 0.06 * wowK;
  sy += 0.06 * wowK;

  // hombros: dos subidas
  const hombros = tg > tHombros && tg < tHombros + 1.3 ? Math.max(0, Math.sin(((tg - tHombros) / 0.65) * Math.PI)) : 0;
  const brazos = lerp(tg, tHombros - 0.15, tHombros + 0.15) * (1 - lerp(tg, tSeVa + 0.1, tSeVa + 0.4));
  // se va arrastrando
  const vaK = lerp(tg, tSeVa, tSeVa + 1.5, 0, 1, (x) => x * x);
  const xVa = 760 * vaK;
  const inclina = tg > tSeVa ? -9 * Math.min(1, (tg - tSeVa) / 0.25) : 0;
  const bamboleo = tg > tSeVa ? Math.abs(Math.sin((tg - tSeVa) * 14)) * -10 : 0;
  const yCaja = yCaida - 22 * hombros + bamboleo;

  /* --- ojos y boca --- */
  const abreOjos = lerp(tg, tAterriza + 0.25, tAterriza + 0.4);
  const parpadeoBase = [2.6, 5.1, 9.4, 13.2, 16.7].some((b) => tg > b && tg < b + 0.14) ? 1 : 0;
  const meh = lerp(tg, tMeh, tMeh + 0.25) * 0.5;
  const parpado = Math.max(1 - abreOjos, parpadeoBase, meh);
  const guino = tg > tGuino && tg < tGuino + 0.55 ? 1 : 0;
  // hacia dónde mira
  let mx = noise2D("mx", tg / 2, 0) * 0.4;
  let my = 0;
  if (tg > tPegatina - 0.2 && tg < tPegatina + 0.6) {
    mx = -0.9;
    my = -0.8;
  }
  if (tg > tReloj && tg < tDing + 0.3) {
    mx = 0;
    my = 1;
  }
  if (tg > tGuino - 0.3 && tg < tGuino + 0.6) {
    mx = 0.3;
    my = 0;
  }
  if (tg > caidas[0] && tg < caidas[4] + 0.6) {
    mx = 0.2 * Math.sin(tg * 8);
    my = 1;
  }
  if (tg > tSeVa) {
    mx = 1;
    my = 0;
  }
  const feliz = tg > tAterriza + 0.3 && tg < caidas[1];
  const boca = tg >= tMeh
    ? "M -34 -96 Q -17 -106 0 -96 Q 17 -86 34 -96"
    : feliz
      ? wowK > 0.3
        ? "M -44 -108 Q 0 -108 44 -108 Q 40 -62 0 -62 Q -40 -62 -44 -108 Z"
        : "M -38 -104 Q 0 -72 38 -104"
      : "M -24 -96 Q 0 -90 24 -96";
  const bocaLlena = feliz && wowK > 0.3;

  /* --- piezas --- */
  const pPeg = muelle(tg, tPegatina, 9, 0.5);
  const sPeg = tg < tPegatina ? 0 : 2.4 - 1.4 * Math.min(1, (tg - tPegatina) / 0.12) + 0.08 * Math.sin(pPeg * 6) * (1 - pPeg);
  const pBan = muelle(tg, tBanner, 8, 0.5);
  const flapBan = tg > tBanner ? Math.exp(-(tg - tBanner) * 5) * Math.sin((tg - tBanner) * 24) * 6 : 0;
  const pRel = muelle(tg, tReloj, 9, 0.5);
  // texto del reloj
  let reloj = "00:00:03";
  const tc = tg - (tReloj + 0.15);
  if (tg >= tReinicio) {
    const s = 59 - Math.floor((tg - tReinicio) * 1.0);
    reloj = `23:59:${String(Math.max(0, s)).padStart(2, "0")}`;
  } else if (tc > 0) {
    const n = Math.max(0, 3 - Math.floor(tc / ((tDing - tReloj - 0.15) / 3)));
    reloj = `00:00:0${n}`;
  }
  const flash = tg > tReinicio ? Math.exp(-(tg - tReinicio) * 6) : tg > tDing ? Math.exp(-(tg - tDing) * 5) * 0.8 : 0;
  const sacReloj = tg > tReinicio && tg < tReinicio + 0.3 ? Math.sin((tg - tReinicio) * 60) * 6 : 0;

  // aureola (wow)
  const pAur = muelle(tg, tWow, 9, 0.6);
  const brillo = lerp(tg, tWow, tWow + 0.35) * (1 - lerp(tg, caidas[0], caidas[0] + 0.4));

  // reloj de 48 h
  const p48 = muelle(tg, t48, 10, 0.6) * (1 - lerp(tg, S("sobra") + 0.2, S("sobra") + 0.5));
  const giro48 = Math.max(0, tg - t48) * 1440; // vueltas rápidas
  const anillo48 = lerp(tg, t48 + 0.1, caidas[4] + 0.3, 0, 1, (x) => x);

  // caídas
  const cAur = cae(caidas[0], 0.4);
  const cMon = cae(caidas[1], -0.8);
  const cRel = cae(caidas[2], 1);
  const cBan = cae(caidas[3], -0.6);
  const cPeg = cae(caidas[4], 1.2);
  const fuera = (c: { dy: number; vivo: boolean }, t0: number) => tg < t0 || c.vivo;

  // monedas: péndulos
  const mon = [
    { L: 92, a0: 16 },
    { L: 158, a0: 9 },
    { L: 224, a0: 3 },
  ];

  /* --- cámara --- */
  const empuje = 1 + 0.07 * lerp(tg, tWow, tWow + 1.4) * (1 - lerp(tg, caidas[0] - 0.2, caidas[0] + 0.8));
  let cdx = noise2D("cx", tg / 3, 0) * 6;
  let cdy = noise2D("cy", tg / 3, 0) * 8;
  [tAterriza, tPegatina, tReinicio, tWow].forEach((ts, i) => {
    const k = tg - ts;
    if (k >= 0 && k < 0.45) {
      const a = (1 - k / 0.45) ** 2 * (i === 0 ? 24 : 12);
      cdx += noise2D("shx", k * 15, i) * a;
      cdy += noise2D("shy", k * 15, i) * a;
    }
  });

  // silueta punteada (hook)
  const silueta = 1 - lerp(tg, tAterriza - 0.2, tAterriza);
  const pulso = 0.55 + 0.25 * Math.sin(tg * 6);

  // check final
  const pCheck = muelle(tg, tCheck, 9, 0.55);
  const trazo = lerp(tg, tCheck + 0.1, tCheck + 0.45);

  const PX = 540; // centro del pedestal
  const PY = 1150; // cara superior del pedestal

  return (
    <AbsoluteFill style={{ fontFamily, overflow: "hidden" }}>
      <Fondo tono="azul" luz={COLORS.accent} />
      <AbsoluteFill style={{ scale: String(empuje), translate: `${cdx}px ${cdy}px`, transformOrigin: "50% 55%" }}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, fontFamily }}>
          <defs>
            <linearGradient id="cara" gradientUnits="userSpaceOnUse" x1="0" y1="-300" x2="0" y2="0">
              <stop offset="0" stopColor={CARTON.claro} />
              <stop offset="1" stopColor={CARTON.oscuro} />
            </linearGradient>
            <linearGradient id="lado" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={CARTON.lado} />
              <stop offset="1" stopColor="#6E4420" />
            </linearGradient>
            <linearGradient id="tapa" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#F2C990" />
              <stop offset="1" stopColor={CARTON.medio} />
            </linearGradient>
            <radialGradient id="rojo" cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#FF8A8A" />
              <stop offset="1" stopColor="#DC2626" />
            </radialGradient>
            <linearGradient id="amarillo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FDE68A" />
              <stop offset="1" stopColor={COLORS.gold} />
            </linearGradient>
            <linearGradient id="pantalla" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1E293B" />
              <stop offset="1" stopColor="#0B1224" />
            </linearGradient>
            <radialGradient id="oro" cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#FEF3C7" />
              <stop offset="0.5" stopColor={COLORS.gold} />
              <stop offset="1" stopColor="#D97706" />
            </radialGradient>
            <linearGradient id="foco" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.16" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="pedestal" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#1B2A5E" />
              <stop offset="0.45" stopColor="#30478F" />
              <stop offset="1" stopColor="#141F48" />
            </linearGradient>
            <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor={COLORS.gold} stopOpacity="0.75" />
              <stop offset="1" stopColor={COLORS.gold} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* foco de luz */}
          <polygon points={`430,0 650,0 860,${PY + 10} 220,${PY + 10}`} fill="url(#foco)" opacity={0.9 + 0.4 * brillo} />
          {Array.from({ length: 14 }, (_, i) => {
            const x = 300 + ((i * 137) % 480) + noise2D("px", i, tg / 4) * 40;
            const y = 300 + ((i * 263 + tg * 25) % 820);
            return <circle key={i} cx={x} cy={y} r={2 + (i % 3)} fill="#FFFFFF" opacity={0.25} />;
          })}

          {/* brillo y rayos del wow */}
          {brillo > 0.01 ? (
            <g opacity={brillo}>
              <circle cx={PX + 25} cy={PY - 180} r={420} fill="url(#halo)" />
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i / 12) * Math.PI * 2 + tg * 0.6;
                return (
                  <line
                    key={i}
                    x1={PX + 25 + Math.cos(a) * 250}
                    y1={PY - 180 + Math.sin(a) * 250}
                    x2={PX + 25 + Math.cos(a) * 460}
                    y2={PY - 180 + Math.sin(a) * 460}
                    stroke={COLORS.gold}
                    strokeWidth={10}
                    strokeLinecap="round"
                    opacity={0.5}
                  />
                );
              })}
            </g>
          ) : null}

          {/* reloj de 48 h */}
          {p48 > 0.01 ? (
            <g transform={`translate(${PX} 600) scale(${p48})`}>
              <circle r={104} fill="rgba(0,0,0,0.25)" cy={8} />
              <circle r={104} fill={COLORS.white} />
              <circle
                r={88}
                fill="none"
                stroke={COLORS.green}
                strokeWidth={14}
                strokeDasharray={`${2 * Math.PI * 88 * anillo48} 999`}
                transform="rotate(-90)"
                strokeLinecap="round"
              />
              <line x1={0} y1={0} x2={0} y2={-62} stroke={COLORS.navy} strokeWidth={8} strokeLinecap="round" transform={`rotate(${giro48})`} />
              <line x1={0} y1={0} x2={0} y2={-42} stroke={COLORS.blue} strokeWidth={10} strokeLinecap="round" transform={`rotate(${giro48 / 12})`} />
              <circle r={9} fill={COLORS.navy} />
              <text y={58} textAnchor="middle" fontSize={34} fontWeight={900} fill={COLORS.navy}>
                48 h
              </text>
            </g>
          ) : null}

          <g transform="translate(540 1080) scale(1.15) translate(-540 -1080)">
          {/* pedestal */}
          <ellipse cx={PX} cy={PY + 170} rx={330} ry={40} fill="rgba(0,0,0,0.35)" />
          <path d={`M ${PX - 270} ${PY} L ${PX - 270} ${PY + 140} A 270 44 0 0 0 ${PX + 270} ${PY + 140} L ${PX + 270} ${PY} Z`} fill="url(#pedestal)" />
          <ellipse cx={PX} cy={PY} rx={270} ry={44} fill="#3A5299" />
          <ellipse cx={PX} cy={PY} rx={270} ry={44} fill="none" stroke={COLORS.accent} strokeWidth={4} opacity={0.8} />
          <ellipse cx={PX - 40} cy={PY - 6} rx={160} ry={18} fill="#FFFFFF" opacity={0.08} />

          {/* sombra de la caja */}
          {visibleCaja ? (
            <ellipse
              cx={PX + 25 + xVa}
              cy={PY + 4}
              rx={250 * (1 - 0.6 * Math.min(1, -yCaida / 1100)) * sx}
              ry={30}
              fill="rgba(5,9,20,0.45)"
              opacity={Math.max(0, 1 - xVa / 500)}
            />
          ) : null}

          {/* silueta punteada del hook */}
          {silueta > 0.01 ? (
            <g transform={`translate(${PX} ${PY})`} opacity={silueta * pulso} fill="none" stroke={COLORS.light} strokeWidth={6} strokeDasharray="18 14" strokeLinejoin="round">
              <rect x={-200} y={-300} width={400} height={300} rx={14} />
              <polygon points="-200,-300 -150,-335 250,-335 200,-300" />
              <polygon points="200,-300 250,-335 250,-35 200,0" />
              <text x={0} y={-130} textAnchor="middle" fontSize={120} fontWeight={900} fill={COLORS.light} stroke="none" opacity={0.6}>
                ?
              </text>
            </g>
          ) : null}

          {/* LA CAJA y sus piezas */}
          {visibleCaja ? (
            <g transform={`translate(${PX + xVa} ${PY + yCaja}) rotate(${inclina}) scale(${sx} ${sy})`}>
              {/* brazos (encoge los hombros) */}
              {brazos > 0.01
                ? [-1, 1].map((lado) => {
                    const bx = lado < 0 ? -200 : 250;
                    const up = hombros;
                    const ex = bx + lado * (60 + 10 * up);
                    const ey = -120 - 70 * up;
                    const hx = ex + lado * (18 + 8 * up);
                    const hy = ey - 50 * up - 10;
                    return (
                      <g key={lado} opacity={brazos}>
                        <path d={`M ${bx} -150 Q ${ex} ${-130 + 10 * up} ${hx} ${hy}`} stroke={CARTON.tinta} strokeWidth={13} fill="none" strokeLinecap="round" />
                        <ellipse cx={hx} cy={hy} rx={20} ry={14} fill={CARTON.lado} stroke={CARTON.tinta} strokeWidth={5} transform={`rotate(${lado * -30} ${hx} ${hy})`} />
                      </g>
                    );
                  })
                : null}
              {/* volumen */}
              <polygon points="200,-300 250,-335 250,-35 200,0" fill="url(#lado)" />
              <polygon points="-200,-300 -150,-335 250,-335 200,-300" fill="url(#tapa)" />
              <line x1={-175} y1={-317} x2={225} y2={-317} stroke={CARTON.oscuro} strokeWidth={4} opacity={0.6} />
              <rect x={-200} y={-300} width={400} height={300} rx={12} fill="url(#cara)" />
              <rect x={-200} y={-300} width={130} height={300} rx={12} fill="#FFFFFF" opacity={0.08} />
              <rect x={-30} y={-300} width={60} height={70} fill="#F5D9A8" opacity={0.75} />
              <polygon points="-25,-300 35,-300 75,-335 15,-335" fill="#F5D9A8" opacity={0.75} />
              {/* cara */}
              <Ojo id="oi" cx={-72} cy={-178} parpado={parpado} mx={mx} my={my} />
              <Ojo id="od" cx={72} cy={-178} parpado={parpado} mx={mx} my={my} guino={guino} />
              {tg >= tMeh ? (
                <>
                  <line x1={-104} y1={-238} x2={-44} y2={-228} stroke={CARTON.tinta} strokeWidth={8} strokeLinecap="round" />
                  <line x1={104} y1={-238} x2={44} y2={-228} stroke={CARTON.tinta} strokeWidth={8} strokeLinecap="round" />
                </>
              ) : guino ? (
                <line x1={44} y1={-236} x2={104} y2={-246} stroke={CARTON.tinta} strokeWidth={8} strokeLinecap="round" />
              ) : null}
              {abreOjos > 0.5 ? (
                <path
                  d={boca}
                  stroke={CARTON.tinta}
                  strokeWidth={8}
                  fill={bocaLlena ? "#7F1D1D" : "none"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}

              {/* monedas colgando */}
              {fuera(cMon, caidas[1])
                ? mon.map((m, i) => {
                    const p = muelle(tg, tMon[i], 8, 0.5);
                    if (p <= 0.01) return null;
                    const dt = Math.max(0, tg - tMon[i]);
                    const a = (m.a0 + 16 * Math.exp(-dt * 1.6) * Math.cos(dt * 7) + 3 * Math.sin(tg * 2.4 + i)) * (Math.PI / 180);
                    const L = m.L * Math.min(1, p);
                    const ox = -205;
                    const oy = -235;
                    const x = ox - Math.sin(a) * L;
                    const y = oy + Math.cos(a) * L;
                    return (
                      <g key={i} transform={`translate(${tg > caidas[1] ? -20 * (tg - caidas[1]) * (i + 1) : 0} ${tg > caidas[1] ? cMon.dy * (1 + i * 0.15) : 0})`}>
                        <line x1={ox} y1={oy} x2={x} y2={y} stroke="#F5F0E6" strokeWidth={4} />
                        <g transform={`translate(${x} ${y + 40}) rotate(${tg > caidas[1] ? cMon.rot : a * 40}) scale(${p})`}>
                          <Moneda />
                        </g>
                      </g>
                    );
                  })
                : null}
              {mon.some((_, i) => tg >= tMon[i]) && fuera(cMon, caidas[1]) ? (
                <circle cx={-205} cy={-235} r={9} fill="#94A3B8" stroke="#475569" strokeWidth={3} />
              ) : null}

              {/* reloj */}
              {tg >= tReloj && fuera(cRel, caidas[2]) ? (
                <g transform={`translate(${25 + sacReloj} ${-30 + cRel.dy}) rotate(${(tg > caidas[2] ? cRel.rot : 0) - 2}) scale(${pRel})`}>
                  <RelojDigital texto={reloj} flash={flash} />
                </g>
              ) : null}

              {/* banner */}
              {tg >= tBanner && fuera(cBan, caidas[3]) ? (
                <g transform={`translate(${170} ${-262 + cBan.dy}) rotate(${38 + flapBan + (tg > caidas[3] ? cBan.rot : 0)})`}>
                  <Banner abre={pBan} />
                </g>
              ) : null}

              {/* pegatina */}
              {tg >= tPegatina && fuera(cPeg, caidas[4]) ? (
                <g transform={`translate(${-168} ${-262 + cPeg.dy}) rotate(${-14 + (tg > caidas[4] ? cPeg.rot : 0)}) scale(${sPeg})`} opacity={Math.min(1, (tg - tPegatina) / 0.06)}>
                  <Pegatina />
                </g>
              ) : null}

              {/* aureola */}
              {tg >= tWow && fuera(cAur, caidas[0]) ? (
                <g transform={`translate(${25} ${-420 + (1 - pAur) * -300 + Math.sin(tg * 4) * 8 + cAur.dy}) rotate(${tg > caidas[0] ? cAur.rot : 0})`} opacity={Math.min(1, pAur * 1.5)}>
                  <ellipse rx={130} ry={30} fill="none" stroke="#FDE68A" strokeWidth={26} opacity={0.35} />
                  <ellipse rx={130} ry={30} fill="none" stroke={COLORS.gold} strokeWidth={14} />
                </g>
              ) : null}
            </g>
          ) : null}

          {/* polvo al aterrizar */}
          {tg > tAterriza && tg < tAterriza + 0.7
            ? Array.from({ length: 10 }, (_, i) => {
                const k = (tg - tAterriza) / 0.7;
                const lado = i % 2 ? 1 : -1;
                const x = PX + 25 + lado * (180 + k * (120 + i * 14));
                const y = PY - 10 - k * (30 + (i % 4) * 14);
                return <circle key={i} cx={x} cy={y} r={14 + k * 26} fill={COLORS.light} opacity={(1 - k) * 0.35} />;
              })
            : null}
          {/* polvo al irse */}
          {tg > tSeVa && tg < tSeVa + 1.6
            ? Array.from({ length: 6 }, (_, i) => {
                const t0 = tSeVa + i * 0.22;
                const k = (tg - t0) / 0.6;
                if (k < 0 || k > 1) return null;
                const x0 = PX - 200 + 760 * lerp(t0, tSeVa, tSeVa + 1.5, 0, 1, (x) => x * x);
                return <circle key={i} cx={x0 - k * 60} cy={PY - 8 - k * 30} r={12 + k * 22} fill={COLORS.light} opacity={(1 - k) * 0.4} />;
              })
            : null}

          {/* check final */}
          {pCheck > 0.01 ? (
            <g transform={`translate(${PX} ${PY - 90}) scale(${pCheck})`}>
              <circle r={74} fill="rgba(0,0,0,0.25)" cy={8} />
              <circle r={74} fill={COLORS.green} />
              <path
                d="M -32 2 L -8 26 L 36 -24"
                stroke="#FFFFFF"
                strokeWidth={16}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={`${110 * trazo} 200`}
              />
            </g>
          ) : null}
          </g>
        </svg>
      </AbsoluteFill>

      <Titulo
        tg={tg}
        lineas={[
          [{ t: 0, texto: "UNA COMPRA QUE" }, { t: 0, texto: "NO NECESITAS", color: COLORS.gold }],
          [{ t: S("caja"), texto: "PON" }],
          [{ t: tPegatina, texto: "-70 %", color: COLORS.red }],
          [{ t: S("soloHoy"), texto: "SOLO HOY", color: COLORS.gold }],
          [{ t: S("reloj"), texto: "00:00:03…" }],
          [{ t: S("plazos"), texto: "3 «CÓMODOS»" }, { t: S("plazos") + 0.15, texto: "PLAZOS", color: COLORS.gold }],
          [{ t: S("wow"), texto: "IMPRESCINDIBLE", color: COLORS.gold }],
          [{ t: S("prisa"), texto: "48 HORAS" }, { t: W("prisa", 9), texto: "SIN PAGAR", color: COLORS.green }],
          [{ t: S("sobra"), texto: "CASI SIEMPRE" }, { t: W("sobra", 4) - 0.1, texto: "SOBRA", color: COLORS.gold }],
        ]}
      />
    </AbsoluteFill>
  );
};

/** Pinta el plano con el tiempo global aunque esté dentro de una escena. */
const Fijo: React.FC<{ T: Tiempos; id: string }> = ({ T, id }) => (
  <Sequence from={-Math.round(T.S(id) * FPS)} layout="none">
    <Plano T={T} />
  </Sequence>
);

/* ---------- Efectos de sonido (tiempo global) ---------- */
const Sonidos: React.FC<{ T: Tiempos }> = ({ T }) => {
  const { S, W } = T;
  const caidas = [0, 1, 2, 3, 4].map((i) => S("prisa") + 1.55 + i * 0.4);
  const tReloj = S("reloj") + 0.08;
  const tDing = W("reloj", 3);
  const paso = (tDing - tReloj - 0.15) / 3;
  return (
    <>
      <Sfx s="impacto" volumen={0.4} en={0} />
      <Sfx s="swoosh" volumen={0.3} en={W("caja", 2) - 0.35} />
      <Sfx s="impacto" volumen={0.5} en={W("caja", 2) + 0.05} />
      <Sfx s="pop" volumen={0.5} en={W("caja", 6)} />
      <Sfx s="swoosh" volumen={0.3} en={W("soloHoy", 2) - 0.05} />
      <Sfx s="pop" volumen={0.4} en={W("soloHoy", 2) + 0.1} />
      <Sfx s="pop" volumen={0.4} en={tReloj} />
      {[1, 2, 3].map((i) => (
        <Sfx key={i} s="tick" volumen={0.3} en={tReloj + 0.15 + paso * i - 0.02} />
      ))}
      <Sfx s="ding" volumen={0.4} en={tDing} />
      <Sfx s="swoosh" volumen={0.35} en={W("reloj", 5)} />
      <Sfx s="click" volumen={0.4} en={W("reloj", 7) - 0.05} />
      {[1, 2, 3].map((i) => (
        <Sfx key={`m${i}`} s="pop" volumen={0.32} en={W("plazos", i)} />
      ))}
      <Sfx s="riser" volumen={0.35} en={Math.max(0, S("wow") - 1.4)} />
      <Sfx s="ding" volumen={0.45} en={S("wow") + 0.1} />
      <Sfx s="whoosh" volumen={0.3} en={W("prisa", 4) - 0.15} />
      {caidas.map((t, i) => (
        <Sfx key={`c${i}`} s={i % 2 ? "swoosh" : "pop"} volumen={0.28} en={t} />
      ))}
      <Sfx s="swoosh" volumen={0.25} en={W("sobra", 2) - 0.1} />
      <Sfx s="whoosh" volumen={0.3} en={W("sobra", 4) + 0.35} />
      <Sfx s="ding" volumen={0.3} en={W("sobra", 9)} />
      <Sfx s="impacto" volumen={0.3} en={T.total - CIERRE} />
    </>
  );
};

/* ---------- Cierre: marca + aviso ---------- */
const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const s = spring({ frame, fps: FPS, config: { damping: 12, mass: 0.6 } });
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Fondo tono="noche" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 26, paddingBottom: 120 }}>
        <div style={{ fontSize: 120, fontWeight: 900, letterSpacing: 10, color: COLORS.white, scale: String(0.7 + 0.3 * s), opacity: s }}>
          ALIGN <span style={{ fontWeight: 500, color: COLORS.light, fontSize: 64, letterSpacing: 4 }}>by ADB</span>
        </div>
        <div style={{ fontSize: 34, color: COLORS.light, textAlign: "center", maxWidth: 820, opacity: interpolate(frame, [6, 14], [0, 1], cl) }}>
          Contenido informativo, no es asesoramiento financiero.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const escenas = (T: Tiempos, voz: Voz): DefEscena[] => {
  const ids = ["hook", "caja", "soloHoy", "reloj", "plazos", "wow", "prisa", "sobra"];
  const plano: DefEscena[] = ids.map((id) => ({
    id,
    render: () => (
      <>
        <Fijo T={T} id={id} />
        {id === "wow" ? <Chispas en={0.35} x={565} y={820} color={COLORS.gold} n={44} /> : null}
      </>
    ),
  }));
  const cta = voz.escenas.find((e) => e.id === "cta");
  return [
    ...plano,
    {
      id: "cta",
      subtitulos: false,
      render: ({ dur }) => {
        const finCta = dur - Math.round(CIERRE * FPS);
        return (
          <>
            <Sequence durationInFrames={finCta} layout="none">
              <CtaCrecer tipo="guardar" boton="GUÁRDALO" linea="Para **el viernes**" />
              {cta ? <Subtitulos palabras={cta.palabras} desde={ENTRADA_VOZ} claro /> : null}
            </Sequence>
            <Sequence from={finCta}>
              <Cierre />
            </Sequence>
          </>
        );
      },
    },
  ];
};

export const W4801v2: React.FC<PropsVoz> = ({ voz, videoId }) => {
  if (!voz) return null;
  const T = tiempos(voz);
  return (
    <AbsoluteFill>
      <Montaje videoId={videoId} voz={voz} escenas={escenas(T, voz)} extra={EXTRA_W4801v2} pista="tech-synthpop.mp3" />
      <Sonidos T={T} />
    </AbsoluteFill>
  );
};
