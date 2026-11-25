import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../brand";
import { Chispas, Cifra, CtaCrecer, DefEscena, Escena, Fondo, Montaje, Pildora, PropsVoz, Rotulo, Sfx, useSpring } from "../kit";

// W49-09 · «La tanda de la oficina: ¿pides el 1 o el 10?» · Reel · Dilema A/B · H7 · CTA COMENTAR con un número
// Ejemplo (cálculo propio): 10 personas × $1,000 = $10,000 por turno. No recomienda ninguna opción.
// Los números son personajes: papelitos con ojos («1», «10») y la silla del 7 que se esfuma. Todo DIBUJO.

export const EXTRA_W4909: Record<string, number> = { hook: 0.2, raja: 0.6, decide: 0.3, cta: 0.9 };

const UNO = COLORS.accent;
const DIEZ = COLORS.gold;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pesos = (v: number) => "$" + String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/* ---------- Personajes: papelitos de la tanda ---------- */
const Papelito: React.FC<{
  n: string;
  color: string;
  x: number;
  y: number;
  escala?: number;
  mirar?: number; // -1 izq, 0 frente, 1 der
  reojo?: boolean;
  boca?: "feliz" | "o" | "recta" | "preocupado";
  abierto?: number; // 0 = doblado, 1 = abierto
  rot?: number;
  semilla?: number;
}> = ({ n, color, x, y, escala = 1, mirar = 0, reojo = false, boca = "feliz", abierto = 1, rot = 0, semilla = 0 }) => {
  const frame = useCurrentFrame();
  const t = frame / 30 + semilla;
  const flota = Math.sin(t * 2.2) * 8;
  const parpadeo = (frame + semilla * 37) % 95 < 4 ? 0.1 : 1;
  const W = 240;
  const H = 300;
  const ojoY = reojo ? 0.35 : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + flota,
        translate: "-50% -50%",
        scale: String(escala),
        rotate: `${rot + Math.sin(t * 1.7) * 2}deg`,
      }}
    >
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible", filter: "drop-shadow(0 16px 26px rgba(0,0,0,0.4))" }}>
        {/* papel (se despliega de arriba abajo) */}
        <g transform={`translate(0 ${(1 - abierto) * H * 0.5}) scale(1 ${0.35 + 0.65 * abierto})`}>
          <path d={`M8 8 H${W - 50} L${W - 8} 50 V${H - 8} H8 Z`} fill={COLORS.paper} stroke={COLORS.navy} strokeWidth={6} strokeLinejoin="round" />
          <path d={`M${W - 50} 8 V50 H${W - 8}`} fill="#E2E8F0" stroke={COLORS.navy} strokeWidth={6} strokeLinejoin="round" />
          <line x1={14} y1={H / 2} x2={W - 14} y2={H / 2} stroke={COLORS.navy} strokeOpacity={0.12} strokeWidth={4} />
          <text x={W / 2} y={H * 0.52} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={n.length > 1 ? 120 : 150} fill={color} stroke={COLORS.navy} strokeWidth={5} paintOrder="stroke">
            {n}
          </text>
          {/* cara */}
          {[W / 2 - 40, W / 2 + 40].map((cx) => (
            <g key={cx} transform={`translate(${cx} ${H * 0.7}) scale(1 ${parpadeo * ojoY})`}>
              <ellipse rx={20} ry={22} fill={COLORS.white} stroke={COLORS.navy} strokeWidth={4} />
              <circle cx={mirar * 9} cy={reojo ? 4 : 2} r={9} fill={COLORS.navy} />
            </g>
          ))}
          {boca === "feliz" ? <path d={`M${W / 2 - 22} ${H * 0.83} Q${W / 2} ${H * 0.9} ${W / 2 + 22} ${H * 0.83}`} stroke={COLORS.navy} strokeWidth={6} fill="none" strokeLinecap="round" /> : null}
          {boca === "o" ? <ellipse cx={W / 2} cy={H * 0.86} rx={10} ry={13} fill={COLORS.navy} /> : null}
          {boca === "recta" ? <line x1={W / 2 - 18} y1={H * 0.86} x2={W / 2 + 18} y2={H * 0.86} stroke={COLORS.navy} strokeWidth={6} strokeLinecap="round" /> : null}
          {boca === "preocupado" ? <path d={`M${W / 2 - 22} ${H * 0.88} Q${W / 2 - 11} ${H * 0.84} ${W / 2} ${H * 0.88} Q${W / 2 + 11} ${H * 0.92} ${W / 2 + 22} ${H * 0.88}`} stroke={COLORS.navy} strokeWidth={6} fill="none" strokeLinecap="round" /> : null}
        </g>
      </svg>
    </div>
  );
};

/* ---------- Taza de oficina ---------- */
const Taza: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={360} height={300} style={{ position: "absolute", left: x - 180, top: y, overflow: "visible" }}>
    <path d="M300 80 Q360 80 360 150 Q360 220 290 220" stroke={COLORS.light} strokeWidth={26} fill="none" />
    <path d="M20 20 H300 L280 290 H40 Z" fill={COLORS.light} stroke={COLORS.navy} strokeWidth={8} strokeLinejoin="round" />
    <ellipse cx={160} cy={20} rx={140} ry={22} fill="#1E293B" stroke={COLORS.navy} strokeWidth={8} />
    <text x={160} y={180} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={44} fill={COLORS.blue}>
      TANDA
    </text>
    <text x={160} y={230} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={28} fill={COLORS.navy}>
      la de la ofi ☕
    </text>
  </svg>
);

/* ---------- Silla de oficina ---------- */
const Silla: React.FC<{ n: number; x: number; y: number; giro?: number; op?: number; escala?: number }> = ({ n, x, y, giro = 0, op = 1, escala = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", opacity: op, scale: String(escala), rotate: `${giro}deg` }}>
    <svg width={120} height={150} viewBox="0 0 120 150" style={{ overflow: "visible" }}>
      <rect x={22} y={4} width={76} height={70} rx={20} fill={COLORS.blue} stroke={COLORS.navy} strokeWidth={5} />
      <rect x={12} y={74} width={96} height={24} rx={12} fill="#1E40AF" stroke={COLORS.navy} strokeWidth={5} />
      <line x1={60} y1={98} x2={60} y2={128} stroke={COLORS.navy} strokeWidth={8} />
      <path d="M22 140 L60 126 L98 140" stroke={COLORS.navy} strokeWidth={8} fill="none" strokeLinecap="round" />
      <text x={60} y={56} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={42} fill={COLORS.white}>
        {n}
      </text>
    </svg>
  </div>
);

const CENTRO = { x: 540, y: 780 };
const posSilla = (i: number, rx = 330, ry = 300) => {
  const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
  return { x: CENTRO.x + Math.cos(a) * rx, y: CENTRO.y + Math.sin(a) * ry, a };
};

const Moneda: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle at 35% 30%, #FDE68A, ${COLORS.gold} 60%, #B45309)`,
      border: `4px solid ${COLORS.navy}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily,
      fontWeight: 900,
      fontSize: size * 0.45,
      color: COLORS.navy,
    }}
  >
    $
  </div>
);

/* ---------- Escenas ---------- */

/** Composición del gancho (se reutiliza al final para el bucle). */
const Gancho: React.FC<{ congelar?: boolean }> = ({ congelar }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = congelar ? 0 : frame / fps;
  // los papelitos ya asoman en el fotograma 0, salen de la taza y se abren
  const sale = interpolate(t, [0, 0.5], [0.15, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  const abre = interpolate(t, [0.45, 0.8], [0.35, 1], clamp);
  const y = interpolate(sale, [0, 1], [1040, 780]);
  return (
    <>
      <Rotulo texto="Tanda de $1,000. ¿Pides el **1** o el **10**?" delay={congelar ? -2 : -0.4} size={60} />
      <Papelito n="1" color={UNO} x={interpolate(sale, [0, 1], [470, 300])} y={y} rot={-8} abierto={abre} boca="o" mirar={1} />
      <Papelito n="10" color={DIEZ} x={interpolate(sale, [0, 1], [610, 780])} y={y} rot={8} abierto={abre} boca="o" mirar={-1} semilla={1.3} />
      <Taza x={540} y={970} />
    </>
  );
};

const Hook = () => (
  <Escena sinEntrada luz="#1E3A8A" sacudidas={[0.5]}>
    <Sfx s="impacto" volumen={0.45} />
    <Sfx s="swoosh" volumen={0.4} en={0.05} />
    <Sfx s="pop" volumen={0.45} en={0.6} />
    <Gancho />
  </Escena>
);

const Diez: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const finM = dur / fps - 0.6;
  return (
    <Escena luz="#14532D">
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Pildora size={44} bg="rgba(251,191,36,0.18)">10 × $1,000 = $10,000</Pildora>
      </div>
      {Array.from({ length: 10 }, (_, i) => {
        const p = posSilla(i);
        return <Silla key={i} n={i + 1} x={p.x} y={p.y} escala={Math.min(1, Math.max(0, (t - i * 0.06) * 5))} />;
      })}
      {/* monedas que viajan al centro */}
      {Array.from({ length: 10 }, (_, i) => {
        const p = posSilla(i);
        const k = interpolate(t, [0.5 + i * 0.09, 1.0 + i * 0.09], [0, 1], { ...clamp, easing: (x) => x * x });
        if (k <= 0 || k >= 1) return null;
        return (
          <div key={i} style={{ position: "absolute", left: p.x + (CENTRO.x - p.x) * k, top: p.y + (CENTRO.y - p.y) * k - Math.sin(k * Math.PI) * 120, translate: "-50% -50%" }}>
            <Moneda />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: CENTRO.x, top: CENTRO.y, translate: "-50% -50%" }}>
        <Cifra a={10000} de={0} inicio={0.55} fin={Math.max(1.6, finM)} size={110} color={COLORS.gold} formato={pesos} />
      </div>
      <Sfx s="ding" volumen={0.35} en={Math.max(1.6, finM)} />
    </Escena>
  );
};

const Spoiler = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // se miran de reojo: los ojos van y vienen
  const m1 = t < 0.8 ? 0 : t < 1.6 ? 1 : 0.2;
  const m2 = t < 1.1 ? 0 : t < 1.9 ? -1 : -0.2;
  const s = useSpring(0.15, 12, 0.7);
  return (
    <Escena luz="#4C1D95">
      <Rotulo texto="Spoiler: los dos ganan **algo distinto**" size={60} />
      <Papelito n="1" color={UNO} x={330 - (1 - s) * 400} y={820} reojo boca="recta" mirar={m1} rot={-4} />
      <Papelito n="10" color={DIEZ} x={750 + (1 - s) * 400} y={820} reojo boca="recta" mirar={m2} rot={4} semilla={1.3} />
      <div style={{ position: "absolute", left: 540, top: 820, translate: "-50% -50%", fontFamily, fontWeight: 900, fontSize: 90, color: COLORS.white, opacity: s, textShadow: `0 0 40px ${COLORS.accent}` }}>
        👀
      </div>
      <Sfx s="pop" volumen={0.35} en={0.8} />
      <Sfx s="pop" volumen={0.35} en={1.1} />
    </Escena>
  );
};

const Recibo: React.FC<{ i: number; tachado: number }> = ({ i, tachado }) => (
  <div style={{ position: "relative", width: 76, height: 104, background: COLORS.paper, border: `4px solid ${COLORS.navy}`, borderRadius: 8, fontFamily, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.grey }}>Q{i + 1}</div>
    <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.navy }}>$1,000</div>
    {tachado > 0 ? (
      <svg width={76} height={104} style={{ position: "absolute", left: -4, top: -4 }}>
        <path d={`M10 14 L${10 + 56 * tachado} ${14 + 76 * tachado}`} stroke={COLORS.green} strokeWidth={8} strokeLinecap="round" />
        <path d={`M66 14 L${66 - 56 * tachado} ${14 + 76 * tachado}`} stroke={COLORS.green} strokeWidth={8} strokeLinecap="round" />
      </svg>
    ) : null}
  </div>
);

const Uno: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const fin = dur / fps;
  const bolsa = useSpring(0.2, 9, 0.6);
  return (
    <Escena luz="#1E3A8A">
      <Rotulo texto="N.º 1 = **préstamo** sin intereses" size={60} />
      <Papelito n="1" color={UNO} x={330} y={700} boca="feliz" mirar={1} escala={0.95} />
      {/* bolsa de dinero */}
      <div style={{ position: "absolute", left: 640, top: 560, scale: String(bolsa), rotate: `${(1 - bolsa) * 30}deg` }}>
        <svg width={260} height={270} viewBox="0 0 260 270">
          <path d="M90 60 Q130 90 170 60 L150 30 Q130 44 110 30 Z" fill="#A16207" stroke={COLORS.navy} strokeWidth={6} strokeLinejoin="round" />
          <path d="M100 70 Q20 140 40 220 Q60 262 130 262 Q200 262 220 220 Q240 140 160 70 Z" fill="#CA8A04" stroke={COLORS.navy} strokeWidth={6} />
          <text x={130} y={200} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={46} fill={COLORS.navy}>
            $10,000
          </text>
        </svg>
      </div>
      <Sfx s="pop" volumen={0.4} en={0.2} />
      {/* fila de 10 recibos que se tachan */}
      <div style={{ position: "absolute", left: 90, right: 120, top: 960, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        {Array.from({ length: 10 }, (_, i) => (
          <Recibo key={i} i={i} tachado={interpolate(t, [1.4 + i * ((fin - 1.9) / 10), 1.4 + (i + 0.8) * ((fin - 1.9) / 10)], [0, 1], clamp)} />
        ))}
      </div>
      <div style={{ position: "absolute", top: 1230, left: 0, right: 0, textAlign: "center", fontFamily, fontWeight: 800, fontSize: 34, color: COLORS.light }}>
        Hoy cobra · luego paga 10 quincenas
      </div>
    </Escena>
  );
};

const ElDiez: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const fin = dur / fps;
  const lleno = interpolate(t, [0.3, fin - 0.4], [0, 1], clamp);
  const tela = interpolate(t, [fin - 1.6, fin - 0.8], [0, 1], clamp);
  const monedaK = (t * 2.6) % 1;
  return (
    <Escena luz="#78350F">
      <Rotulo texto="N.º 10 = **ahorro** sin rendimiento" size={60} />
      <Papelito n="10" color={DIEZ} x={300} y={760} boca="recta" mirar={1} escala={0.95} semilla={1.3} />
      {/* moneda que cae en la alcancía en bucle */}
      {t > 0.3 && t < fin - 0.4 ? (
        <div style={{ position: "absolute", left: 720, top: 560 + monedaK * 200, translate: "-50% 0", opacity: 1 - monedaK * 0.5 }}>
          <Moneda size={60} />
        </div>
      ) : null}
      {/* alcancía de vidrio que se llena */}
      <div style={{ position: "absolute", left: 590, top: 760, width: 260, height: 340 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "40px 40px 60px 60px", border: `8px solid ${COLORS.light}`, background: "rgba(199,215,254,0.12)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lleno * 100}%`, background: `repeating-radial-gradient(circle at 30% 40%, ${COLORS.gold} 0 18px, #D97706 18px 22px)` }} />
        </div>
        <div style={{ position: "absolute", left: 90, top: -14, width: 80, height: 20, borderRadius: 10, background: COLORS.navy }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 350, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 40, color: COLORS.gold }}>
          {pesos(Math.round(lleno * 10) * 1000)}
        </div>
        {/* telaraña */}
        <svg width={160} height={160} style={{ position: "absolute", right: -40, top: -40, opacity: tela }}>
          <g stroke={COLORS.white} strokeWidth={3} fill="none" opacity={0.85}>
            <path d="M160 0 L40 120 M160 0 L60 0 M160 0 L160 100 M160 0 L90 140 M160 0 L20 60" />
            <path d="M120 0 Q130 30 160 40 M90 0 Q105 50 160 70 M60 10 Q90 70 160 100" />
          </g>
        </svg>
      </div>
      {Array.from({ length: Math.floor(Math.max(0, fin - 0.7) * 2.6) }, (_, i) => (
        <Sfx key={i} s="tick" volumen={0.22} en={0.3 + (i + 0.8) / 2.6} />
      ))}
    </Escena>
  );
};

const Raja: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const PUF = 1.3;
  const humo = interpolate(t, [PUF, PUF + 0.6], [0, 1], clamp);
  const giro = interpolate(t, [PUF + 0.5, PUF + 1.1], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  const p7 = posSilla(6);
  return (
    <Escena luz="#7F1D1D" sacudidas={[PUF]}>
      <Rotulo texto="…si **nadie se raja**" size={66} />
      {Array.from({ length: 10 }, (_, i) => {
        const p = posSilla(i);
        if (i === 6) {
          return <Silla key={i} n={7} x={p.x} y={p.y} op={1 - humo} escala={1 + humo * 0.3} />;
        }
        // las demás sillas giran hacia el hueco
        const hacia = (Math.atan2(p7.y - p.y, p7.x - p.x) * 180) / Math.PI;
        return <Silla key={i} n={i + 1} x={p.x} y={p.y} giro={giro * Math.max(-25, Math.min(25, hacia / 6))} />;
      })}
      {/* nube de humo */}
      {humo > 0 && humo < 1
        ? [0, 1, 2, 3, 4].map((k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                left: p7.x + Math.cos(k * 1.3) * 70 * humo,
                top: p7.y + Math.sin(k * 1.3) * 50 * humo - humo * 60,
                width: 110 + humo * 60,
                height: 110 + humo * 60,
                translate: "-50% -50%",
                borderRadius: "50%",
                background: "#CBD5E1",
                opacity: (1 - humo) * 0.9,
              }}
            />
          ))
        : null}
      {t > PUF + 0.4 ? (
        <div style={{ position: "absolute", left: p7.x, top: p7.y, translate: "-50% -50%", fontFamily, fontWeight: 900, fontSize: 110, color: COLORS.red, opacity: interpolate(t, [PUF + 0.4, PUF + 0.7], [0, 1], clamp) }}>
          ?
        </div>
      ) : null}
      <div style={{ position: "absolute", left: CENTRO.x, top: CENTRO.y, translate: "-50% -50%", fontFamily, fontWeight: 900, fontSize: 90, color: COLORS.gold, textShadow: `0 0 30px ${COLORS.gold}88` }}>
        {t < PUF ? "$10,000" : "$9,000"}
      </div>
      <Sfx s="impacto" volumen={0.5} en={PUF} />
      <Sfx s="swoosh" volumen={0.35} en={PUF + 0.5} />
      <Chispas en={PUF} x={p7.x} y={p7.y} color={COLORS.light} n={14} />
    </Escena>
  );
};

const Cartel: React.FC<{ pregunta: string; n: string; color: string; on: number }> = ({ pregunta, n, color, on }) => (
  <div
    style={{
      width: 860,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 30,
      padding: "28px 40px",
      borderRadius: 40,
      background: on ? `${color}2E` : "rgba(255,255,255,0.05)",
      border: `6px solid ${on ? color : "rgba(255,255,255,0.15)"}`,
      boxShadow: on ? `0 0 60px ${color}66` : "none",
      scale: String(1 + on * 0.04),
      opacity: 0.45 + 0.55 * on,
      fontFamily,
    }}
  >
    <div style={{ fontSize: 50, fontWeight: 900, color: COLORS.white, lineHeight: 1.1 }}>{pregunta}</div>
    <div style={{ fontSize: 130, fontWeight: 900, color, textShadow: `0 0 30px ${color}` }}>{n}</div>
  </div>
);

const Decide: React.FC<{ dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const on1 = interpolate(t, [0.1, 0.3, 2.3, 2.5], [0, 1, 1, 0.2], clamp);
  const on2 = interpolate(t, [2.5, 2.7], [0, 1], clamp);
  return (
    <Escena luz="#1E3A8A">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 60, top: -200, bottom: 0 }}>
        <Cartel pregunta="¿La necesitas ya?" n="1" color={UNO} on={on1} />
        <Cartel pregunta="¿Quieres forzarte a ahorrar?" n="10" color={DIEZ} on={on2} />
      </AbsoluteFill>
      <Sfx s="ding" volumen={0.35} en={1.3} />
      <Sfx s="ding" volumen={0.35} en={2.6} />
    </Escena>
  );
};

const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const vuelta = interpolate(frame, [dur - 10, dur - 2], [0, 1], clamp);
  return (
    <>
      <CtaCrecer tipo="comentar" boton="¿1 o 10?" linea="Comenta **tu número** 👇" />
      <div style={{ position: "absolute", top: 1272, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 28, fontWeight: 700, color: COLORS.navy }}>
        Contenido informativo, no es asesoramiento financiero.
      </div>
      {vuelta > 0 ? (
        <AbsoluteFill style={{ opacity: vuelta, fontFamily }}>
          <Fondo luz="#1E3A8A" />
          <Gancho congelar />
        </AbsoluteFill>
      ) : null}
    </>
  );
};

const ESCENAS: DefEscena[] = [
  { id: "hook", render: () => <Hook /> },
  { id: "diez", render: ({ dur }) => <Diez dur={dur} /> },
  { id: "spoiler", render: () => <Spoiler /> },
  { id: "uno", render: ({ dur }) => <Uno dur={dur} /> },
  { id: "elDiez", render: ({ dur }) => <ElDiez dur={dur} /> },
  { id: "raja", render: ({ dur }) => <Raja dur={dur} /> },
  { id: "decide", render: ({ dur }) => <Decide dur={dur} /> },
  { id: "cta", subtitulosClaros: true, render: ({ dur }) => <Cta dur={dur} /> },
];

export const W4909: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4909} pista="long-day.mp3" /> : null;
