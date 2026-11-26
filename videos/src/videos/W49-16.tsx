import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../brand";
import { Chispas, CtaCrecer, DefEscena, Escena, Montaje, Pildora, PropsVoz, Sfx } from "../kit";

// W49-16 · «Si tu quincena tuviera sonido · Cap. 1» · Reel · Gráfica sonorizada / serie con capítulos · H11 (+ H4)
// Ejemplo (cálculo propio): 2,500 + 1,200 + 600 + 400 + 700 + 300 + 300 = 6,000.
// Con «págate primero»: −$600 el día 1 al sobre y el resto de la quincena se ajusta → día 15: $600 en el sobre.
// El sonido es el protagonista: trompetas, bombo, sirena, cumbia cortada, pitido (scripts/sfx-extra.sh, propios)
// y la voz (ElevenLabs) gritando «¡Ajúa!» y «¡Tamales calientitos!». Sin grabaciones ajenas. Todo DIBUJO.

export const EXTRA_W4916: Record<string, number> = { ajua: 3.0, tamales: 3.7, rebobina: 0.9, final: 1.2 };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pesos = (v: number) => (v < 0 ? "−" : "") + "$" + String(Math.abs(Math.round(v))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const useSeg = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

const Extra: React.FC<{ s: string; en?: number; volumen?: number; hasta?: number; rate?: number }> = ({ s, en = 0, volumen = 0.5, hasta, rate = 1 }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.round(en * fps)} durationInFrames={hasta ? Math.round((hasta - en) * fps) : undefined} layout="none">
      <Audio src={staticFile(`sfx/extra/${s}.wav`)} volume={volumen} playbackRate={rate} />
    </Sequence>
  );
};

/* ---------- La gráfica ---------- */
const GX0 = 120;
const GX1 = 950;
const GY0 = 1230; // $0
const GY1 = 700; // $6,000
const xDia = (d: number) => GX0 + ((d - 1) / 14) * (GX1 - GX0);
const yVal = (v: number) => GY0 - (v / 6000) * (GY0 - GY1);

type Ev = { en: number; dia: number; menos: number; txt?: string; sfx?: React.ReactNode };

/** Recorre los eventos hasta `t` y devuelve los puntos (escalón: cae en vertical en su día). */
const puntosHasta = (t: number, inicio: number, evs: Ev[]) => {
  const pts: [number, number][] = [[1, inicio]];
  let v = inicio;
  let ultimo: Ev | null = null;
  let k = 1;
  for (const e of evs) {
    if (t < e.en) break;
    k = interpolate(t, [e.en, e.en + 0.15], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
    pts.push([e.dia, v]);
    v = v - e.menos * k;
    pts.push([e.dia, v]);
    ultimo = e;
  }
  return { pts, v, ultimo, k };
};

const Grafica: React.FC<{ pts: [number, number][]; hastaDia: number; color?: string; plano?: boolean; brillo?: number }> = ({ pts, hastaDia, color = COLORS.green, plano, brillo = 0 }) => {
  const frame = useCurrentFrame();
  const all: [number, number][] = [...pts, [hastaDia, pts[pts.length - 1][1]]];
  const d = all.map(([dd, v], i) => `${i ? "L" : "M"}${xDia(dd)} ${yVal(v)}`).join(" ");
  const area = `${d} L${xDia(hastaDia)} ${GY0} L${xDia(1)} ${GY0} Z`;
  const [lx, lv] = all[all.length - 1];
  const pulso = 1 + 0.25 * Math.sin(frame / 3);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id="area16" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* rejilla */}
      {[0, 1500, 3000, 4500, 6000].map((v) => (
        <g key={v}>
          <line x1={GX0} y1={yVal(v)} x2={GX1} y2={yVal(v)} stroke={COLORS.white} strokeOpacity={0.08} strokeWidth={2} />
          <text x={GX0 - 14} y={yVal(v) + 8} textAnchor="end" fontFamily={fontFamily} fontWeight={700} fontSize={22} fill={COLORS.grey}>
            {v / 1000}k
          </text>
        </g>
      ))}
      {[1, 5, 10, 15].map((dd) => (
        <text key={dd} x={xDia(dd)} y={GY0 + 44} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={28} fill={COLORS.light}>
          día {dd}
        </text>
      ))}
      <path d={area} fill="url(#area16)" />
      <path d={d} stroke={color} strokeWidth={12} fill="none" strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 ${14 + brillo * 30}px ${color})` }} />
      <circle cx={xDia(lx)} cy={yVal(lv)} r={16 * (plano ? 1 : pulso)} fill={COLORS.white} stroke={color} strokeWidth={6} />
    </svg>
  );
};

const Titulo: React.FC = () => (
  <div style={{ position: "absolute", top: 240, left: 90, right: 120, textAlign: "center", fontFamily }}>
    <div style={{ display: "inline-block", fontSize: 40, fontWeight: 900, whiteSpace: "nowrap", color: COLORS.white, background: "rgba(255,255,255,0.08)", border: `3px solid ${COLORS.light}55`, borderRadius: 22, padding: "10px 28px" }}>
      🎧 Si tu quincena tuviera sonido <span style={{ color: COLORS.gold }}>· Cap. 1</span>
    </div>
  </div>
);

const Saldo: React.FC<{ v: number; color?: string }> = ({ v, color }) => (
  <div style={{ position: "absolute", top: 370, left: 120, fontFamily, fontWeight: 900, fontSize: 120, lineHeight: 1, color: color ?? (v > 3000 ? COLORS.green : v > 1000 ? COLORS.gold : COLORS.red), fontVariantNumeric: "tabular-nums", textShadow: "0 0 30px rgba(0,0,0,0.4)" }}>
    {pesos(v)}
  </div>
);

const Etiqueta: React.FC<{ e: Ev | null; k: number; extra?: string }> = ({ e, k, extra }) => {
  if (!e?.txt) return null;
  return (
    <div style={{ position: "absolute", top: 520, left: 120, right: 120, fontFamily, opacity: Math.min(1, k * 2), scale: String(0.8 + 0.2 * k), transformOrigin: "left center" }}>
      <span style={{ fontSize: 64, fontWeight: 900, color: COLORS.white }}>{e.txt} </span>
      <span style={{ fontSize: 64, fontWeight: 900, color: COLORS.red }}>−${e.menos.toLocaleString("en-US")}</span>
      {extra ? <span style={{ fontSize: 40, fontWeight: 800, color: COLORS.light }}> {extra}</span> : null}
    </div>
  );
};

/* ---------- Escenas ---------- */
const EV1: Ev[] = [
  { en: 1.05, dia: 2, menos: 2500, txt: "Renta" },
  { en: 2.15, dia: 4, menos: 1200, txt: "Súper" },
  { en: 2.9, dia: 5, menos: 600, txt: "MSI" },
];

const Ajua = () => {
  const t = useSeg();
  const { pts, v, ultimo, k } = puntosHasta(t, 6000, EV1);
  const hastaDia = Math.max(1.6, ultimo ? ultimo.dia + 0.6 : 1.6);
  const sacudidas = EV1.map((e) => e.en);
  return (
    <Escena sinEntrada luz={v > 3000 ? "#14532D" : "#7F1D1D"} sacudidas={sacudidas}>
      <Titulo />
      <Saldo v={v} />
      {ultimo ? <Etiqueta e={ultimo} k={k} /> : <div style={{ position: "absolute", top: 520, left: 120, fontFamily, fontSize: 64, fontWeight: 900, color: COLORS.green }}>Día 1: +$6,000 🎺</div>}
      <Grafica pts={pts} hastaDia={hastaDia} brillo={ultimo ? 0 : 1} color={v > 3000 ? COLORS.green : COLORS.gold} />
      {t < 1 ? <Chispas en={0.05} x={xDia(1.6)} y={yVal(6000)} color={COLORS.gold} n={16} /> : null}
      <Extra s="trompetas" volumen={0.5} />
      <Extra s="bombo" volumen={0.9} en={EV1[0].en} />
      <Sfx s="impacto" volumen={0.5} en={EV1[1].en} />
      <Extra s="sirena" volumen={0.45} en={EV1[2].en} />
    </Escena>
  );
};

const EV2: Ev[] = [
  { en: 0.25, dia: 6, menos: 100, txt: "Antojos del Oxxo" },
  { en: 0.95, dia: 7, menos: 100, txt: "Antojos del Oxxo" },
  { en: 1.45, dia: 8, menos: 100, txt: "Antojos del Oxxo" },
  { en: 1.85, dia: 9, menos: 100, txt: "Antojos del Oxxo" },
  { en: 2.45, dia: 10, menos: 700, txt: "Salida" },
  { en: 2.95, dia: 12, menos: 300, txt: "Celular" },
  { en: 3.35, dia: 14, menos: 300, txt: "Uber" },
];

const Tamales = () => {
  const t = useSeg();
  const { pts, v, ultimo, k } = puntosHasta(t, 1700, EV2);
  const PLANO = 3.7;
  const hastaDia = t > PLANO ? 15 : ultimo ? ultimo.dia + 0.6 : 5.6;
  const antojos = EV2.slice(0, 4).filter((e) => t >= e.en).length * 100;
  const esAntojo = ultimo && ultimo.txt === "Antojos del Oxxo";
  return (
    <Escena luz={t > PLANO ? "#450A0A" : "#7F1D1D"} sacudidas={[2.45, 2.95, 3.35]} sonidoEntrada={null}>
      <Titulo />
      <Saldo v={v} />
      {t < PLANO ? (
        esAntojo ? (
          <div style={{ position: "absolute", top: 520, left: 120, right: 120, fontFamily, fontSize: 60, fontWeight: 900, color: COLORS.white }}>
            🌽 Antojos del Oxxo <span style={{ color: COLORS.red }}>−${antojos}</span>
          </div>
        ) : (
          <Etiqueta e={ultimo} k={k} />
        )
      ) : (
        <div style={{ position: "absolute", top: 520, left: 120, right: 120, fontFamily, fontSize: 50, fontWeight: 900, color: COLORS.white, lineHeight: 1.2 }}>
          nadie:
          <br />
          mi cuenta el día 15: <span style={{ color: COLORS.red }}>📉</span>
        </div>
      )}
      <Grafica pts={pts} hastaDia={hastaDia} color={t > PLANO ? COLORS.red : COLORS.gold} plano={t > PLANO} />
      {/* carrito de tamales que no para */}
      {t < 2.3 ? (
        <div style={{ position: "absolute", left: interpolate(t, [0, 2.3], [1100, 560]), top: 1040, fontSize: 120, rotate: `${Math.sin(t * 20) * 4}deg` }}>🛒</div>
      ) : null}
      {/* la voz grita «¡Tamales calientitos!» en 0; luego se repite cada vez más rápido */}
      <Sequence from={Math.round(0.95 * 30)} layout="none">
        <Audio src={staticFile("voz/W49-16/tamales.mp3")} volume={0.8} playbackRate={1.35} />
      </Sequence>
      <Sequence from={Math.round(1.6 * 30)} layout="none">
        <Audio src={staticFile("voz/W49-16/tamales.mp3")} volume={0.75} playbackRate={1.7} />
      </Sequence>
      {EV2.slice(0, 4).map((e, i) => (
        <Sfx key={i} s="tick" volumen={0.6} en={e.en} />
      ))}
      <Extra s="cumbia" volumen={0.55} en={2.2} hasta={2.95} />
      <Extra s="rayon" volumen={0.6} en={2.95} />
      <Sfx s="impacto" volumen={0.45} en={2.45} />
      <Sfx s="impacto" volumen={0.4} en={3.35} />
      <Extra s="plano" volumen={0.5} en={PLANO} />
    </Escena>
  );
};

const Rebobina = () => {
  const t = useSeg();
  // de $0 en el día 15 vuelve al día 1 con $6,000
  const r = interpolate(t, [0, 0.9], [0, 1], { ...clamp, easing: (x) => x * x });
  const dia = interpolate(r, [0, 1], [15, 1.4]);
  const val = interpolate(r, [0, 1], [0, 6000]);
  const SOBRE = 1.7;
  const sobre = interpolate(t, [SOBRE, SOBRE + 0.4], [0, 1], clamp);
  const v = 6000 - 600 * sobre;
  return (
    <Escena luz="#1E3A8A" sonidoEntrada={null}>
      <Titulo />
      <Saldo v={t < 0.9 ? val : v} color={COLORS.light} />
      {/* líneas de VHS */}
      {t < 0.95 ? (
        <AbsoluteFill style={{ background: `repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 3px, transparent 3px ${8 + (t * 60) % 6}px)` }}>
          <div style={{ position: "absolute", top: 300, right: 140, fontFamily, fontSize: 60, fontWeight: 900, color: COLORS.white }}>◀◀</div>
        </AbsoluteFill>
      ) : null}
      <Grafica pts={t < 0.9 ? [[1, val]] : [[1, 6000], [1.2, 6000], [1.2, v]]} hastaDia={t < 0.9 ? dia : 1.6} color={COLORS.light} />
      {t > 1.2 ? (
        <div style={{ position: "absolute", top: 520, left: 120, right: 120, fontFamily, fontSize: 58, fontWeight: 900, color: COLORS.white, opacity: interpolate(t, [1.2, 1.4], [0, 1], clamp) }}>
          Día 1: págate primero <span style={{ color: COLORS.gold }}>−$600</span>
        </div>
      ) : null}
      {/* sobre */}
      {t > SOBRE - 0.3 ? (
        <div style={{ position: "absolute", left: 700, top: 760, scale: String(interpolate(t, [SOBRE - 0.3, SOBRE], [0.3, 1], clamp)) }}>
          <svg width={260} height={170} viewBox="0 0 260 170">
            <rect x={5} y={5} width={250} height={160} rx={16} fill="#FDE68A" stroke={COLORS.navy} strokeWidth={6} />
            <path d="M5 15 L130 95 L255 15" fill="none" stroke={COLORS.navy} strokeWidth={6} />
            <text x={130} y={150} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={40} fill={COLORS.navy}>
              $600
            </text>
          </svg>
        </div>
      ) : null}
      {sobre > 0 && sobre < 1 ? (
        <div style={{ position: "absolute", left: interpolate(sobre, [0, 1], [xDia(1.2), 820]), top: interpolate(sobre, [0, 1], [yVal(6000), 820]) - Math.sin(sobre * Math.PI) * 120, width: 60, height: 60, borderRadius: "50%", background: COLORS.gold, border: `4px solid ${COLORS.navy}` }} />
      ) : null}
      <Extra s="rebobina" volumen={0.55} />
      <Sfx s="ding" volumen={0.5} en={SOBRE + 0.35} />
    </Escena>
  );
};

const EV3: Ev[] = [
  { en: 0.15, dia: 2, menos: 2400 },
  { en: 0.35, dia: 4, menos: 1100 },
  { en: 0.5, dia: 5, menos: 550 },
  { en: 0.65, dia: 8, menos: 350 },
  { en: 0.8, dia: 10, menos: 500 },
  { en: 0.95, dia: 13, menos: 500 },
];

const GraficaFinal = () => {
  const t = useSeg();
  // la misma quincena ajustada: 5,400 que se gastan + 600 que ya están en el sobre
  const { pts } = puntosHasta(t, 6000, EV3);
  const fin = t > 1.1;
  return (
    <Escena luz="#14532D" sonidoEntrada={null}>
      <Titulo />
      <Saldo v={fin ? 600 : pts[pts.length - 1][1]} color={fin ? COLORS.gold : COLORS.light} />
      <div style={{ position: "absolute", top: 520, left: 120, right: 120, fontFamily, fontSize: 58, fontWeight: 900, color: COLORS.white, opacity: fin ? 1 : 0 }}>
        Día 15: <span style={{ color: COLORS.gold }}>$600</span> ✨ en tu sobre
      </div>
      <Grafica pts={pts} hastaDia={fin ? 15 : Math.min(15, 1.6 + t * 12)} color={fin ? COLORS.gold : COLORS.light} brillo={fin ? 1 : 0} />
      <div style={{ position: "absolute", top: 400, right: 130, display: "flex", justifyContent: "flex-end" }}>
        <Pildora size={28}>Ejemplo</Pildora>
      </div>
      {EV3.map((e, i) => (
        <Sfx key={i} s="tick" volumen={0.25} en={e.en} />
      ))}
      {fin ? <Chispas en={1.6} x={xDia(15)} y={yVal(600)} color={COLORS.gold} n={18} /> : null}
      <Extra s="acorde" volumen={0.6} en={1.9} />
    </Escena>
  );
};

const Final: React.FC<{ dur: number }> = () => {
  const { fps } = useVideoConfig();
  const CORTE = Math.round(2.5 * fps);
  return (
    <>
      <Sequence durationInFrames={CORTE} layout="none">
        <GraficaFinal />
      </Sequence>
      <Sequence from={CORTE} layout="none">
        <CtaCrecer tipo="comentar" boton="¿QUÉ DÍA? 👇" linea="¿En qué día **suena así** la tuya?" />
        <div style={{ position: "absolute", top: 1190, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 40, fontWeight: 900, color: COLORS.blue }}>🎧 Próximo: Cap. 2 · tu tarjeta</div>
        <div style={{ position: "absolute", top: 1272, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 28, fontWeight: 700, color: COLORS.navy }}>
          Ejemplo · Contenido informativo, no es asesoramiento financiero.
        </div>
      </Sequence>
    </>
  );
};

const ESCENAS: DefEscena[] = [
  { id: "ajua", render: () => <Ajua /> },
  { id: "tamales", render: () => <Tamales /> },
  { id: "rebobina", render: () => <Rebobina /> },
  { id: "final", subtitulosClaros: true, render: ({ dur }) => <Final dur={dur} /> },
];

export const W4916: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4916} pista="pad-align.wav" /> : null;
