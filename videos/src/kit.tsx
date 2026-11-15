/* =====================================================================
   KIT DE ANIMACIÓN v2 · ALIGN
   Todo vídeo nuevo se monta con estas piezas. Ver videos/KIT.md.
   - Voz en off por escena (public/voz/<ID>/voz.json) que marca la duración.
   - Subtítulos palabra a palabra sincronizados con la voz.
   - Fondo vivo (degradado, luces que se mueven, rejilla y grano).
   - Cámara con empuje lento y sacudida en el momento wow.
   - Entradas y salidas de escena con zoom y desenfoque + whoosh.
   - Música lejana con atenuación automática bajo la voz.
   ===================================================================== */
import { Audio } from "@remotion/media";
import { noise2D } from "@remotion/noise";
import React from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Easing,
  interpolate,
  Sequence,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, SAFE, fontFamily } from "./brand";

/* ---------- Voz ---------- */
export type Palabra = { t: string; inicio: number; fin: number };
export type EscenaVoz = { id: string; texto: string; archivo: string; segundos: number; palabras: Palabra[] };
export type Voz = { proveedor: string; voz: string; escenas: EscenaVoz[] };
export type PropsVoz = { voz: Voz | null; videoId: string };

export const PAD = 0.35; // aire tras cada frase (s)
export const ENTRADA_VOZ = 3; // frames que espera la voz al empezar una escena (el hook empieza en 0)
export const FPS = 30;

/** Frames de cada escena a partir de su voz. `extra` da segundos de más a escenas concretas. */
export const framesEscena = (e: EscenaVoz, i: number, extra: Record<string, number> = {}) =>
  Math.ceil((e.segundos + PAD + (extra[e.id] ?? 0)) * FPS) + (i === 0 ? 0 : ENTRADA_VOZ);

/** calculateMetadata: carga voz.json y fija la duración total. */
export const metadataConVoz =
  (extra: Record<string, number> = {}): CalculateMetadataFunction<PropsVoz> =>
  async ({ props }) => {
    const res = await fetch(staticFile(`voz/${props.videoId}/voz.json`));
    const voz = (await res.json()) as Voz;
    const total = voz.escenas.reduce((s, e, i) => s + framesEscena(e, i, extra), 0);
    return { durationInFrames: total, props: { ...props, voz } };
  };

/* ---------- Utilidades de animación ---------- */
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = Easing.bezier(0.16, 1, 0.3, 1);

export const useSpring = (delaySec = 0, damping = 14, mass = 0.7) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - Math.round(delaySec * fps), fps, config: { damping, mass, stiffness: 160 } });
};

export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/* ---------- Fondo vivo ---------- */
export const Fondo: React.FC<{ tono?: "noche" | "azul" | "claro"; luz?: string }> = ({ tono = "noche", luz }) => {
  const frame = useCurrentFrame();
  const base =
    tono === "claro"
      ? "radial-gradient(130% 90% at 50% 10%, #FFFFFF 0%, #EEF3FF 55%, #DCE6FF 100%)"
      : tono === "azul"
        ? "radial-gradient(130% 90% at 50% 0%, #2547C9 0%, #12245E 50%, #070D22 100%)"
        : "radial-gradient(130% 90% at 50% 0%, #1A2C66 0%, #0B1224 55%, #050914 100%)";
  const orbes = [
    { c: luz ?? COLORS.blue, s: 1100, x: 0.2, y: 0.25, k: 1 },
    { c: COLORS.accent, s: 900, x: 0.85, y: 0.65, k: 2 },
    { c: tono === "claro" ? "#C7D7FE" : "#3B1D8F", s: 1000, x: 0.4, y: 0.95, k: 3 },
  ];
  const t = frame / 140;
  const claro = tono === "claro";
  return (
    <AbsoluteFill style={{ background: base, overflow: "hidden" }}>
      {orbes.map((o) => (
        <div
          key={o.k}
          style={{
            position: "absolute",
            width: o.s,
            height: o.s,
            left: 1080 * o.x - o.s / 2 + noise2D(`x${o.k}`, t, 0) * 160,
            top: 1920 * o.y - o.s / 2 + noise2D(`y${o.k}`, t, 0) * 200,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${o.c} 0%, transparent 62%)`,
            opacity: claro ? 0.35 : 0.45,
            filter: "blur(30px)",
          }}
        />
      ))}
      {/* Rejilla en perspectiva que avanza despacio */}
      <svg
        width={1080}
        height={900}
        viewBox="0 0 1080 900"
        style={{ position: "absolute", bottom: 0, opacity: claro ? 0.12 : 0.16 }}
      >
        <defs>
          <linearGradient id="fadeGrid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={claro ? COLORS.blue : COLORS.light} stopOpacity="0" />
            <stop offset="1" stopColor={claro ? COLORS.blue : COLORS.light} stopOpacity="1" />
          </linearGradient>
        </defs>
        {Array.from({ length: 13 }, (_, i) => {
          const x = (i - 6) * 180;
          return <line key={`v${i}`} x1={540 + x * 0.25} y1={0} x2={540 + x * 2.2} y2={900} stroke="url(#fadeGrid)" strokeWidth={2} />;
        })}
        {Array.from({ length: 9 }, (_, i) => {
          const p = ((i + (frame / 90) % 1) / 9) ** 2;
          return <line key={`h${i}`} x1={0} y1={p * 900} x2={1080} y2={p * 900} stroke="url(#fadeGrid)" strokeWidth={2} />;
        })}
      </svg>
      {/* Grano de película */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: claro ? 0.05 : 0.08, mixBlendMode: "overlay" }}>
        <filter id="grano">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 6} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grano)" />
      </svg>
      {/* Viñeta */}
      <AbsoluteFill
        style={{
          background: claro
            ? "radial-gradient(120% 80% at 50% 45%, transparent 60%, rgba(29,78,216,0.12) 100%)"
            : "radial-gradient(120% 80% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- Cámara: empuje lento + deriva + sacudidas ---------- */
export const Camara: React.FC<{ children: React.ReactNode; sacudidas?: number[]; empuje?: number }> = ({
  children,
  sacudidas = [],
  empuje = 0.05,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = 1 + interpolate(frame, [0, durationInFrames], [0, empuje], clamp);
  let dx = noise2D("camx", frame / 90, 0) * 6;
  let dy = noise2D("camy", frame / 90, 0) * 8;
  let rot = noise2D("camr", frame / 120, 0) * 0.25;
  for (const seg of sacudidas) {
    const f0 = Math.round(seg * fps);
    const k = frame - f0;
    if (k >= 0 && k < 14) {
      const a = (1 - k / 14) ** 2 * 22;
      dx += noise2D("shx", k / 2, f0) * a;
      dy += noise2D("shy", k / 2, f0) * a;
      rot += noise2D("shr", k / 2, f0) * a * 0.05;
    }
  }
  return (
    <AbsoluteFill style={{ scale: String(s), translate: `${dx}px ${dy}px`, rotate: `${rot}deg` }}>{children}</AbsoluteFill>
  );
};

/* ---------- Escena: entra con zoom+desenfoque, sale rápido; whoosh al entrar ---------- */
export const Escena: React.FC<{
  children: React.ReactNode;
  fondo?: React.ComponentProps<typeof Fondo>["tono"];
  luz?: string;
  sacudidas?: number[];
  sinEntrada?: boolean;
  sonidoEntrada?: "whoosh" | "impacto" | "swoosh" | null;
}> = ({ children, fondo = "noche", luz, sacudidas, sinEntrada = false, sonidoEntrada = "whoosh" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pin = sinEntrada ? 1 : interpolate(frame, [0, 9], [0, 1], { ...clamp, easing: ease });
  const pout = interpolate(frame, [durationInFrames - 5, durationInFrames], [0, 1], clamp);
  const scale = 1.12 - 0.12 * pin + 0.06 * pout;
  const blur = (1 - pin) * 18 + pout * 10;
  return (
    <AbsoluteFill style={{ fontFamily, overflow: "hidden" }}>
      <Fondo tono={fondo} luz={luz} />
      <Camara sacudidas={sacudidas}>
        <AbsoluteFill style={{ scale: String(scale), filter: blur > 0.3 ? `blur(${blur}px)` : undefined, opacity: Math.min(1, pin * 1.4) }}>
          {children}
        </AbsoluteFill>
      </Camara>
      {/* destello blanco en el corte */}
      {!sinEntrada ? (
        <AbsoluteFill style={{ backgroundColor: COLORS.white, opacity: interpolate(frame, [0, 4], [0.22, 0], clamp), pointerEvents: "none" }} />
      ) : null}
      {sonidoEntrada && !sinEntrada ? <Sfx s={sonidoEntrada} volumen={sonidoEntrada === "impacto" ? 0.5 : 0.28} /> : null}
    </AbsoluteFill>
  );
};

/* ---------- Zona de contenido (respeta la zona segura) ---------- */
export const Zona: React.FC<{
  children: React.ReactNode;
  top?: number;
  bottom?: number;
  gap?: number;
  justify?: React.CSSProperties["justifyContent"];
}> = ({ children, top = SAFE.top + 30, bottom = 660, gap = 40, justify = "center" }) => (
  <div
    style={{
      position: "absolute",
      top,
      bottom,
      left: SAFE.left,
      right: SAFE.right,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: justify,
      gap,
    }}
  >
    {children}
  </div>
);

/* ---------- Texto cinético: palabra a palabra. **así** resalta ---------- */
export const Palabras: React.FC<{
  texto: string;
  size?: number;
  color?: string;
  resalta?: string;
  delay?: number;
  stagger?: number;
  weight?: number;
  align?: "center" | "left";
  maxWidth?: number;
  marcador?: boolean;
}> = ({
  texto,
  size = 92,
  color = COLORS.white,
  resalta = COLORS.gold,
  delay = 0,
  stagger = 0.06,
  weight = 900,
  align = "center",
  maxWidth = 870,
  marcador = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const partes: { w: string; hl: boolean }[] = [];
  texto.split(/(\*\*[^*]+\*\*)/).forEach((trozo) => {
    const hl = trozo.startsWith("**");
    trozo
      .replace(/\*\*/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => partes.push({ w, hl }));
  });
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: size * 0.26,
        rowGap: size * 0.02,
        maxWidth,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.08,
        letterSpacing: -size * 0.025,
      }}
    >
      {partes.map((p, i) => {
        const s = spring({ frame: frame - Math.round((delay + i * stagger) * fps), fps, config: { damping: 13, mass: 0.6, stiffness: 170 } });
        const m = interpolate(frame - (delay + i * stagger + 0.25) * fps, [0, 8], [0, 1], { ...clamp, easing: ease });
        return (
          <span
            key={i}
            style={{
              position: "relative",
              display: "inline-block",
              color: p.hl ? (marcador ? COLORS.navy : resalta) : color,
              opacity: Math.min(1, s * 1.5),
              translate: `0px ${(1 - s) * size * 0.6}px`,
              scale: String(0.85 + 0.15 * s),
              filter: s < 0.98 ? `blur(${(1 - s) * 10}px)` : undefined,
              textShadow: p.hl && !marcador ? `0 0 40px ${resalta}66` : "0 8px 30px rgba(0,0,0,0.25)",
              zIndex: 1,
            }}
          >
            {p.hl && marcador ? (
              <span
                style={{
                  position: "absolute",
                  left: -size * 0.12,
                  right: -size * 0.12,
                  top: size * 0.08,
                  bottom: size * 0.02,
                  backgroundColor: resalta,
                  borderRadius: size * 0.16,
                  transformOrigin: "left center",
                  scale: `${m} 1`,
                  rotate: "-1.5deg",
                  zIndex: -1,
                }}
              />
            ) : null}
            {p.w}
          </span>
        );
      })}
    </div>
  );
};

/* ---------- Subtítulos sincronizados con la voz ---------- */
export const Subtitulos: React.FC<{
  palabras: Palabra[];
  desde?: number; // frames de retraso de la voz en la escena
  porPagina?: number;
  claro?: boolean;
  y?: number; // borde inferior del bloque (px desde abajo)
}> = ({ palabras, desde = 0, porPagina = 3, claro = false, y = 480 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame - desde) / fps;
  if (!palabras.length) return null;
  // páginas: cortar por número de palabras o por pausa (puntuación)
  const paginas: Palabra[][] = [];
  let actual: Palabra[] = [];
  palabras.forEach((p) => {
    actual.push(p);
    if (actual.length >= porPagina || /[.,;:!?…]$/.test(p.t)) {
      paginas.push(actual);
      actual = [];
    }
  });
  if (actual.length) paginas.push(actual);
  const idx = paginas.findIndex((pg, i) => t < (paginas[i + 1]?.[0].inicio ?? Infinity) && t >= pg[0].inicio - 0.05);
  if (idx < 0) return null;
  const pg = paginas[idx];
  const pIn = spring({ frame: frame - desde - Math.round(pg[0].inicio * fps), fps, config: { damping: 15, stiffness: 220 } });
  return (
    <div
      style={{
        position: "absolute",
        bottom: y,
        left: SAFE.left,
        right: SAFE.right,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: 24,
        fontFamily,
        fontSize: 66,
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: -1,
        scale: String(0.9 + 0.1 * pIn),
        opacity: pIn,
      }}
    >
      {pg.map((p, i) => {
        const activa = t >= p.inicio - 0.03 && t < (pg[i + 1]?.inicio ?? p.fin + 0.4);
        const dicha = t >= p.inicio - 0.03;
        return (
          <span
            key={i}
            style={{
              color: activa ? COLORS.gold : claro ? COLORS.navy : COLORS.white,
              opacity: dicha ? 1 : 0.55,
              scale: activa ? "1.08" : "1",
              textShadow: claro ? "none" : "0 3px 0 rgba(5,9,20,0.55), 0 6px 24px rgba(0,0,0,0.6)",
              display: "inline-block",
            }}
          >
            {p.t.replace(/[.,;:…]+$/, "")}
          </span>
        );
      })}
    </div>
  );
};

/* ---------- Tarjeta de cristal ---------- */
export const Cristal: React.FC<{
  children: React.ReactNode;
  color?: string;
  w?: number;
  h?: number;
  delay?: number;
  desde?: "izq" | "der" | "abajo" | "zoom";
  style?: React.CSSProperties;
}> = ({ children, color = COLORS.accent, w = 400, h, delay = 0, desde = "abajo", style }) => {
  const s = useSpring(delay, 12, 0.8);
  const off = (1 - s) * 500;
  const tr =
    desde === "izq" ? `${-off}px 0px` : desde === "der" ? `${off}px 0px` : desde === "abajo" ? `0px ${off * 0.5}px` : "0px 0px";
  return (
    <div
      style={{
        width: w,
        height: h,
        padding: 34,
        boxSizing: "border-box",
        borderRadius: 40,
        background: `linear-gradient(160deg, ${color}33 0%, rgba(255,255,255,0.06) 60%)`,
        border: `2px solid ${color}88`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25), 0 0 60px ${color}22`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        translate: tr,
        scale: desde === "zoom" ? String(0.4 + 0.6 * s) : undefined,
        opacity: Math.min(1, s * 1.3),
        rotate: `${(1 - s) * (desde === "izq" ? -8 : 8)}deg`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ---------- Cifra grande con brillo y contador ---------- */
export const Cifra: React.FC<{
  a: number;
  de?: number;
  inicio?: number;
  fin?: number;
  formato: (v: number) => string;
  size?: number;
  color?: string;
  brillo?: boolean;
  ticks?: boolean;
}> = ({ a, de = 0, inicio = 0, fin = 1.5, formato, size = 160, color = COLORS.white, brillo = true, ticks = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [inicio * fps, fin * fps], [0, 1], { ...clamp, easing: Easing.bezier(0.33, 0, 0.15, 1) });
  const v = de + (a - de) * p;
  const llegada = spring({ frame: frame - Math.round(fin * fps), fps, config: { damping: 9, stiffness: 200 } });
  const nTicks = ticks ? Math.floor((fin - inicio) * 8) : 0;
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          fontSize: size,
          fontWeight: 900,
          whiteSpace: "nowrap",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: -size * 0.04,
          lineHeight: 1,
          color,
          scale: String(1 + 0.08 * Math.sin(Math.min(1, llegada) * Math.PI)),
          textShadow: brillo ? `0 0 ${30 + 30 * llegada}px ${color}99, 0 10px 40px rgba(0,0,0,0.4)` : undefined,
        }}
      >
        {formato(v)}
      </div>
      {Array.from({ length: nTicks }, (_, i) => (
        <Sequence key={i} from={Math.round((inicio + ((fin - inicio) * i) / nTicks) * fps)} durationInFrames={3} layout="none">
          <Sfx s="tick" volumen={0.12} />
        </Sequence>
      ))}
    </div>
  );
};

/* ---------- Píldora (aviso hipotético, etiquetas) ---------- */
export const Pildora: React.FC<{ children: React.ReactNode; bg?: string; color?: string; size?: number; delay?: number }> = ({
  children,
  bg = "rgba(251,191,36,0.16)",
  color = COLORS.gold,
  size = 34,
  delay = 0,
}) => {
  const s = useSpring(delay, 16);
  return (
    <div
      style={{
        fontSize: size,
        fontWeight: 800,
        color,
        backgroundColor: bg,
        border: `2px solid ${color}66`,
        padding: "10px 28px",
        borderRadius: 999,
        whiteSpace: "nowrap",
        opacity: s,
        scale: String(0.7 + 0.3 * s),
      }}
    >
      {children}
    </div>
  );
};

/* ---------- Chispas: explosión de partículas en el momento wow ---------- */
export const Chispas: React.FC<{ en: number; x?: number; y?: number; color?: string; n?: number }> = ({
  en,
  x = 540,
  y = 800,
  color = COLORS.gold,
  n = 36,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = frame - Math.round(en * fps);
  if (k < 0 || k > 40) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const ang = (i / n) * Math.PI * 2 + noise2D("ang", i, 0);
        const vel = 14 + 10 * (noise2D("vel", i, 1) + 1);
        const d = vel * k * (1 - k / 90);
        const g = 0.35 * k * k * 0.3;
        const size = 10 + 8 * (noise2D("sz", i, 2) + 1);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(ang) * d - size / 2,
              top: y + Math.sin(ang) * d + g - size / 2,
              width: size,
              height: size,
              borderRadius: i % 3 ? "50%" : 3,
              rotate: `${k * 12 + i * 30}deg`,
              backgroundColor: i % 4 === 0 ? COLORS.white : color,
              opacity: 1 - k / 40,
              boxShadow: `0 0 16px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- Sonido ---------- */
export type NombreSfx = "whoosh" | "swoosh" | "pop" | "tick" | "ding" | "riser" | "impacto" | "click";
export const Sfx: React.FC<{ s: NombreSfx; volumen?: number; en?: number }> = ({ s, volumen = 0.3, en = 0 }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.round(en * fps)} layout="none" durationInFrames={Math.round(2 * fps)}>
      <Audio src={staticFile(`sfx/${s}.wav`)} volume={volumen} />
    </Sequence>
  );
};

/**
 * Música lejana: suena baja todo el vídeo y baja aún más mientras habla la voz.
 * Las pistas están en public/musica/ (ver public/musica/LICENCIAS.md).
 */
export const Musica: React.FC<{ pista: string; voz: Voz; extra?: Record<string, number>; base?: number }> = ({
  pista,
  voz,
  extra = {},
  base = 0.16,
}) => {
  const { durationInFrames, fps } = useVideoConfig();
  // intervalos en los que habla la voz (frames absolutos)
  const hablando: [number, number][] = [];
  let off = 0;
  voz.escenas.forEach((e, i) => {
    const d0 = off + (i === 0 ? 0 : ENTRADA_VOZ);
    hablando.push([d0, d0 + e.segundos * fps]);
    off += framesEscena(e, i, extra);
  });
  const volumen = (f: number) => {
    const enVoz = hablando.some(([a, b]) => f >= a - 4 && f <= b + 4);
    const fade = interpolate(f, [0, 15, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], clamp);
    return (enVoz ? base * 0.55 : base) * fade;
  };
  return <Audio src={staticFile(`musica/${pista}`)} volume={volumen} loop />;
};

/* ---------- Montaje: una escena por cada frase de la voz ---------- */
export type DefEscena = {
  id: string;
  render: (ctx: { voz: EscenaVoz; dur: number }) => React.ReactNode;
  subtitulos?: boolean;
  subtitulosClaros?: boolean;
};

export const Montaje: React.FC<{
  videoId: string;
  voz: Voz;
  escenas: DefEscena[];
  pista?: string;
  extra?: Record<string, number>;
}> = ({ videoId, voz, escenas, pista = "pad-align.wav", extra = {} }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.deep }}>
      <Series>
        {voz.escenas.map((ev, i) => {
          const def = escenas.find((d) => d.id === ev.id);
          const dur = framesEscena(ev, i, extra);
          const desde = i === 0 ? 0 : ENTRADA_VOZ;
          return (
            <Series.Sequence key={ev.id} durationInFrames={dur} name={ev.id}>
              {def ? def.render({ voz: ev, dur }) : null}
              {def?.subtitulos !== false ? (
                <Subtitulos palabras={ev.palabras} desde={desde} claro={def?.subtitulosClaros} />
              ) : null}
              <Sequence from={desde} layout="none" name={`voz ${ev.id}`}>
                <Audio src={staticFile(`voz/${videoId}/${ev.archivo}`)} volume={1} />
              </Sequence>
            </Series.Sequence>
          );
        })}
      </Series>
      <Musica pista={pista} voz={voz} extra={extra} />
    </AbsoluteFill>
  );
};
