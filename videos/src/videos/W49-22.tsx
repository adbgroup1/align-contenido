import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../brand";
import { Bocadillo, Chispas, CtaCrecer, DefEscena, Escena, Escenario, Fondo, Montaje, Personaje, PropsVoz, Rotulo, Sfx, SUELO_Y } from "../kit";

// W49-22 · «Le presté $500 a mi primo "hasta el lunes"» · Reel · Historia con personaje + contador de días · H9
// Sin cifras externas ($500 es ejemplo). Lalo (frijol naranja, el de W49-17 sin gorro) y Beto (frijol verde con gorra).
// El contador de días vive arriba a la izquierda y se acelera del día 15 al 90. Cierre en bucle a «DÍA 1».

export const EXTRA_W4922: Record<string, number> = { hook: 0.2, d15: 0.2, d40: 0.3, d90: 0.5, cta: 0.9 };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (x: number) => 1 - (1 - x) ** 3;
const LALO = { color: "#FB923C", semilla: 1 };
const BETO = { color: "#22C55E", accesorio: "gorra" as const, colorAccesorio: COLORS.blue, semilla: 2 };

const useSeg = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/* ---------- Contador de días ---------- */
const Dias: React.FC<{ de: number; a: number; en?: number; dur?: number }> = ({ de, a, en = 0, dur = 0.6 }) => {
  const t = useSeg();
  const k = interpolate(t, [en, en + dur], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 2 });
  const v = Math.round(de + (a - de) * k);
  const golpe = t > en && t < en + dur + 0.25 ? Math.sin(((t - en) / (dur + 0.25)) * Math.PI) : 0;
  const color = v >= 60 ? COLORS.red : v >= 15 ? COLORS.gold : COLORS.white;
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 450,
        background: "rgba(15,23,42,0.85)",
        border: `5px solid ${color}`,
        borderRadius: 26,
        padding: "8px 26px 12px",
        fontFamily,
        scale: String(1 + golpe * 0.15),
        transformOrigin: "left top",
        boxShadow: `0 0 ${20 + golpe * 40}px ${color}88`,
        rotate: `${Math.sin(t * 40) * golpe * 3}deg`,
        zIndex: 5,
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.light, letterSpacing: 2 }}>«EL LUNES»</div>
      <div style={{ fontSize: 84, fontWeight: 900, color, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>DÍA {v}</div>
    </div>
  );
};

/* ---------- Objetos ---------- */
const Billete: React.FC<{ x: number; y: number; rot?: number; escala?: number; lentes?: boolean; saluda?: boolean }> = ({ x, y, rot = 0, escala = 1, lentes, saluda }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", rotate: `${rot}deg`, scale: String(escala) }}>
      <svg width={180} height={96} viewBox="0 0 180 96" style={{ overflow: "visible", filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.35))" }}>
        <rect x={3} y={3} width={174} height={90} rx={12} fill="#C4B5FD" stroke={COLORS.navy} strokeWidth={5} />
        <text x={90} y={62} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={40} fill={COLORS.navy}>
          $500
        </text>
        {lentes ? (
          <g>
            <rect x={44} y={10} width={38} height={18} rx={6} fill={COLORS.navy} />
            <rect x={98} y={10} width={38} height={18} rx={6} fill={COLORS.navy} />
            <line x1={82} y1={16} x2={98} y2={16} stroke={COLORS.navy} strokeWidth={4} />
          </g>
        ) : null}
        {saluda ? <path d={`M176 40 L214 ${8 + Math.sin(frame * 0.5) * 12}`} stroke={COLORS.navy} strokeWidth={8} strokeLinecap="round" /> : null}
      </svg>
    </div>
  );
};

const Celular: React.FC<{ x: number; y: number; escala?: number; rot?: number; children?: React.ReactNode }> = ({ x, y, escala = 1, rot = 0, children }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(escala), rotate: `${rot}deg` }}>
    <div style={{ width: 300, height: 540, background: COLORS.navy, borderRadius: 44, padding: 14, boxShadow: "0 30px 60px rgba(0,0,0,0.5)", border: `4px solid #334155` }}>
      <div style={{ width: "100%", height: "100%", background: "#E2E8F0", borderRadius: 32, overflow: "hidden", position: "relative" }}>{children}</div>
    </div>
  </div>
);

const Chat: React.FC<{ on: number; y: number }> = ({ on, y }) => (
  <div style={{ position: "absolute", right: 14, top: y, opacity: on, translate: `${(1 - on) * 60}px 0px`, background: "#DCFCE7", border: `3px solid ${COLORS.navy}`, borderRadius: 16, padding: "6px 12px", fontFamily, fontWeight: 800, fontSize: 26, color: COLORS.navy }}>
    Mi CLABE 👇 <span style={{ color: "#2563EB", fontWeight: 900 }}>✓✓</span>
  </div>
);

const Telarana: React.FC<{ x: number; y: number; on: number }> = ({ x, y, on }) => (
  <svg width={200} height={140} viewBox="0 0 200 140" style={{ position: "absolute", left: x - 100, top: y - 70, opacity: on, scale: String(0.4 + on * 0.6) }}>
    <g stroke={COLORS.white} strokeWidth={3} fill="none" opacity={0.9}>
      {[0, 30, 60, 90, 120, 150, 180].map((a) => (
        <line key={a} x1={100} y1={130} x2={100 + Math.cos((a * Math.PI) / 180) * 95} y2={130 - Math.sin((a * Math.PI) / 180) * 95} />
      ))}
      {[30, 55, 80].map((r) => (
        <path key={r} d={`M${100 - r} 130 Q${100 - r * 0.7} ${130 - r * 0.6} 100 ${130 - r} Q${100 + r * 0.7} ${130 - r * 0.6} ${100 + r} 130`} />
      ))}
    </g>
  </svg>
);

const Playa: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={272} height={512} viewBox="0 0 272 512" style={{ position: "absolute", inset: 0 }}>
      <rect width={272} height={512} fill="#7DD3FC" />
      <circle cx={210} cy={80} r={36} fill="#FDE047" />
      <path d={`M0 270 Q68 ${255 + Math.sin(frame * 0.15) * 8} 136 270 T272 270 L272 340 L0 340 Z`} fill="#0EA5E9" />
      <rect y={330} width={272} height={182} fill="#FDE68A" />
      <path d="M40 330 L48 200" stroke={COLORS.choco} strokeWidth={10} />
      <path d="M48 200 Q10 190 0 215 M48 200 Q90 185 100 210 M48 200 Q30 170 10 175 M48 200 Q70 165 92 172" stroke="#16A34A" strokeWidth={9} fill="none" strokeLinecap="round" />
    </svg>
  );
};

/* ---------- Escenas ---------- */

const Gancho: React.FC<{ congelar?: boolean }> = ({ congelar }) => {
  const ts = useSeg();
  const t = congelar ? 0 : ts;
  const vuela = congelar ? 0 : interpolate(t, [0.15, 0.7], [0, 1], { ...clamp, easing: easeOut });
  const bx = interpolate(vuela, [0, 1], [400, 700]);
  const by = interpolate(vuela, [0, 1], [930, 940]) - Math.sin(vuela * Math.PI) * 120;
  return (
    <>
      <Escenario tipo="interior" />
      <Personaje x={300} y={SUELO_Y} escala={1.6} {...LALO} expresion="feliz" pose="senala" mirar="der" />
      <Personaje x={800} y={SUELO_Y} escala={1.6} {...BETO} expresion="feliz" pose="saluda" mirar="izq" />
      <Billete x={bx} y={by} rot={vuela * 20 - 10} escala={0.9} />
      <Bocadillo texto="«Te lo paso el lunes, primo»" x={700} y={620} ancho={480} size={40} delay={congelar ? -2 : -0.3} colaX={80} />
      <Dias de={1} a={1} />
    </>
  );
};

const Hook = () => (
  <Escena sinEntrada luz="#7C2D12">
    <Gancho />
    <Sfx s="swoosh" volumen={0.4} en={0.15} />
    <Sfx s="pop" volumen={0.4} en={0.7} />
  </Escena>
);

const D7 = () => {
  const t = useSeg();
  return (
    <Escena luz="#7C2D12" sonidoEntrada="whoosh">
      <Escenario tipo="interior" />
      <Personaje x={280} y={SUELO_Y} escala={1.6} {...LALO} expresion="pensativo" pose="piensa" mirar="der" />
      <Personaje x={800} y={SUELO_Y} escala={1.6} {...BETO} expresion="sorpresa" pose="encoge" mirar="izq" />
      {t > 0.9 ? <Bocadillo texto="«Es que no ha caído la quincena» 😇" x={720} y={600} ancho={480} size={38} delay={0.9} colaX={80} /> : null}
      <Dias de={1} a={7} en={0.1} />
      <Sfx s="tick" volumen={0.4} en={0.2} />
      <Sfx s="pop" volumen={0.35} en={0.9} />
    </Escena>
  );
};

const D15 = () => {
  const t = useSeg();
  return (
    <Escena luz="#1E3A8A" sonidoEntrada="swoosh">
      <Escenario tipo="interior" />
      <Rotulo texto="«Pásame **tu CLABE**»" size={60} />
      <Personaje x={260} y={SUELO_Y} escala={1.5} {...LALO} expresion="preocupado" pose="senala" mirar="der" />
      <Celular x={730} y={880} escala={1.3} rot={4}>
        <div style={{ background: COLORS.blue, color: COLORS.white, fontFamily, fontWeight: 900, fontSize: 26, padding: "12px 16px" }}>Primo Beto 🌴</div>
        {[0.4, 0.8, 1.2].map((en, i) => (
          <Chat key={i} y={80 + i * 70} on={interpolate(t, [en, en + 0.15], [0, 1], clamp)} />
        ))}
        <div style={{ position: "absolute", left: 14, top: 310, opacity: interpolate(t, [1.6, 1.7], [0, 1], clamp), fontFamily, fontSize: 24, fontWeight: 700, color: COLORS.grey }}>
          Beto: visto ✓✓
        </div>
      </Celular>
      <Dias de={7} a={15} en={0.1} dur={0.5} />
      {[0.4, 0.8, 1.2].map((en) => (
        <Sfx key={en} s="pop" volumen={0.4} en={en} />
      ))}
    </Escena>
  );
};

const D40 = () => {
  const t = useSeg();
  return (
    <Escena luz="#3F3F46" sonidoEntrada="whoosh">
      <Escenario tipo="interior" />
      {Array.from({ length: 10 }, (_, i) => {
        const en = i * 0.12;
        const k = interpolate(t, [en, en + 0.7], [0, 1], clamp);
        if (k <= 0 || k >= 1) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 540 + k * (i % 2 ? 420 : -420), top: 640 - k * 260 + k * k * 500, rotate: `${k * (i % 2 ? 300 : -300)}deg`, width: 130, height: 110, background: COLORS.paper, border: `4px solid ${COLORS.navy}`, borderRadius: 12, fontFamily, fontWeight: 900, fontSize: 52, color: COLORS.navy, textAlign: "center", overflow: "hidden" }}>
            <div style={{ background: COLORS.red, height: 26 }} />
            {16 + i * 3}
          </div>
        );
      })}
      <Personaje x={540} y={SUELO_Y} escala={1.8} {...LALO} expresion="neutral" pose="encoge" mirar="frente" />
      <Telarana x={540} y={SUELO_Y - 470} on={interpolate(t, [1.0, 1.6], [0, 1], clamp)} />
      {t > 0.8 ? <Bocadillo texto="«Ahorita»" x={800} y={640} ancho={340} size={52} delay={0.8} colaX={-60} /> : null}
      <Dias de={15} a={40} en={0} dur={1.1} />
      <Sfx s="swoosh" volumen={0.35} en={0.1} />
      <Sfx s="pop" volumen={0.4} en={0.8} />
    </Escena>
  );
};

const D90 = () => {
  const t = useSeg();
  const sube = interpolate(t, [0.1, 0.5], [0, 1], { ...clamp, easing: easeOut });
  const FOTO = 1.2;
  return (
    <Escena luz="#991B1B" sonidoEntrada="whoosh" sacudidas={[FOTO]}>
      <Escenario tipo="interior" />
      <Celular x={600} y={interpolate(sube, [0, 1], [1500, 920])} escala={1.25}>
        <Playa />
        <div style={{ position: "absolute", left: 10, right: 10, top: 10, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.5)" }}>
          <div style={{ width: `${Math.min(100, t * 30)}%`, height: "100%", background: COLORS.white, borderRadius: 3 }} />
        </div>
        <div style={{ position: "absolute", left: 14, top: 26, fontFamily, fontWeight: 900, fontSize: 22, color: COLORS.white, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>beto_primo · 2 min</div>
        {t > FOTO - 0.4 ? (
          <>
            <Personaje x={110} y={470} escala={0.85} {...BETO} expresion="feliz" pose="brazos-arriba" mirar="frente" accesorio="gafas" />
            <Billete x={210} y={300} escala={0.7} rot={-8} lentes saluda />
          </>
        ) : null}
      </Celular>
      <Personaje x={190} y={SUELO_Y} escala={1.3} {...LALO} expresion={t < FOTO ? "neutral" : "enfadado"} pose="quieto" mirar="der" />
      <Dias de={40} a={90} en={0} dur={0.9} />
      <Sfx s="impacto" volumen={0.5} en={FOTO} />
      <Chispas en={FOTO} x={600} y={800} color={COLORS.gold} n={12} />
    </Escena>
  );
};

const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const CORTE = Math.round(1.6 * fps);
  const guarda = interpolate(t, [0.5, 1.0], [0, 1], { ...clamp, easing: easeOut });
  const vuelta = interpolate(frame, [dur - 10, dur - 2], [0, 1], clamp);
  return (
    <>
      <Sequence durationInFrames={CORTE} layout="none">
        <Escena luz="#15803D" sonidoEntrada="swoosh">
          <Escenario tipo="interior" />
          <Rotulo texto="Presta solo lo que **podrías regalar**" size={58} />
          <Personaje x={540} y={SUELO_Y} escala={1.8} {...LALO} expresion="feliz" pose="abraza" mirar="frente" />
          <div style={{ position: "absolute", left: 540, top: 1000 + guarda * 60, translate: "-50% 0", width: 160, height: 100, background: COLORS.choco, border: `5px solid ${COLORS.navy}`, borderRadius: 16, scale: String(1 - guarda * 0.3), opacity: 1 - guarda * 0.5 }} />
        </Escena>
      </Sequence>
      <Sequence from={CORTE} layout="none">
        <CtaCrecer tipo="compartir" boton="MÁNDASELO 👀" linea="a tu **primo**: él sabe" />
        <div style={{ position: "absolute", top: 1272, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 28, fontWeight: 700, color: COLORS.navy }}>
          Ejemplo · Contenido informativo, no es asesoramiento financiero.
        </div>
      </Sequence>
      {vuelta > 0 ? (
        <AbsoluteFill style={{ opacity: vuelta, fontFamily }}>
          <Fondo luz="#7C2D12" />
          <Gancho congelar />
        </AbsoluteFill>
      ) : null}
    </>
  );
};

const ESCENAS: DefEscena[] = [
  { id: "hook", render: () => <Hook /> },
  { id: "d7", render: () => <D7 /> },
  { id: "d15", render: () => <D15 /> },
  { id: "d40", render: () => <D40 /> },
  { id: "d90", render: () => <D90 /> },
  { id: "cta", subtitulosClaros: true, render: ({ dur }) => <Cta dur={dur} /> },
];

export const W4922: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4922} pista="sunlight.mp3" /> : null;
