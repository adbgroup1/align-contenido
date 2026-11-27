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
  Img,
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

/* ---------- Foto: imagen generada a pantalla completa (public/img/<ID>/<nombre>.png) ----------
   Zoom lento (Ken Burns) + oscurecido arriba para el texto y abajo para los subtítulos.
   Va como primer hijo de <Escena>, debajo de <Zona>. */
export const Foto: React.FC<{
  src: string; // ruta dentro de public/, p. ej. "img/EJ-colchon/01-hucha.png"
  zoom?: [number, number]; // escala al empezar y al acabar la escena
  subir?: number; // px que sube la imagen durante la escena (negativo = baja)
  sombra?: number; // 0–1, fuerza del oscurecido de arriba
}> = ({ src, zoom = [1.12, 1], subir = 0, sombra = 0.9 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const a = (x: number) => Math.round(Math.min(1, x) * 255).toString(16).padStart(2, "0");
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: COLORS.navy }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: String(zoom[0] + (zoom[1] - zoom[0]) * p),
          translate: `0px ${-subir * p}px`,
        }}
      />
      <AbsoluteFill
        style={{
          // arriba: texto · centro: el objeto · abajo (desde ~70 %): franja oscura para los subtítulos
          background: `linear-gradient(180deg, ${COLORS.navy}${a(sombra)} 0%, ${COLORS.navy}${a(sombra * 0.7)} 26%, ${COLORS.navy}00 44%, ${COLORS.navy}00 60%, ${COLORS.navy}99 72%, ${COLORS.navy}E6 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- Lluvia: gotas animadas por encima de una Foto (escenas de «imprevistos») ---------- */
export const Lluvia: React.FC<{ gotas?: number; color?: string }> = ({ gotas = 70, color = COLORS.light }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: gotas }, (_, i) => {
        const speed = 28 + ((i * 53) % 18);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: (i * 137.5) % 1080,
              top: ((frame * speed + i * 211) % 2200) - 200,
              width: 3,
              height: 40 + ((i * 29) % 50),
              borderRadius: 2,
              background: `linear-gradient(180deg, ${color}00, ${color})`,
              opacity: 0.25 + ((i * 17) % 40) / 100,
              rotate: "8deg",
            }}
          />
        );
      })}
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
 * Volumen medido de cada pista (LUFS integrados, ffmpeg ebur128). Sirve para igualarlas: todas suenan al
 * mismo nivel lejano. Al añadir una pista nueva, mide su LUFS y apúntalo aquí y en LICENCIAS.md.
 */
export const LUFS_PISTAS: Record<string, number> = {
  "lay-back.mp3": -11.4,
  "lofi-polaroids.mp3": -9.9,
  "long-day.mp3": -14.5,
  "minimal-ambient-tech.mp3": -11.4,
  "piano-strings-light.mp3": -19.5,
  "quiet-courtyard.mp3": -11.0,
  "sunlight.mp3": -10.0,
  "tech-synthpop.mp3": -5.6,
  "pad-align.wav": -11.5,
};
/** Nivel de la música sin voz (LUFS). La voz va a unos -17: la música queda unos 14 dB por debajo. */
export const MUSICA_OBJETIVO_LUFS = -31;

/**
 * Música lejana: suena baja todo el vídeo y baja aún más mientras habla la voz.
 * Las pistas están en public/musica/ (ver public/musica/LICENCIAS.md).
 */
export const Musica: React.FC<{ pista: string; voz: Voz; extra?: Record<string, number>; nivel?: number }> = ({
  pista,
  voz,
  extra = {},
  nivel = 1,
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
  const lufs = LUFS_PISTAS[pista] ?? -11;
  const base = Math.min(1, 10 ** ((MUSICA_OBJETIVO_LUFS - lufs) / 20)) * nivel;
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
  estiloSub?: EstiloSub; // cambia el estilo de subtítulo solo en esta escena
};

/** Frame (absoluto, desde el inicio del vídeo) en que empieza cada escena de la voz, y en que empieza a hablar. */
export type Inicios = Record<string, { escena: number; voz: number; dur: number }>;
export const calcularInicios = (voz: Voz, extra: Record<string, number> = {}): Inicios => {
  const out: Inicios = {};
  let off = 0;
  voz.escenas.forEach((e, i) => {
    const dur = framesEscena(e, i, extra);
    out[e.id] = { escena: off, voz: off + (i === 0 ? 0 : ENTRADA_VOZ), dur };
    off += dur;
  });
  return out;
};

/** Estilo de subtítulos: «karaoke» (el de siempre, mayúsculas con palabra activa), «caja» (frase en caja blanca,
 *  estilo TikTok), «limpio» (minúsculas, sombra, sin caja) o «ninguno» (el texto ya está en pantalla). */
export type EstiloSub = "karaoke" | "caja" | "limpio" | "ninguno";

export const Montaje: React.FC<{
  videoId: string;
  voz: Voz;
  escenas: DefEscena[];
  pista?: string | null; // null = sin música (a veces el silencio o solo efectos funciona mejor)
  extra?: Record<string, number>;
  subtitulos?: EstiloSub;
  subY?: number;
  /** Capa continua por DEBAJO de las escenas (formatos de pantalla entera: chat, app, noticiero…). */
  fondoFijo?: (ctx: { inicios: Inicios }) => React.ReactNode;
  /** Capa continua por ENCIMA de las escenas (rótulos fijos, marcadores, comentario fijado…). */
  capa?: (ctx: { inicios: Inicios }) => React.ReactNode;
  nivelMusica?: number;
}> = ({ videoId, voz, escenas, pista = "pad-align.wav", extra = {}, subtitulos = "karaoke", subY, fondoFijo, capa, nivelMusica }) => {
  const inicios = calcularInicios(voz, extra);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.deep }}>
      {fondoFijo ? fondoFijo({ inicios }) : null}
      <Series>
        {voz.escenas.map((ev, i) => {
          const def = escenas.find((d) => d.id === ev.id);
          const dur = framesEscena(ev, i, extra);
          const desde = i === 0 ? 0 : ENTRADA_VOZ;
          const estilo: EstiloSub = def?.subtitulos === false ? "ninguno" : def?.estiloSub ?? subtitulos;
          return (
            <Series.Sequence key={ev.id} durationInFrames={dur} name={ev.id}>
              {def ? def.render({ voz: ev, dur }) : null}
              {estilo === "karaoke" ? (
                <Subtitulos palabras={ev.palabras} desde={desde} claro={def?.subtitulosClaros} y={subY} />
              ) : estilo === "ninguno" ? null : (
                <SubtituloFrase palabras={ev.palabras} desde={desde} estilo={estilo} y={subY} />
              )}
              <Sequence from={desde} layout="none" name={`voz ${ev.id}`}>
                <Audio src={staticFile(`voz/${videoId}/${ev.archivo}`)} volume={1} />
              </Sequence>
            </Series.Sequence>
          );
        })}
      </Series>
      {capa ? capa({ inicios }) : null}
      {pista ? <Musica pista={pista} voz={voz} extra={extra} nivel={nivelMusica} /> : null}
    </AbsoluteFill>
  );
};

/** Subtítulo por frases cortas: «caja» (blanco con texto negro, tipo TikTok) o «limpio» (blanco con sombra). */
export const SubtituloFrase: React.FC<{ palabras: Palabra[]; desde?: number; estilo: "caja" | "limpio"; y?: number; porPagina?: number }> = ({
  palabras,
  desde = 0,
  estilo,
  y = 470,
  porPagina = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame - desde) / fps;
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
  const texto = paginas[idx].map((p) => p.t).join(" ").replace(/[.,;:…]+$/, "");
  const caja = estilo === "caja";
  return (
    <div style={{ position: "absolute", bottom: y, left: SAFE.left, right: SAFE.right, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          fontFamily,
          fontSize: caja ? 54 : 60,
          fontWeight: 800,
          lineHeight: 1.25,
          textAlign: "center",
          color: caja ? "#111" : COLORS.white,
          background: caja ? COLORS.white : "transparent",
          padding: caja ? "10px 26px 14px" : 0,
          borderRadius: caja ? 18 : 0,
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
          textShadow: caja ? "none" : "0 0 4px #000, 0 4px 18px rgba(0,0,0,0.85)",
          maxWidth: 860,
        }}
      >
        {texto}
      </div>
    </div>
  );
};

/* ---------- CTA de crecimiento (GUIA.md: compartir, guardar, comentar o seguir) ---------- */
export type TipoCta = "compartir" | "guardar" | "comentar" | "seguir";
const IconoCta: React.FC<{ tipo: TipoCta; color: string }> = ({ tipo, color }) => {
  const p = { fill: "none", stroke: color, strokeWidth: 9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={150} height={150} viewBox="0 0 100 100">
      {tipo === "compartir" ? (
        <>
          <path d="M88 12 L10 44 L42 56 L54 88 Z" {...p} />
          <path d="M88 12 L42 56" {...p} />
        </>
      ) : tipo === "guardar" ? (
        <path d="M24 10 H76 V90 L50 70 L24 90 Z" {...p} />
      ) : tipo === "comentar" ? (
        <path d="M14 18 H86 V68 H44 L24 86 V68 H14 Z" {...p} />
      ) : (
        <>
          <circle cx="40" cy="34" r="16" {...p} />
          <path d="M12 86 C12 64 26 56 40 56 C54 56 68 64 68 86" {...p} />
          <path d="M80 30 V58 M66 44 H94" {...p} />
        </>
      )}
    </svg>
  );
};

export const CtaCrecer: React.FC<{
  tipo: TipoCta;
  boton: string; // texto grande: «MÁNDASELO», «GUÁRDALO», «¿12 o 14?», «SÍGUENOS»
  linea: string; // frase debajo, admite **resaltado**
  seguir?: boolean; // añade «Síguenos para más» (por defecto, sí salvo tipo seguir)
}> = ({ tipo, boton, linea, seguir = tipo !== "seguir" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSpring(0.3, 8, 0.8);
  const ic = useSpring(0.05, 9, 0.6);
  const pulso = 1 + 0.035 * Math.sin((frame / fps) * Math.PI * 2.2);
  const sg = useSpring(1.4, 12, 0.7);
  return (
    <Escena fondo="claro">
      <Sfx s="pop" volumen={0.4} en={0.3} />
      <Sfx s="click" volumen={0.4} en={1.1} />
      <Zona gap={40}>
        <div style={{ scale: String(ic), rotate: `${(1 - ic) * -20}deg`, filter: `drop-shadow(0 16px 30px ${COLORS.blue}55)` }}>
          <IconoCta tipo={tipo} color={COLORS.blue} />
        </div>
        <div
          style={{
            fontSize: boton.length > 13 ? 84 : boton.length > 10 ? 100 : boton.length > 8 ? 118 : 140,
            fontWeight: 900,
            color: COLORS.white,
            background: `linear-gradient(160deg, #3B6BFF, ${COLORS.blue})`,
            padding: "24px 56px",
            borderRadius: 44,
            letterSpacing: 3,
            rotate: "-3deg",
            scale: String(s * pulso),
            whiteSpace: "nowrap",
            boxShadow: `0 30px 80px ${COLORS.blue}66, inset 0 -10px 0 rgba(0,0,0,0.2)`,
          }}
        >
          {boton}
        </div>
        <Palabras texto={linea} size={62} color={COLORS.navy} resalta={COLORS.blue} delay={0.7} />
        {seguir ? (
          <div
            style={{
              opacity: sg,
              translate: `0px ${(1 - sg) * 30}px`,
              fontSize: 44,
              fontWeight: 800,
              color: COLORS.blue,
              border: `4px solid ${COLORS.blue}`,
              borderRadius: 999,
              padding: "12px 34px",
              backgroundColor: COLORS.white,
            }}
          >
            ＋ Síguenos para más
          </div>
        ) : null}
      </Zona>
    </Escena>
  );
};

/* =====================================================================
   PERSONAJES Y ESCENARIOS (fábulas e historias). Ver KIT.md, «Personajes».
   Todo dibujado en SVG con los colores de brand.ts. Nunca personas reconocibles.
   ===================================================================== */
export type Expresion = "feliz" | "neutral" | "sorpresa" | "triste" | "preocupado" | "enfadado" | "pensativo";
export type Pose = "quieto" | "saluda" | "brazos-arriba" | "senala" | "piensa" | "abraza" | "encoge";

const BRAZOS: Record<Pose, [number, number]> = {
  // ángulo de cada brazo desde «colgando» (0°) hacia fuera; [izquierdo, derecho]
  quieto: [18, 18],
  saluda: [18, 150],
  "brazos-arriba": [150, 150],
  senala: [18, 92],
  piensa: [18, 165],
  abraza: [-38, -38],
  encoge: [70, 70],
};

/**
 * Personaje: figura redonda tipo «judía» con ojos, cejas y boca, brazos y piernas.
 * `x`, `y` = posición de los pies en el lienzo 1080×1920. `escala` 1 ≈ 200 px de ancho.
 * Respira, parpadea solo y, con `anda`, mueve las piernas y bota. `salto` = segundo en que da un brinco.
 */
export const Personaje: React.FC<{
  x: number;
  y: number;
  escala?: number;
  color?: string;
  expresion?: Expresion;
  pose?: Pose;
  mirar?: "izq" | "der" | "frente";
  anda?: boolean;
  salto?: number;
  accesorio?: "lazo" | "gorra" | "gafas" | "santa" | "corbata" | "casco" | "sombrero" | null;
  colorAccesorio?: string;
  bigote?: boolean; // bigote grande (encima de la boca)
  entra?: "izq" | "der" | "abajo" | null;
  delay?: number;
  semilla?: number; // desfasa respiración y parpadeo entre personajes
}> = ({
  x,
  y,
  escala = 1.6,
  color = COLORS.accent,
  expresion = "neutral",
  pose = "quieto",
  mirar = "frente",
  anda = false,
  salto,
  accesorio = null,
  colorAccesorio = COLORS.red,
  bigote = false,
  entra = null,
  delay = 0,
  semilla = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + semilla * 0.77;
  const s = useSpring(delay, 13, 0.7);
  const ent = entra ? s : 1;
  const offX = entra === "izq" ? -(1 - ent) * 700 : entra === "der" ? (1 - ent) * 700 : 0;
  const offY = entra === "abajo" ? (1 - ent) * 500 : 0;
  // respiración, paso y brinco
  const resp = Math.sin(t * Math.PI * 1.6) * 3;
  const paso = anda ? Math.sin(t * Math.PI * 2 * 1.8) : 0;
  const bote = anda ? Math.abs(paso) * 8 : 0;
  let brinco = 0;
  if (salto !== undefined) {
    const k = frame - Math.round(salto * fps);
    if (k >= 0 && k < 14) brinco = Math.sin((k / 14) * Math.PI) * 46;
  }
  // parpadeo cada ~3 s (4 frames)
  const ciclo = Math.floor(fps * 3.1);
  const fb = (frame + semilla * 23) % ciclo;
  const parpadeo = fb < 4 ? 0.12 : 1;
  const px = mirar === "izq" ? -6 : mirar === "der" ? 6 : 0;
  const sorpresa = expresion === "sorpresa";
  const ojoR = sorpresa ? 18 : 15;
  const [aI, aD] = BRAZOS[pose];
  const onda = pose === "saluda" ? Math.sin(t * Math.PI * 2 * 1.5) * 18 : 0;
  const L = 62;
  const brazo = (lado: -1 | 1, ang: number) => {
    const r = (ang * Math.PI) / 180;
    const x0 = 100 + lado * 56;
    const y0 = 130;
    return { x0, y0, x1: x0 + lado * Math.sin(r) * L, y1: y0 + Math.cos(r) * L };
  };
  const bI = brazo(-1, aI);
  const bD = brazo(1, aD + onda);
  const oscuro = COLORS.navy;
  const cejas: Record<Expresion, [number, number]> = {
    // [inclinación (grados, + = hacia dentro abajo), altura extra]
    feliz: [-6, 2],
    neutral: [0, 0],
    sorpresa: [-4, 12],
    triste: [-18, 4],
    preocupado: [-14, 6],
    enfadado: [22, -2],
    pensativo: [8, 4],
  };
  const [ci, ch] = cejas[expresion];
  const boca: Record<Expresion, React.ReactNode> = {
    feliz: <path d="M80 148 Q100 172 120 148" fill="none" stroke={oscuro} strokeWidth={6} strokeLinecap="round" />,
    neutral: <path d="M86 156 L114 156" fill="none" stroke={oscuro} strokeWidth={6} strokeLinecap="round" />,
    sorpresa: <ellipse cx={100} cy={158} rx={11} ry={15} fill={oscuro} />,
    triste: <path d="M82 166 Q100 146 118 166" fill="none" stroke={oscuro} strokeWidth={6} strokeLinecap="round" />,
    preocupado: <path d="M82 160 Q91 152 100 160 Q109 168 118 160" fill="none" stroke={oscuro} strokeWidth={6} strokeLinecap="round" />,
    enfadado: <path d="M84 164 Q100 152 116 164" fill="none" stroke={oscuro} strokeWidth={7} strokeLinecap="round" />,
    pensativo: <path d="M96 158 Q108 152 118 156" fill="none" stroke={oscuro} strokeWidth={6} strokeLinecap="round" />,
  };
  return (
    <div
      style={{
        position: "absolute",
        left: x - 100 * escala + offX,
        top: y - 260 * escala + offY - brinco - bote,
        width: 200 * escala,
        height: 260 * escala,
        opacity: Math.min(1, ent * 1.4),
        pointerEvents: "none",
      }}
    >
      <svg width={200 * escala} height={260 * escala} viewBox="0 0 200 260" style={{ overflow: "visible" }}>
        {/* sombra */}
        <ellipse cx={100} cy={254 + (brinco + bote) / escala} rx={58 - brinco * 0.3} ry={9} fill="#000" opacity={0.22} />
        {/* piernas */}
        <g stroke={oscuro} strokeWidth={15} strokeLinecap="round">
          <line x1={82} y1={200} x2={82 - paso * 16} y2={246} />
          <line x1={118} y1={200} x2={118 + paso * 16} y2={246} />
        </g>
        {/* brazo de detrás (izquierdo) */}
        <line x1={bI.x0} y1={bI.y0} x2={bI.x1} y2={bI.y1} stroke={color} strokeWidth={17} strokeLinecap="round" />
        <circle cx={bI.x1} cy={bI.y1} r={11} fill={color} stroke={oscuro} strokeWidth={3} />
        {/* cuerpo */}
        <g transform={`translate(0 ${resp * 0.5}) scale(1 ${1 + resp * 0.004})`} style={{ transformOrigin: "100px 210px" }}>
          <rect x={40} y={56} width={120} height={158} rx={60} fill={color} stroke={oscuro} strokeWidth={4} />
          <ellipse cx={100} cy={170} rx={40} ry={34} fill={COLORS.white} opacity={0.18} />
          <ellipse cx={74} cy={86} rx={14} ry={9} fill={COLORS.white} opacity={0.35} transform="rotate(-25 74 86)" />
          {/* ojos */}
          {[78, 122].map((cx, i) => (
            <g key={cx} transform={`translate(${cx} 112) scale(1 ${parpadeo}) translate(${-cx} -112)`}>
              <ellipse cx={cx} cy={112} rx={ojoR} ry={ojoR + 2} fill={COLORS.white} stroke={oscuro} strokeWidth={3} />
              <circle cx={cx + px} cy={114} r={sorpresa ? 6 : 7.5} fill={oscuro} />
              <circle cx={cx + px + 3} cy={110} r={2.4} fill={COLORS.white} />
              {/* ceja */}
              <line
                x1={cx - 14}
                y1={88 - ch}
                x2={cx + 14}
                y2={88 - ch}
                stroke={oscuro}
                strokeWidth={6}
                strokeLinecap="round"
                transform={`rotate(${i === 0 ? ci : -ci} ${cx} ${88 - ch})`}
              />
            </g>
          ))}
          {expresion === "feliz" ? (
            <>
              <ellipse cx={64} cy={140} rx={10} ry={6} fill={COLORS.red} opacity={0.35} />
              <ellipse cx={136} cy={140} rx={10} ry={6} fill={COLORS.red} opacity={0.35} />
            </>
          ) : null}
          {boca[expresion]}
          {accesorio === "gafas" ? (
            <g fill="none" stroke={oscuro} strokeWidth={5}>
              <circle cx={78} cy={112} r={21} />
              <circle cx={122} cy={112} r={21} />
              <line x1={99} y1={110} x2={101} y2={110} />
            </g>
          ) : null}
          {accesorio === "lazo" ? (
            <g transform="translate(132 60) rotate(18)">
              <path d="M0 0 L-26 -16 L-26 16 Z M0 0 L26 -16 L26 16 Z" fill={colorAccesorio} stroke={oscuro} strokeWidth={3} strokeLinejoin="round" />
              <circle r={7} fill={colorAccesorio} stroke={oscuro} strokeWidth={3} />
            </g>
          ) : null}
          {accesorio === "santa" ? (
            <g>
              <path d="M50 76 Q70 10 150 14 Q176 30 170 58 Q150 40 140 44 Q150 60 150 76 Z" fill={colorAccesorio} stroke={oscuro} strokeWidth={4} strokeLinejoin="round" />
              <rect x={42} y={62} width={116} height={24} rx={12} fill={COLORS.white} stroke={oscuro} strokeWidth={4} />
              <circle cx={170} cy={60} r={14} fill={COLORS.white} stroke={oscuro} strokeWidth={4} />
            </g>
          ) : null}
          {accesorio === "casco" ? (
            <g>
              <path d="M46 76 Q46 18 100 16 Q154 18 154 76 Z" fill={colorAccesorio} stroke={oscuro} strokeWidth={4} strokeLinejoin="round" />
              <rect x={34} y={70} width={132} height={16} rx={8} fill={colorAccesorio} stroke={oscuro} strokeWidth={4} />
              <rect x={92} y={18} width={16} height={54} rx={6} fill={COLORS.white} opacity={0.45} />
            </g>
          ) : null}
          {bigote ? (
            <path d="M100 140 Q86 128 70 134 Q54 140 50 156 Q62 146 76 150 Q90 154 100 146 Q110 154 124 150 Q138 146 150 156 Q146 140 130 134 Q114 128 100 140 Z" fill={COLORS.navy} stroke={oscuro} strokeWidth={2} />
          ) : null}
          {accesorio === "sombrero" ? (
            <g>
              <ellipse cx={100} cy={70} rx={96} ry={20} fill={colorAccesorio} stroke={oscuro} strokeWidth={4} />
              <path d="M58 70 Q60 18 100 16 Q140 18 142 70 Z" fill={colorAccesorio} stroke={oscuro} strokeWidth={4} strokeLinejoin="round" />
              <rect x={58} y={52} width={84} height={14} rx={4} fill={COLORS.red} opacity={0.85} />
              <path d="M20 70 L180 70 M70 30 L130 30" stroke={oscuro} strokeWidth={2} opacity={0.25} />
            </g>
          ) : null}
          {accesorio === "corbata" ? (
            <g>
              <path d="M90 168 L110 168 L104 178 L114 214 L100 226 L86 214 L96 178 Z" fill={colorAccesorio} stroke={oscuro} strokeWidth={3} strokeLinejoin="round" />
            </g>
          ) : null}
          {accesorio === "gorra" ? (
            <g>
              <path d="M52 74 Q100 22 148 74 Z" fill={colorAccesorio} stroke={oscuro} strokeWidth={4} strokeLinejoin="round" />
              <path d="M120 70 Q160 66 178 76 Q150 82 120 78 Z" fill={colorAccesorio} stroke={oscuro} strokeWidth={4} strokeLinejoin="round" />
            </g>
          ) : null}
        </g>
        {/* brazo de delante (derecho) */}
        <line x1={bD.x0} y1={bD.y0} x2={bD.x1} y2={bD.y1} stroke={color} strokeWidth={17} strokeLinecap="round" />
        <circle cx={bD.x1} cy={bD.y1} r={11} fill={color} stroke={oscuro} strokeWidth={3} />
      </svg>
    </div>
  );
};

/** Línea del suelo de los escenarios: los pies de los personajes van aquí (por encima de los subtítulos). */
export const SUELO_Y = 1250;

/**
 * Escenario dibujado en código, a pantalla completa. Va como primer hijo de <Escena>.
 * `tipo` = `campo` (cielo, sol, colinas, nubes), `interior` (pared cálida, ventana, cuadro, lámpara),
 * `tienda` (pared clara, estantes y mostrador) o `calle` (noche, edificios con ventanas que se encienden).
 * Abajo lleva una franja oscura para que los subtítulos se lean.
 */
export const Escenario: React.FC<{ tipo: "campo" | "interior" | "tienda" | "calle"; tarde?: number }> = ({ tipo, tarde = 0 }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const sombraAbajo = (
    <AbsoluteFill
      style={{ background: `linear-gradient(180deg, transparent 0%, transparent 66%, ${COLORS.navy}AA 80%, ${COLORS.navy}EE 100%)` }}
    />
  );
  if (tipo === "campo") {
    // `tarde` 0–1 oscurece el cielo hacia el atardecer
    const cielo = `linear-gradient(180deg, ${COLORS.accent} 0%, ${COLORS.light} 45%, ${COLORS.paper} 70%)`;
    return (
      <AbsoluteFill style={{ overflow: "hidden", background: cielo }}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.navy} 0%, ${COLORS.blue} 60%)`, opacity: tarde * 0.75 }} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <circle cx={820} cy={430 + tarde * 260} r={110} fill={COLORS.gold} opacity={0.95} />
          <circle cx={820} cy={430 + tarde * 260} r={170} fill={COLORS.gold} opacity={0.18} />
          {[0, 1, 2].map((i) => {
            const cx = ((i * 420 + t * (14 + i * 6)) % 1400) - 200;
            const cy = 340 + i * 150;
            return (
              <g key={i} fill={COLORS.white} opacity={0.85}>
                <ellipse cx={cx} cy={cy} rx={110} ry={38} />
                <ellipse cx={cx - 50} cy={cy - 20} rx={60} ry={40} />
                <ellipse cx={cx + 40} cy={cy - 28} rx={70} ry={46} />
              </g>
            );
          })}
          <path d="M-100 1080 Q250 900 560 1060 T1200 1020 V1920 H-100 Z" fill={COLORS.green} opacity={0.55} />
          <path d="M-100 1180 Q300 1080 640 1170 T1200 1150 V1920 H-100 Z" fill={COLORS.green} />
          <rect x={0} y={SUELO_Y - 20} width={1080} height={700} fill={COLORS.green} />
          <rect x={0} y={SUELO_Y - 20} width={1080} height={700} fill={COLORS.navy} opacity={0.12} />
          {Array.from({ length: 14 }, (_, i) => (
            <path
              key={i}
              d={`M${40 + i * 75} ${SUELO_Y + 30 + (i % 3) * 40} q6 -26 12 0 q6 -20 12 0`}
              stroke={COLORS.navy}
              strokeOpacity={0.25}
              strokeWidth={5}
              fill="none"
            />
          ))}
        </svg>
        {sombraAbajo}
      </AbsoluteFill>
    );
  }
  if (tipo === "interior") {
    const luz = 0.85 + 0.15 * Math.sin(t * 2.2);
    return (
      <AbsoluteFill style={{ overflow: "hidden", background: `linear-gradient(180deg, ${COLORS.chocoLight} 0%, ${COLORS.choco} 100%)` }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={i * 96} y={0} width={48} height={SUELO_Y} fill={COLORS.white} opacity={0.04} />
          ))}
          {/* ventana con cielo */}
          <rect x={120} y={300} width={300} height={380} rx={16} fill={COLORS.light} stroke={COLORS.paper} strokeWidth={18} />
          <circle cx={340} cy={400} r={40} fill={COLORS.gold} opacity={0.9} />
          <line x1={270} y1={300} x2={270} y2={680} stroke={COLORS.paper} strokeWidth={12} />
          <line x1={120} y1={490} x2={420} y2={490} stroke={COLORS.paper} strokeWidth={12} />
          {/* cuadro */}
          <rect x={660} y={340} width={240} height={180} rx={10} fill={COLORS.navy} stroke={COLORS.gold} strokeWidth={12} />
          <path d="M680 500 L740 430 L790 480 L830 440 L880 500 Z" fill={COLORS.accent} />
          {/* lámpara */}
          <line x1={780} y1={0} x2={780} y2={150} stroke={COLORS.navy} strokeWidth={6} />
          <path d="M720 150 H840 L810 210 H750 Z" fill={COLORS.gold} />
          <ellipse cx={780} cy={230} rx={240} ry={80} fill={COLORS.gold} opacity={0.12 * luz} />
          {/* suelo */}
          <rect x={0} y={SUELO_Y - 30} width={1080} height={700} fill={COLORS.navy} opacity={0.55} />
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1={i * 150} y1={SUELO_Y - 30} x2={i * 150 - 120} y2={1920} stroke={COLORS.white} strokeOpacity={0.06} strokeWidth={4} />
          ))}
        </svg>
        {sombraAbajo}
      </AbsoluteFill>
    );
  }
  if (tipo === "tienda") {
    return (
      <AbsoluteFill style={{ overflow: "hidden", background: `linear-gradient(180deg, ${COLORS.paper} 0%, ${COLORS.light} 100%)` }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {[420, 640].map((y, j) => (
            <g key={y}>
              <rect x={60} y={y} width={960} height={16} rx={6} fill={COLORS.grey} />
              {Array.from({ length: 7 }, (_, i) => (
                <rect
                  key={i}
                  x={90 + i * 135}
                  y={y - 90 - ((i + j) % 3) * 20}
                  width={90}
                  height={90 + ((i + j) % 3) * 20}
                  rx={10}
                  fill={[COLORS.accent, COLORS.gold, COLORS.blue, COLORS.green][(i + j) % 4]}
                  opacity={0.75}
                />
              ))}
            </g>
          ))}
          {/* mostrador */}
          <rect x={0} y={1010} width={1080} height={60} fill={COLORS.blue} />
          <rect x={0} y={1070} width={1080} height={200} fill={COLORS.navy} />
          <rect x={0} y={SUELO_Y - 20} width={1080} height={700} fill={COLORS.grey} />
        </svg>
        {sombraAbajo}
      </AbsoluteFill>
    );
  }
  // calle de noche
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: `linear-gradient(180deg, ${COLORS.deep} 0%, ${COLORS.navy} 70%)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 30 }, (_, i) => (
          <circle key={i} cx={(i * 197) % 1080} cy={240 + ((i * 89) % 420)} r={2 + (i % 3)} fill={COLORS.white} opacity={0.3 + 0.4 * Math.abs(Math.sin(t * 1.5 + i))} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => {
          const h = 420 + ((i * 137) % 260);
          const x = i * 230 - 30;
          return (
            <g key={i}>
              <rect x={x} y={SUELO_Y - h} width={210} height={h} fill={COLORS.blue} opacity={0.55} />
              {Array.from({ length: 8 }, (_, k) => (
                <rect
                  key={k}
                  x={x + 30 + (k % 2) * 90}
                  y={SUELO_Y - h + 40 + Math.floor(k / 2) * 90}
                  width={50}
                  height={50}
                  rx={6}
                  fill={COLORS.gold}
                  opacity={(i + k) % 3 === 0 || (frame / 30 > (i + k) % 5) ? 0.8 : 0.12}
                />
              ))}
            </g>
          );
        })}
        <rect x={0} y={SUELO_Y - 20} width={1080} height={700} fill={COLORS.grey} opacity={0.6} />
      </svg>
      {sombraAbajo}
    </AbsoluteFill>
  );
};

/** Bocadillo de diálogo o de pensamiento que entra con muelle. La punta señala hacia (`x` + `colaX`, abajo). */
export const Bocadillo: React.FC<{
  texto: string;
  x: number;
  y: number;
  ancho?: number;
  size?: number;
  delay?: number;
  piensa?: boolean;
  colaX?: number;
  color?: string;
}> = ({ texto, x, y, ancho = 520, size = 54, delay = 0, piensa = false, colaX = 0, color = COLORS.white }) => {
  const s = useSpring(delay, 11, 0.6);
  return (
    <div
      style={{
        position: "absolute",
        left: x - ancho / 2,
        top: y,
        width: ancho,
        scale: String(0.3 + 0.7 * s),
        opacity: Math.min(1, s * 1.5),
        transformOrigin: `${ancho / 2 + colaX}px 120%`,
      }}
    >
      <div
        style={{
          background: color,
          color: COLORS.navy,
          borderRadius: piensa ? 90 : 44,
          padding: "26px 34px",
          fontSize: size,
          fontWeight: 900,
          lineHeight: 1.1,
          textAlign: "center",
          border: `5px solid ${COLORS.navy}`,
          boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
        }}
      >
        {texto}
      </div>
      {piensa ? (
        <>
          <div style={{ position: "absolute", left: ancho / 2 + colaX - 18, bottom: -46, width: 36, height: 36, borderRadius: "50%", background: color, border: `5px solid ${COLORS.navy}` }} />
          <div style={{ position: "absolute", left: ancho / 2 + colaX - 4, bottom: -80, width: 20, height: 20, borderRadius: "50%", background: color, border: `4px solid ${COLORS.navy}` }} />
        </>
      ) : (
        <svg width={60} height={50} style={{ position: "absolute", left: ancho / 2 + colaX - 30, bottom: -44 }}>
          <path d="M4 0 L30 46 L56 0" fill={color} stroke={COLORS.navy} strokeWidth={5} strokeLinejoin="round" />
          <rect x={6} y={-6} width={48} height={9} fill={color} />
        </svg>
      )}
    </div>
  );
};

/** Rótulo pequeño arriba (fábulas e historias): poco texto, en la franja superior y sin tapar al personaje. */
export const Rotulo: React.FC<{ texto: string; delay?: number; color?: string; fondo?: string; size?: number }> = ({
  texto,
  delay = 0.1,
  color = COLORS.navy,
  fondo = COLORS.white,
  size = 64,
}) => {
  const s = useSpring(delay, 12, 0.6);
  return (
    <div style={{ position: "absolute", top: 250, left: SAFE.left, right: SAFE.right, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          background: fondo,
          color,
          fontFamily,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 1.08,
          padding: "20px 36px",
          borderRadius: 30,
          textAlign: "center",
          rotate: `${(1 - s) * -6 - 1.5}deg`,
          translate: `0px ${(1 - s) * -80}px`,
          opacity: Math.min(1, s * 1.4),
          boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
          maxWidth: 860,
        }}
      >
        {texto.split(/(\*\*[^*]+\*\*)/).map((p, i) =>
          p.startsWith("**") ? (
            <span key={i} style={{ color: COLORS.blue }}>
              {p.replace(/\*\*/g, "")}
            </span>
          ) : (
            <span key={i}>{p}</span>
          ),
        )}
      </div>
    </div>
  );
};
