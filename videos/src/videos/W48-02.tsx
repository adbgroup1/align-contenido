import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../brand";
import {
  Bocadillo,
  Chispas,
  Cifra,
  CtaCrecer,
  DefEscena,
  Escena,
  Escenario,
  Montaje,
  Personaje,
  Pildora,
  PropsVoz,
  Rotulo,
  Sfx,
  SUELO_Y,
  useSpring,
} from "../kit";

// W48-02 · «Tu dinero quieto encoge» · FÁBULA CON PERSONAJES (rehecho el 19 nov) · CTA COMPARTIR
// Personajes: Tomasa (judía dorada con lazo rojo) y la Polilla (la inflación).
// Cifras: IPC 2022 (INE): media anual 8,4 % → en el vídeo «más de un 8 %».
// Ejemplo hipotético: 10.000 / 1,03^10 = 7.440,94 → 7.441 €; 1 − 0,7441 = 25,6 % («una cuarta parte»).
const PODER = 10000 / Math.pow(1.03, 10);
const miles = (v: number) => {
  const n = Math.round(v);
  return n >= 1000 ? `${Math.floor(n / 1000)}.${String(n % 1000).padStart(3, "0")}` : String(n);
};
const eur = (v: number) => `${miles(v)} €`;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const EXTRA_W4802: Record<string, number> = { hook: 0.2, wow: 0.4, cta: 0.5, cierre: 0.6 };

const TOMASA = { color: COLORS.gold, accesorio: "lazo" as const, colorAccesorio: COLORS.red };

/* Tarro de cristal con monedas y su etiqueta, que nunca cambia */
const Tarro: React.FC<{ x: number; y: number; escala?: number; etiqueta?: string; brillo?: boolean }> = ({
  x,
  y,
  escala = 1,
  etiqueta = "10.000 €",
  brillo = false,
}) => {
  const frame = useCurrentFrame();
  const g = brillo ? 0.5 + 0.5 * Math.sin(frame / 6) : 0;
  return (
    <div style={{ position: "absolute", left: x - 120 * escala, top: y - 300 * escala, width: 240 * escala, height: 300 * escala }}>
      <svg width={240 * escala} height={300 * escala} viewBox="0 0 240 300" style={{ overflow: "visible" }}>
        <ellipse cx={120} cy={296} rx={100} ry={10} fill="#000" opacity={0.2} />
        <rect x={60} y={20} width={120} height={34} rx={10} fill={COLORS.choco} stroke={COLORS.navy} strokeWidth={4} />
        <path d="M50 54 H190 Q214 54 214 90 V262 Q214 292 184 292 H56 Q26 292 26 262 V90 Q26 54 50 54 Z" fill={COLORS.light} fillOpacity={0.55} stroke={COLORS.navy} strokeWidth={5} />
        {Array.from({ length: 14 }, (_, i) => (
          <ellipse key={i} cx={58 + (i % 5) * 32 + (Math.floor(i / 5) % 2) * 14} cy={276 - Math.floor(i / 5) * 22} rx={20} ry={9} fill={COLORS.gold} stroke={COLORS.choco} strokeWidth={3} />
        ))}
        <rect x={30} y={130} width={180} height={70} rx={12} fill={COLORS.white} stroke={COLORS.navy} strokeWidth={4} style={{ filter: g ? `drop-shadow(0 0 ${12 * g}px ${COLORS.gold})` : undefined }} />
        <text x={120} y={178} textAnchor="middle" fontSize={etiqueta.length > 7 ? 32 : 36} fontWeight={900} fill={COLORS.navy} fontFamily="Inter, sans-serif">
          {etiqueta}
        </text>
        <path d="M44 80 Q40 160 48 240" stroke={COLORS.white} strokeOpacity={0.6} strokeWidth={8} fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
};

/* Cesta con 8 productos; `quedan` = cuántos se ven (los que se van, se encogen) */
const PRODUCTOS = [
  { dx: -70, dy: -40, c: COLORS.gold, f: "pan" },
  { dx: 0, dy: -62, c: COLORS.red, f: "manzana" },
  { dx: 70, dy: -44, c: COLORS.white, f: "leche" },
  { dx: -34, dy: -12, c: COLORS.green, f: "manzana" },
  { dx: 38, dy: -14, c: COLORS.gold, f: "queso" },
  { dx: -96, dy: -6, c: COLORS.red, f: "manzana" },
  { dx: 96, dy: -8, c: COLORS.accent, f: "leche" },
  { dx: 0, dy: -26, c: COLORS.chocoLight, f: "pan" },
];
const Cesta: React.FC<{ x: number; y: number; escala?: number; quedan?: number }> = ({ x, y, escala = 1, quedan = 8 }) => (
  <div style={{ position: "absolute", left: x - 160 * escala, top: y - 260 * escala, width: 320 * escala, height: 260 * escala }}>
    <svg width={320 * escala} height={260 * escala} viewBox="-160 -150 320 260" style={{ overflow: "visible" }}>
      <ellipse cx={0} cy={106} rx={140} ry={10} fill="#000" opacity={0.2} />
      <path d="M-110 0 Q0 -170 110 0" fill="none" stroke={COLORS.choco} strokeWidth={12} />
      {PRODUCTOS.map((p, i) => {
        const vis = Math.max(0, Math.min(1, quedan - i));
        if (vis <= 0) return null;
        const t = `translate(${p.dx} ${p.dy}) scale(${vis})`;
        return (
          <g key={i} transform={t}>
            {p.f === "pan" ? <ellipse rx={42} ry={22} fill={p.c} stroke={COLORS.choco} strokeWidth={4} /> : null}
            {p.f === "manzana" ? <circle r={24} fill={p.c} stroke={COLORS.navy} strokeWidth={3} /> : null}
            {p.f === "leche" ? <rect x={-18} y={-40} width={36} height={60} rx={6} fill={p.c} stroke={COLORS.navy} strokeWidth={3} /> : null}
            {p.f === "queso" ? <path d="M-30 14 L30 14 L30 -10 L-30 -22 Z" fill={p.c} stroke={COLORS.choco} strokeWidth={3} /> : null}
          </g>
        );
      })}
      <path d="M-130 0 H130 L106 100 H-106 Z" fill={COLORS.chocoLight} stroke={COLORS.choco} strokeWidth={6} strokeLinejoin="round" />
      {[-80, -40, 0, 40, 80].map((xx) => (
        <line key={xx} x1={xx} y1={6} x2={xx * 0.85} y2={96} stroke={COLORS.choco} strokeWidth={5} />
      ))}
      <line x1={-124} y1={40} x2={124} y2={40} stroke={COLORS.choco} strokeWidth={5} />
    </svg>
  </div>
);

/* La Polilla (inflación): cuerpo azul, alas claras que aletean, antenas */
const Polilla: React.FC<{ x: number; y: number; escala?: number; etiqueta?: boolean; muerde?: boolean }> = ({
  x,
  y,
  escala = 1,
  etiqueta = false,
  muerde = false,
}) => {
  const frame = useCurrentFrame();
  const ala = Math.sin(frame * 0.9) * 26;
  const boca = muerde ? Math.abs(Math.sin(frame * 0.6)) * 8 : 2;
  return (
    <div style={{ position: "absolute", left: x - 110 * escala, top: y - 90 * escala, width: 220 * escala, height: 180 * escala }}>
      <svg width={220 * escala} height={180 * escala} viewBox="-110 -90 220 180" style={{ overflow: "visible" }}>
        <g transform={`rotate(${-ala})`} style={{ transformOrigin: "0px 0px" }}>
          <ellipse cx={-56} cy={-24} rx={56} ry={40} fill={COLORS.light} stroke={COLORS.navy} strokeWidth={4} />
          <circle cx={-62} cy={-26} r={12} fill={COLORS.grey} opacity={0.6} />
        </g>
        <g transform={`rotate(${ala})`} style={{ transformOrigin: "0px 0px" }}>
          <ellipse cx={56} cy={-24} rx={56} ry={40} fill={COLORS.light} stroke={COLORS.navy} strokeWidth={4} />
          <circle cx={62} cy={-26} r={12} fill={COLORS.grey} opacity={0.6} />
        </g>
        <ellipse cx={0} cy={6} rx={24} ry={50} fill={COLORS.blue} stroke={COLORS.navy} strokeWidth={4} />
        <path d="M-8 -40 Q-24 -80 -40 -82 M8 -40 Q24 -80 40 -82" stroke={COLORS.navy} strokeWidth={4} fill="none" strokeLinecap="round" />
        <circle cx={-9} cy={-22} r={7} fill={COLORS.white} />
        <circle cx={9} cy={-22} r={7} fill={COLORS.white} />
        <circle cx={-8} cy={-21} r={3.5} fill={COLORS.navy} />
        <circle cx={10} cy={-21} r={3.5} fill={COLORS.navy} />
        <ellipse cx={0} cy={-6} rx={7} ry={boca} fill={COLORS.navy} />
        {etiqueta ? (
          <g transform="translate(0 74)">
            <rect x={-100} y={-24} width={200} height={48} rx={24} fill={COLORS.red} stroke={COLORS.navy} strokeWidth={4} />
            <text textAnchor="middle" y={11} fontSize={30} fontWeight={900} fill={COLORS.white} fontFamily="Inter, sans-serif" letterSpacing={2}>
              INFLACIÓN
            </text>
          </g>
        ) : null}
      </svg>
    </div>
  );
};

/* Polilla que vuela por una trayectoria entre dos segundos */
const vuelo = (t: number, t0: number, t1: number, a: [number, number], b: [number, number], ondas = 2, amp = 40) => {
  const p = interpolate(t, [t0, t1], [0, 1], clamp);
  const e = 1 - (1 - p) ** 3;
  return [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e + Math.sin(p * Math.PI * 2 * ondas) * amp] as const;
};

const useSeg = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/* ---------- Escenas ---------- */
const Hook: React.FC = () => {
  const t = useSeg();
  // la cesta pierde productos año a año mientras el tarro sigue igual
  const quedan = interpolate(t, [0.6, 3.6], [8, 5.6], clamp);
  const anio = Math.min(10, 1 + Math.floor(Math.max(0, t - 0.6) * 3));
  return (
    <Escena sinEntrada>
      <Escenario tipo="campo" />
      <Sfx s="impacto" volumen={0.5} />
      <Rotulo texto="Tomasa guardó **10.000 €**" delay={-1} />
      <div style={{ position: "absolute", top: 430, width: "100%", textAlign: "center", fontSize: 46, fontWeight: 900, color: COLORS.navy }}>
        Año {anio}
      </div>
      <Personaje x={540} y={SUELO_Y} {...TOMASA} expresion={t > 2 ? "preocupado" : "feliz"} pose="abraza" mirar="der" />
      <Tarro x={250} y={SUELO_Y} />
      <Cesta x={830} y={SUELO_Y} quedan={quedan} />
    </Escena>
  );
};

const Gancho2: React.FC = () => {
  const t = useSeg();
  return (
    <Escena>
      <Escenario tipo="interior" />
      <Rotulo texto="Nadie le robó **ni un euro**" />
      <Personaje x={620} y={SUELO_Y} {...TOMASA} expresion="preocupado" mirar={Math.floor(t * 1.6) % 2 ? "izq" : "der"} pose="encoge" />
      <Tarro x={300} y={SUELO_Y} escala={1.1} brillo />
      <Sfx s="pop" volumen={0.35} en={0.5} />
    </Escena>
  );
};

const PolillaEscena: React.FC = () => {
  const t = useSeg();
  const [px, py] = vuelo(t, 0.1, 1.6, [1250, 500], [700, 760], 1.5, 60);
  return (
    <Escena>
      <Escenario tipo="interior" />
      <Rotulo texto="El ladrón: **la inflación**" delay={0.5} />
      <Personaje x={330} y={SUELO_Y} {...TOMASA} expresion="sorpresa" mirar="der" salto={1.3} pose="brazos-arriba" />
      <Polilla x={px} y={py} escala={1.4} etiqueta={t > 1.2} />
      <Sfx s="swoosh" volumen={0.25} en={0.2} />
      <Sfx s="impacto" volumen={0.45} en={1.3} />
    </Escena>
  );
};

const Come: React.FC = () => {
  const t = useSeg();
  const quedan = interpolate(t, [0.8, 3.2], [8, 5], clamp);
  const [px, py] = vuelo(t, 0, 0.8, [900, 500], [600, 880], 1, 20);
  return (
    <Escena>
      <Escenario tipo="interior" />
      <Rotulo texto="Se come **lo que compran**" />
      <Tarro x={220} y={SUELO_Y} escala={0.8} />
      <Cesta x={600} y={SUELO_Y} escala={1.4} quedan={quedan} />
      <Polilla x={px + Math.sin(t * 5) * 10} y={py} escala={1} muerde={t > 0.8} />
      {[1.2, 2.0, 2.8].map((s) => (
        <Sfx key={s} s="pop" volumen={0.3} en={s} />
      ))}
    </Escena>
  );
};

const Dato: React.FC = () => {
  const t = useSeg();
  const crece = 1 + interpolate(t, [0.8, 2.6], [0, 0.7], clamp);
  return (
    <Escena sacudidas={[2.6]}>
      <Escenario tipo="campo" tarde={0.25} />
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ background: COLORS.choco, border: `6px solid ${COLORS.navy}`, borderRadius: 26, padding: "18px 50px 22px", display: "flex", flexDirection: "column", alignItems: "center", rotate: "-2deg" }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: COLORS.light }}>Precios en España, 2022</div>
          <Cifra a={8} de={0} inicio={0.6} fin={2.6} formato={(v) => `+${Math.round(v)} %`} size={190} color={COLORS.gold} />
          <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.white }}>más de un 8 %</div>
        </div>
        <div style={{ fontSize: 30, fontWeight: 700, color: COLORS.navy }}>Fuente: INE (IPC, media anual 2022)</div>
      </div>
      <Polilla x={560} y={1020} escala={crece} muerde />
      <Personaje x={210} y={SUELO_Y} {...TOMASA} escala={1.2} expresion="sorpresa" mirar="der" />
      <Sfx s="ding" volumen={0.35} en={2.6} />
    </Escena>
  );
};

const Rehook: React.FC = () => {
  const t = useSeg();
  const anio = Math.min(10, Math.max(1, Math.floor(interpolate(t, [0.8, 3.6], [1, 10.99], clamp))));
  const hoja = useSpring(0.8 + (anio - 1) * 0.31, 14, 0.5);
  return (
    <Escena>
      <Escenario tipo="interior" />
      <div style={{ position: "absolute", top: 270, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={{ width: 300, background: COLORS.white, border: `6px solid ${COLORS.navy}`, borderRadius: 24, overflow: "hidden", rotate: `${(1 - hoja) * 8}deg` }}>
          <div style={{ background: COLORS.red, color: COLORS.white, fontSize: 40, fontWeight: 900, textAlign: "center", padding: 8 }}>AÑO</div>
          <div style={{ fontSize: 150, fontWeight: 900, color: COLORS.navy, textAlign: "center", lineHeight: 1.1 }}>{anio}</div>
        </div>
        <Pildora delay={0.3} bg={COLORS.navy} color={COLORS.gold}>Ejemplo hipotético · 3 % anual</Pildora>
      </div>
      <Bocadillo texto="3 % × 10 años…" x={700} y={760} ancho={420} size={50} piensa colaX={-120} delay={0.4} />
      <Personaje x={420} y={SUELO_Y} {...TOMASA} expresion="pensativo" pose="piensa" mirar="der" />
      {Array.from({ length: 9 }, (_, i) => (
        <Sfx key={i} s="tick" volumen={0.14} en={0.8 + i * 0.31} />
      ))}
      <Sfx s="riser" volumen={0.35} en={Math.max(0, 4.2 - 1.2)} />
    </Escena>
  );
};

const Wow: React.FC = () => {
  const t = useSeg();
  const quedan = interpolate(t, [1.2, 3.4], [8, 6], clamp);
  return (
    <Escena sacudidas={[3.4]} sonidoEntrada="impacto">
      <Escenario tipo="campo" tarde={0.15} />
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ fontSize: 46, fontWeight: 900, color: COLORS.navy }}>El tarro dice 10.000 €… compra como</div>
        <div style={{ background: COLORS.white, borderRadius: 34, padding: "6px 40px", border: `6px solid ${COLORS.red}` }}>
          <Cifra a={PODER} de={10000} inicio={1.2} fin={3.4} formato={eur} size={170} color={COLORS.red} brillo={false} />
        </div>
        <Pildora delay={0.4} bg={COLORS.navy} color={COLORS.gold}>
          Ejemplo hipotético · 3 % anual · 10 años
        </Pildora>
      </div>
      <Tarro x={230} y={SUELO_Y} escala={0.95} brillo />
      <Cesta x={820} y={SUELO_Y} escala={1.05} quedan={quedan} />
      <Personaje x={530} y={SUELO_Y} {...TOMASA} escala={1.35} expresion="sorpresa" salto={3.4} />
      <Polilla x={820 + Math.sin(t * 3) * 60} y={780} escala={0.8} muerde />
      <Chispas en={3.4} x={540} y={430} color={COLORS.red} />
      <Sfx s="ding" volumen={0.4} en={3.4} />
    </Escena>
  );
};

const Cuarto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [0.2 * fps, 1.1 * fps], [0, 1], { ...clamp });
  const ang = 270 * p; // tres cuartos que quedan
  const r = 190;
  const rad = ((ang - 90) * Math.PI) / 180;
  const large = ang > 180 ? 1 : 0;
  const d = `M0 0 L0 ${-r} A${r} ${r} 0 ${large} 1 ${Math.cos(rad) * r} ${Math.sin(rad) * r} Z`;
  return (
    <Escena>
      <Escenario tipo="interior" />
      <Rotulo texto="**−¼** sin gastar nada" />
      <svg width={500} height={500} viewBox="-250 -250 500 500" style={{ position: "absolute", left: 290, top: 420 }}>
        <circle r={r} fill="none" stroke={COLORS.white} strokeWidth={6} strokeDasharray="18 14" opacity={0.8} />
        <path d={d} fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={6} />
      </svg>
      <Personaje x={540} y={SUELO_Y} {...TOMASA} escala={1.2} expresion="triste" />
      <Sfx s="pop" volumen={0.35} en={1.1} />
    </Escena>
  );
};

const Moraleja: React.FC = () => {
  const t = useSeg();
  const [px, py] = vuelo(t, 2.6, 5.4, [540, 760], [1400, 300], 2, 50);
  const brote = useSpring(2.8, 12, 0.7);
  return (
    <Escena>
      <Escenario tipo="campo" />
      <Rotulo texto="Moraleja" fondo={COLORS.navy} color={COLORS.gold} />
      <div style={{ position: "absolute", top: 400, left: 90, right: 120, display: "flex", justifyContent: "space-between" }}>
        <Etiqueta texto="Colchón: a mano" delay={0.6} color={COLORS.blue} />
        <Etiqueta texto="El resto: con un plan" delay={2.6} color={COLORS.green} />
      </div>
      <Tarro x={230} y={SUELO_Y} escala={0.75} etiqueta="Colchón" />
      {/* maceta con brote: lo que no vas a tocar en años */}
      <svg width={260} height={360} viewBox="-130 -300 260 360" style={{ position: "absolute", left: 700, top: SUELO_Y - 300 }}>
        <path d="M-80 0 H80 L64 56 H-64 Z" fill={COLORS.chocoLight} stroke={COLORS.navy} strokeWidth={5} />
        <g transform={`scale(${brote})`} style={{ transformOrigin: "0px 0px" }}>
          <path d="M0 0 V-200" stroke={COLORS.green} strokeWidth={12} strokeLinecap="round" />
          <ellipse cx={-46} cy={-120} rx={48} ry={22} fill={COLORS.green} transform="rotate(-30 -46 -120)" stroke={COLORS.navy} strokeWidth={4} />
          <ellipse cx={46} cy={-170} rx={48} ry={22} fill={COLORS.green} transform="rotate(30 46 -170)" stroke={COLORS.navy} strokeWidth={4} />
          <circle cx={0} cy={-216} r={22} fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={4} />
        </g>
      </svg>
      <Personaje x={480} y={SUELO_Y} {...TOMASA} expresion="feliz" pose={t > 2.6 ? "senala" : "saluda"} mirar="der" />
      {t > 2.4 ? <Polilla x={px} y={py} escala={0.7} /> : null}
      <Sfx s="pop" volumen={0.35} en={0.6} />
      <Sfx s="pop" volumen={0.35} en={2.6} />
      <Sfx s="swoosh" volumen={0.25} en={3.2} />
    </Escena>
  );
};

const Etiqueta: React.FC<{ texto: string; delay: number; color: string }> = ({ texto, delay, color }) => {
  const s = useSpring(delay, 12, 0.6);
  return (
    <div
      style={{
        width: 400,
        background: color,
        color: COLORS.white,
        fontSize: 50,
        fontWeight: 900,
        textAlign: "center",
        borderRadius: 26,
        padding: "18px 14px",
        border: `5px solid ${COLORS.navy}`,
        opacity: Math.min(1, s * 1.4),
        scale: String(0.6 + 0.4 * s),
      }}
    >
      {texto}
    </div>
  );
};

const Cierre: React.FC = () => {
  const t = useSeg();
  return (
    <Escena>
      <Escenario tipo="campo" tarde={0.85} />
      <Rotulo texto="Y la polilla **sigue comiendo**" />
      <Tarro x={380} y={SUELO_Y - 40} escala={0.9} />
      <Polilla x={620 + Math.sin(t * 2) * 80} y={760 + Math.cos(t * 3) * 30} escala={1} muerde />
      <div style={{ position: "absolute", top: 1330, left: 90, right: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: 6, color: COLORS.white }}>
          ALIGN <span style={{ fontWeight: 500, color: COLORS.light }}>by ADB</span>
        </div>
        <div style={{ fontSize: 28, color: COLORS.light }}>Contenido informativo, no es asesoramiento financiero.</div>
      </div>
    </Escena>
  );
};

const ESCENAS: DefEscena[] = [
  { id: "hook", render: () => <Hook /> },
  { id: "gancho2", render: () => <Gancho2 /> },
  { id: "polilla", render: () => <PolillaEscena /> },
  { id: "come", render: () => <Come /> },
  { id: "dato", render: () => <Dato /> },
  { id: "rehook", render: () => <Rehook /> },
  { id: "wow", render: () => <Wow /> },
  { id: "cuarto", render: () => <Cuarto /> },
  { id: "moraleja", render: () => <Moraleja /> },
  {
    id: "cta",
    subtitulosClaros: true,
    render: () => <CtaCrecer tipo="compartir" boton="MÁNDASELO" linea="A quien lo tiene todo **«por si acaso»**" />,
  },
  { id: "cierre", subtitulos: false, render: () => <Cierre /> },
];

export const W4802: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4802} pista="quiet-courtyard.mp3" /> : null;
