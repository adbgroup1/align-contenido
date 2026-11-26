import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../brand";
import { Bocadillo, Chispas, CtaCrecer, DefEscena, Escena, Fondo, Montaje, Pildora, PropsVoz, Rotulo, Sfx } from "../kit";

// W49-21 · «Carrera de canicas: ¿quién se cobra primero tu quincena?» · Reel · Carrera de canicas + contador · H16
// Ejemplo (cálculo propio): 2,500 + 1,800 + 1,700 = 6,000; con ahorro primero: 600 + 2,500 + 1,800 + 1,100 = 6,000.
// Todo DIBUJO: tablero de clavos, 4 canicas de colores fijos (Renta azul, Tarjeta roja, Antojos amarilla, Ahorro verde)
// y la cubeta «Quincena» con su contador. Cierre en bucle con las canicas en la salida.

export const EXTRA_W4921: Record<string, number> = { renta: 0.2, antojos: 0.3, gana: 0.5, cta: 0.9 };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (x: number) => 1 - (1 - x) ** 3;
const pesos = (v: number) => "$" + String(Math.round(Math.max(0, v))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

type Id = "renta" | "tarjeta" | "antojos" | "ahorro";
const CAN: Record<Id, { color: string; luz: string; nombre: string; carril: number; fase: number }> = {
  renta: { color: "#2563EB", luz: "#93C5FD", nombre: "RENTA", carril: 250, fase: 0.1 },
  tarjeta: { color: "#DC2626", luz: "#FCA5A5", nombre: "TARJETA", carril: 450, fase: 0.6 },
  antojos: { color: "#EAB308", luz: "#FEF08A", nombre: "ANTOJOS", carril: 650, fase: 0.3 },
  ahorro: { color: "#16A34A", luz: "#86EFAC", nombre: "AHORRO", carril: 830, fase: 0.8 },
};
const Y0 = 400; // salida
const Y1 = 1080; // boca de la cubeta
const CUBETA_X = 540;

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

const tri = (x: number) => 1 - 2 * Math.abs((x % 1 + 1) % 1 - 0.5) * 2; // -1..1

/** Posición de una canica según su avance p (0 = salida, 1 = cubeta). `zig` = rebotes más amplios. */
const posicion = (id: Id, p: number, zig = 1) => {
  const c = CAN[id];
  const destinoX = CUBETA_X + (c.carril - 540) * 0.25;
  const xBase = interpolate(p, [0, 0.85, 1], [c.carril, c.carril * 0.6 + destinoX * 0.4, destinoX], clamp);
  const amp = 60 * zig * (p < 0.9 ? 1 : (1 - p) * 10);
  const x = xBase + tri(p * 6 * zig + c.fase) * amp;
  const salto = Math.abs(Math.sin(p * Math.PI * 7)) * 18;
  const y = Y0 + p * (Y1 - Y0) - salto;
  return { x, y };
};

/* ---------- Piezas ---------- */

const Clavos: React.FC<{ letreros?: boolean; ahorita?: boolean }> = ({ letreros = false, ahorita = false }) => {
  const filas = 7;
  const clavos: { x: number; y: number }[] = [];
  for (let r = 0; r < filas; r++) {
    for (let c = 0; c < 6; c++) {
      const x = 150 + c * 160 + (r % 2 ? 80 : 0);
      if (x > 960) continue;
      clavos.push({ x, y: 470 + r * 90 });
    }
  }
  const tags: [number, string][] = letreros ? [[7, "la tiendita"], [16, "delivery"], [26, "antojo"]] : [];
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect x={90} y={380} width={900} height={720} rx={36} fill="rgba(15,23,42,0.55)" stroke={COLORS.light} strokeOpacity={0.25} strokeWidth={4} />
        {clavos.map((k, i) => (
          <g key={i}>
            <circle cx={k.x} cy={k.y + 4} r={11} fill="#000" opacity={0.3} />
            <circle cx={k.x} cy={k.y} r={11} fill="#CBD5E1" stroke={COLORS.navy} strokeWidth={3} />
            <circle cx={k.x - 3} cy={k.y - 3} r={4} fill={COLORS.white} />
          </g>
        ))}
      </svg>
      {tags.map(([i, txt]) => (
        <div key={txt} style={{ position: "absolute", left: clavos[i].x, top: clavos[i].y - 52, translate: "-50% 0", background: COLORS.gold, color: COLORS.navy, fontFamily, fontWeight: 900, fontSize: 30, padding: "2px 12px", borderRadius: 10, border: `3px solid ${COLORS.navy}`, whiteSpace: "nowrap" }}>
          {txt}
        </div>
      ))}
      {ahorita ? (
        <div style={{ position: "absolute", left: 640, top: 600, translate: "-50% 0", background: COLORS.paper, color: COLORS.red, fontFamily, fontWeight: 900, fontSize: 36, padding: "2px 14px", borderRadius: 10, border: `4px solid ${COLORS.navy}`, rotate: "-6deg" }}>
          «ahorita»
        </div>
      ) : null}
    </>
  );
};

const Canica: React.FC<{ id: Id; x: number; y: number; r?: number; lentes?: boolean; bosteza?: boolean; etiqueta?: boolean; brillo?: number }> = ({
  id,
  x,
  y,
  r = 44,
  lentes = false,
  bosteza = false,
  etiqueta = true,
  brillo = 0,
}) => {
  const c = CAN[id];
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r }}>
      <svg width={2 * r} height={2 * r} viewBox="-50 -50 100 100" style={{ overflow: "visible", filter: `drop-shadow(0 8px 10px rgba(0,0,0,0.45)) drop-shadow(0 0 ${brillo * 30}px ${c.luz})` }}>
        <defs>
          <radialGradient id={`g-${id}`} cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor={c.luz} />
            <stop offset="0.55" stopColor={c.color} />
            <stop offset="1" stopColor={COLORS.navy} />
          </radialGradient>
        </defs>
        <circle r={48} fill={`url(#g-${id})`} stroke={COLORS.navy} strokeWidth={4} />
        <ellipse cx={-16} cy={-20} rx={14} ry={9} fill={COLORS.white} opacity={0.7} transform="rotate(-30 -16 -20)" />
        {lentes ? (
          <g>
            <rect x={-34} y={-12} width={30} height={18} rx={6} fill={COLORS.navy} />
            <rect x={4} y={-12} width={30} height={18} rx={6} fill={COLORS.navy} />
            <line x1={-4} y1={-6} x2={4} y2={-6} stroke={COLORS.navy} strokeWidth={4} />
            <path d="M-12 20 Q0 28 12 20" stroke={COLORS.navy} strokeWidth={4} fill="none" strokeLinecap="round" />
          </g>
        ) : null}
        {bosteza ? (
          <g>
            <path d="M-22 -6 Q-14 -2 -6 -6 M6 -6 Q14 -2 22 -6" stroke={COLORS.navy} strokeWidth={4} fill="none" strokeLinecap="round" />
            <ellipse cx={0} cy={18} rx={10} ry={8 + Math.abs(Math.sin(frame * 0.12)) * 8} fill={COLORS.navy} />
          </g>
        ) : null}
      </svg>
      {etiqueta ? (
        <div style={{ position: "absolute", left: r, top: 2 * r + 2, translate: "-50% 0", background: c.color, color: COLORS.white, fontFamily, fontWeight: 900, fontSize: 24, padding: "1px 10px", borderRadius: 8, border: `3px solid ${COLORS.navy}`, whiteSpace: "nowrap" }}>
          {c.nombre}
        </div>
      ) : null}
    </div>
  );
};

/** Cubeta «Quincena» con contador. */
const Cubeta: React.FC<{ valor: number; golpe?: number }> = ({ valor, golpe = 0 }) => {
  const rojo = valor <= 0;
  const color = rojo ? COLORS.red : valor < 2000 ? COLORS.gold : "#4ADE80";
  return (
    <div style={{ position: "absolute", left: CUBETA_X - 260, top: 1100, width: 520, height: 200, scale: String(1 + golpe * 0.06) }}>
      <svg width={520} height={200} viewBox="0 0 520 200" style={{ position: "absolute", inset: 0, overflow: "visible", filter: "drop-shadow(0 16px 22px rgba(0,0,0,0.45))" }}>
        <path d="M10 10 L510 10 L470 190 L50 190 Z" fill={COLORS.light} stroke={COLORS.navy} strokeWidth={6} strokeLinejoin="round" />
        <rect x={0} y={0} width={520} height={24} rx={10} fill="#E0E7FF" stroke={COLORS.navy} strokeWidth={6} />
      </svg>
      <div style={{ position: "absolute", top: 34, left: 0, right: 0, textAlign: "center", fontFamily }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.navy, letterSpacing: 2 }}>QUINCENA</div>
        <div style={{ fontSize: 96, fontWeight: 900, color, lineHeight: 1, WebkitTextStroke: `3px ${COLORS.navy}`, fontVariantNumeric: "tabular-nums" }}>{pesos(valor)}</div>
      </div>
    </div>
  );
};

/** Resta animada que sale de la cubeta. */
const Resta: React.FC<{ texto: string; en: number; color: string; x?: number }> = ({ texto, en, color, x = 860 }) => {
  const t = useSeg() - en;
  if (t < 0) return null;
  const k = easeOut(Math.min(1, t / 0.35));
  return (
    <div style={{ position: "absolute", left: x, top: 1080 - k * 90, translate: "-50% 0", opacity: t > 1.6 ? Math.max(0, 1 - (t - 1.6) * 3) : 1, scale: String(0.6 + k * 0.4), fontFamily, fontWeight: 900, fontSize: 60, color, WebkitTextStroke: `3px ${COLORS.navy}`, whiteSpace: "nowrap" }}>
      {texto}
    </div>
  );
};

const Tablero: React.FC<{ children?: React.ReactNode; letreros?: boolean; ahorita?: boolean; valor: number; golpe?: number }> = ({ children, letreros, ahorita, valor, golpe }) => (
  <>
    <Clavos letreros={letreros} ahorita={ahorita} />
    <Cubeta valor={valor} golpe={golpe} />
    {children}
  </>
);

const caeEn = (t: number, en: number, golpe = 0.3) => (t > en && t < en + golpe ? Math.sin(((t - en) / golpe) * Math.PI) : 0);

/* ---------- Escenas ---------- */

const Gancho: React.FC<{ congelar?: boolean }> = ({ congelar }) => {
  const ts = useSeg();
  const t = congelar ? 0 : ts;
  const avance = (id: Id, base: number) => (congelar ? 0 : base + t * 0.09);
  return (
    <>
      <Rotulo texto="La que llega primero, **se cobra primero**" delay={congelar ? -2 : -0.5} size={54} />
      <Tablero valor={6000}>
        {(["renta", "tarjeta", "antojos", "ahorro"] as Id[]).map((id, i) => {
          const p = posicion(id, avance(id, [0.12, 0.08, 0.15, 0.02][i]));
          return <Canica key={id} id={id} x={p.x} y={p.y} />;
        })}
      </Tablero>
      <div style={{ position: "absolute", left: 70, top: 1170, rotate: "-6deg", background: COLORS.red, color: COLORS.white, fontFamily, fontWeight: 900, fontSize: 46, padding: "4px 18px", borderRadius: 14, border: `4px solid ${COLORS.navy}` }}>
        ¿Cuál gana?
      </div>
    </>
  );
};

const Hook = () => (
  <Escena sinEntrada luz="#1D4ED8">
    <Gancho />
    <Extra s="trompetas" en={0} volumen={0.3} rate={1.2} />
    <Sfx s="tick" volumen={0.4} en={0.5} />
    <Sfx s="tick" volumen={0.4} en={1.0} />
    <Sfx s="tick" volumen={0.4} en={1.6} />
  </Escena>
);

const Renta = () => {
  const t = useSeg();
  const R = 0.9;
  const T = 2.9;
  const pR = interpolate(t, [0, R], [0.55, 1], clamp);
  const pT = interpolate(t, [0, T], [0.3, 1], clamp);
  const pA = 0.3 + t * 0.05;
  const valor = t < R ? 6000 : t < T ? 3500 : 1700;
  const golpe = caeEn(t, R) + caeEn(t, T);
  const pr = posicion("renta", pR);
  const pt = posicion("tarjeta", pT);
  const pa = posicion("antojos", pA);
  const pg = posicion("ahorro", 0.08);
  return (
    <Escena luz="#1D4ED8" sonidoEntrada={null}>
      <Rotulo texto="¡Viene por fuera **la renta**!" size={58} />
      <Tablero valor={valor} golpe={golpe}>
        {t < R ? <Canica id="renta" x={pr.x} y={pr.y} /> : null}
        {t < T ? <Canica id="tarjeta" x={pt.x} y={pt.y} /> : null}
        <Canica id="antojos" x={pa.x} y={pa.y} />
        <Canica id="ahorro" x={pg.x} y={pg.y} />
        <Resta texto="Renta −$2,500" en={R} color="#93C5FD" x={300} />
        <Resta texto="Tarjeta −$1,800" en={T} color="#FCA5A5" x={780} />
      </Tablero>
      <Sfx s="pop" volumen={0.5} en={R} />
      <Sfx s="pop" volumen={0.5} en={T} />
      <Chispas en={R} x={540} y={1110} color="#93C5FD" n={10} />
      <Chispas en={T} x={540} y={1110} color="#FCA5A5" n={10} />
    </Escena>
  );
};

const Antojos = () => {
  const t = useSeg();
  const LLEGA = 3.0;
  const p = interpolate(t, [0, LLEGA], [0.35, 1], clamp);
  const pa = posicion("antojos", p, 2.2);
  const pg = posicion("ahorro", 0.1);
  const valor = t < LLEGA ? 1700 : 0;
  const rebotes = [0.5, 1.0, 1.5, 2.0, 2.5];
  return (
    <Escena luz="#A16207" sonidoEntrada="swoosh" sacudidas={[LLEGA]}>
      <Rotulo texto="Los antojos **rebotan en todo**" size={58} />
      <Tablero valor={valor} golpe={caeEn(t, LLEGA)} letreros>
        {t < LLEGA ? <Canica id="antojos" x={pa.x} y={pa.y} lentes /> : null}
        <Canica id="ahorro" x={pg.x} y={pg.y} />
        <Resta texto="Antojos −$1,700" en={LLEGA} color="#FEF08A" x={540} />
      </Tablero>
      {rebotes.map((r) => (
        <Sfx key={r} s="tick" volumen={0.45} en={r} />
      ))}
      <Sfx s="impacto" volumen={0.45} en={LLEGA} />
    </Escena>
  );
};

const Ahorro = () => {
  const t = useSeg();
  const tiembla = Math.sin(t * 9) * 3;
  return (
    <Escena luz="#14532D" sonidoEntrada="whoosh">
      <Rotulo texto="¿Y el ahorro? Atorado en **«ahorita»**" size={56} />
      <Tablero valor={0} ahorita>
        <Canica id="ahorro" x={830 + tiembla} y={630} r={58} bosteza />
        {t > 1.4 ? <Bocadillo texto="Ahorita voy… 🥱" x={500} y={760} ancho={360} size={40} delay={1.4} colaX={150} /> : null}
        {[0, 1, 2].map((i) => {
          const k = ((t * 0.8 + i * 0.33) % 1);
          return (
            <div key={i} style={{ position: "absolute", left: 890 + k * 60, top: 540 - k * 120, fontFamily, fontWeight: 900, fontSize: 40 + i * 6, color: COLORS.light, opacity: 1 - k }}>
              z
            </div>
          );
        })}
      </Tablero>
      <div style={{ position: "absolute", left: 90, top: 1300 }}>
        <Pildora size={34} color={COLORS.red} bg="rgba(220,38,38,0.2)">Ahorro: $0</Pildora>
      </div>
      <Sfx s="pop" volumen={0.4} en={1.4} />
    </Escena>
  );
};

const Otra = () => {
  const t = useSeg();
  const REB = 0.9;
  const sube = interpolate(t, [0, REB], [0, 1], { ...clamp, easing: easeOut });
  const pg = posicion("ahorro", interpolate(t, [REB + 0.3, 2.9], [0, 0.75], clamp), 0.7);
  const ids: Id[] = ["renta", "tarjeta", "antojos"];
  return (
    <Escena luz="#15803D" sonidoEntrada={null}>
      <Rotulo texto={t < REB ? "Otra vez… ⏪" : "Suelta **al ahorro** primero"} size={60} />
      <Tablero valor={6000}>
        {t < REB
          ? (["renta", "tarjeta", "antojos", "ahorro"] as Id[]).map((id) => {
              const p = posicion(id, 1 - sube);
              return <Canica key={id} id={id} x={p.x} y={p.y} />;
            })
          : null}
        {t >= REB
          ? ids.map((id) => {
              const p = posicion(id, 0);
              return <Canica key={id} id={id} x={p.x} y={p.y - 20} />;
            })
          : null}
        {t >= REB ? <Canica id="ahorro" x={pg.x} y={pg.y} brillo={1} /> : null}
      </Tablero>
      <Extra s="rebobina" en={0} volumen={0.45} />
      <Sfx s="swoosh" volumen={0.4} en={REB + 0.3} />
    </Escena>
  );
};

const Fila: React.FC<{ id: Id; v: string; on: number; signo?: string }> = ({ id, v, on, signo = "" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: on, translate: `${(1 - on) * 60}px 0px`, fontFamily, fontWeight: 900, fontSize: 40, color: COLORS.white }}>
    <div style={{ width: 30, height: 30, borderRadius: 15, background: CAN[id].color, border: `3px solid ${COLORS.navy}` }} />
    <span style={{ flex: 1 }}>{CAN[id].nombre}</span>
    <span style={{ color: id === "ahorro" ? "#4ADE80" : COLORS.light }}>
      {signo}
      {v}
    </span>
  </div>
);

const Gana = () => {
  const t = useSeg();
  const G = 0.35;
  const pg = posicion("ahorro", interpolate(t, [0, G], [0.75, 1], clamp));
  const llegadas = [G, 1.1, 1.6, 2.2];
  const valores = [6000, 5400, 2900, 1100, 1100];
  const n = llegadas.filter((l) => t > l).length;
  const ids: Id[] = ["renta", "tarjeta", "antojos"];
  const lentes = t < 2.4;
  return (
    <Escena luz="#15803D" sonidoEntrada={null}>
      <div style={{ position: "absolute", left: 270, top: 230, width: 540, display: "flex", flexDirection: "column", gap: 4, background: "rgba(15,23,42,0.85)", padding: "10px 18px", borderRadius: 18, border: `4px solid #4ADE80` }}>
        <div style={{ fontFamily, fontWeight: 900, fontSize: 50, color: "#4ADE80", textAlign: "center" }}>¡Gana el ahorro!</div>
        <Fila id="ahorro" v="$600" signo="+" on={interpolate(t, [G, G + 0.2], [0, 1], clamp)} />
        <Fila id="renta" v="$2,500" on={interpolate(t, [1.1, 1.3], [0, 1], clamp)} />
        <Fila id="tarjeta" v="$1,800" on={interpolate(t, [1.6, 1.8], [0, 1], clamp)} />
        <Fila id="antojos" v="$1,100" on={interpolate(t, [2.2, 2.4], [0, 1], clamp)} />
      </div>
      <Tablero valor={valores[n]} golpe={llegadas.reduce((s, l) => s + caeEn(t, l), 0)}>
        {t < G ? <Canica id="ahorro" x={pg.x} y={pg.y} brillo={1} /> : null}
        {ids.map((id, i) => {
          const fin = llegadas[i + 1];
          if (t >= fin) return null;
          const p = posicion(id, interpolate(t, [0, fin], [0, 1], clamp));
          return <Canica key={id} id={id} x={p.x} y={p.y} lentes={id === "antojos" && lentes} />;
        })}
      </Tablero>
      {t > 2.3 ? <Bocadillo texto="Antojos: «ni modo» 😎→🙂" x={330} y={900} ancho={330} size={38} delay={2.3} colaX={60} /> : null}
      <Extra s="trompetas" en={G} volumen={0.4} />
      <Sfx s="ding" volumen={0.5} en={G} />
      <Chispas en={G} x={540} y={1100} color="#4ADE80" n={16} />
      <Sfx s="pop" volumen={0.35} en={1.1} />
      <Sfx s="pop" volumen={0.35} en={1.6} />
      <Sfx s="pop" volumen={0.35} en={2.2} />
    </Escena>
  );
};

const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const CORTE = Math.round(1.0 * fps);
  const vuelta = interpolate(frame, [dur - 10, dur - 2], [0, 1], clamp);
  return (
    <>
      <Sequence durationInFrames={CORTE} layout="none">
        <Escena luz="#15803D" sonidoEntrada="swoosh">
          <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 130, color: "#4ADE80", WebkitTextStroke: `4px ${COLORS.navy}`, lineHeight: 1 }}>
            PÁGATE
            <br />
            PRIMERO
          </div>
          <Canica id="ahorro" x={540} y={1120} r={70} brillo={1} etiqueta={false} />
        </Escena>
      </Sequence>
      <Sequence from={CORTE} layout="none">
        <CtaCrecer tipo="comentar" boton="¿Cuál gana en tu casa? 👇" linea="La **amarilla**, ¿verdad?" />
        <div style={{ position: "absolute", top: 1272, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 28, fontWeight: 700, color: COLORS.navy }}>
          Ejemplo · Contenido informativo, no es asesoramiento financiero.
        </div>
      </Sequence>
      {vuelta > 0 ? (
        <AbsoluteFill style={{ opacity: vuelta, fontFamily }}>
          <Fondo luz="#1D4ED8" />
          <Gancho congelar />
        </AbsoluteFill>
      ) : null}
    </>
  );
};

const ESCENAS: DefEscena[] = [
  { id: "hook", render: () => <Hook /> },
  { id: "renta", render: () => <Renta /> },
  { id: "antojos", render: () => <Antojos /> },
  { id: "ahorro", render: () => <Ahorro /> },
  { id: "otra", render: () => <Otra /> },
  { id: "gana", render: () => <Gana /> },
  { id: "cta", subtitulosClaros: true, render: ({ dur }) => <Cta dur={dur} /> },
];

export const W4921: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4921} pista="lay-back.mp3" /> : null;
