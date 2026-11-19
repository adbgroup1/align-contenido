import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../brand";
import { Bocadillo, Chispas, CtaCrecer, DefEscena, Escena, Escenario, Expresion, Foto, Montaje, Personaje, Pose, PropsVoz, Rotulo, Sfx, SUELO_Y, useSpring } from "../kit";

// W49-04 · «Juicio al gimnasio que no pisas» · HISTORIA CON PERSONAJE (formato juicio) · estilo mixto · CTA COMPARTIR
// Personajes: Dani (sudadera cobalto y cinta en la frente) y la fiscal búho (toga periwinkle y gafas).
// Cálculo: 40 € al mes ÷ 2 visitas = 20 € por visita.
// Música: lay-back. Fondo dominante: sala de juicio de madera (cálido).
export const EXTRA_W4904: Record<string, number> = { hook: 0.2, wow: 0.8, rehook: 0.3, cta: 0.4, cierre: 0.6 };

// La foto de la escena 3 solo se usa si llegó y pasó la revisión (Paso 0). Si no, la bolsa se dibuja en código.
const FOTO_BOLSA: string | null = null;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useSeg = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

/* ---------- Sala: estrado, banquillo ---------- */
const Sala: React.FC = () => (
  <>
    <Escenario tipo="interior" />
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      {/* escudo genérico en la pared */}
      <circle cx={540} cy={520} r={90} fill={COLORS.gold} opacity={0.25} />
      <path d="M540 450 L600 480 V540 Q600 590 540 610 Q480 590 480 540 V480 Z" fill={COLORS.gold} opacity={0.5} stroke={COLORS.choco} strokeWidth={4} />
      {/* barandilla */}
      <rect x={0} y={SUELO_Y - 170} width={1080} height={16} fill={COLORS.choco} />
      {Array.from({ length: 14 }, (_, k) => (
        <rect key={k} x={20 + k * 78} y={SUELO_Y - 160} width={14} height={160} fill={COLORS.choco} opacity={0.6} />
      ))}
    </svg>
  </>
);

/* ---------- Dani ---------- */
const Dani: React.FC<{ x: number; y?: number; escala?: number; expresion?: Expresion; pose?: Pose; mirar?: "izq" | "der" | "frente"; salto?: number; sudor?: boolean; anda?: boolean }> = ({
  x,
  y = SUELO_Y,
  escala = 1.5,
  expresion = "neutral",
  pose = "quieto",
  mirar = "frente",
  salto,
  sudor = false,
  anda = false,
}) => {
  const f = useCurrentFrame();
  const caja = { left: x - 100 * escala, top: y - 260 * escala, width: 200 * escala, height: 260 * escala };
  return (
    <>
      <Personaje x={x} y={y} escala={escala} color={COLORS.blue} expresion={expresion} pose={pose} mirar={mirar} salto={salto} anda={anda} semilla={1} />
      <svg style={{ position: "absolute", ...caja, overflow: "visible" }} viewBox="0 0 200 260">
        {/* cinta en la frente */}
        <rect x={42} y={70} width={116} height={14} rx={6} fill={COLORS.red} stroke={COLORS.navy} strokeWidth={3} />
        <path d="M156 76 L178 66 L176 90 Z" fill={COLORS.red} stroke={COLORS.navy} strokeWidth={3} />
        {/* capucha de la sudadera */}
        <path d="M60 196 Q100 214 140 196" stroke={COLORS.light} strokeWidth={6} fill="none" />
        {sudor
          ? [0, 1].map((k) => {
              const p = ((f / 20 + k * 0.5) % 1);
              return <path key={k} d={`M${150 + k * 14} ${60 + p * 60} q-7 12 0 18 q7 -6 0 -18 Z`} fill={COLORS.light} opacity={1 - p} />;
            })
          : null}
      </svg>
    </>
  );
};

/* ---------- Fiscal búho ---------- */
const Buho: React.FC<{ x: number; y?: number; escala?: number; expresion?: Expresion; pose?: Pose; mirar?: "izq" | "der" | "frente"; entra?: "izq" | "der" | null; delay?: number }> = ({
  x,
  y = SUELO_Y,
  escala = 1.5,
  expresion = "neutral",
  pose = "quieto",
  mirar = "izq",
  entra = null,
  delay = 0,
}) => {
  const s = useSpring(delay, 13, 0.7);
  const off = entra === "der" ? (1 - s) * 700 : entra === "izq" ? -(1 - s) * 700 : 0;
  const caja = { left: x - 100 * escala, top: y - 260 * escala, width: 200 * escala, height: 260 * escala };
  return (
    <div style={{ position: "absolute", inset: 0, translate: `${off}px 0px` }}>
      <svg style={{ position: "absolute", ...caja, overflow: "visible" }} viewBox="0 0 200 260">
        {/* plumas de las orejas */}
        <path d="M52 70 L40 22 L82 58 Z" fill={COLORS.choco} stroke={COLORS.navy} strokeWidth={4} strokeLinejoin="round" />
        <path d="M148 70 L160 22 L118 58 Z" fill={COLORS.choco} stroke={COLORS.navy} strokeWidth={4} strokeLinejoin="round" />
      </svg>
      <Personaje x={x} y={y} escala={escala} color={COLORS.chocoLight} expresion={expresion} pose={pose} mirar={mirar} accesorio="gafas" semilla={3} />
      <svg style={{ position: "absolute", ...caja, overflow: "visible" }} viewBox="0 0 200 260">
        {/* pico */}
        <path d="M92 128 L108 128 L100 146 Z" fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={3} strokeLinejoin="round" />
        {/* toga */}
        <path d="M42 160 Q100 150 158 160 L160 214 Q100 226 40 214 Z" fill={COLORS.light} stroke={COLORS.navy} strokeWidth={4} />
        <path d="M100 156 V222" stroke={COLORS.navy} strokeWidth={3} />
        <path d="M84 156 L100 176 L116 156" fill={COLORS.white} stroke={COLORS.navy} strokeWidth={3} />
      </svg>
    </div>
  );
};

/* ---------- Mazo ---------- */
const Mazo: React.FC<{ x: number; y: number; golpe: number; escala?: number }> = ({ x, y, golpe, escala = 1 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = f / fps - golpe;
  const ang = k < 0 ? interpolate(k, [-0.35, 0], [-55, 0], clamp) : k < 0.3 ? Math.sin(k * 30) * 6 * (1 - k / 0.3) : 0;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <g transform={`translate(${x} ${y}) scale(${escala})`}>
        <ellipse cx={0} cy={20} rx={90} ry={20} fill={COLORS.choco} stroke={COLORS.navy} strokeWidth={4} />
        <g transform={`translate(110 -20) rotate(${ang})`}>
          <rect x={-10} y={-10} width={160} height={20} rx={8} fill={COLORS.chocoLight} stroke={COLORS.navy} strokeWidth={4} transform="rotate(-20)" />
          <rect x={-80} y={-40} width={110} height={70} rx={14} fill={COLORS.choco} stroke={COLORS.navy} strokeWidth={4} transform="translate(-20 30)" />
        </g>
        {k >= 0 && k < 0.4
          ? [0, 1, 2, 3].map((j) => (
              <line key={j} x1={0} y1={0} x2={Math.cos((j / 3) * Math.PI + Math.PI) * (60 + k * 200)} y2={Math.sin((j / 3) * Math.PI + Math.PI) * (40 + k * 120)} stroke={COLORS.gold} strokeWidth={6} opacity={1 - k / 0.4} strokeLinecap="round" />
            ))
          : null}
      </g>
    </svg>
  );
};

/* ---------- Cartel 40 €/mes (se parte en dos) ---------- */
const Cartel: React.FC<{ x: number; y: number; parte?: number; s?: number }> = ({ x, y, parte = 0, s = 1 }) => {
  const d = parte * 170;
  const rot = parte * 14;
  if (parte <= 0) {
    return (
      <div style={{ position: "absolute", left: x - 230, top: y, width: 460, scale: String(s), rotate: "-3deg" }}>
        <div style={{ background: COLORS.white, border: `7px solid ${COLORS.navy}`, borderRadius: 26, textAlign: "center", padding: "10px 0", boxShadow: "0 18px 40px rgba(0,0,0,0.3)" }}>
          <div style={{ fontSize: 120, fontWeight: 900, color: COLORS.blue, lineHeight: 1 }}>40 €</div>
          <div style={{ fontSize: 46, fontWeight: 800, color: COLORS.navy }}>al mes</div>
        </div>
      </div>
    );
  }
  const Mitad: React.FC<{ lado: -1 | 1 }> = ({ lado }) => (
    <div style={{ position: "absolute", left: x - 140 + lado * d, top: y + parte * 30, width: 280, rotate: `${lado * rot}deg` }}>
      <div style={{ background: COLORS.white, border: `7px solid ${COLORS.navy}`, borderRadius: 26, textAlign: "center", padding: "12px 0", boxShadow: "0 18px 40px rgba(0,0,0,0.3)" }}>
        <div style={{ fontSize: 110, fontWeight: 900, color: COLORS.red, lineHeight: 1 }}>20 €</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: COLORS.navy }}>por visita</div>
      </div>
    </div>
  );
  return (
    <>
      <Mitad lado={-1} />
      <Mitad lado={1} />
    </>
  );
};

/* ---------- Móvil con el calendario del mes ---------- */
const MovilCalendario: React.FC<{ x: number; y: number; marca?: number }> = ({ x, y, marca = 1 }) => {
  const dias = Array.from({ length: 30 }, (_, i) => i + 1);
  const marcados = [6, 19];
  return (
    <div style={{ position: "absolute", left: x - 190, top: y, width: 380 }}>
      <svg width={380} height={600} viewBox="0 0 380 600">
        <rect x={6} y={6} width={368} height={588} rx={50} fill={COLORS.navy} stroke={COLORS.white} strokeWidth={6} />
        <rect x={26} y={50} width={328} height={510} rx={26} fill={COLORS.paper} />
        <text x={190} y={110} textAnchor="middle" fontSize={36} fontWeight={900} fill={COLORS.navy} fontFamily="Inter, sans-serif">
          Este mes
        </text>
        {dias.map((d, i) => {
          const cx = 66 + (i % 6) * 50;
          const cy = 170 + Math.floor(i / 6) * 70;
          const idx = marcados.indexOf(d);
          const on = idx >= 0 && marca > idx;
          return (
            <g key={d}>
              <circle cx={cx} cy={cy} r={22} fill={on ? COLORS.green : COLORS.white} stroke={on ? COLORS.navy : COLORS.light} strokeWidth={3} />
              <text x={cx} y={cy + 8} textAnchor="middle" fontSize={22} fontWeight={800} fill={on ? COLORS.white : COLORS.grey} fontFamily="Inter, sans-serif">
                {d}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/* ---------- Bolsa de deporte dibujada (si no llega la foto) ---------- */
const BolsaDeporte: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      {/* puerta */}
      <rect x={620} y={420} width={300} height={830} rx={10} fill={COLORS.choco} stroke={COLORS.navy} strokeWidth={6} />
      <circle cx={660} cy={860} r={14} fill={COLORS.gold} />
      <rect x={0} y={SUELO_Y} width={1080} height={20} fill={COLORS.navy} opacity={0.4} />
      {/* bolsa */}
      <g transform="translate(400 1160)">
        <path d="M-120 -40 Q-50 -110 0 -110 Q50 -110 120 -40" fill="none" stroke={COLORS.navy} strokeWidth={14} strokeLinecap="round" />
        <rect x={-230} y={-60} width={460} height={150} rx={70} fill={COLORS.navy} stroke={COLORS.light} strokeWidth={5} />
        <path d="M-200 -10 H200" stroke={COLORS.light} strokeWidth={5} strokeDasharray="14 10" />
        <rect x={-60} y={10} width={120} height={50} rx={14} fill={COLORS.blue} />
        {/* zapatillas encima */}
        <path d="M-150 -60 Q-150 -110 -90 -110 L-30 -80 Q0 -76 0 -60 Z" fill={COLORS.white} stroke={COLORS.navy} strokeWidth={4} />
        <path d="M20 -60 Q20 -106 70 -106 L130 -80 Q160 -76 160 -60 Z" fill={COLORS.white} stroke={COLORS.navy} strokeWidth={4} />
        {/* polvo */}
        {Array.from({ length: 16 }, (_, k) => (
          <circle key={k} cx={-220 + ((k * 97) % 440)} cy={-70 + ((k * 31) % 60) + Math.sin(f / 20 + k) * 3} r={3 + (k % 3)} fill={COLORS.paper} opacity={0.45} />
        ))}
      </g>
      {/* telaraña */}
      <path d="M560 1180 L620 1120 M560 1180 L600 1130 M560 1180 L620 1160 M575 1165 Q590 1150 610 1140" stroke={COLORS.paper} strokeWidth={2} opacity={0.6} fill="none" />
    </svg>
  );
};

const Etiqueta: React.FC<{ texto: string; delay?: number }> = ({ texto, delay = 0.3 }) => {
  const s = useSpring(delay, 9, 0.6);
  return (
    <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ background: COLORS.gold, color: COLORS.navy, fontSize: 64, fontWeight: 900, padding: "14px 40px", borderRadius: 14, border: `6px solid ${COLORS.navy}`, rotate: `${-6 + (1 - s) * -20}deg`, scale: String(0.4 + 0.6 * s), opacity: Math.min(1, s * 1.5) }}>
        {texto}
      </div>
    </div>
  );
};

/* ---------- Escenas ---------- */
const Hook: React.FC = () => (
  <Escena sinEntrada sacudidas={[0.25]}>
    <Sala />
    <Rotulo texto="Hoy juzgamos al **gimnasio de Dani**" delay={-1} />
    <Dani x={360} expresion="preocupado" sudor mirar="der" />
    <Mazo x={820} y={SUELO_Y - 40} golpe={0.25} />
    <Sfx s="impacto" volumen={0.55} en={0.2} />
  </Escena>
);

const Gancho2: React.FC = () => {
  const s = useSpring(0.5, 10, 0.6);
  return (
    <Escena>
      <Sala />
      <Cartel x={540} y={420} s={s} />
      <Dani x={540} expresion="feliz" pose="brazos-arriba" salto={0.4} />
      <Sfx s="pop" volumen={0.4} en={0.5} />
    </Escena>
  );
};

const Prueba1: React.FC = () => (
  <Escena>
    {FOTO_BOLSA ? (
      <Foto src={FOTO_BOLSA} zoom={[1, 1.12]} />
    ) : (
      <>
        <Escenario tipo="interior" />
        <BolsaDeporte />
      </>
    )}
    <Etiqueta texto="PRUEBA Nº 1" />
    <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <Sello />
    </div>
    <Sfx s="pop" volumen={0.4} en={0.3} />
  </Escena>
);
const Sello: React.FC = () => {
  const s = useSpring(1.6, 8, 0.6);
  return (
    <div style={{ fontSize: 46, fontWeight: 900, color: COLORS.red, border: `5px solid ${COLORS.red}`, borderRadius: 12, padding: "6px 22px", background: "rgba(255,255,255,0.9)", rotate: "4deg", scale: String(s), opacity: Math.min(1, s * 2) }}>
      Sin abrir desde octubre
    </div>
  );
};

const Prueba2: React.FC = () => {
  const t = useSeg();
  const marca = t > 2.4 ? 2 : t > 1.8 ? 1 : 0;
  return (
    <Escena>
      <Sala />
      <Etiqueta texto="PRUEBA Nº 2: 2 visitas" />
      <MovilCalendario x={680} y={440} marca={marca} />
      <Dani x={230} escala={1.2} expresion={t > 2.6 ? "triste" : "preocupado"} pose={t > 2.6 ? "encoge" : "quieto"} mirar="der" />
      <Sfx s="pop" volumen={0.35} en={1.8} />
      <Sfx s="pop" volumen={0.35} en={2.4} />
    </Escena>
  );
};

const Rehook: React.FC = () => (
  <Escena>
    <Sala />
    <Rotulo texto="La fiscal tiene **una pregunta**" />
    <Dani x={260} escala={1.3} expresion="sorpresa" mirar="der" />
    <Buho x={760} entra="der" delay={0.1} pose="senala" expresion="pensativo" />
    <Sfx s="swoosh" volumen={0.25} en={0.1} />
    <Sfx s="riser" volumen={0.35} en={0.6} />
  </Escena>
);

const Pregunta: React.FC = () => {
  const t = useSeg();
  const z = interpolate(t, [0, 1.6], [1, 1.25], clamp);
  const bote = Math.abs(Math.sin(t * 6)) * 30;
  return (
    <Escena>
      <Sala />
      <div style={{ position: "absolute", inset: 0, scale: String(z), transformOrigin: "400px 1000px" }}>
        <Dani x={400} escala={1.5} expresion="preocupado" sudor mirar="der" />
        <Buho x={880} escala={1.3} pose="senala" />
      </div>
      <Bocadillo texto="¿Cuánto te cuesta cada visita?" x={600} y={300} ancho={720} size={58} colaX={200} delay={0.1} />
      <div style={{ position: "absolute", top: 560 - bote, left: 260, fontSize: 170, fontWeight: 900, color: COLORS.gold, textShadow: "0 10px 20px rgba(0,0,0,0.3)" }}>?</div>
    </Escena>
  );
};

const Wow: React.FC = () => {
  const t = useSeg();
  const parte = interpolate(t, [1.6, 2.0], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  return (
    <Escena sacudidas={[1.6]}>
      <Sala />
      <Cartel x={540} y={420} parte={parte} />
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, textAlign: "center", fontSize: 54, fontWeight: 900, color: COLORS.white, textShadow: "0 6px 20px rgba(0,0,0,0.4)" }}>
        40 € ÷ 2 visitas
      </div>
      <Mazo x={540} y={720} golpe={1.6} escala={1.1} />
      <Dani x={220} escala={1.1} expresion={t > 1.7 ? "sorpresa" : "preocupado"} salto={1.7} />
      <Buho x={880} escala={1.1} expresion="feliz" />
      <Chispas en={1.7} x={540} y={600} color={COLORS.red} />
      <Sfx s="impacto" volumen={0.55} en={1.6} />
      <Sfx s="ding" volumen={0.4} en={2.0} />
    </Escena>
  );
};

const Balanza: React.FC = () => {
  const t = useSeg();
  const inc = interpolate(t, [0.4, 1.4], [0, 1], clamp) * (1 - interpolate(t, [2.4, 3.6], [0, 1.6], clamp));
  const ang = 16 * inc;
  return (
    <Escena>
      <Sala />
      <Rotulo texto="Lo caro es **lo que no usas**" />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <g transform="translate(540 620)">
          <rect x={-10} y={0} width={20} height={520} fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={4} />
          <rect x={-120} y={510} width={240} height={30} rx={10} fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={4} />
          <g transform={`rotate(${ang})`}>
            <rect x={-330} y={-10} width={660} height={20} rx={8} fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={4} />
            {[-1, 1].map((lado) => (
              <g key={lado} transform={`translate(${lado * 300} 0) rotate(${-ang})`}>
                <line x1={-80} y1={180} x2={0} y2={0} stroke={COLORS.navy} strokeWidth={4} />
                <line x1={80} y1={180} x2={0} y2={0} stroke={COLORS.navy} strokeWidth={4} />
                <path d="M-110 180 H110 Q90 230 0 230 Q-90 230 -110 180 Z" fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={4} />
                <text x={0} y={160} textAnchor="middle" fontSize={44} fontWeight={900} fill={COLORS.white} stroke={COLORS.navy} strokeWidth={2} fontFamily="Inter, sans-serif">
                  {lado < 0 ? "Cuota" : t > 2.4 ? "8 visitas" : "2 visitas"}
                </text>
              </g>
            ))}
          </g>
          <circle r={18} fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={4} />
        </g>
      </svg>
      <Sfx s="pop" volumen={0.3} en={2.4} />
    </Escena>
  );
};

const Sentencia: React.FC = () => {
  const s = useSpring(0.2, 12, 0.7);
  return (
    <Escena>
      <Sala />
      <div style={{ position: "absolute", top: 260, left: 140, right: 170, scale: `1 ${0.2 + 0.8 * s}`, transformOrigin: "50% 0%", opacity: s }}>
        <div style={{ background: COLORS.paper, border: `6px solid ${COLORS.choco}`, borderRadius: 20, padding: "26px 30px", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.choco, letterSpacing: 4 }}>SENTENCIA</div>
          <div style={{ fontSize: 66, fontWeight: 900, color: COLORS.navy, lineHeight: 1.1 }}>
            Úsalo <span style={{ color: COLORS.blue }}>o dalo de baja</span>
          </div>
        </div>
      </div>
      <Buho x={760} escala={1.3} expresion="feliz" pose="senala" />
      <Dani x={300} escala={1.3} expresion="feliz" mirar="der" salto={1.6} />
      <Sfx s="pop" volumen={0.35} en={1.6} />
    </Escena>
  );
};

const Cierre: React.FC = () => {
  const t = useSeg();
  const x = interpolate(t, [1.0, 2.6], [420, 1350], clamp);
  return (
    <Escena sacudidas={[0.3]}>
      <Sala />
      <div style={{ position: "absolute", top: 250, left: 90, right: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 70, fontWeight: 900, letterSpacing: 6, color: COLORS.white }}>
          ALIGN <span style={{ fontWeight: 500, color: COLORS.light }}>by ADB</span>
        </div>
        <div style={{ fontSize: 30, color: COLORS.light }}>Contenido informativo, no es asesoramiento financiero.</div>
      </div>
      <Mazo x={820} y={SUELO_Y - 40} golpe={0.3} escala={0.8} />
      <Dani x={x} escala={1.3} expresion="feliz" mirar="der" anda={t > 1.0} pose={t > 1.0 ? "saluda" : "quieto"} />
      <Sfx s="impacto" volumen={0.5} en={0.25} />
      <Sfx s="swoosh" volumen={0.25} en={1.2} />
    </Escena>
  );
};

const ESCENAS: DefEscena[] = [
  { id: "hook", render: () => <Hook /> },
  { id: "gancho2", render: () => <Gancho2 /> },
  { id: "prueba1", render: () => <Prueba1 /> },
  { id: "prueba2", render: () => <Prueba2 /> },
  { id: "rehook", render: () => <Rehook /> },
  { id: "pregunta", render: () => <Pregunta /> },
  { id: "wow", render: () => <Wow /> },
  { id: "balanza", render: () => <Balanza /> },
  { id: "sentencia", render: () => <Sentencia /> },
  {
    id: "cta",
    subtitulosClaros: true,
    render: () => <CtaCrecer tipo="compartir" boton="MÁNDASELO" linea="A quien paga el gimnasio **y no va**" />,
  },
  { id: "cierre", render: () => <Cierre /> },
];

export const W4904: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4904} pista="lay-back.mp3" /> : null;
