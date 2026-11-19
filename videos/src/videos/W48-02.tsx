import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../brand";
import {
  Chispas,
  Cifra,
  Cristal,
  CtaCrecer,
  DefEscena,
  Escena,
  Foto,
  Montaje,
  Palabras,
  Pildora,
  PropsVoz,
  Sfx,
  useSpring,
  Zona,
} from "../kit";

// W48-02 · «Tu dinero quieto encoge» · CTA COMPARTIR
// Cifras: IPC 2022 (INE): media anual 8,4 % → en el vídeo «más de un 8 %».
// Ejemplo hipotético: 10.000 / 1,03^10 = 7.440,94 → 7.441 €; 1 − 0,7441 = 25,6 % («una cuarta parte»).
const IMG = (n: string) => `img/W48-02/${n}.jpg`;
const PODER = 10000 / Math.pow(1.03, 10); // 7.440,94
const miles = (v: number) => {
  const n = Math.round(v);
  return n >= 1000 ? `${Math.floor(n / 1000)}.${String(n % 1000).padStart(3, "0")}` : String(n);
};
const eur = (v: number) => `${miles(v)} €`;
const EJEMPLO = "Ejemplo hipotético · 3 % anual";

export const EXTRA_W4802: Record<string, number> = { hook: 0.2, wow: 0.5, cuarto: 0.4, cta: 0.6, cierre: 0.8 };

const Arriba: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 22 }) => (
  <Zona top={250} bottom={1050} justify="flex-start" gap={gap}>
    {children}
  </Zona>
);

/* Flecha roja de «valor» que baja */
const FlechaBaja: React.FC<{ delay?: number }> = ({ delay = 0.3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [delay * fps, (delay + 1.4) * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const W = 720;
  const H = 300;
  const pts: string[] = [];
  for (let i = 0; i <= 40 * p; i++) {
    const x = (i / 40) * W;
    const y = 30 + (i / 40) * (H - 60) + Math.sin(i * 1.3) * 10;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const last = pts[pts.length - 1]?.split(",").map(Number) ?? [0, 30];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={W + 40} height={H + 20} viewBox={`-20 0 ${W + 40} ${H + 20}`} style={{ overflow: "visible" }}>
        <path d={"M" + pts.join(" L")} fill="none" stroke={COLORS.red} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 16px ${COLORS.red})` }} />
        <polygon points="-26,-20 26,-20 0,22" transform={`translate(${last[0]},${last[1] + 6}) rotate(-20)`} fill={COLORS.red} opacity={p > 0.05 ? 1 : 0} />
      </svg>
      <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.red, letterSpacing: 4, marginTop: 6 }}>LO QUE COMPRA</div>
    </div>
  );
};

/* Iconos en código con flecha que sube */
const IconoPan = () => (
  <svg width={140} height={140} viewBox="0 0 100 100">
    <path d="M12 62 C12 30 88 30 88 62 L84 78 H16 Z" fill={COLORS.gold} />
    <path d="M32 44 L40 56 M48 40 L56 54 M64 44 L70 56" stroke={COLORS.choco} strokeWidth={5} strokeLinecap="round" />
  </svg>
);
const IconoBombilla = () => (
  <svg width={140} height={140} viewBox="0 0 100 100">
    <circle cx="50" cy="40" r="26" fill={COLORS.gold} />
    <rect x="38" y="62" width="24" height="18" rx="4" fill={COLORS.light} />
    <rect x="42" y="82" width="16" height="6" rx="3" fill={COLORS.light} />
  </svg>
);
const IconoCasa = () => (
  <svg width={140} height={140} viewBox="0 0 100 100">
    <path d="M10 50 L50 14 L90 50" fill="none" stroke={COLORS.accent} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 46 V86 H78 V46" fill={COLORS.accent} />
    <rect x="42" y="60" width="16" height="26" fill={COLORS.navy} />
  </svg>
);
const ConFlecha: React.FC<{ children: React.ReactNode; delay: number }> = ({ children, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSpring(delay, 11, 0.7);
  const sube = interpolate(frame, [(delay + 0.3) * fps, (delay + 1.2) * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: s, scale: String(0.5 + 0.5 * s) }}>
      <div style={{ fontSize: 90, fontWeight: 900, color: COLORS.red, translate: `0px ${(1 - sube) * 40}px`, opacity: sube }}>▲</div>
      <div
        style={{
          width: 220,
          height: 220,
          borderRadius: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.07)",
          border: `2px solid ${COLORS.light}44`,
          translate: `0px ${-sube * 30}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* Hojas de calendario: año 1 → 10 */
const Anios: React.FC<{ inicio?: number; fin?: number }> = ({ inicio = 0.8, fin = 3.2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [inicio * fps, fin * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const anio = 1 + Math.floor(p * 9.999);
  const local = (p * 9.999) % 1;
  const s = useSpring(0.1, 12, 0.7);
  return (
    <div style={{ position: "relative", width: 360, height: 400, scale: String(0.6 + 0.4 * s), opacity: s }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 36, backgroundColor: COLORS.white, boxShadow: "0 30px 80px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 100, borderRadius: "36px 36px 0 0", backgroundColor: COLORS.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46, fontWeight: 900, color: COLORS.white, letterSpacing: 4 }}>
        AÑO
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 110,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 210,
          fontWeight: 900,
          color: COLORS.navy,
          fontVariantNumeric: "tabular-nums",
          rotate: p < 1 ? `${-local * 6}deg` : "0deg",
        }}
      >
        {anio}
      </div>
    </div>
  );
};

/* Barra que pierde un cuarto */
const BarraCuarto = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [0.5 * fps, 1.6 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const W = 860;
  const keep = 0.7441;
  return (
    <div style={{ width: W }}>
      <div style={{ position: "relative", height: 120, borderRadius: 30, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: W * keep, background: `linear-gradient(90deg, ${COLORS.accent}99, ${COLORS.accent})`, boxShadow: `0 0 40px ${COLORS.accent}` }} />
        <div
          style={{
            position: "absolute",
            left: W * keep + p * 60,
            top: 0,
            bottom: 0,
            width: W * (1 - keep),
            background: COLORS.gold,
            opacity: 1 - p * 0.75,
            rotate: `${p * 8}deg`,
            translate: `0px ${p * 30}px`,
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 40, fontWeight: 800 }}>
        <span style={{ color: COLORS.accent }}>Lo que compran</span>
        <span style={{ color: COLORS.gold, opacity: p }}>−¼</span>
      </div>
    </div>
  );
};

/* Reloj de arena en código */
const RelojArena = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = Math.min(1, frame / Math.max(1, durationInFrames - 0.3 * fps));
  const s = useSpring(0.2, 12, 0.8);
  return (
    <svg width={260} height={360} viewBox="0 0 100 140" style={{ scale: String(s), rotate: `${Math.sin(frame / 20) * 4}deg` }}>
      <rect x="10" y="2" width="80" height="10" rx="4" fill={COLORS.light} />
      <rect x="10" y="128" width="80" height="10" rx="4" fill={COLORS.light} />
      <path d="M20 12 L80 12 L54 70 L80 128 L20 128 L46 70 Z" fill="rgba(199,215,254,0.12)" stroke={COLORS.light} strokeWidth={3} />
      {/* arena de arriba */}
      <clipPath id="arr">
        <rect x="0" y={14 + 52 * p} width="100" height="60" />
      </clipPath>
      <path d="M22 14 L78 14 L52 68 L48 68 Z" fill={COLORS.gold} clipPath="url(#arr)" />
      {/* arena de abajo */}
      <clipPath id="aba">
        <rect x="0" y={126 - 50 * p} width="100" height="60" />
      </clipPath>
      <path d="M48 74 L52 74 L78 126 L22 126 Z" fill={COLORS.gold} clipPath="url(#aba)" />
      <rect x="49" y="68" width="2" height="58" fill={COLORS.gold} opacity={p < 1 ? 0.9 : 0} />
    </svg>
  );
};

const ESCENAS: DefEscena[] = [
  {
    id: "hook",
    render: () => (
      <Escena sinEntrada sacudidas={[0.05]}>
        <Sfx s="impacto" volumen={0.5} />
        <Zona top={250} bottom={560} gap={24} justify="flex-start">
          <div style={{ fontSize: 80, fontWeight: 900, lineHeight: 1.1, color: COLORS.white, textAlign: "center", maxWidth: 870 }}>
            Tus 10.000 € <span style={{ color: COLORS.red }}>valen menos</span> cada año
          </div>
          <Cifra a={10000} de={10000} inicio={0} fin={0.01} formato={eur} size={200} ticks={false} />
          <FlechaBaja delay={0.3} />
        </Zona>
      </Escena>
    ),
  },
  {
    id: "gancho2",
    render: () => (
      <Escena sonidoEntrada="swoosh">
        <Foto src={IMG("02-cesta-llena")} zoom={[1, 1.12]} subir={-90} />
        <Arriba gap={12}>
          <Palabras texto="El número no cambia." size={70} color={COLORS.light} maxWidth={900} />
          <Palabras texto="**Lo que compra, sí.**" size={90} delay={1.9} maxWidth={900} />
        </Arriba>
      </Escena>
    ),
  },
  {
    id: "inflacion",
    render: () => (
      <Escena fondo="azul">
        <Sfx s="pop" volumen={0.35} en={0.9} />
        <Sfx s="pop" volumen={0.35} en={1.9} />
        <Sfx s="pop" volumen={0.35} en={2.9} />
        <Zona gap={60}>
          <Palabras texto="Inflación = **los precios suben**" size={92} />
          <div style={{ display: "flex", gap: 30 }}>
            <ConFlecha delay={0.6}>
              <IconoPan />
            </ConFlecha>
            <ConFlecha delay={1.6}>
              <IconoBombilla />
            </ConFlecha>
            <ConFlecha delay={2.6}>
              <IconoCasa />
            </ConFlecha>
          </div>
        </Zona>
      </Escena>
    ),
  },
  {
    id: "dato",
    render: () => (
      <Escena sacudidas={[3.4]}>
        <Sfx s="impacto" volumen={0.45} en={3.4} />
        <Zona gap={30}>
          <Palabras texto="España, **2022**" size={96} />
          <div style={{ fontSize: 56, fontWeight: 800, color: COLORS.light }}>los precios subieron</div>
          <Cifra a={8} inicio={1.4} fin={3.4} formato={(v) => `+${Math.round(v)} %`} size={300} color={COLORS.red} />
          <Pildora delay={3.0} bg="rgba(199,215,254,0.12)" color={COLORS.light}>
            Fuente: INE · IPC medio 2022
          </Pildora>
        </Zona>
      </Escena>
    ),
  },
  {
    id: "rehook",
    render: ({ dur }) => (
      <Escena fondo="azul" luz="#4C1D95">
        <Sfx s="riser" volumen={0.35} en={Math.max(0, dur / 30 - 1.5)} />
        <Zona gap={36}>
          <Palabras texto="**3 %** al año · **10 años**" size={100} />
          <Anios inicio={0.9} fin={3.4} />
          <Pildora delay={0.4}>Ejemplo hipotético</Pildora>
        </Zona>
      </Escena>
    ),
  },
  {
    id: "wow",
    render: () => (
      <Escena sacudidas={[3.6]}>
        <Foto src={IMG("06-cesta-menos")} zoom={[1.15, 1]} />
        <Sfx s="ding" volumen={0.4} en={3.6} />
        <Arriba gap={14}>
          <div style={{ fontSize: 54, fontWeight: 800, color: COLORS.light }}>Tus 10.000 € compran como</div>
          <Cifra a={PODER} de={10000} inicio={1.6} fin={3.6} formato={eur} size={190} color={COLORS.gold} />
          <Pildora delay={0.4}>{EJEMPLO}</Pildora>
        </Arriba>
        <Chispas en={3.6} x={540} y={470} color={COLORS.gold} />
      </Escena>
    ),
  },
  {
    id: "cuarto",
    render: () => (
      <Escena sonidoEntrada="impacto">
        <Zona gap={50}>
          <Palabras texto="**Una cuarta parte menos.**" size={96} resalta={COLORS.gold} />
          <BarraCuarto />
          <Palabras texto="Sin gastar nada." size={80} color={COLORS.light} delay={1.0} />
        </Zona>
      </Escena>
    ),
  },
  {
    id: "cuesta",
    render: () => (
      <Escena luz="#7F1D1D">
        <Zona gap={40}>
          <Palabras texto="No hacer nada **también cuesta**" size={100} marcador />
          <RelojArena />
        </Zona>
      </Escena>
    ),
  },
  {
    id: "plan",
    render: () => (
      <Escena fondo="azul">
        <Sfx s="pop" volumen={0.35} en={0.3} />
        <Sfx s="pop" volumen={0.35} en={1.6} />
        <Zona gap={50}>
          <div style={{ display: "flex", gap: 40 }}>
            <Cristal color={COLORS.accent} w={400} desde="izq" delay={0.2}>
              <div style={{ fontSize: 58, fontWeight: 900, color: COLORS.accent }}>Colchón</div>
              <div style={{ fontSize: 40, fontWeight: 700, color: COLORS.white }}>en la cuenta</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: COLORS.white, marginTop: 10 }}>a mano</div>
            </Cristal>
            <Cristal color={COLORS.gold} w={400} desde="der" delay={1.5}>
              <div style={{ fontSize: 58, fontWeight: 900, color: COLORS.gold }}>Años vista</div>
              <div style={{ fontSize: 40, fontWeight: 700, color: COLORS.white }}>lo que no tocas</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: COLORS.white, marginTop: 10 }}>con un plan</div>
            </Cristal>
          </div>
          <Palabras texto="Colchón: a mano. El resto: **con un plan.**" size={70} delay={2.2} />
        </Zona>
      </Escena>
    ),
  },
  {
    id: "cta",
    subtitulosClaros: true,
    render: () => <CtaCrecer tipo="compartir" boton="MÁNDASELO" linea="A quien lo tiene todo **«por si acaso»**" />,
  },
  {
    id: "cierre",
    subtitulos: false,
    render: () => (
      <Escena>
        <Zona top={250} bottom={620} gap={24} justify="flex-start">
          <Palabras texto="Y el año que viene, otra vez:" size={70} color={COLORS.light} />
          <Cifra a={10000} de={10000} inicio={0} fin={0.01} formato={eur} size={200} ticks={false} />
          <Palabras texto="**valen menos**" size={100} resalta={COLORS.red} delay={1.2} />
        </Zona>
        <Zona top={1300} bottom={300} gap={12}>
          <div style={{ fontSize: 60, fontWeight: 900, letterSpacing: 6, color: COLORS.white }}>
            ALIGN <span style={{ fontWeight: 500, color: COLORS.light }}>by ADB</span>
          </div>
          <div style={{ fontSize: 28, color: COLORS.light }}>Contenido informativo, no es asesoramiento financiero.</div>
        </Zona>
      </Escena>
    ),
  },
];

export const W4802: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4802} pista="minimal-ambient-tech.mp3" /> : null;
