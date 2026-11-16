import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, euros } from "../brand";
import {
  Chispas,
  Cifra,
  DefEscena,
  CtaCrecer,
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

// W47-04 v2 · «¿14 pagas = cobrar más?» · CTA COMENTAR
// Kit v2 + imágenes (public/img/W47-04/). Ejemplo hipotético, bruto anual: 24.000 € / 12 = 2.000 €; / 14 = 1.714 €
// Notas del guion: hablar solo de bruto anual; junio y diciembre son fechas habituales, no obligatorias.
const IMG = (n: string) => `img/W47-04/${n}.jpg`;
const TOTAL = 24000;
const BAR_W = 840;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EJEMPLO = "Ejemplo hipotético · bruto anual";

export const EXTRA_W4704: Record<string, number> = { wow: 0.8, importes: 0.4, cta: 0.8, cierre: 0.8 };

const Arriba: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 26 }) => (
  <Zona top={250} bottom={1050} justify="flex-start" gap={gap}>
    {children}
  </Zona>
);

/* Tableta de chocolate: n trozos, mismo ancho total */
const Tableta: React.FC<{ n: number; crece?: number; etiqueta?: string; etiquetaOp?: number; apagados?: number[]; titulo?: boolean }> = ({
  n,
  crece = 1,
  etiqueta,
  etiquetaOp = 1,
  apagados = [],
  titulo = true,
}) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
    {titulo ? <div style={{ fontSize: 44, fontWeight: 800, color: COLORS.white }}>{n} trozos</div> : null}
    <div
      style={{
        width: BAR_W,
        height: 140,
        display: "flex",
        gap: 6,
        padding: 10,
        boxSizing: "border-box",
        background: `linear-gradient(180deg, ${COLORS.chocoLight}, ${COLORS.choco})`,
        borderRadius: 18,
        scale: `${crece} 1`,
        transformOrigin: "left",
        boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 40px ${COLORS.gold}22`,
      }}
    >
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            background: `linear-gradient(160deg, #B87A4E, ${COLORS.chocoLight})`,
            borderRadius: 8,
            boxShadow: "inset 0 -6px 0 rgba(0,0,0,0.25), inset 0 4px 0 rgba(255,255,255,0.12)",
            opacity: apagados.includes(i) ? 0.15 : 1,
          }}
        />
      ))}
    </div>
    {etiqueta ? <div style={{ fontSize: 50, fontWeight: 900, color: COLORS.gold, opacity: etiquetaOp }}>{etiqueta}</div> : null}
  </div>
);

/* Nómina dibujada */
const Nomina: React.FC<{ n: number; color: string; escala?: number }> = ({ n, color, escala = 1 }) => (
  <div
    style={{
      width: 280 * escala,
      height: 360 * escala,
      borderRadius: 24 * escala,
      backgroundColor: COLORS.white,
      padding: 24 * escala,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: 12 * escala,
      boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${color}55`,
    }}
  >
    <div style={{ fontSize: 28 * escala, fontWeight: 800, color: COLORS.grey }}>NÓMINA</div>
    {[0.9, 0.7, 0.8].map((w, i) => (
      <div key={i} style={{ height: 13 * escala, width: `${w * 100}%`, backgroundColor: "#E2E8F0", borderRadius: 7 }} />
    ))}
    <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ fontSize: 120 * escala, fontWeight: 900, color, lineHeight: 1 }}>{n}</div>
    </div>
    <div style={{ fontSize: 26 * escala, fontWeight: 800, color, textAlign: "center" }}>pagas</div>
  </div>
);

const Nominas: React.FC<{ escala?: number; delay?: number }> = ({ escala = 1, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = useSpring(delay, 12, 0.7);
  const b = useSpring(delay + 0.12, 12, 0.7);
  const giro = Math.sin((frame / fps) * Math.PI * 2) * 7;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 26 * escala }}>
      <div style={{ scale: String(a), rotate: "-5deg" }}>
        <Nomina n={12} color={COLORS.blue} escala={escala} />
      </div>
      <div style={{ fontSize: 200 * escala, fontWeight: 900, color: COLORS.gold, rotate: `${giro}deg`, filter: `drop-shadow(0 0 30px ${COLORS.gold}88)` }}>?</div>
      <div style={{ scale: String(b), rotate: "5deg" }}>
        <Nomina n={14} color={COLORS.choco} escala={escala} />
      </div>
    </div>
  );
};

const ESCENAS: DefEscena[] = [
  {
    id: "hook",
    render: () => (
      <Escena sinEntrada sacudidas={[0.05]}>
        <Sfx s="impacto" volumen={0.5} />
        <Zona gap={60}>
          <Palabras texto="¿Con 14 pagas cobras **más que con 12?**" size={92} stagger={0.05} resalta={COLORS.gold} />
          <Nominas />
        </Zona>
      </Escena>
    ),
  },
  {
    id: "gancho2",
    render: () => (
      <Escena sonidoEntrada="impacto">
        <Foto src={IMG("01-tableta")} zoom={[1.15, 1.0]} />
        <Arriba>
          <Palabras texto="Spoiler: **no.**" size={130} resalta={COLORS.red} />
          <Palabras texto="Mira las dos tabletas." size={76} delay={0.6} color={COLORS.light} />
        </Arriba>
      </Escena>
    ),
  },
  {
    id: "ejemplo",
    render: () => (
      <Escena fondo="azul">
        <Zona gap={40}>
          <Palabras texto="Ejemplo:" size={84} />
          <Cifra a={TOTAL} inicio={0.2} fin={1.4} size={180} color={COLORS.gold} formato={(v) => euros(Math.round(v / 100) * 100)} />
          <Palabras texto="brutos al año" size={72} delay={0.6} color={COLORS.light} />
          <Pildora delay={0.9}>{EJEMPLO}</Pildora>
        </Zona>
      </Escena>
    ),
  },
  {
    id: "importes",
    render: () => <Importes />,
  },
  {
    id: "wow",
    render: ({ dur }) => <Wow dur={dur} />,
  },
  {
    id: "regalo",
    render: () => (
      <Escena sonidoEntrada="whoosh">
        <Foto src={IMG("02-regalo")} zoom={[1.0, 1.14]} subir={20} />
        <Sfx s="pop" volumen={0.35} en={0.8} />
        <Arriba>
          <Palabras texto="La paga extra" size={96} />
          <Palabras texto="**no es dinero extra**" size={96} delay={0.5} resalta={COLORS.red} marcador />
        </Arriba>
      </Escena>
    ),
  },
  {
    id: "calendario",
    render: () => <Calendario />,
  },
  {
    id: "planifica",
    render: () => (
      <Escena sonidoEntrada="whoosh">
        <Foto src={IMG("03-tarros")} zoom={[1.12, 1.0]} />
        <Arriba gap={20}>
          <Palabras texto="**Planifícala**" size={110} resalta={COLORS.green} />
          <Palabras texto="antes de que llegue" size={74} delay={0.4} color={COLORS.light} />
          <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
            <Pildora bg="rgba(34,197,94,0.18)" color={COLORS.green} size={36} delay={0.8}>Colchón</Pildora>
            <Pildora size={36} delay={1.0}>Gastos del año</Pildora>
            <Pildora bg="rgba(251,191,36,0.18)" color={COLORS.gold} size={36} delay={1.2}>Capricho</Pildora>
          </div>
        </Arriba>
      </Escena>
    ),
  },
  {
    id: "cta",
    subtitulosClaros: true,
    render: () => <CtaCrecer tipo="comentar" boton="¿12 o 14?" linea="¿Tú cuántas pagas cobras? **Te leemos**" />,
  },
  {
    id: "cierre",
    subtitulos: false,
    render: () => (
      <Escena>
        <Zona gap={50}>
          <Palabras texto="14 pagas no es cobrar más. **Es cobrar distinto.**" size={84} resalta={COLORS.gold} />
          <Nominas escala={0.75} delay={0.3} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 60, fontWeight: 900, letterSpacing: 6, color: COLORS.white }}>
              ALIGN <span style={{ fontWeight: 500, color: COLORS.light }}>by ADB</span>
            </div>
            <div style={{ fontSize: 28, color: COLORS.light }}>Contenido informativo, no es asesoramiento financiero.</div>
          </div>
        </Zona>
      </Escena>
    ),
  },
];

const Importes = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g1 = interpolate(frame, [0.1 * fps, 0.7 * fps], [0, 1], clamp);
  const g2 = interpolate(frame, [0.4 * fps, 1.0 * fps], [0, 1], clamp);
  const l1 = interpolate(frame, [0.8 * fps, 1.1 * fps], [0, 1], clamp);
  const l2 = interpolate(frame, [1.6 * fps, 1.9 * fps], [0, 1], clamp);
  return (
    <Escena fondo="noche">
      <Sfx s="pop" volumen={0.35} en={0.8} />
      <Sfx s="pop" volumen={0.35} en={1.6} />
      <Zona gap={34}>
        <Pildora>{EJEMPLO}</Pildora>
        <Tableta n={12} crece={g1} etiqueta="2.000 € cada trozo" etiquetaOp={l1} />
        <Tableta n={14} crece={g2} etiqueta="1.714 € cada trozo" etiquetaOp={l2} />
      </Zona>
    </Escena>
  );
};

const Wow: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 0.3 * fps, fps, config: { damping: 15 }, durationInFrames: 30 });
  const eqEn = 1.2;
  const eq = spring({ frame: frame - eqEn * fps, fps, config: { damping: 10 } });
  return (
    <Escena fondo="noche" sacudidas={[eqEn]}>
      <Sfx s="riser" volumen={0.3} />
      <Sfx s="ding" volumen={0.4} en={eqEn} />
      <Zona gap={24}>
        <Palabras texto="Mismo total:" size={88} />
        <Cifra a={TOTAL} inicio={0} fin={0.01} size={150} color={COLORS.gold} formato={(v) => euros(Math.round(v))} ticks={false} />
        <div style={{ position: "relative", height: 420, width: BAR_W }}>
          <div style={{ position: "absolute", top: 0, left: 0 }}>
            <Tableta n={12} titulo={false} />
          </div>
          <div style={{ position: "absolute", top: 260 - t * 100, left: 0 }}>
            <Tableta n={14} titulo={false} />
          </div>
          <div style={{ position: "absolute", top: -20, bottom: 0, left: -8, borderLeft: `6px dashed ${COLORS.gold}`, opacity: eq }} />
          <div style={{ position: "absolute", top: -20, bottom: 0, right: -8, borderRight: `6px dashed ${COLORS.gold}`, opacity: eq }} />
        </div>
        <div style={{ fontSize: 180, fontWeight: 900, color: COLORS.gold, lineHeight: 0.8, scale: String(eq), filter: `drop-shadow(0 0 40px ${COLORS.gold})` }}>=</div>
      </Zona>
      <Chispas en={Math.min(eqEn, dur / fps - 0.5)} x={540} y={1100} color={COLORS.gold} />
    </Escena>
  );
};

const Trozo: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: 110,
      background: `linear-gradient(160deg, #B87A4E, ${COLORS.chocoLight})`,
      border: `5px solid ${COLORS.choco}`,
      borderRadius: 10,
      boxShadow: `0 0 30px ${COLORS.gold}88`,
    }}
  />
);

const Calendario = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 16 }, durationInFrames: 36 });
  const trozo = (BAR_W - 20 - 13 * 6) / 14;
  const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  const cw = 200;
  const ch = 90;
  const celda = (i: number) => ({ x: (i % 4) * (cw + 13), y: 230 + Math.floor(i / 4) * (ch + 14) });
  const jun = celda(5);
  const dic = celda(11);
  const desdeX = (i: number) => 10 + i * (trozo + 6);
  return (
    <Escena fondo="azul">
      <Sfx s="pop" volumen={0.35} en={1.0} />
      <Zona gap={30}>
        <Palabras texto="Es tu sueldo, **que llega más tarde**" size={80} resalta={COLORS.gold} />
        <div style={{ position: "relative", width: BAR_W, height: 560 }}>
          <Tableta n={14} titulo={false} apagados={[12, 13]} />
          {meses.map((m, i) => {
            const c = celda(i);
            const hot = i === 5 || i === 11;
            return (
              <div
                key={m}
                style={{
                  position: "absolute",
                  left: c.x,
                  top: c.y,
                  width: cw,
                  height: ch,
                  borderRadius: 14,
                  backgroundColor: hot ? COLORS.gold : "rgba(255,255,255,0.08)",
                  color: hot ? COLORS.navy : COLORS.light,
                  fontSize: 34,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 22,
                  boxSizing: "border-box",
                }}
              >
                {m}
              </div>
            );
          })}
          <Trozo x={interpolate(t, [0, 1], [desdeX(12), jun.x + cw - trozo - 12])} y={interpolate(t, [0, 1], [10, jun.y - 10])} w={trozo} />
          <Trozo x={interpolate(t, [0, 1], [desdeX(13), dic.x + cw - trozo - 12])} y={interpolate(t, [0, 1], [10, dic.y - 10])} w={trozo} />
        </div>
        <Pildora delay={1.2}>Fechas habituales · dependen del convenio</Pildora>
      </Zona>
    </Escena>
  );
};


export const W4704v2: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4704} pista="minimal-ambient-tech.mp3" /> : null;
