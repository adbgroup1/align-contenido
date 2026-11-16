import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, euros } from "../brand";
import {
  Chispas,
  Cifra,
  Cristal,
  CtaCrecer,
  DefEscena,
  Escena,
  Foto,
  Lluvia,
  Montaje,
  Palabras,
  Pildora,
  PropsVoz,
  Sfx,
  useSpring,
  Zona,
} from "../kit";

// W47-01 v2 · «El colchón no es tu cuenta corriente» · CTA GUARDAR
// Kit v2 + imágenes del tarro (public/img/W47-01/, las mismas de EJ-colchon).
// Dato: 36,4 % de las personas no puede afrontar un gasto imprevisto (INE, ECV 2025, nota del 5 feb 2026).
// Ejemplo hipotético: gastos de 1.200 €/mes → 3.600–7.200 €.
const IMG = (n: string) => `img/W47-01/${n}.jpg`;
const GASTO_MES = 1200;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const EXTRA_W4701: Record<string, number> = { dato: 0.6, wow: 0.8, cta: 0.8, cierre: 0.8 };

const Arriba: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 26 }) => (
  <Zona top={250} bottom={1050} justify="flex-start" gap={gap}>
    {children}
  </Zona>
);

/* Tarjeta de cuenta con saldo que baja (o sube) */
const Cuenta: React.FC<{ nombre: string; de: number; a: number; color: string; inicio?: number; fin?: number; candado?: boolean; delay?: number; desde?: "izq" | "der" | "abajo" }> = ({
  nombre,
  de,
  a,
  color,
  inicio = 0.4,
  fin = 1.8,
  candado = false,
  delay = 0,
  desde = "abajo",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = interpolate(frame, [inicio * fps, fin * fps], [de, a], clamp);
  return (
    <Cristal color={color} w={820} desde={desde} delay={delay}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", fontSize: 42, fontWeight: 800, color: COLORS.light }}>
        <span>{nombre}</span>
        {candado ? <Candado color={color} /> : null}
      </div>
      <div style={{ fontSize: 110, fontWeight: 900, color, fontVariantNumeric: "tabular-nums" }}>{euros(Math.round(v / 10) * 10)}</div>
    </Cristal>
  );
};

const Candado: React.FC<{ color: string }> = ({ color }) => (
  <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2.5" fill={`${color}33`} />
    <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    <circle cx="12" cy="16" r="1.4" fill={color} />
  </svg>
);

const ESCENAS: DefEscena[] = [
  { id: "hook", render: () => <Hook /> },
  {
    id: "gasto",
    render: () => (
      <Escena fondo="azul" sonidoEntrada="swoosh">
        <Zona gap={40}>
          <Palabras texto="Si no está **separado,**" size={96} resalta={COLORS.gold} />
          <Palabras texto="no es colchón:" size={96} delay={0.5} />
          <Palabras texto="**es gasto.**" size={130} delay={1.0} resalta={COLORS.red} />
        </Zona>
        <Sfx s="impacto" volumen={0.4} en={1.0} />
      </Escena>
    ),
  },
  { id: "dato", render: () => <Dato /> },
  {
    id: "paso1",
    render: () => (
      <Escena fondo="noche" sonidoEntrada="whoosh">
        <Zona gap={34} bottom={700}>
          <Pildora bg="rgba(34,197,94,0.18)" color={COLORS.green}>PASO 1</Pildora>
          <Palabras texto="Una cuenta **aparte**" size={100} resalta={COLORS.green} />
          <Cuenta nombre="Cuenta corriente · gastos" de={1400} a={1400} color={COLORS.light} desde="izq" delay={0.3} />
          <Cuenta nombre="Cuenta colchón" de={0} a={1200} inicio={1.0} fin={2.2} color={COLORS.green} candado desde="der" delay={0.6} />
        </Zona>
        <Sfx s="click" volumen={0.4} en={1.0} />
      </Escena>
    ),
  },
  {
    id: "rehook",
    render: () => (
      <Escena fondo="azul" sacudidas={[0.4]} sonidoEntrada="impacto">
        <Zona gap={36}>
          <Pildora bg="rgba(245,197,66,0.2)" color={COLORS.gold}>PASO 2</Pildora>
          <Palabras texto="¿Cuánto tiene que **haber?**" size={120} resalta={COLORS.gold} />
        </Zona>
      </Escena>
    ),
  },
  { id: "wow", render: ({ dur }) => <Wow dur={dur} /> },
  {
    id: "usos",
    render: () => (
      <Escena sonidoEntrada="swoosh">
        <Foto src={IMG("02-imprevistos")} zoom={[1.0, 1.12]} subir={30} />
        <Lluvia />
        <Arriba gap={14}>
          <Palabras texto="Solo se toca si hay:" size={80} />
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", maxWidth: 960 }}>
            <Pildora size={50} delay={0.6}>Avería</Pildora>
            <Pildora size={50} delay={1.0}>Despido</Pildora>
            <Pildora size={50} delay={1.4}>Médico</Pildora>
          </div>
          <Palabras texto="Las rebajas **no.**" size={70} delay={2.0} resalta={COLORS.red} />
        </Arriba>
        <Sfx s="pop" volumen={0.3} en={0.6} />
        <Sfx s="pop" volumen={0.3} en={1.0} />
        <Sfx s="pop" volumen={0.3} en={1.4} />
      </Escena>
    ),
  },
  {
    id: "repones",
    render: () => (
      <Escena sonidoEntrada="whoosh">
        <Foto src={IMG("03-llenando")} zoom={[1.12, 1.0]} subir={-20} />
        <Arriba gap={22}>
          <Palabras texto="Si lo usas, **lo repones primero.**" size={88} resalta={COLORS.green} />
          <div style={{ display: "flex", gap: 20 }}>
            <Pildora bg="rgba(34,197,94,0.2)" color={COLORS.green} size={44} delay={0.8}>1. Reponer</Pildora>
            <Pildora size={44} delay={1.1}>2. Todo lo demás</Pildora>
          </div>
        </Arriba>
        <Sfx s="ding" volumen={0.35} en={0.8} />
      </Escena>
    ),
  },
  {
    id: "cta",
    subtitulosClaros: true,
    render: () => <CtaCrecer tipo="guardar" boton="GUÁRDALO" linea="y monta **tu colchón** este mes" />,
  },
  {
    id: "cierre",
    subtitulos: false,
    render: () => (
      <Escena sonidoEntrada="whoosh">
        <Foto src={IMG("04-crece")} zoom={[1.15, 1.0]} />
        <Arriba gap={24}>
          <Palabras texto="Tu colchón: **separado**" size={88} resalta={COLORS.green} />
          <Palabras texto="y fuera de tu cuenta corriente." size={66} delay={0.6} color={COLORS.light} />
        </Arriba>
        <Zona top={1300} bottom={300} gap={12}>
          <div style={{ fontSize: 60, fontWeight: 900, letterSpacing: 6, color: COLORS.white }}>
            ALIGN <span style={{ fontWeight: 500, color: COLORS.light }}>by ADB</span>
          </div>
          <div style={{ fontSize: 28, color: COLORS.light }}>Contenido informativo, no es asesoramiento financiero.</div>
        </Zona>
      </Escena>
    ),
  },
];

const Hook = () => {
  const gastos = ["Alquiler", "Súper", "Cena"];
  return (
    <Escena sinEntrada sacudidas={[0.9]}>
      <Foto src={IMG("01-hucha")} zoom={[1.18, 1.02]} />
      <Sfx s="impacto" volumen={0.5} />
      <Arriba gap={22}>
        <Palabras texto="Tu colchón **no puede estar**" size={92} stagger={0.05} resalta={COLORS.red} />
        <Palabras texto="en tu cuenta corriente" size={80} delay={0.5} />
        <div style={{ display: "flex", gap: 18, marginTop: 6 }}>
          {gastos.map((g, i) => (
            <Pildora key={g} bg="rgba(248,113,113,0.18)" color={COLORS.red} size={44} delay={0.9 + i * 0.25}>
              − {g}
            </Pildora>
          ))}
        </div>
      </Arriba>
      <Sfx s="pop" volumen={0.3} en={0.9} />
      <Sfx s="pop" volumen={0.3} en={1.15} />
      <Sfx s="pop" volumen={0.3} en={1.4} />
    </Escena>
  );
};

const Dato = () => {
  const s = useSpring(1.6, 12, 0.7);
  return (
    <Escena fondo="noche" sonidoEntrada="whoosh">
      <Zona gap={30}>
        <Palabras texto="Más de **1 de cada 3** personas" size={84} resalta={COLORS.gold} />
        <Cifra a={36.4} de={0} inicio={0.4} fin={1.5} size={220} formato={(v) => `${v.toFixed(1).replace(".", ",")} %`} />
        <Palabras texto="no puede pagar **un imprevisto**" size={64} delay={1.2} resalta={COLORS.red} />
        <div style={{ scale: String(s) }}>
          <Pildora size={34}>Fuente: INE, Encuesta de Condiciones de Vida 2025</Pildora>
        </div>
      </Zona>
    </Escena>
  );
};

const Wow: React.FC<{ dur: number }> = ({ dur }) => {
  return (
    <Escena sonidoEntrada="whoosh" sacudidas={[1.6]}>
      <Foto src={IMG("03-llenando")} zoom={[1.0, 1.14]} subir={20} />
      <Sfx s="ding" volumen={0.4} en={1.6} />
      <Arriba gap={18}>
        <Palabras texto="De **3 a 6 meses** de tus gastos" size={84} resalta={COLORS.gold} />
        <Pildora delay={0.5} size={38}>Ejemplo: gastas {euros(GASTO_MES)} al mes</Pildora>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <Cifra a={GASTO_MES * 3} de={0} inicio={0.8} fin={1.5} size={108} formato={(v) => euros(Math.round(v / 100) * 100)} ticks={false} />
          <span style={{ fontSize: 80, fontWeight: 900, color: COLORS.white }}>–</span>
          <Cifra a={GASTO_MES * 6} de={GASTO_MES * 3} inicio={1.5} fin={2.3} size={108} formato={(v) => euros(Math.round(v / 100) * 100)} />
        </div>
      </Arriba>
      <Chispas en={Math.min(2.3, dur / 30 - 0.5)} x={540} y={600} color={COLORS.gold} />
    </Escena>
  );
};

export const W4701v2: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4701} pista="lofi-polaroids.mp3" /> : null;
