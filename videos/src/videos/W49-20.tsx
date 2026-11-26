import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../brand";
import { Bocadillo, Chispas, CtaCrecer, DefEscena, Escena, Fondo, Montaje, Personaje, Pildora, PropsVoz, Rotulo, Sfx, SUELO_Y } from "../kit";

// W49-20 · «Tres cajas: ¿cuál te llevas?» · Reel · Dilema con cajas misteriosas + volado · H16 + H7
// Ejemplo (cálculo propio): 12 × 1,000 = 12,000; valor esperado del volado 0,5 × 25,000 = 12,500. Sin cifras externas.
// Todo DIBUJO. Las cajas tiemblan desde el fotograma 0; la moneda acaba de canto; cierre en bucle con las cajas cerradas.

export const EXTRA_W4920: Record<string, number> = { hook: 0.25, ab: 0.2, c: 0.2, riesgo: 0.2, cta: 0.8 };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (x: number) => 1 - (1 - x) ** 3;
const CARTON = "#C08A4E";
const CARTON_OSC = "#8B5E34";
const XS = [210, 540, 870];
const CAJA_Y = 1060; // base de las cajas

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

/* ---------- Piezas ---------- */

/** Caja de cartón con letra; `abre` 0–1 levanta las solapas; `tiembla` 0–1. */
const Caja: React.FC<{ x: number; y?: number; letra: string; abre?: number; tiembla?: number; escala?: number; color?: string; apagada?: number }> = ({
  x,
  y = CAJA_Y,
  letra,
  abre = 0,
  tiembla = 0,
  escala = 1,
  color = COLORS.gold,
  apagada = 0,
}) => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame * 1.7 + x) * 6 * tiembla;
  const rot = Math.sin(frame * 1.3 + x * 0.1) * 3 * tiembla;
  return (
    <div style={{ position: "absolute", left: x - 140 * escala + dx, top: y - 260 * escala, width: 280 * escala, height: 260 * escala, rotate: `${rot}deg`, transformOrigin: "50% 100%", opacity: 1 - apagada * 0.6 }}>
      <svg width={280 * escala} height={260 * escala} viewBox="0 0 280 260" style={{ overflow: "visible", filter: "drop-shadow(0 18px 22px rgba(0,0,0,0.45))" }}>
        {/* solapas */}
        <g transform={`rotate(${-abre * 120} 20 70)`}>
          <path d="M20 70 L20 30 L140 30 L140 70 Z" fill={CARTON_OSC} stroke={COLORS.navy} strokeWidth={5} strokeLinejoin="round" />
        </g>
        <g transform={`rotate(${abre * 120} 260 70)`}>
          <path d="M140 70 L140 30 L260 30 L260 70 Z" fill={CARTON_OSC} stroke={COLORS.navy} strokeWidth={5} strokeLinejoin="round" />
        </g>
        <rect x={20} y={66} width={240} height={190} rx={10} fill={CARTON} stroke={COLORS.navy} strokeWidth={6} />
        <rect x={20} y={66} width={240} height={26} fill={CARTON_OSC} opacity={0.5} />
        <path d="M120 66 L120 120 L160 120 L160 66" fill="#E7C79A" stroke={COLORS.navy} strokeWidth={3} opacity={0.9} />
        <text x={140} y={210} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={110} fill={color} stroke={COLORS.navy} strokeWidth={6} paintOrder="stroke">
          {letra}
        </text>
      </svg>
    </div>
  );
};

const Etiqueta: React.FC<{ x: number; y: number; arriba: string; abajo?: string; color?: string; s?: number }> = ({ x, y, arriba, abajo, color = COLORS.gold, s = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      translate: "-50% -50%",
      scale: String(s),
      background: "rgba(15,23,42,0.9)",
      border: `5px solid ${color}`,
      borderRadius: 22,
      padding: "8px 20px",
      fontFamily,
      textAlign: "center",
      whiteSpace: "nowrap",
      boxShadow: `0 0 30px ${color}66`,
    }}
  >
    <div style={{ fontSize: 60, fontWeight: 900, color, lineHeight: 1.05 }}>{arriba}</div>
    {abajo ? <div style={{ fontSize: 30, fontWeight: 800, color: COLORS.light }}>{abajo}</div> : null}
  </div>
);

const BilleteMini: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <svg width={110} height={56} viewBox="0 0 110 56" style={{ position: "absolute", left: x - 55, top: y - 28, rotate: `${rot}deg` }}>
    <rect x={3} y={3} width={104} height={50} rx={8} fill="#86EFAC" stroke={COLORS.navy} strokeWidth={4} />
    <circle cx={55} cy={28} r={13} fill="none" stroke="#166534" strokeWidth={4} />
  </svg>
);

/** Confeti de billetes que sale de (x, y) a partir del segundo `en`. */
const LluviaBilletes: React.FC<{ x: number; y: number; en: number; n?: number }> = ({ x, y, en, n = 10 }) => {
  const t = useSeg() - en;
  if (t < 0) return null;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const ang = -Math.PI / 2 + (i / (n - 1) - 0.5) * 2.2;
        const v = 900 + (i % 3) * 200;
        const bx = x + Math.cos(ang) * v * t * 0.6;
        const by = y + Math.sin(ang) * v * t + 1400 * t * t;
        return <BilleteMini key={i} x={bx} y={by} rot={i * 40 + t * 500 * (i % 2 ? 1 : -1)} />;
      })}
    </>
  );
};

/** Sobre con «$1,000». */
const Sobre: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", rotate: `${rot}deg` }}>
    <svg width={120} height={78} viewBox="0 0 120 78">
      <rect x={3} y={3} width={114} height={72} rx={8} fill={COLORS.paper} stroke={COLORS.navy} strokeWidth={4} />
      <path d="M3 6 L60 44 L117 6" fill="none" stroke={COLORS.navy} strokeWidth={4} />
      <text x={60} y={68} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={20} fill="#166534">
        $1,000
      </text>
    </svg>
  </div>
);

/** Moneda genérica: `giro` en vueltas; `canto` 0–1 la pone de perfil. */
const Moneda: React.FC<{ x: number; y: number; r?: number; giro?: number; canto?: number }> = ({ x, y, r = 120, giro = 0, canto = 0 }) => {
  const c = Math.cos(giro * Math.PI * 2);
  const ancho = canto > 0 ? interpolate(canto, [0, 1], [Math.abs(c), 0.14]) : Math.max(0.08, Math.abs(c));
  const cara = c >= 0 ? "ÁGUILA" : "SOL";
  return (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, scale: `${ancho} 1` }}>
      <svg width={2 * r} height={2 * r} viewBox="0 0 240 240" style={{ overflow: "visible", filter: "drop-shadow(0 16px 24px rgba(0,0,0,0.45))" }}>
        <circle cx={120} cy={120} r={114} fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={8} />
        <circle cx={120} cy={120} r={88} fill="none" stroke="#B45309" strokeWidth={6} strokeDasharray="10 8" />
        {ancho > 0.35 ? (
          <text x={120} y={136} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={44} fill="#92400E">
            {cara}
          </text>
        ) : null}
      </svg>
    </div>
  );
};

const Montones: React.FC<{ on: number }> = ({ on }) => (
  <>
    <div style={{ opacity: on, translate: `${(1 - on) * -80}px 0px` }}>
      <Etiqueta x={250} y={1120} arriba="$25,000" abajo="si cae águila" color="#4ADE80" />
    </div>
    <div style={{ opacity: on, translate: `${(1 - on) * 80}px 0px` }}>
      <Etiqueta x={830} y={1120} arriba="$0" abajo="si cae sol" color={COLORS.red} />
    </div>
  </>
);

/* ---------- Escenas ---------- */

const Cajas: React.FC<{ tiembla?: number }> = ({ tiembla = 1 }) => (
  <>
    {XS.map((x, i) => (
      <Caja key={i} x={x} letra={"ABC"[i]} tiembla={tiembla} />
    ))}
  </>
);

const Gancho: React.FC<{ congelar?: boolean }> = ({ congelar }) => {
  const t = useSeg();
  const n = congelar ? 3 : t < 0.7 ? 3 : t < 1.4 ? 2 : 1;
  const k = congelar ? 0.5 : (t % 0.7) / 0.7;
  return (
    <>
      <Rotulo texto="Solo puedes abrir **una**" delay={congelar ? -2 : -0.5} size={66} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 260, color: COLORS.gold, opacity: 1 - k * 0.6, scale: String(1.3 - k * 0.3), textShadow: "0 0 60px rgba(251,191,36,0.6)" }}>
        {n}
      </div>
      <Cajas />
    </>
  );
};

const Hook = () => (
  <Escena sinEntrada luz="#B45309">
    <Gancho />
    <Sfx s="tick" volumen={0.5} en={0.02} />
    <Sfx s="tick" volumen={0.5} en={0.7} />
    <Sfx s="tick" volumen={0.5} en={1.4} />
    <Extra s="bombo" en={0.02} volumen={0.3} />
  </Escena>
);

const AB = () => {
  const t = useSeg();
  const A = 0.05;
  const B = 1.35;
  const abreA = interpolate(t, [A, A + 0.25], [0, 1], { ...clamp, easing: easeOut });
  const abreB = interpolate(t, [B, B + 0.25], [0, 1], { ...clamp, easing: easeOut });
  const sA = interpolate(t, [A + 0.2, A + 0.5], [0, 1], { ...clamp, easing: easeOut });
  const sB = interpolate(t, [B + 1.4, B + 1.7], [0, 1], { ...clamp, easing: easeOut });
  return (
    <Escena luz="#15803D" sonidoEntrada={null}>
      <div style={{ position: "absolute", left: 90, top: 1300 }}><Pildora size={30}>Ejemplo</Pildora></div>
      <Caja x={XS[0]} letra="A" abre={abreA} color="#4ADE80" />
      <Caja x={XS[1]} letra="B" abre={abreB} color={COLORS.accent} />
      <Caja x={XS[2]} letra="C" tiembla={1} />
      <LluviaBilletes x={XS[0]} y={CAJA_Y - 200} en={A + 0.1} n={12} />
      {sA > 0 ? <Etiqueta x={XS[0] + 40} y={520} arriba="$10,000" abajo="hoy" color="#4ADE80" s={sA} /> : null}
      {/* 12 sobres que caen uno tras otro desde la caja B */}
      {Array.from({ length: 12 }, (_, i) => {
        const en = B + 0.2 + i * 0.1;
        const k = interpolate(t, [en, en + 0.35], [0, 1], { ...clamp, easing: easeOut });
        if (k <= 0) return null;
        const col = i % 4;
        const fila = Math.floor(i / 4);
        return <Sobre key={i} x={XS[1] - 180 + col * 120 + 60 * (fila % 2)} y={interpolate(k, [0, 1], [CAJA_Y - 200, 470 + fila * 80])} rot={(i % 3) * 6 - 6} />;
      })}
      {sB > 0 ? <Etiqueta x={XS[1] + 90} y={770} arriba="$1,000 × 12" abajo="= $12,000 en un año" color={COLORS.accent} s={sB * 0.9} /> : null}
      <Sfx s="pop" volumen={0.5} en={A} />
      <Sfx s="pop" volumen={0.45} en={B} />
      {Array.from({ length: 12 }, (_, i) => (i % 3 === 0 ? <Sfx key={i} s="tick" volumen={0.25} en={B + 0.2 + i * 0.1} /> : null))}
    </Escena>
  );
};

const C = () => {
  const t = useSeg();
  const abre = interpolate(t, [0.05, 0.3], [0, 1], { ...clamp, easing: easeOut });
  const sube = interpolate(t, [0.2, 0.8], [0, 1], { ...clamp, easing: easeOut });
  const giro = t * 1.6;
  const montones = interpolate(t, [2.0, 2.4], [0, 1], { ...clamp, easing: easeOut });
  return (
    <Escena luz="#7C2D12" sonidoEntrada={null}>
      <div style={{ position: "absolute", left: 90, top: 1300 }}><Pildora size={30}>Ejemplo</Pildora></div>
      <Rotulo texto="La C: **¿águila o sol?**" size={64} />
      <Caja x={XS[0]} letra="A" apagada={1} escala={0.8} y={CAJA_Y + 180} />
      <Caja x={XS[1]} letra="C" abre={abre} y={CAJA_Y + 180} color={COLORS.gold} />
      <Caja x={XS[2]} letra="B" apagada={1} escala={0.8} y={CAJA_Y + 180} />
      <Moneda x={540} y={interpolate(sube, [0, 1], [1100, 700])} r={interpolate(sube, [0, 1], [60, 150])} giro={giro} />
      <Montones on={montones} />
      <Sfx s="pop" volumen={0.5} en={0.05} />
      <Sfx s="riser" volumen={0.3} en={0.6} />
      <Sfx s="impacto" volumen={0.4} en={2.1} />
    </Escena>
  );
};

const Balanza: React.FC<{ incl: number; cRojo: number }> = ({ incl, cRojo }) => {
  const ang = incl * 9;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect x={525} y={660} width={30} height={420} rx={10} fill={COLORS.light} stroke={COLORS.navy} strokeWidth={5} />
        <path d="M440 1090 L640 1090 L600 1060 L480 1060 Z" fill={COLORS.light} stroke={COLORS.navy} strokeWidth={5} />
        <g transform={`rotate(${ang} 540 660)`}>
          <rect x={150} y={648} width={780} height={24} rx={12} fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={5} />
          <circle cx={540} cy={660} r={22} fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={5} />
        </g>
      </svg>
      {/* platos: izquierda A y B; derecha C */}
      {[
        { x: 200, lado: -1, cont: <><Etiqueta x={0} y={-150} arriba="A $10,000" color="#4ADE80" s={0.62} /><Etiqueta x={0} y={-60} arriba="B $12,000" color={COLORS.accent} s={0.62} /></> },
        { x: 880, lado: 1, cont: <Etiqueta x={0} y={-90} arriba={cRojo > 0.5 ? "C $0" : "C $12,500"} abajo={cRojo > 0.5 ? "1 de cada 2 veces" : "en promedio"} color={cRojo > 0.5 ? COLORS.red : COLORS.gold} s={0.75 + cRojo * 0.15} /> },
      ].map(({ x, lado, cont }) => {
        const dy = Math.sin((ang * Math.PI) / 180) * (x - 540);
        return (
          <div key={x} style={{ position: "absolute", left: x, top: 660 + dy + 120 }}>
            <svg width={240} height={140} viewBox="0 0 240 140" style={{ position: "absolute", left: -120, top: -120, overflow: "visible" }}>
              <line x1={20} y1={100} x2={120} y2={-10} stroke={COLORS.light} strokeWidth={4} />
              <line x1={220} y1={100} x2={120} y2={-10} stroke={COLORS.light} strokeWidth={4} />
              <path d="M10 100 Q120 150 230 100 Z" fill={COLORS.light} stroke={COLORS.navy} strokeWidth={5} />
            </svg>
            {cont}
            <span style={{ display: "none" }}>{lado}</span>
          </div>
        );
      })}
    </div>
  );
};

const Riesgo = () => {
  const t = useSeg();
  const PERO = 1.9;
  const DEPA = 4.1;
  const incl = t < PERO ? interpolate(t, [0.4, 1.1], [0, 0.4], { ...clamp, easing: easeOut }) : interpolate(t, [PERO + 0.9, PERO + 1.4], [0.4, -1], { ...clamp, easing: easeOut });
  const cRojo = interpolate(t, [PERO + 1.4, PERO + 1.5], [0, 1], clamp);
  const depa = interpolate(t, [DEPA, DEPA + 0.4], [0, 1], { ...clamp, easing: easeOut });
  const frame = useCurrentFrame();
  return (
    <Escena luz="#1E3A8A" sonidoEntrada="whoosh" sacudidas={[PERO + 1.45]}>
      <div style={{ position: "absolute", left: 90, top: 1300 }}><Pildora size={30}>Ejemplo</Pildora></div>
      {t < DEPA ? (
        <>
          <Rotulo texto={t < PERO ? "En promedio **gana la C**" : "Pero 1 de cada 2 veces: **$0**"} size={60} />
          <Balanza incl={incl} cRojo={cRojo} />
          <Sfx s="ding" volumen={0.35} en={0.9} />
          <Sfx s="impacto" volumen={0.5} en={PERO + 1.45} />
        </>
      ) : (
        <>
          <Rotulo texto="La mejor caja es **la que puedes perder**" size={58} />
          <div style={{ opacity: depa }}>
            <Personaje x={330} y={SUELO_Y} escala={1.8} color={COLORS.accent} expresion="preocupado" pose="senala" mirar="der" semilla={4} />
            {/* recibo de la renta */}
            <div style={{ position: "absolute", left: 150, top: 820, rotate: "-10deg", background: COLORS.paper, border: `5px solid ${COLORS.navy}`, borderRadius: 10, padding: "8px 16px", fontFamily, fontWeight: 900, fontSize: 34, color: COLORS.navy }}>
              RENTA DEL DEPA
            </div>
            {/* gotas de sudor */}
            {[0, 1, 2].map((i) => {
              const k = ((frame + i * 12) % 36) / 36;
              return <div key={i} style={{ position: "absolute", left: 420 + i * 30, top: 700 + k * 120, width: 18, height: 26, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#7DD3FC", opacity: 1 - k }} />;
            })}
            <Caja x={810} y={1160} letra="C" tiembla={1} color={COLORS.gold} />
            <Bocadillo texto="¿Y si sale sol?" x={760} y={560} ancho={360} size={44} delay={DEPA + 0.5} colaX={-110} />
          </div>
          <Sfx s="pop" volumen={0.4} en={DEPA + 0.5} />
        </>
      )}
    </Escena>
  );
};

const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const CORTE = Math.round(2.3 * fps);
  const CAE = 1.2;
  const y = interpolate(t, [0, CAE], [420, 980], { ...clamp, easing: (x) => x * x });
  const bote = t > CAE ? Math.abs(Math.sin((t - CAE) * 14)) * 30 * Math.max(0, 1 - (t - CAE) * 3) : 0;
  const canto = interpolate(t, [CAE, CAE + 0.25], [0, 1], clamp);
  const vuelta = interpolate(frame, [dur - 10, dur - 2], [0, 1], clamp);
  return (
    <>
      <Sequence durationInFrames={CORTE} layout="none">
        <Escena luz="#B45309" sonidoEntrada="swoosh">
          <Rotulo texto={t < CAE + 0.2 ? "Y el volado…" : "Cayó **de canto** 🙃"} size={64} />
          <Moneda x={540} y={y - bote} r={150} giro={t * 3} canto={canto} />
          <div style={{ position: "absolute", left: 140, right: 140, top: 1135, height: 14, borderRadius: 8, background: COLORS.light, opacity: 0.5 }} />
          <Sfx s="ding" volumen={0.5} en={CAE} />
          <Chispas en={CAE} x={540} y={1000} color={COLORS.gold} n={10} />
        </Escena>
      </Sequence>
      <Sequence from={CORTE} layout="none">
        <CtaCrecer tipo="comentar" boton="¿A, B o C? 👇" linea="Etiqueta al que **se avienta con la C**" />
        <div style={{ position: "absolute", top: 1272, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 28, fontWeight: 700, color: COLORS.navy }}>
          Ejemplo · Contenido informativo, no es asesoramiento financiero.
        </div>
      </Sequence>
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
  { id: "ab", render: () => <AB /> },
  { id: "c", render: () => <C /> },
  { id: "riesgo", render: () => <Riesgo /> },
  { id: "cta", subtitulosClaros: true, render: ({ dur }) => <Cta dur={dur} /> },
];

export const W4920: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4920} pista="minimal-ambient-tech.mp3" /> : null;
