import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../brand";
import {
  Chispas,
  Cifra,
  CtaCrecer,
  DefEscena,
  Escena,
  Montaje,
  Personaje,
  Pildora,
  PropsVoz,
  Rotulo,
  Sfx,
  SUELO_Y,
  useSpring,
} from "../kit";

// W48-05 · «Te suben el sueldo y sigues igual» · COMPARACIÓN A/B (pantalla partida todo el vídeo) · CTA COMPARTIR
// Ana (izquierda, rojo) y Pablo (derecha, verde) reciben el mismo aumento de 200 €/mes (supuesto del ejemplo).
// Cálculo propio: Pablo aparta 100 €/mes desde el primer mes → 100 × 12 = 1.200 € en un año (sin intereses).
const NB = " ";
const eur = (v: number) => {
  const n = Math.round(v);
  return (n >= 1000 ? `${Math.floor(n / 1000)}.${String(n % 1000).padStart(3, "0")}` : String(n)) + NB + "€";
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const IZQ = 290;
const DER = 790;
const ANA = { color: COLORS.red, accesorio: "lazo" as const, colorAccesorio: COLORS.gold, escala: 1.15 };
const PABLO = { color: COLORS.green, accesorio: "gafas" as const, escala: 1.15, semilla: 2 };

export const EXTRA_W4805: Record<string, number> = { hook: 0.2, wow: 0.6, cta: 0.6, cierre: 0.8 };

const useSeg = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/* Fondo partido: mitad roja (Ana) y mitad verde (Pablo); `foco` atenúa el lado que no habla */
const Partida: React.FC<{ foco?: "ana" | "pablo" | null }> = ({ foco = null }) => {
  const frame = useCurrentFrame();
  const lado = (c: string, x: number, apagado: boolean) => (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: x,
        width: 540,
        background: `radial-gradient(120% 70% at 50% 35%, ${c}55 0%, ${COLORS.deep} 75%)`,
        filter: apagado ? "brightness(0.45) saturate(0.5)" : undefined,
      }}
    />
  );
  return (
    <>
      {lado(COLORS.red, 0, foco === "pablo")}
      {lado(COLORS.green, 540, foco === "ana")}
      <div style={{ position: "absolute", left: 536, top: 0, bottom: 0, width: 8, background: COLORS.white, opacity: 0.85, boxShadow: `0 0 30px ${COLORS.white}` }} />
      <div
        style={{
          position: "absolute",
          left: 500,
          top: 660 + Math.sin(frame / 15) * 6,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: COLORS.white,
          color: COLORS.navy,
          fontSize: 40,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        VS
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 700, background: `linear-gradient(180deg, transparent, ${COLORS.navy}EE)` }} />
    </>
  );
};

/* Lado: contenido centrado en una mitad, atenuado si no tiene el foco */
const Lado: React.FC<{ x: number; apagado?: boolean; children: React.ReactNode }> = ({ x, apagado = false, children }) => (
  <div style={{ position: "absolute", inset: 0, opacity: apagado ? 0.35 : 1 }}>
    <div style={{ position: "absolute", left: x - 230, width: 460, top: 0, bottom: 0 }}>{children}</div>
  </div>
);

const Nombre: React.FC<{ texto: string; color: string }> = ({ texto, color }) => (
  <div style={{ position: "absolute", top: 240, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <div style={{ fontSize: 60, fontWeight: 900, color: COLORS.navy, background: color, borderRadius: 20, padding: "4px 30px", letterSpacing: 3 }}>{texto}</div>
  </div>
);

/* Hucha-tarro de ahorro que se llena (0–1) */
const Bote: React.FC<{ lleno: number; color: string; top?: number; etiqueta?: string }> = ({ lleno, color, top = 520, etiqueta = "AHORRO" }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
    <svg width={260} height={300} viewBox="0 0 260 300">
      <defs>
        <clipPath id={`bote-${color.slice(1)}`}>
          <path d="M40 60 H220 Q240 60 240 90 V260 Q240 290 210 290 H50 Q20 290 20 260 V90 Q20 60 40 60 Z" />
        </clipPath>
      </defs>
      <rect x={70} y={20} width={120} height={40} rx={10} fill={COLORS.grey} />
      <g clipPath={`url(#bote-${color.slice(1)})`}>
        <rect x={0} y={290 - 230 * lleno} width={260} height={300} fill={color} />
        {Array.from({ length: Math.floor(lleno * 12) }, (_, i) => (
          <ellipse key={i} cx={60 + (i % 4) * 46} cy={280 - Math.floor(i / 4) * 24} rx={20} ry={8} fill={COLORS.gold} stroke={COLORS.choco} strokeWidth={3} />
        ))}
      </g>
      <path d="M40 60 H220 Q240 60 240 90 V260 Q240 290 210 290 H50 Q20 290 20 260 V90 Q20 60 40 60 Z" fill="none" stroke={COLORS.white} strokeWidth={6} />
    </svg>
    <div style={{ fontSize: 34, fontWeight: 800, color: COLORS.light, letterSpacing: 3 }}>{etiqueta}</div>
  </div>
);

/* Placa «+200 €» que aparece encima de cada personaje */
const Mas: React.FC<{ delay: number; texto?: string; color?: string; top?: number; size?: number }> = ({ delay, texto = `+200${NB}€`, color = COLORS.gold, top = 420, size = 84 }) => {
  const s = useSpring(delay, 9, 0.6);
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ fontSize: size, fontWeight: 900, color: COLORS.navy, background: color, borderRadius: 24, padding: "4px 26px", scale: String(s), rotate: `${(1 - s) * 20 - 3}deg`, whiteSpace: "nowrap" }}>
        {texto}
      </div>
    </div>
  );
};

/* Monedas que caen o salen volando */
const Monedas: React.FC<{ desde: [number, number]; hasta: [number, number]; inicio: number; n?: number }> = ({ desde, hasta, inicio, n = 6 }) => {
  const t = useSeg();
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const p = interpolate(t, [inicio + i * 0.18, inicio + i * 0.18 + 0.7], [0, 1], clamp);
        if (p <= 0 || p >= 1) return null;
        const x = desde[0] + (hasta[0] - desde[0]) * p;
        const y = desde[1] + (hasta[1] - desde[1]) * p - Math.sin(p * Math.PI) * 120;
        return <div key={i} style={{ position: "absolute", left: x - 26, top: y - 26, width: 52, height: 52, borderRadius: "50%", background: COLORS.gold, border: `5px solid ${COLORS.choco}` }} />;
      })}
    </>
  );
};

const Icono: React.FC<{ tipo: "cena" | "suscripcion" | "capricho"; x: number; y: number; delay: number }> = ({ tipo, x, y, delay }) => {
  const s = useSpring(delay, 10, 0.6);
  return (
    <svg width={150} height={150} viewBox="0 0 100 100" style={{ position: "absolute", left: x - 75, top: y - 75, scale: String(s) }}>
      <circle cx={50} cy={50} r={46} fill={COLORS.white} opacity={0.15} />
      {tipo === "cena" ? (
        <>
          <circle cx={50} cy={52} r={28} fill={COLORS.white} />
          <circle cx={50} cy={52} r={18} fill={COLORS.gold} />
          <path d="M14 30 V74 M86 30 V74" stroke={COLORS.white} strokeWidth={6} strokeLinecap="round" />
        </>
      ) : tipo === "suscripcion" ? (
        <>
          <rect x={18} y={24} width={64} height={44} rx={6} fill={COLORS.white} />
          <path d="M44 36 L60 46 L44 56 Z" fill={COLORS.red} />
          <rect x={38} y={72} width={24} height={6} rx={3} fill={COLORS.white} />
        </>
      ) : (
        <>
          <path d="M24 38 H76 L70 84 H30 Z" fill={COLORS.white} />
          <path d="M38 38 Q38 18 50 18 Q62 18 62 38" fill="none" stroke={COLORS.white} strokeWidth={6} />
        </>
      )}
    </svg>
  );
};

const Pie: React.FC<{ ana: React.ComponentProps<typeof Personaje>; pablo: React.ComponentProps<typeof Personaje>; foco?: "ana" | "pablo" | null }> = ({
  ana,
  pablo,
  foco = null,
}) => (
  <>
    <div style={{ opacity: foco === "pablo" ? 0.4 : 1 }}>
      <Personaje {...ANA} {...ana} />
    </div>
    <div style={{ opacity: foco === "ana" ? 0.4 : 1 }}>
      <Personaje {...PABLO} {...pablo} />
    </div>
  </>
);

const ESCENAS: DefEscena[] = [
  {
    id: "hook",
    render: () => (
      <Escena sinEntrada>
        <Partida />
        <Sfx s="impacto" volumen={0.5} />
        <Lado x={IZQ}>
          <Nombre texto="ANA" color={COLORS.red} />
          <Mas delay={-1} />
        </Lado>
        <Lado x={DER}>
          <Nombre texto="PABLO" color={COLORS.green} />
          <Mas delay={-1} />
        </Lado>
        <Pie ana={{ x: IZQ, y: SUELO_Y, expresion: "feliz", mirar: "der" }} pablo={{ x: DER, y: SUELO_Y, expresion: "feliz", mirar: "izq", pose: "saluda" }} />
      </Escena>
    ),
  },
  {
    id: "gancho2",
    render: () => {
      const G: React.FC = () => {
        const s = useSpring(0.2, 12, 0.6);
        return (
          <Escena>
            <Partida />
            <Rotulo texto="Dentro de **1 año**" size={56} />
            <Lado x={IZQ}>
              <Bote lleno={0} color={COLORS.red} top={430} />
              <div style={{ position: "absolute", top: 560, width: "100%", textAlign: "center", fontSize: 150, fontWeight: 900, color: COLORS.white, scale: String(s) }}>?</div>
            </Lado>
            <Lado x={DER}>
              <Bote lleno={0} color={COLORS.green} top={430} />
              <div style={{ position: "absolute", top: 560, width: "100%", textAlign: "center", fontSize: 150, fontWeight: 900, color: COLORS.white, scale: String(s) }}>?</div>
            </Lado>
            <Pie ana={{ x: IZQ, y: SUELO_Y, expresion: "pensativo", mirar: "der" }} pablo={{ x: DER, y: SUELO_Y, expresion: "pensativo", mirar: "izq" }} />
            <Sfx s="pop" volumen={0.35} en={0.2} />
          </Escena>
        );
      };
      return <G />;
    },
  },
  {
    id: "ana",
    render: () => (
      <Escena sonidoEntrada="swoosh">
        <Partida foco="ana" />
        <Lado x={IZQ}>
          <Nombre texto="ANA" color={COLORS.red} />
          <div style={{ position: "absolute", top: 560, left: 40, right: 40, height: 220, borderRadius: 30, border: `5px solid ${COLORS.white}`, background: `${COLORS.white}14`, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 18 }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.light }}>CUENTA</div>
          </div>
          <Mas delay={1.2} top={610} />
        </Lado>
        <Lado x={DER} apagado>
          <Nombre texto="PABLO" color={COLORS.green} />
        </Lado>
        <Monedas desde={[IZQ, 200]} hasta={[IZQ, 680]} inicio={0.1} />
        <Pie foco="ana" ana={{ x: IZQ, y: SUELO_Y, expresion: "feliz", pose: "brazos-arriba" }} pablo={{ x: DER, y: SUELO_Y, expresion: "neutral", mirar: "izq" }} />
      </Escena>
    ),
  },
  {
    id: "ana2",
    render: () => {
      const A: React.FC = () => {
        const t = useSeg();
        const queda = Math.max(0, 200 - Math.floor(interpolate(t, [0.3, 2.4], [0, 200], clamp)));
        return (
          <Escena sonidoEntrada={null}>
            <Partida foco="ana" />
            <Lado x={IZQ}>
              <Nombre texto="ANA" color={COLORS.red} />
              <div style={{ position: "absolute", top: 560, left: 40, right: 40, height: 220, borderRadius: 30, border: `5px solid ${COLORS.white}`, background: `${COLORS.white}14`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 96, fontWeight: 900, color: queda > 0 ? COLORS.gold : COLORS.red }}>
                  +{queda}
                  {NB}€
                </div>
                <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.light }}>CUENTA</div>
              </div>
            </Lado>
            <Lado x={DER} apagado>
              <Nombre texto="PABLO" color={COLORS.green} />
            </Lado>
            <Icono tipo="cena" x={130} y={420} delay={0.3} />
            <Icono tipo="suscripcion" x={290} y={380} delay={1.0} />
            <Icono tipo="capricho" x={450} y={420} delay={1.7} />
            <Monedas desde={[IZQ, 680]} hasta={[130, 420]} inicio={0.3} n={2} />
            <Monedas desde={[IZQ, 680]} hasta={[290, 380]} inicio={1.0} n={2} />
            <Monedas desde={[IZQ, 680]} hasta={[450, 420]} inicio={1.7} n={2} />
            {[0.3, 1.0, 1.7].map((s) => (
              <Sfx key={s} s="pop" volumen={0.3} en={s} />
            ))}
            <Pie foco="ana" ana={{ x: IZQ, y: SUELO_Y, expresion: t > 2.2 ? "preocupado" : "feliz", pose: t > 2.2 ? "encoge" : "quieto" }} pablo={{ x: DER, y: SUELO_Y, expresion: "neutral", mirar: "izq" }} />
          </Escena>
        );
      };
      return <A />;
    },
  },
  {
    id: "pablo",
    render: () => {
      const P: React.FC = () => {
        const t = useSeg();
        const lleno = interpolate(t, [1.2, 3.6], [0, 0.12], clamp);
        const flecha = useSpring(0.4, 12, 0.6);
        return (
          <Escena sonidoEntrada="swoosh">
            <Partida foco="pablo" />
            <Lado x={IZQ} apagado>
              <Nombre texto="ANA" color={COLORS.red} />
            </Lado>
            <Lado x={DER}>
              <Nombre texto="PABLO" color={COLORS.green} />
              <div style={{ position: "absolute", top: 360, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
                <div style={{ fontSize: 40, fontWeight: 900, color: COLORS.navy, background: COLORS.white, borderRadius: 18, padding: "10px 18px", textAlign: "center", scale: String(flecha), lineHeight: 1.1 }}>
                  Transferencia automática
                  <br />
                  <span style={{ color: COLORS.green, fontSize: 60 }}>+100{NB}€/mes</span>
                </div>
              </div>
              <Bote lleno={lleno} color={COLORS.green} top={560} />
            </Lado>
            <Monedas desde={[DER, 420]} hasta={[DER, 720]} inicio={1.2} n={5} />
            <Sfx s="pop" volumen={0.35} en={0.4} />
            <Sfx s="swoosh" volumen={0.25} en={1.2} />
            <Pie foco="pablo" ana={{ x: IZQ, y: SUELO_Y, expresion: "neutral", mirar: "der" }} pablo={{ x: DER, y: SUELO_Y, expresion: "feliz", pose: "senala", mirar: "izq" }} />
          </Escena>
        );
      };
      return <P />;
    },
  },
  {
    id: "rehook",
    render: () => (
      <Escena sonidoEntrada={null}>
        <Partida foco="pablo" />
        <Lado x={IZQ} apagado>
          <Nombre texto="ANA" color={COLORS.red} />
        </Lado>
        <Lado x={DER}>
          <Nombre texto="PABLO" color={COLORS.green} />
          <Mas delay={0.2} texto={`+100${NB}€ libres`} color={COLORS.gold} top={400} size={64} />
          <Bote lleno={0.12} color={COLORS.green} top={560} />
        </Lado>
        <Chispas en={0.5} x={DER} y={700} color={COLORS.gold} n={24} />
        <Sfx s="pop" volumen={0.35} en={0.2} />
        <Sfx s="riser" volumen={0.35} en={Math.max(0, 3.8 - 1.3)} />
        <Pie foco="pablo" ana={{ x: IZQ, y: SUELO_Y, expresion: "neutral", mirar: "der" }} pablo={{ x: DER, y: SUELO_Y, expresion: "feliz", pose: "brazos-arriba", salto: 0.5 }} />
      </Escena>
    ),
  },
  {
    id: "wow",
    render: () => {
      const W: React.FC = () => {
        const t = useSeg();
        const mes = Math.min(12, Math.max(1, Math.ceil(interpolate(t, [0.1, 2.4], [0.01, 12], clamp))));
        const lleno = interpolate(t, [0.1, 2.4], [0.12, 1], clamp);
        return (
          <Escena sacudidas={[2.4]} sonidoEntrada="impacto">
            <Partida />
            <div style={{ position: "absolute", top: 240, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
              <div style={{ fontSize: 56, fontWeight: 900, color: COLORS.navy, background: COLORS.white, borderRadius: 20, padding: "6px 30px" }}>Mes {mes}</div>
            </div>
            <Lado x={IZQ}>
              <Bote lleno={0} color={COLORS.red} top={380} />
              <div style={{ position: "absolute", top: 760, width: "100%", display: "flex", justifyContent: "center" }}>
                <Cifra a={0} de={0} formato={eur} size={110} color={COLORS.red} ticks={false} />
              </div>
            </Lado>
            <Lado x={DER}>
              <Bote lleno={lleno} color={COLORS.green} top={380} />
              <div style={{ position: "absolute", top: 760, width: "100%", display: "flex", justifyContent: "center" }}>
                <Cifra a={1200} de={100} inicio={0.1} fin={2.4} formato={eur} size={110} color={COLORS.green} />
              </div>
            </Lado>
            <div style={{ position: "absolute", top: 900, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
              <Pildora delay={0.3} bg={COLORS.navy}>
                Ejemplo · 100{NB}€/mes × 12 · sin intereses
              </Pildora>
            </div>
            <Chispas en={2.4} x={DER} y={820} color={COLORS.green} />
            <Sfx s="ding" volumen={0.4} en={2.4} />
            <Pie ana={{ x: IZQ, y: SUELO_Y, expresion: "triste", mirar: "der" }} pablo={{ x: DER, y: SUELO_Y, expresion: t > 2.4 ? "sorpresa" : "feliz", salto: 2.4, pose: t > 2.4 ? "brazos-arriba" : "quieto" }} />
          </Escena>
        );
      };
      return <W />;
    },
  },
  {
    id: "clave",
    render: () => (
      <Escena>
        <Partida />
        <Lado x={IZQ}>
          <Mas delay={0.1} />
          <Bote lleno={0} color={COLORS.red} top={580} etiqueta="0 €" />
        </Lado>
        <Lado x={DER}>
          <Mas delay={0.1} />
          <Bote lleno={1} color={COLORS.green} top={580} etiqueta={`1.200${NB}€`} />
        </Lado>
        <Rotulo texto="La clave: **el primer mes**" delay={1.0} size={58} />
        <Sfx s="pop" volumen={0.35} en={1.0} />
        <Pie ana={{ x: IZQ, y: SUELO_Y, expresion: "pensativo", mirar: "der" }} pablo={{ x: DER, y: SUELO_Y, expresion: "feliz", mirar: "izq", pose: "senala" }} />
      </Escena>
    ),
  },
  {
    id: "cta",
    subtitulosClaros: true,
    render: () => <CtaCrecer tipo="compartir" boton="MÁNDASELO" linea="A quien acaba de tener **una subida**" />,
  },
  {
    id: "cierre",
    subtitulos: false,
    render: () => (
      <Escena>
        <Partida />
        <Rotulo texto="¿Serás **Ana** o **Pablo**?" />
        <Pie ana={{ x: IZQ, y: 1150, expresion: "neutral", mirar: "der", pose: "encoge" }} pablo={{ x: DER, y: 1150, expresion: "feliz", mirar: "izq", pose: "saluda" }} />
        <div style={{ position: "absolute", top: 1330, left: 90, right: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: 6, color: COLORS.white }}>
            ALIGN <span style={{ fontWeight: 500, color: COLORS.light }}>by ADB</span>
          </div>
          <div style={{ fontSize: 28, color: COLORS.light }}>Contenido informativo, no es asesoramiento financiero.</div>
        </div>
      </Escena>
    ),
  },
];

export const W4805: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4805} pista="long-day.mp3" /> : null;
