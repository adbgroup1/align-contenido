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

// W48-03 · «El móvil de 1.000 € que costó 1.202 €» · HISTORIA CON PERSONAJE · CTA COMENTAR
// Personajes: Leo (judía azul clara con gorra azul) y la dependienta (verde, con gafas).
// Ejemplo hipotético: 1.000 € a 24 meses, TAE 20 %; r = 1,20^(1/12) − 1 = 1,531 %;
// cuota = 1.000·r / (1 − (1+r)^−24) = 50,10 €; total = 1.202,49 € → «1.202 €».
const NB = " ";
const eur = (v: number) => {
  const n = Math.round(v);
  return (n >= 1000 ? `${Math.floor(n / 1000)}.${String(n % 1000).padStart(3, "0")}` : String(n)) + NB + "€";
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const LEO = { color: COLORS.accent, accesorio: "gorra" as const, colorAccesorio: COLORS.blue };
const DEPEN = { color: COLORS.green, accesorio: "gafas" as const, semilla: 3 };
const HIPO = `Ejemplo hipotético · 20${NB}% TAE`;

export const EXTRA_W4803: Record<string, number> = { hook: 0.2, rehook: 0.9, wow: 0.5, clave: 0.3, cta: 0.6, cierre: 0.7 };

const useSeg = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/* Móvil genérico sin marca, con etiqueta de precio colgando */
const Movil: React.FC<{ x: number; y: number; escala?: number; precio?: React.ReactNode; tachado?: number }> = ({
  x,
  y,
  escala = 1,
  precio,
  tachado = 0,
}) => {
  const frame = useCurrentFrame();
  const brillo = 0.5 + 0.5 * Math.sin(frame / 10);
  return (
    <div style={{ position: "absolute", left: x - 90 * escala, top: y - 330 * escala, width: 180 * escala, height: 330 * escala }}>
      <svg width={180 * escala} height={330 * escala} viewBox="0 0 180 330" style={{ overflow: "visible" }}>
        <rect x={10} y={10} width={160} height={310} rx={30} fill={COLORS.navy} stroke={COLORS.grey} strokeWidth={5} />
        <rect x={22} y={34} width={136} height={264} rx={16} fill={COLORS.blue} />
        <rect x={22} y={34} width={136} height={264} rx={16} fill={COLORS.accent} opacity={0.4 * brillo} />
        <rect x={66} y={18} width={48} height={8} rx={4} fill={COLORS.grey} />
        <circle cx={60} cy={120} r={16} fill={COLORS.gold} opacity={0.9} />
        <circle cx={120} cy={120} r={16} fill={COLORS.green} opacity={0.9} />
        <circle cx={60} cy={180} r={16} fill={COLORS.red} opacity={0.9} />
        <circle cx={120} cy={180} r={16} fill={COLORS.white} opacity={0.9} />
      </svg>
      {precio !== undefined ? (
        <div
          style={{
            position: "absolute",
            left: 120 * escala,
            top: 30 * escala,
            background: COLORS.gold,
            color: COLORS.navy,
            fontWeight: 900,
            fontSize: 54,
            padding: "8px 22px",
            borderRadius: 14,
            border: `5px solid ${COLORS.navy}`,
            rotate: "8deg",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ position: "relative" }}>
            {precio}
            {tachado > 0 ? (
              <span style={{ position: "absolute", left: -6, right: -6, top: "48%", height: 8, background: COLORS.red, transformOrigin: "left", scale: `${tachado} 1` }} />
            ) : null}
          </span>
        </div>
      ) : null}
    </div>
  );
};

const Hook: React.FC = () => {
  const t = useSeg();
  const tach = interpolate(t, [1.0, 1.4], [0, 1], clamp);
  const nuevo = useSpring(1.5, 9, 0.6);
  return (
    <Escena sinEntrada sacudidas={[1.5]}>
      <Escenario tipo="tienda" />
      <Sfx s="impacto" volumen={0.5} />
      <Rotulo texto={`Leo pagó **1.202${NB}€** por un móvil de 1.000${NB}€`} delay={-1} size={58} />
      <Movil x={320} y={1000} escala={1.1} precio={`1.000${NB}€`} tachado={tach} />
      <div
        style={{
          position: "absolute",
          left: 380,
          top: 820,
          fontSize: 90,
          fontWeight: 900,
          color: COLORS.white,
          background: COLORS.red,
          border: `6px solid ${COLORS.navy}`,
          borderRadius: 22,
          padding: "4px 26px",
          rotate: "-6deg",
          scale: String(nuevo),
          opacity: Math.min(1, nuevo * 2),
        }}
      >
        1.202{NB}€
      </div>
      <Personaje x={780} y={SUELO_Y} {...LEO} expresion={t > 1.5 ? "sorpresa" : "feliz"} mirar="izq" salto={1.5} />
      <Sfx s="impacto" volumen={0.4} en={1.5} />
    </Escena>
  );
};

/* Contrato con renglones que se van escribiendo y firma */
const Gancho2: React.FC = () => {
  const t = useSeg();
  const firma = interpolate(t, [1.6, 3.2], [0, 1], clamp);
  return (
    <Escena>
      <Escenario tipo="tienda" />
      <Rotulo texto="Nadie le **engañó**" />
      <svg width={420} height={520} viewBox="0 0 420 520" style={{ position: "absolute", left: 120, top: 520, rotate: "-6deg" }}>
        <rect x={10} y={10} width={400} height={500} rx={18} fill={COLORS.white} stroke={COLORS.navy} strokeWidth={6} />
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={50} y={60 + i * 42} width={interpolate(t, [i * 0.12, i * 0.12 + 0.3], [0, 300 - (i % 3) * 50], clamp)} height={12} rx={6} fill={COLORS.light} />
        ))}
        <path
          d="M60 440 C100 390 120 470 160 420 S230 400 260 440 S320 420 360 410"
          fill="none"
          stroke={COLORS.blue}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={420}
          strokeDashoffset={420 * (1 - firma)}
        />
      </svg>
      <Personaje x={800} y={SUELO_Y} {...LEO} expresion="neutral" pose="senala" mirar="izq" />
      <Sfx s="swoosh" volumen={0.25} en={1.6} />
    </Escena>
  );
};

const Tienda: React.FC = () => (
  <Escena>
    <Escenario tipo="tienda" />
    <Bocadillo texto={`¡Solo 50${NB}€ al mes!`} x={360} y={420} ancho={520} size={62} delay={0.3} colaX={-60} />
    <Personaje x={300} y={SUELO_Y} {...DEPEN} expresion="feliz" pose="saluda" mirar="der" />
    <Personaje x={790} y={SUELO_Y} {...LEO} expresion="feliz" mirar="izq" />
    <Movil x={540} y={1010} escala={0.7} />
    <Sfx s="pop" volumen={0.4} en={0.3} />
  </Escena>
);

const Asiente: React.FC = () => {
  const t = useSeg();
  const x = interpolate(t, [0, 2.8], [260, 700], clamp);
  const check = useSpring(0.6, 10, 0.6);
  return (
    <Escena>
      <Escenario tipo="calle" />
      <Rotulo texto="Se paga **sin pensar**" fondo={COLORS.white} />
      <svg width={200} height={200} viewBox="0 0 100 100" style={{ position: "absolute", left: x - 30, top: 620, scale: String(check) }}>
        <circle cx={50} cy={50} r={44} fill={COLORS.green} stroke={COLORS.navy} strokeWidth={5} />
        <path d="M28 52 L44 66 L72 36" fill="none" stroke={COLORS.white} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <Personaje x={x} y={SUELO_Y} {...LEO} expresion="feliz" anda mirar="der" pose="abraza" />
      <Sfx s="pop" volumen={0.35} en={0.6} />
    </Escena>
  );
};

/* Calendario de 24 casillas que se llenan */
const Calendario: React.FC<{ llenas: number }> = ({ llenas }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 110px)", gap: 14, padding: 24, background: COLORS.white, borderRadius: 30, border: `6px solid ${COLORS.navy}` }}>
    {Array.from({ length: 24 }, (_, i) => {
      const v = Math.max(0, Math.min(1, llenas - i));
      return (
        <div key={i} style={{ height: 90, borderRadius: 14, border: `4px solid ${COLORS.light}`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: COLORS.gold, scale: String(v), borderRadius: 10 }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 900, color: v > 0.5 ? COLORS.navy : COLORS.grey }}>
            {v > 0.5 ? `50${NB}€` : i + 1}
          </div>
        </div>
      );
    })}
  </div>
);

const Plazos: React.FC = () => (
  <Escena fondo="claro">
    <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <div style={{ fontSize: 70, fontWeight: 900, color: COLORS.navy }}>24 meses · con intereses</div>
      <Pildora delay={0.2} bg={COLORS.navy} color={COLORS.gold}>
        {HIPO}
      </Pildora>
      <Calendario llenas={0} />
    </div>
    <Personaje x={880} y={SUELO_Y} {...LEO} escala={1.1} expresion="preocupado" mirar="izq" />
  </Escena>
);

const Rehook: React.FC = () => {
  const t = useSeg();
  const llenas = interpolate(t, [0.2, 2.4], [0, 24], clamp);
  return (
    <Escena fondo="claro" sonidoEntrada={null}>
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <div style={{ fontSize: 90, fontWeight: 900, color: COLORS.blue }}>50{NB}€ × 24</div>
        <Pildora delay={-1} bg={COLORS.navy} color={COLORS.gold}>
          {HIPO}
        </Pildora>
        <Calendario llenas={llenas} />
      </div>
      <Personaje x={880} y={SUELO_Y} {...LEO} escala={1.1} expresion="sorpresa" mirar="izq" />
      {Array.from({ length: 12 }, (_, i) => (
        <Sfx key={i} s="tick" volumen={0.14} en={0.2 + i * 0.18} />
      ))}
      <Sfx s="riser" volumen={0.35} en={1.4} />
    </Escena>
  );
};

const Wow: React.FC = () => {
  const mas = useSpring(2.2, 9, 0.6);
  return (
    <Escena sacudidas={[1.8]} sonidoEntrada="impacto">
      <Escenario tipo="calle" />
      <div style={{ position: "absolute", top: 270, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={{ fontSize: 46, fontWeight: 800, color: COLORS.light }}>El mismo móvil, en total:</div>
        <Cifra a={1202} de={1000} inicio={0.2} fin={1.8} formato={eur} size={210} color={COLORS.gold} />
        <div style={{ fontSize: 90, fontWeight: 900, color: COLORS.white, background: COLORS.red, borderRadius: 24, padding: "4px 30px", scale: String(mas), opacity: Math.min(1, mas * 2) }}>
          +202{NB}€
        </div>
        <Pildora delay={0.3} bg={COLORS.navy} color={COLORS.gold}>
          {HIPO}
        </Pildora>
      </div>
      <Personaje x={540} y={SUELO_Y} {...LEO} escala={1.4} expresion="sorpresa" pose="brazos-arriba" salto={1.8} />
      <Chispas en={1.8} x={540} y={420} />
      <Sfx s="ding" volumen={0.4} en={1.8} />
      <Sfx s="pop" volumen={0.35} en={2.2} />
    </Escena>
  );
};

const Tarjeta: React.FC<{ titulo: string; cifra: string; pregunta: string; color: string; delay: number; desde: number }> = ({
  titulo,
  cifra,
  pregunta,
  color,
  delay,
  desde,
}) => {
  const s = useSpring(delay, 12, 0.7);
  return (
    <div
      style={{
        width: 400,
        background: COLORS.white,
        border: `6px solid ${color}`,
        borderRadius: 34,
        padding: "26px 10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        translate: `${(1 - s) * desde}px 0px`,
        opacity: Math.min(1, s * 1.4),
        boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ fontSize: 44, fontWeight: 800, color: COLORS.grey }}>{titulo}</div>
      <div style={{ fontSize: 86, fontWeight: 900, color }}>{cifra}</div>
      <div style={{ fontSize: 40, fontWeight: 900, color: COLORS.navy, textAlign: "center" }}>{pregunta}</div>
    </div>
  );
};

const Clave: React.FC = () => (
  <Escena>
    <Escenario tipo="tienda" />
    <div style={{ position: "absolute", top: 300, left: 90, right: 120, display: "flex", justifyContent: "space-between" }}>
      <Tarjeta titulo="Cuota" cifra={`50${NB}€`} pregunta="¿Puedo pagarlo?" color={COLORS.choco} delay={0.2} desde={-500} />
      <Tarjeta titulo="Total" cifra={`1.202${NB}€`} pregunta="¿Cuánto cuesta?" color={COLORS.blue} delay={1.6} desde={500} />
    </div>
    <Personaje x={540} y={SUELO_Y} {...LEO} expresion="pensativo" pose="piensa" mirar="der" />
    <Sfx s="pop" volumen={0.35} en={0.2} />
    <Sfx s="pop" volumen={0.35} en={1.6} />
  </Escena>
);

const Consejo: React.FC = () => {
  const cartel = useSpring(2.2, 10, 0.6);
  return (
    <Escena>
      <Escenario tipo="tienda" />
      <Rotulo texto="Antes de firmar: **el total**" />
      <Bocadillo texto="¿Total a pagar?" x={720} y={520} ancho={440} size={56} delay={0.4} colaX={60} />
      <Personaje x={790} y={SUELO_Y} {...LEO} expresion="feliz" pose="senala" mirar="izq" />
      <Personaje x={290} y={SUELO_Y} {...DEPEN} expresion="neutral" mirar="der" />
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 700,
          fontSize: 70,
          fontWeight: 900,
          background: COLORS.white,
          color: COLORS.blue,
          border: `6px solid ${COLORS.blue}`,
          borderRadius: 20,
          padding: "6px 24px",
          scale: String(cartel),
          rotate: "-4deg",
        }}
      >
        1.202{NB}€
      </div>
      <Sfx s="pop" volumen={0.35} en={0.4} />
      <Sfx s="pop" volumen={0.35} en={2.2} />
    </Escena>
  );
};

const Cierre: React.FC = () => {
  const t = useSeg();
  const x = interpolate(t, [0, 4], [200, 760], clamp);
  return (
    <Escena>
      <Escenario tipo="calle" />
      <Rotulo texto={`«Solo 50${NB}€ al mes» = **1.202${NB}€**`} size={56} />
      <Personaje x={x} y={SUELO_Y} {...LEO} expresion="feliz" anda mirar="der" />
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
  { id: "tienda", render: () => <Tienda /> },
  { id: "asiente", render: () => <Asiente /> },
  { id: "plazos", subtitulosClaros: true, render: () => <Plazos /> },
  { id: "rehook", subtitulosClaros: true, render: () => <Rehook /> },
  { id: "wow", render: () => <Wow /> },
  { id: "clave", render: () => <Clave /> },
  { id: "consejo", render: () => <Consejo /> },
  {
    id: "cta",
    subtitulosClaros: true,
    render: () => <CtaCrecer tipo="comentar" boton="¿CUOTA O TOTAL?" linea="Te leo en **comentarios**" />,
  },
  { id: "cierre", subtitulos: false, render: () => <Cierre /> },
];

export const W4803: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4803} pista="lay-back.mp3" /> : null;
