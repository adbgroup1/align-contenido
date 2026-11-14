import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { contributed, euros, futureValue } from "./brand";

const Disclaimer = () => (
  <Interactive.Div
    name="Aviso"
    style={{
      position: "absolute",
      bottom: 120,
      left: 90,
      right: 90,
      fontSize: 26,
      lineHeight: 1.35,
      color: "#64748B",
      textAlign: "center",
    }}
  >
    Ejemplo ilustrativo: 7 % anual hipotético, sin comisiones ni impuestos.
    Rentabilidades pasadas no garantizan rentabilidades futuras.
  </Interactive.Div>
);

/* ---------- 1. Gancho ---------- */
const HookInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <Interactive.Div
        name="Etiqueta"
        style={{
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: 6,
          color: "#C7D7FE",
          marginBottom: 40,
          opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        ALIGN · FINANZAS FÁCILES
      </Interactive.Div>
      <Interactive.Div
        name="Pregunta línea 1"
        style={{
          fontSize: 110,
          fontWeight: 800,
          color: "#FFFFFF",
          lineHeight: 1.05,
          textAlign: "center",
          opacity: interpolate(frame, [0.2 * fps, 0.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [0.2 * fps, 0.8 * fps],
            ["0px 60px", "0px 0px"],
            {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
        }}
      >
        ¿Y si inviertes
      </Interactive.Div>
      <Interactive.Div
        name="Pregunta línea 2"
        style={{
          fontSize: 120,
          whiteSpace: "nowrap",
          fontWeight: 900,
          color: "#FFFFFF",
          backgroundColor: "#1D4ED8",
          padding: "10px 40px",
          borderRadius: 28,
          marginTop: 30,
          rotate: "-2deg",
          scale: interpolate(frame, [0.7 * fps, 1.2 * fps], [0, 1], {
            easing: Easing.spring({ damping: 12 }),
            output: "perceptual-scale",
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        100 € al mes?
      </Interactive.Div>
    </>
  );
};

export const Hook = Interactive.create({
  Component: HookInner,
  layout: "absolute-fill",
  schema: { ...Interactive.backgroundSchema },
});

/* ---------- 2. Contador ---------- */
const BigCounter = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const value = interpolate(frame, [0.6 * fps, 4.5 * fps], [0, futureValue(30)], {
    easing: Easing.bezier(0.3, 0, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        fontSize: 170,
        fontWeight: 900,
        color: "#FFFFFF",
        whiteSpace: "nowrap",
        fontVariantNumeric: "tabular-nums",
        letterSpacing: -4,
      }}
    >
      {euros(Math.round(value / 100) * 100)}
    </div>
  );
};

const CounterInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <Interactive.Div
        name="Intro contador"
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: "#C7D7FE",
          marginBottom: 20,
        }}
      >
        En 30 años tendrías
      </Interactive.Div>
      <BigCounter />
      <Interactive.Div
        name="Aportado"
        style={{
          fontSize: 60,
          fontWeight: 600,
          color: "#FFFFFF",
          marginTop: 50,
          padding: "18px 36px",
          borderRadius: 999,
          border: "3px solid #3B5BDB",
          opacity: interpolate(frame, [4.6 * fps, 5.1 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [4.6 * fps, 5.2 * fps],
            ["0px 40px", "0px 0px"],
            {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
        }}
      >
        y tú solo habrías puesto <b>{euros(contributed(30))}</b>
      </Interactive.Div>
      <Disclaimer />
    </>
  );
};

export const Counter = Interactive.create({
  Component: CounterInner,
  layout: "absolute-fill",
  schema: { ...Interactive.backgroundSchema },
});

/* ---------- 3. Gráfico ---------- */
const BAR_MAX_HEIGHT = 800;

const Bar = ({ years, delay }: { years: number; delay: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = futureValue(years);
  const max = futureValue(30);
  const grow = interpolate(
    frame,
    [delay * fps, (delay + 1.2) * fps],
    [0, 1],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const totalH = (total / max) * BAR_MAX_HEIGHT * grow;
  const ownH = (contributed(years) / max) * BAR_MAX_HEIGHT * grow;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        width: 230,
        height: BAR_MAX_HEIGHT + 220,
      }}
    >
      <div
        style={{
          fontSize: 46,
          fontWeight: 800,
          color: "#FFFFFF",
          marginBottom: 16,
          opacity: grow,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {euros(Math.round(total / 100) * 100)}
      </div>
      <div
        style={{
          width: 200,
          height: totalH,
          borderRadius: "22px 22px 0 0",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          backgroundColor: "#1D4ED8",
        }}
      >
        <div style={{ height: ownH, backgroundColor: "#C7D7FE" }} />
      </div>
      <div
        style={{
          fontSize: 44,
          fontWeight: 700,
          color: "#C7D7FE",
          marginTop: 24,
        }}
      >
        {years} años
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <div
      style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: color }}
    />
    <span style={{ fontSize: 40, color: "#FFFFFF", fontWeight: 600 }}>
      {label}
    </span>
  </div>
);

const ChartInner = () => {
  return (
    <>
      <Interactive.Div
        name="Título gráfico"
        style={{
          position: "absolute",
          top: 180,
          left: 90,
          right: 90,
          fontSize: 92,
          fontWeight: 800,
          color: "#FFFFFF",
          lineHeight: 1.05,
          textAlign: "center",
        }}
      >
        El secreto no es cuánto.
        <br />
        <span style={{ color: "#7C9BFF" }}>Es cuánto tiempo.</span>
      </Interactive.Div>
      <div
        style={{
          position: "absolute",
          top: 540,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 70,
        }}
      >
        <LegendItem color="#C7D7FE" label="Lo que pones" />
        <LegendItem color="#1D4ED8" label="Lo que gana" />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 280,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: 60,
        }}
      >
        <Bar years={10} delay={0.4} />
        <Bar years={20} delay={1.4} />
        <Bar years={30} delay={2.4} />
      </div>
      <Disclaimer />
    </>
  );
};

export const Chart = Interactive.create({
  Component: ChartInner,
  layout: "absolute-fill",
  schema: { ...Interactive.backgroundSchema },
});

/* ---------- 4. Idea clave ---------- */
const InsightInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <Interactive.Div
        name="Porcentaje"
        style={{
          fontSize: 380,
          fontWeight: 900,
          color: "#FFFFFF",
          letterSpacing: -10,
          lineHeight: 1,
          scale: interpolate(frame, [0, 0.5 * fps], [0.6, 1], {
            easing: Easing.spring({ damping: 14 }),
            output: "perceptual-scale",
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        70 %
      </Interactive.Div>
      <Interactive.Div
        name="Explicación"
        style={{
          fontSize: 76,
          fontWeight: 700,
          color: "#FFFFFF",
          textAlign: "center",
          lineHeight: 1.15,
          marginTop: 40,
          paddingLeft: 90,
          paddingRight: 90,
          opacity: interpolate(frame, [0.5 * fps, 1 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        de ese dinero lo pone el interés compuesto.
        <br />
        <span style={{ color: "#C7D7FE" }}>No tú.</span>
      </Interactive.Div>
    </>
  );
};

export const Insight = Interactive.create({
  Component: InsightInner,
  layout: "absolute-fill",
  schema: { ...Interactive.backgroundSchema },
});

/* ---------- 5. Llamada a la acción ---------- */
const CtaInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <Interactive.Div
        name="CTA título"
        style={{
          fontSize: 104,
          fontWeight: 800,
          color: "#0F172A",
          textAlign: "center",
          lineHeight: 1.05,
          paddingLeft: 90,
          paddingRight: 90,
        }}
      >
        No necesitas saber de finanzas.
        <br />
        <span style={{ color: "#1D4ED8" }}>Solo el sistema correcto.</span>
      </Interactive.Div>
      <Interactive.Div
        name="CTA botón"
        style={{
          marginTop: 80,
          fontSize: 48,
          whiteSpace: "nowrap",
          fontWeight: 700,
          color: "#FFFFFF",
          backgroundColor: "#1D4ED8",
          padding: "30px 56px",
          borderRadius: 999,
          scale: interpolate(frame, [0.6 * fps, 1.1 * fps], [0, 1], {
            easing: Easing.spring({ damping: 12 }),
            output: "perceptual-scale",
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Comenta la palabra · te lo mando por DM
      </Interactive.Div>
      <Interactive.Div
        name="Marca"
        style={{
          marginTop: 70,
          fontSize: 52,
          fontWeight: 900,
          letterSpacing: 4,
          color: "#0F172A",
        }}
      >
        ALIGN <span style={{ fontWeight: 500, color: "#64748B" }}>by ADB</span>
      </Interactive.Div>
      <Interactive.Div
        name="Aviso legal"
        style={{
          position: "absolute",
          bottom: 110,
          left: 90,
          right: 90,
          fontSize: 24,
          lineHeight: 1.35,
          color: "#64748B",
          textAlign: "center",
        }}
      >
        Contenido informativo, no es asesoramiento financiero.
      </Interactive.Div>
    </>
  );
};

export const Cta = Interactive.create({
  Component: CtaInner,
  layout: "absolute-fill",
  schema: { ...Interactive.backgroundSchema },
});
