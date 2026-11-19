import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../brand";
import { Chispas, CtaCrecer, DefEscena, Escena, Escenario, Foto, Lluvia, Montaje, Pildora, PropsVoz, Rotulo, Sfx, useSpring } from "../kit";

// W49-02 · «¿Y si mañana cierra tu banco?» · QUÉ PASARÍA SI · estilo mixto (1 foto + dibujo en código) · CTA COMENTAR
// Dato: el FGD garantiza hasta 100.000 € por depositante y entidad (Banco de España, Portal del Cliente Bancario).
// Sin nombrar bancos. Dos versiones de la misma escena (dentro del límite / por encima) con un rebobinado entre ellas.
// Música: quiet-courtyard. Fondo dominante: calle de noche con lluvia.
export const EXTRA_W4902: Record<string, number> = { hook: 0.3, wow: 1.0, rehook: 0.6, cta: 0.4, cierre: 0.6 };

// La foto de la escena 3 solo se usa si llegó y pasó la revisión (Paso 0). Si no, la fachada se dibuja en código.
const FOTO_SUCURSAL: string | null = "img/W49-02/03-sucursal-cerrada.jpg";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useSeg = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

/* ---------- Sucursal genérica con persiana (sin rótulos) ---------- */
const Sucursal: React.FC<{ baja: number; polvo?: number; y?: number; escala?: number; farola?: boolean }> = ({ baja, polvo = -1, y = 560, escala = 1, farola = false }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = 700;
  const H = 640;
  const hueco = { x: 110, y: 150, w: 480, h: 450 };
  const alto = hueco.h * baja;
  const pp = polvo >= 0 ? (f / fps - polvo) : -1;
  return (
    <div style={{ position: "absolute", left: 540 - (W / 2) * escala, top: y, width: W * escala, height: H * escala }}>
      <svg width={W * escala} height={H * escala} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
        {farola ? (
          <g>
            <ellipse cx={-40} cy={260} rx={180} ry={260} fill={COLORS.gold} opacity={0.12 + 0.03 * Math.sin(f / 5)} />
            <rect x={-50} y={120} width={14} height={520} fill={COLORS.navy} />
            <path d="M-80 120 H-6 L-20 90 H-66 Z" fill={COLORS.navy} />
            <circle cx={-43} cy={128} r={14} fill={COLORS.gold} />
          </g>
        ) : null}
        {/* fachada */}
        <rect x={0} y={0} width={W} height={H} rx={14} fill="#2B3A67" stroke={COLORS.navy} strokeWidth={6} />
        {Array.from({ length: 8 }, (_, k) => (
          <line key={k} x1={0} x2={W} y1={40 + k * 80} y2={40 + k * 80} stroke={COLORS.navy} strokeOpacity={0.35} strokeWidth={3} />
        ))}
        {/* letrero vacío */}
        <rect x={90} y={40} width={520} height={80} rx={12} fill={COLORS.navy} stroke={COLORS.light} strokeOpacity={0.4} strokeWidth={4} />
        {/* hueco: interior oscuro */}
        <rect x={hueco.x} y={hueco.y} width={hueco.w} height={hueco.h} fill={COLORS.deep} />
        <rect x={hueco.x + 30} y={hueco.y + 60} width={180} height={260} rx={8} fill={COLORS.blue} opacity={0.25} />
        <rect x={hueco.x + 270} y={hueco.y + 60} width={180} height={260} rx={8} fill={COLORS.blue} opacity={0.25} />
        {/* persiana */}
        <g>
          <rect x={hueco.x} y={hueco.y} width={hueco.w} height={alto} fill={COLORS.grey} />
          {Array.from({ length: Math.ceil(alto / 26) }, (_, k) => (
            <line key={k} x1={hueco.x} x2={hueco.x + hueco.w} y1={hueco.y + alto - k * 26} y2={hueco.y + alto - k * 26} stroke={COLORS.navy} strokeOpacity={0.45} strokeWidth={4} />
          ))}
          <rect x={hueco.x - 6} y={hueco.y + alto - 14} width={hueco.w + 12} height={18} rx={4} fill={COLORS.light} stroke={COLORS.navy} strokeWidth={3} />
        </g>
        <rect x={hueco.x - 16} y={hueco.y - 20} width={hueco.w + 32} height={30} rx={8} fill={COLORS.navy} />
        {/* polvo al tocar el suelo */}
        {pp >= 0 && pp < 1.2
          ? Array.from({ length: 10 }, (_, k) => {
              const ang = (k / 9) * Math.PI;
              const r = pp * 260;
              return (
                <circle
                  key={k}
                  cx={hueco.x + hueco.w / 2 + Math.cos(ang) * r * (k % 2 ? 1 : -1)}
                  cy={hueco.y + hueco.h - Math.sin(ang) * r * 0.25}
                  r={18 * (1 - pp / 1.2) + 4}
                  fill={COLORS.light}
                  opacity={0.6 * (1 - pp / 1.2)}
                />
              );
            })
          : null}
      </svg>
    </div>
  );
};

/* ---------- Billetes, cúpula ---------- */
const PilaBilletes: React.FC<{ x: number; base: number; n: number; techo?: number; ancho?: number }> = ({ x, base, n, techo = -1, ancho = 240 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {Array.from({ length: Math.floor(n) }, (_, k) => {
        const y = base - 18 - k * 22;
        const mojado = y < techo;
        const dx = Math.sin(k * 1.7) * 8;
        return (
          <g key={k}>
            <rect x={x - ancho / 2 + dx} y={y} width={ancho} height={20} rx={5} fill={mojado ? "#16307F" : COLORS.blue} stroke={COLORS.navy} strokeWidth={3} />
            <rect x={x - 22 + dx} y={y + 4} width={44} height={12} rx={6} fill={mojado ? COLORS.grey : COLORS.light} opacity={0.8} />
            {mojado ? <ellipse cx={x + dx + ((k * 37) % 80) - 40} cy={y + 22 + ((f / 3 + k * 5) % 14)} rx={4} ry={7} fill={COLORS.light} opacity={0.8} /> : null}
          </g>
        );
      })}
    </svg>
  );
};

const Cupula: React.FC<{ x: number; base: number; r?: number; s?: number; rotulo?: string }> = ({ x, base, r = 340, s = 1, rotulo = "100.000 €" }) => {
  if (s <= 0.01) return null;
  const rr = r * s;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path d={`M${x - rr} ${base} A${rr} ${rr * 1.05} 0 0 1 ${x + rr} ${base} Z`} fill={COLORS.light} fillOpacity={0.14} stroke={COLORS.white} strokeWidth={6} strokeOpacity={0.85} />
      <path d={`M${x - rr * 0.7} ${base - rr * 0.5} Q${x - rr * 0.55} ${base - rr * 0.85} ${x - rr * 0.2} ${base - rr * 0.95}`} stroke={COLORS.white} strokeOpacity={0.5} strokeWidth={10} fill="none" strokeLinecap="round" />
      <rect x={x - rr - 20} y={base} width={rr * 2 + 40} height={46} rx={14} fill={COLORS.navy} stroke={COLORS.light} strokeWidth={4} />
      <text x={x} y={base + 34} textAnchor="middle" fontSize={32 * Math.min(1, s * 1.2)} fontWeight={900} fill={COLORS.gold} fontFamily="Inter, sans-serif">
        {rotulo}
      </text>
    </svg>
  );
};

/* Lluvia que no entra en la cúpula: tapa el interior con el color del fondo */
const Interior: React.FC<{ x: number; base: number; r?: number }> = ({ x, base, r = 340 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
    <path d={`M${x - r} ${base} A${r} ${r * 1.05} 0 0 1 ${x + r} ${base} Z`} fill="#18224A" />
  </svg>
);

/* ---------- Iconos ---------- */
const IcoPersona: React.FC = () => (
  <svg width={300} height={300} viewBox="0 0 100 100">
    <circle cx={50} cy={32} r={18} fill={COLORS.light} stroke={COLORS.navy} strokeWidth={4} />
    <path d="M18 92 C18 66 32 56 50 56 C68 56 82 66 82 92 Z" fill={COLORS.light} stroke={COLORS.navy} strokeWidth={4} />
  </svg>
);
const IcoBanco: React.FC = () => (
  <svg width={300} height={300} viewBox="0 0 100 100">
    <path d="M10 36 L50 12 L90 36 Z" fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={4} strokeLinejoin="round" />
    {[22, 40, 58, 76].map((x) => (
      <rect key={x} x={x - 4} y={40} width={10} height={40} fill={COLORS.paper} stroke={COLORS.navy} strokeWidth={3} />
    ))}
    <rect x={10} y={80} width={80} height={10} fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={4} />
  </svg>
);
const Libreta: React.FC = () => (
  <svg width={340} height={260} viewBox="0 0 130 100">
    <rect x={6} y={10} width={118} height={80} rx={10} fill={COLORS.blue} stroke={COLORS.navy} strokeWidth={4} />
    <rect x={18} y={26} width={30} height={22} rx={4} fill={COLORS.gold} />
    <rect x={18} y={62} width={90} height={8} rx={4} fill={COLORS.light} />
  </svg>
);
const CajaFuerte: React.FC = () => (
  <svg width={280} height={280} viewBox="0 0 100 100">
    <rect x={10} y={20} width={80} height={70} rx={10} fill={COLORS.grey} stroke={COLORS.navy} strokeWidth={4} />
    <circle cx={50} cy={55} r={18} fill={COLORS.light} stroke={COLORS.navy} strokeWidth={4} />
    <line x1={50} y1={55} x2={62} y2={47} stroke={COLORS.navy} strokeWidth={4} strokeLinecap="round" />
    <path d="M36 20 V12 Q50 0 64 12 V20" fill="none" stroke={COLORS.navy} strokeWidth={5} />
  </svg>
);

const Entra: React.FC<{ delay: number; desde?: "izq" | "der" | "abajo"; children: React.ReactNode }> = ({ delay, desde = "abajo", children }) => {
  const s = useSpring(delay, 11, 0.6);
  const dx = desde === "izq" ? -(1 - s) * 500 : desde === "der" ? (1 - s) * 500 : 0;
  const dy = desde === "abajo" ? (1 - s) * 300 : 0;
  return <div style={{ translate: `${dx}px ${dy}px`, opacity: Math.min(1, s * 1.5), scale: String(0.7 + 0.3 * s) }}>{children}</div>;
};

/* ---------- Escenas ---------- */
const Hook: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = useCurrentFrame();
  // la persiana baja de golpe desde el fotograma 0
  const baja = interpolate(f, [0, 0.55 * fps], [0.15, 1], { ...clamp, easing: (x) => x * x });
  return (
    <Escena sinEntrada fondo="noche" sacudidas={[0.55]}>
      <Escenario tipo="calle" />
      <Rotulo texto="¿Y si mañana tu banco **no abre**?" delay={-1} size={66} />
      <Sucursal baja={baja} polvo={0.55} />
      <Sfx s="impacto" volumen={0.5} en={0.5} />
    </Escena>
  );
};

const Gancho2: React.FC = () => {
  const t = useSeg();
  const s = useSpring(0.3, 9, 0.6);
  const parpadeo = 0.5 + 0.5 * Math.sin(t * 10);
  return (
    <Escena fondo="noche">
      <Escenario tipo="calle" />
      <Rotulo texto="Te lo devuelven… **con límite**" />
      <Sucursal baja={1} />
      {/* candado */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <g transform={`translate(540 ${1000 - (1 - s) * 200}) scale(${s})`}>
          <path d="M-50 -40 V-80 Q0 -140 50 -80 V-40" fill="none" stroke={COLORS.light} strokeWidth={18} />
          <rect x={-80} y={-46} width={160} height={130} rx={22} fill={COLORS.light} stroke={COLORS.navy} strokeWidth={6} />
          <circle cx={0} cy={10} r={16} fill={COLORS.navy} />
          <rect x={-6} y={14} width={12} height={34} rx={4} fill={COLORS.navy} />
        </g>
        <line x1={150} x2={930} y1={780} y2={780} stroke={COLORS.red} strokeWidth={8} strokeDasharray="30 18" opacity={t > 2 ? parpadeo : 0} />
        <text x={930} y={760} textAnchor="end" fontSize={40} fontWeight={900} fill={COLORS.red} opacity={t > 2 ? parpadeo : 0} fontFamily="Inter, sans-serif">
          LÍMITE
        </text>
      </svg>
      <Sfx s="pop" volumen={0.4} en={0.3} />
      <Sfx s="pop" volumen={0.3} en={2.0} />
    </Escena>
  );
};

const FondoEscena: React.FC = () => (
  <Escena fondo="noche">
    {FOTO_SUCURSAL ? (
      <Foto src={FOTO_SUCURSAL} zoom={[1, 1.12]} />
    ) : (
      <>
        <Escenario tipo="calle" />
        <ZoomLento>
          <Sucursal baja={1} y={640} escala={0.95} farola />
        </ZoomLento>
      </>
    )}
    <Lluvia gotas={50} />
    <div style={{ position: "absolute", top: 250, left: 90, right: 120, display: "flex", justifyContent: "center" }}>
      <Entra delay={0.2}>
        <div style={{ background: COLORS.white, borderRadius: 30, padding: "18px 36px", textAlign: "center", boxShadow: "0 18px 40px rgba(0,0,0,0.35)" }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.grey }}>Se llama</div>
          <div style={{ fontSize: 64, fontWeight: 900, color: COLORS.navy, lineHeight: 1.05 }}>
            Fondo de Garantía <span style={{ color: COLORS.blue }}>de Depósitos</span>
          </div>
        </div>
      </Entra>
    </div>
  </Escena>
);
const ZoomLento: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const z = interpolate(f, [0, durationInFrames], [1, 1.1]);
  return <div style={{ position: "absolute", inset: 0, scale: String(z), transformOrigin: "540px 1000px" }}>{children}</div>;
};

const Dato: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = useCurrentFrame();
  const caida = interpolate(f, [0.3 * fps, 0.75 * fps], [-700, 0], { ...clamp, easing: (x) => x * x });
  const rebote = Math.abs(Math.sin(Math.max(0, f / fps - 0.75) * 9)) * Math.exp(-Math.max(0, f / fps - 0.75) * 5) * 60;
  return (
    <Escena fondo="noche" sacudidas={[0.75]}>
      <Escenario tipo="calle" />
      <Rotulo texto="Si tu banco quiebra, te devuelve" size={52} />
      <div style={{ position: "absolute", top: 620, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, translate: `0px ${caida - rebote}px` }}>
        <div style={{ fontSize: 70, fontWeight: 900, color: COLORS.light }}>hasta</div>
        <div style={{ background: COLORS.white, borderRadius: 40, padding: "10px 44px", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
          <div style={{ fontSize: 170, fontWeight: 900, color: COLORS.blue, letterSpacing: -6 }}>100.000 €</div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1080, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Pildora delay={1.0} bg={COLORS.navy} color={COLORS.gold}>
          Fondo de Garantía de Depósitos · Banco de España
        </Pildora>
      </div>
      <Sfx s="impacto" volumen={0.5} en={0.75} />
    </Escena>
  );
};

const Persona: React.FC = () => (
  <Escena fondo="noche">
    <Escenario tipo="calle" />
    <Rotulo texto="Por **persona** · por **banco**" />
    <div style={{ position: "absolute", top: 620, left: 90, right: 120, display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
      <Entra delay={0.1} desde="izq">
        <IcoPersona />
      </Entra>
      <Entra delay={0.5}>
        <div style={{ fontSize: 140, fontWeight: 900, color: COLORS.gold }}>+</div>
      </Entra>
      <Entra delay={0.8} desde="der">
        <IcoBanco />
      </Entra>
    </div>
    <Sfx s="pop" volumen={0.35} en={0.1} />
    <Sfx s="pop" volumen={0.35} en={0.8} />
  </Escena>
);

const Cubre: React.FC = () => (
  <Escena fondo="noche">
    <Escenario tipo="calle" />
    <Rotulo texto="Cuentas y **depósitos**" />
    <div style={{ position: "absolute", top: 600, left: 90, right: 120, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
      <Entra delay={0.2} desde="izq">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Libreta />
          <div style={{ fontSize: 46, fontWeight: 900, color: COLORS.navy, background: COLORS.white, borderRadius: 20, padding: "4px 24px" }}>Cuenta</div>
        </div>
      </Entra>
      <Entra delay={0.9} desde="der">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <CajaFuerte />
          <div style={{ fontSize: 46, fontWeight: 900, color: COLORS.navy, background: COLORS.white, borderRadius: 20, padding: "4px 24px" }}>Depósito</div>
        </div>
      </Entra>
    </div>
    <Sfx s="swoosh" volumen={0.25} en={0.2} />
    <Sfx s="swoosh" volumen={0.25} en={0.9} />
  </Escena>
);

const BASE = 1170;
const TECHO = BASE - 340 * 1.05;
const Wow: React.FC = () => {
  const t = useSeg();
  const cup = useSpring(0.2, 10, 0.7);
  const n = interpolate(t, [0.4, 2.2], [0, 13], clamp);
  return (
    <Escena fondo="noche" sacudidas={[2.4]}>
      <Escenario tipo="calle" />
      {t > 1.2 ? <Lluvia gotas={60} /> : null}
      <Interior x={540} base={BASE} r={340 * cup} />
      <PilaBilletes x={540} base={BASE} n={n} />
      <Cupula x={540} base={BASE} s={cup} />
      <Rotulo texto="A salvo hasta **100.000 €**" />
      <Chispas en={2.4} x={540} y={900} color={COLORS.gold} />
      <Sfx s="ding" volumen={0.4} en={2.4} />
    </Escena>
  );
};

/* Rebobinado: la pila baja (vuelve atrás) y luego crece por encima de la cúpula */
const Rehook: React.FC = () => {
  const t = useSeg();
  const f = useCurrentFrame();
  const rebobina = t < 0.9;
  const n = rebobina ? interpolate(t, [0, 0.9], [13, 4], clamp) : interpolate(t, [0.9, 2.4], [4, 22], clamp);
  return (
    <Escena fondo="noche" sonidoEntrada="swoosh">
      <Escenario tipo="calle" />
      <Lluvia gotas={60} />
      <Interior x={540} base={BASE} />
      <PilaBilletes x={540} base={BASE} n={n} techo={TECHO} />
      <Cupula x={540} base={BASE} />
      {rebobina ? (
        <>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            {Array.from({ length: 24 }, (_, k) => (
              <rect key={k} x={0} y={((k * 80 + f * 40) % 1920)} width={1080} height={6} fill={COLORS.white} opacity={0.12} />
            ))}
          </svg>
          <div style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", fontSize: 150, fontWeight: 900, color: COLORS.white, opacity: 0.85 }}>◀◀</div>
        </>
      ) : null}
      <Rotulo texto="¿Y lo que pasa de **100.000**?" delay={0.9} />
      <Sfx s="riser" volumen={0.35} en={0.9} />
    </Escena>
  );
};

const Fuera: React.FC = () => (
  <Escena fondo="noche">
    <Escenario tipo="calle" />
    <Lluvia gotas={80} />
    <Interior x={540} base={BASE} />
    <PilaBilletes x={540} base={BASE} n={22} techo={TECHO} />
    <Cupula x={540} base={BASE} />
    <Rotulo texto="Fuera: **no cubierto**" color={COLORS.navy} />
    <div style={{ position: "absolute", top: 560, left: 640, background: COLORS.red, color: COLORS.white, fontSize: 40, fontWeight: 900, padding: "8px 22px", borderRadius: 16, rotate: "6deg" }}>← se moja</div>
    <Sfx s="pop" volumen={0.3} en={0.4} />
  </Escena>
);

const Reparte: React.FC = () => {
  const t = useSeg();
  const p = interpolate(t, [0.3, 1.4], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  const xa = 540 - p * 250;
  const xb = 540 + p * 250;
  const r = 340 - p * 130;
  return (
    <Escena fondo="noche">
      <Escenario tipo="calle" />
      <Lluvia gotas={60} />
      <Interior x={xa} base={BASE} r={r} />
      <Interior x={xb} base={BASE} r={r} />
      <PilaBilletes x={xa} base={BASE} n={22 - p * 11} ancho={190} techo={BASE - r * 1.05} />
      {p > 0.05 ? <PilaBilletes x={xb} base={BASE} n={p * 11} ancho={190} /> : null}
      <Cupula x={xa} base={BASE} r={r} rotulo="Banco A" />
      {p > 0.05 ? <Cupula x={xb} base={BASE} r={r} s={p} rotulo="Banco B" /> : null}
      <Rotulo texto="Más de 100.000 → **varios bancos**" size={56} />
      <Sfx s="swoosh" volumen={0.25} en={0.3} />
      <Sfx s="pop" volumen={0.35} en={1.4} />
    </Escena>
  );
};

const Cierre: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = useCurrentFrame();
  const baja = interpolate(f, [0.6 * fps, 1.1 * fps], [0, 1], { ...clamp, easing: (x) => x * x });
  return (
    <Escena fondo="noche" sacudidas={[1.1]}>
      <Escenario tipo="calle" />
      <div style={{ position: "absolute", top: 250, left: 90, right: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 70, fontWeight: 900, letterSpacing: 6, color: COLORS.white }}>
          ALIGN <span style={{ fontWeight: 500, color: COLORS.light }}>by ADB</span>
        </div>
        <div style={{ fontSize: 30, color: COLORS.light }}>Contenido informativo, no es asesoramiento financiero.</div>
      </div>
      <Sucursal baja={baja} polvo={1.1} />
      <Sfx s="impacto" volumen={0.45} en={1.1} />
    </Escena>
  );
};

const ESCENAS: DefEscena[] = [
  { id: "hook", render: () => <Hook /> },
  { id: "gancho2", render: () => <Gancho2 /> },
  { id: "fondo", render: () => <FondoEscena /> },
  { id: "dato", render: () => <Dato /> },
  { id: "persona", render: () => <Persona /> },
  { id: "cubre", render: () => <Cubre /> },
  { id: "wow", render: () => <Wow /> },
  { id: "rehook", render: () => <Rehook /> },
  { id: "fuera", render: () => <Fuera /> },
  { id: "reparte", render: () => <Reparte /> },
  {
    id: "cta",
    subtitulosClaros: true,
    render: () => <CtaCrecer tipo="comentar" boton="¿LO SABÍAS?" linea="Responde **SÍ** o **NO**" />,
  },
  { id: "cierre", render: () => <Cierre /> },
];

export const W4902: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4902} pista="quiet-courtyard.mp3" /> : null;

