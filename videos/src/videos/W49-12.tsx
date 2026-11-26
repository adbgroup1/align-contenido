import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../brand";
import { Chispas, DefEscena, Escena, Fondo, Montaje, PropsVoz, Sfx } from "../kit";

// W49-12 · «POV: es día 3 y tu quincena ya se fue» · Reel · POV / meme animado en bucle (~8 s) · H4
// Sin cifras. El billete (con capa y lentes) es la quincena. Bucle perfecto: el último fotograma = el primero.
// Sonidos propios (scripts/sfx-extra.sh): trompetas de mariachi sintetizadas y claxon. Todo DIBUJO.

export const EXTRA_W4912: Record<string, number> = { hook: 0.35, dia3: 0.45, sefue: 0.7, cta: 0.45 };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const VERDE = "#4ADE80";
const PARED = "#FDE68A";

const useSeg = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

const Extra: React.FC<{ s: string; en?: number; volumen?: number }> = ({ s, en = 0, volumen = 0.5 }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.round(en * fps)} layout="none">
      <Audio src={staticFile(`sfx/extra/${s}.wav`)} volume={volumen} />
    </Sequence>
  );
};

/* ---------- Cuarto: pared, piso y calendario ---------- */
const Cuarto: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${PARED} 0%, #FCD34D 70%)` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1270, bottom: 0, background: "linear-gradient(180deg, #92400E, #451A03)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1400, bottom: 0, background: "linear-gradient(180deg, rgba(11,18,36,0) 0%, rgba(11,18,36,0.85) 40%)" }} />
    {/* papel picado */}
    <svg width={1080} height={200} style={{ position: "absolute", top: 120 }}>
      <path d="M0 20 Q540 70 1080 20" stroke={COLORS.navy} strokeWidth={3} fill="none" />
      {Array.from({ length: 9 }, (_, i) => {
        const x = 60 + i * 120;
        const y = 20 + 50 * (1 - ((x - 540) / 540) ** 2);
        return <rect key={i} x={x - 40} y={y} width={80} height={90} rx={4} fill={[COLORS.red, COLORS.green, COLORS.accent, "#F472B6"][i % 4]} opacity={0.85} />;
      })}
    </svg>
  </AbsoluteFill>
);

const Calendario: React.FC<{ dia: number; arranca?: number }> = ({ dia, arranca = 0 }) => (
  <div style={{ position: "absolute", left: 120, top: 520, width: 300, height: 340, fontFamily }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: COLORS.white, border: `6px solid ${COLORS.navy}`, boxShadow: "0 16px 30px rgba(0,0,0,0.25)", overflow: "hidden" }}>
      <div style={{ height: 80, background: COLORS.red, color: COLORS.white, fontSize: 40, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>QUINCENA</div>
      <div style={{ fontSize: 190, fontWeight: 900, color: COLORS.navy, textAlign: "center", lineHeight: "250px" }}>{dia}</div>
    </div>
    {/* hojas que se arrancan */}
    {arranca > 0 && arranca < 1
      ? [0, 1].map((i) => {
          const k = Math.min(1, Math.max(0, arranca * 1.6 - i * 0.4));
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: 80, width: 300, height: 260, background: COLORS.white, border: `5px solid ${COLORS.navy}`, borderRadius: 14, translate: `${k * (500 + i * 200)}px ${-k * 300 + k * k * 900}px`, rotate: `${k * (200 + i * 120)}deg`, opacity: 1 - k * 0.6, fontSize: 150, fontWeight: 900, color: COLORS.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {i + 1}
            </div>
          );
        })
      : null}
    <div style={{ position: "absolute", left: 140, top: -30, width: 20, height: 40, borderRadius: 10, background: COLORS.grey }} />
  </div>
);

/* ---------- El billete ---------- */
const Billete: React.FC<{ x: number; y: number; flaco?: number; lentes?: boolean; capa?: boolean; maleta?: boolean; cara?: "presume" | "triste" | "adios"; t0?: number }> = ({
  x,
  y,
  flaco = 0,
  lentes = true,
  capa = true,
  maleta = false,
  cara = "presume",
  t0,
}) => {
  const frame = useCurrentFrame();
  const t = t0 ?? frame / 30;
  const ondea = Math.sin(t * 8) * 14;
  const W = 300 * (1 - flaco * 0.55);
  const H = 170;
  const N = COLORS.navy;
  const saludo = cara === "adios" ? Math.sin(t * 14) * 30 : 0;
  return (
    <div style={{ position: "absolute", left: x - 200, top: y - 420, width: 400, height: 420 }}>
      <svg width={400} height={420} viewBox="0 0 400 420" style={{ overflow: "visible", filter: "drop-shadow(0 16px 20px rgba(0,0,0,0.3))" }}>
        {capa ? <path d={`M${200 - W / 2 + 10} 130 Q${100 + ondea} 260 ${60 + ondea} 330 L${340 + ondea * 0.5} 330 Q${300 + ondea * 0.5} 260 ${200 + W / 2 - 10} 130 Z`} fill={COLORS.red} stroke={N} strokeWidth={5} /> : null}
        {/* piernas */}
        <path d={`M${200 - 40} 300 L${200 - 50} 400 M${200 + 40} 300 L${200 + 50} 400`} stroke={N} strokeWidth={10} strokeLinecap="round" />
        <path d="M130 402 h40 M230 402 h40" stroke={N} strokeWidth={12} strokeLinecap="round" />
        {/* brazos */}
        {cara === "presume" ? (
          <path d={`M${200 - W / 2} 200 L${200 - W / 2 - 50} 150 M${200 + W / 2} 200 L${200 + W / 2 + 40} 240`} stroke={N} strokeWidth={10} strokeLinecap="round" />
        ) : (
          <path d={`M${200 - W / 2} 210 L${200 - W / 2 - 40} 270 M${200 + W / 2} 200 L${200 + W / 2 + 46} ${150 - saludo * 0.5}`} stroke={N} strokeWidth={10} strokeLinecap="round" />
        )}
        {/* cuerpo-billete */}
        <rect x={200 - W / 2} y={130} width={W} height={H} rx={14} fill={VERDE} stroke={N} strokeWidth={6} />
        <rect x={200 - W / 2 + 14} y={144} width={W - 28} height={H - 28} rx={8} fill="none" stroke="#166534" strokeWidth={4} strokeDasharray="10 6" />
        <text x={200 + W / 2 - 34} y={170} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={30} fill="#166534">$</text>
        {/* cara */}
        {lentes ? (
          <g>
            <rect x={150} y={180} width={44} height={28} rx={10} fill={N} />
            <rect x={206} y={180} width={44} height={28} rx={10} fill={N} />
            <path d="M194 190 H206" stroke={N} strokeWidth={6} />
            <path d="M158 186 l14 0" stroke={COLORS.white} strokeWidth={4} opacity={0.6} />
          </g>
        ) : (
          <g>
            {[180, 220].map((ex) => (
              <g key={ex}>
                <ellipse cx={ex} cy={196} rx={13} ry={15} fill={COLORS.white} stroke={N} strokeWidth={3} />
                <circle cx={ex} cy={200} r={6} fill={N} />
              </g>
            ))}
            <path d="M166 176 L192 184 M234 176 L208 184" stroke={N} strokeWidth={5} strokeLinecap="round" />
          </g>
        )}
        {cara === "presume" ? <path d="M176 236 Q200 258 226 236" stroke={N} strokeWidth={6} fill="none" strokeLinecap="round" /> : <path d="M180 248 Q200 232 220 248" stroke={N} strokeWidth={6} fill="none" strokeLinecap="round" />}
        {maleta ? (
          <g transform="translate(250 300)">
            <rect x={0} y={20} width={110} height={80} rx={10} fill={COLORS.choco} stroke={N} strokeWidth={5} />
            <path d="M35 20 v-14 h40 v14" stroke={N} strokeWidth={5} fill="none" />
            <rect x={0} y={52} width={110} height={8} fill={COLORS.gold} />
          </g>
        ) : null}
      </svg>
    </div>
  );
};

const Trompeta: React.FC<{ x: number; y: number; rot: number; s: number }> = ({ x, y, rot, s }) => (
  <svg width={200} height={110} viewBox="0 0 200 110" style={{ position: "absolute", left: x, top: y, rotate: `${rot}deg`, scale: String(s), overflow: "visible" }}>
    <path d="M10 50 H120 L180 14 V96 L120 60 H10 Z" fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={60} cy={40} r={8} fill="#B45309" />
    <circle cx={84} cy={40} r={8} fill="#B45309" />
    <text x={190} y={8} fontSize={46} fill={COLORS.navy}>♪</text>
  </svg>
);

const TextoArriba: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", top: 250, left: 90, right: 120, display: "flex", justifyContent: "center" }}>
    <div style={{ background: COLORS.navy, color: COLORS.white, fontFamily, fontWeight: 900, fontSize: 76, padding: "16px 40px", borderRadius: 28, rotate: "-2deg", boxShadow: "0 16px 40px rgba(0,0,0,0.3)" }}>{children}</div>
  </div>
);

/* ---------- Escenas ---------- */
/** El fotograma del gancho (también el último: bucle). `t0` congela la animación. */
const Gancho: React.FC<{ t0?: number }> = ({ t0 }) => {
  const frame = useCurrentFrame();
  const t = t0 ?? frame / 30;
  const s = Math.min(1, 0.85 + t * 0.6);
  return (
    <>
      <Cuarto />
      <TextoArriba>POV: es día 3</TextoArriba>
      <Calendario dia={1} />
      <Billete x={680} y={1270} t0={t0} />
      <Trompeta x={430} y={430} rot={-20} s={s} />
      <Trompeta x={760} y={470} rot={200} s={s} />
      <Trompeta x={560} y={380} rot={-90} s={s * 0.9} />
    </>
  );
};

const Hook = () => (
  <Escena sinEntrada luz="#B45309">
    <Gancho />
    <Extra s="trompetas" volumen={0.55} />
    <Chispas en={0.1} x={680} y={1020} color={COLORS.gold} n={16} />
  </Escena>
);

const Dia3 = () => {
  const t = useSeg();
  const arranca = interpolate(t, [0, 0.5], [0, 1], clamp);
  return (
    <Escena luz="#B45309" sonidoEntrada="whoosh" sacudidas={[0.2]}>
      <Cuarto />
      <TextoArriba>POV: es día 3</TextoArriba>
      <Calendario dia={3} arranca={arranca} />
      <Billete x={680} y={1270} flaco={1} lentes={false} capa={false} maleta cara="triste" />
      <Sfx s="swoosh" volumen={0.45} en={0.05} />
      <Sfx s="swoosh" volumen={0.4} en={0.3} />
    </Escena>
  );
};

const Taxi: React.FC<{ x: number }> = ({ x }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x - 260, top: 960, width: 520 }}>
      <div style={{ position: "absolute", left: 120, top: -70, width: 280, background: COLORS.navy, color: COLORS.gold, fontFamily, fontWeight: 900, fontSize: 26, textAlign: "center", borderRadius: 10, padding: "6px 8px", border: `3px solid ${COLORS.gold}` }}>
        renta · Oxxo · Uber · MSI
      </div>
      <svg width={520} height={300} viewBox="0 0 520 300" style={{ overflow: "visible" }}>
        <path d="M20 200 Q24 140 90 136 L160 60 Q172 46 196 46 L330 46 Q356 46 370 62 L430 136 Q500 140 504 200 L504 236 L20 236 Z" fill="#F59E0B" stroke={COLORS.navy} strokeWidth={7} />
        <path d="M176 66 L330 66 L392 136 L120 136 Z" fill={COLORS.light} stroke={COLORS.navy} strokeWidth={6} />
        <line x1={256} y1={66} x2={256} y2={136} stroke={COLORS.navy} strokeWidth={6} />
        <rect x={40} y={170} width={440} height={16} fill={COLORS.white} opacity={0.6} />
        {[130, 400].map((cx) => (
          <g key={cx} transform={`rotate(${-frame * 25} ${cx} 240)`}>
            <circle cx={cx} cy={240} r={46} fill={COLORS.navy} stroke="#334155" strokeWidth={8} />
            <line x1={cx - 26} y1={240} x2={cx + 26} y2={240} stroke={COLORS.grey} strokeWidth={7} />
          </g>
        ))}
      </svg>
    </div>
  );
};

const SeFue = () => {
  const t = useSeg();
  const llega = interpolate(t, [0, 0.35], [-400, 560], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  const sale = interpolate(t, [0.9, 1.6], [0, -1300], { ...clamp, easing: (x) => x * x });
  const x = llega + sale;
  return (
    <Escena luz="#B45309" sonidoEntrada="swoosh">
      <Cuarto />
      <TextoArriba>POV: es día 3</TextoArriba>
      <Calendario dia={3} />
      {t < 0.85 ? <Billete x={720} y={1270} flaco={1} lentes={false} capa={false} maleta cara="triste" /> : null}
      <Taxi x={x} />
      {t >= 0.85 ? (
        <div style={{ position: "absolute", left: x + 40, top: 900, scale: "0.55" }}>
          <Billete x={0} y={300} flaco={1} lentes={false} capa={false} cara="adios" />
        </div>
      ) : null}
      <div style={{ position: "absolute", top: 400, left: 90, right: 120, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 58, color: COLORS.navy, opacity: interpolate(t, [0.4, 0.7], [0, 1], clamp) }}>
        ¿En qué día se te acaba a ti? 👇
      </div>
      <Extra s="claxon" volumen={0.45} en={0.35} />
    </Escena>
  );
};

const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const vuelta = interpolate(frame, [dur - 14, dur - 1], [0, 1], clamp);
  return (
    <>
      <Escena luz="#B45309" sonidoEntrada="swoosh">
        <Cuarto />
        <Calendario dia={1} />
        <div style={{ position: "absolute", top: 260, left: 90, right: 120, display: "flex", justifyContent: "center" }}>
          <div style={{ background: COLORS.blue, color: COLORS.white, fontFamily, fontWeight: 900, fontSize: 78, padding: "18px 40px", borderRadius: 30, rotate: "-3deg", textAlign: "center", lineHeight: 1.05, scale: String(Math.min(1, 0.6 + t * 3)), boxShadow: `0 20px 50px ${COLORS.blue}66` }}>
            Págate primero el día 1
          </div>
        </div>
        <Billete x={680} y={1270} t0={0} />
        <div style={{ position: "absolute", top: 1290, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 28, fontWeight: 700, color: COLORS.white }}>Contenido informativo, no es asesoramiento financiero.</div>
        <Sfx s="ding" volumen={0.4} en={0.15} />
      </Escena>
      {vuelta > 0 ? (
        <AbsoluteFill style={{ opacity: vuelta, fontFamily }}>
          <Fondo luz="#B45309" />
          <Gancho t0={0} />
        </AbsoluteFill>
      ) : null}
    </>
  );
};

const ESCENAS: DefEscena[] = [
  { id: "hook", render: () => <Hook /> },
  { id: "dia3", render: () => <Dia3 /> },
  { id: "sefue", render: () => <SeFue /> },
  { id: "cta", render: ({ dur }) => <Cta dur={dur} /> },
];

export const W4912: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4912} pista="long-day.mp3" /> : null;
