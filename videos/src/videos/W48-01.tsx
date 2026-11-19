import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../brand";
import {
  Chispas,
  Cristal,
  CtaCrecer,
  DefEscena,
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

// W48-01 · «Black Friday: la regla de las 48 horas» · CTA GUARDAR
// Sin cifras externas: 50 € y 100 € son un ejemplo (píldora «Ejemplo»).
const IMG = (n: string) => `img/W48-01/${n}.jpg`;
const DESCUENTO = COLORS.gold;
const GASTO = COLORS.accent;

export const EXTRA_W4801: Record<string, number> = { hook: 0.2, wow: 1.0, falta: 0.3, cta: 0.7, cierre: 0.8 };

const Arriba: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 26 }) => (
  <Zona top={250} bottom={1050} justify="flex-start" gap={gap}>
    {children}
  </Zona>
);

/* Balanza A/B: «−50 € descuento» (gold) contra «100 € gastados» (accent). Cae del lado de los 100 €. */
const Balanza: React.FC<{ inicio?: number; fin?: number; escala?: number }> = ({ inicio = 0.3, fin = 1.2, escala = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [inicio * fps, fin * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rebote = Math.sin(Math.min(1, p) * Math.PI * 3) * (1 - p) * 4;
  const ang = 14 * p + rebote; // grados: baja el lado derecho (100 €)
  const L = 280; // medio brazo
  const rad = (ang * Math.PI) / 180;
  const dy = Math.sin(rad) * L;
  const Plato: React.FC<{ color: string; cifra: string; etiqueta: string; lado: -1 | 1; peso: number }> = ({
    color,
    cifra,
    etiqueta,
    lado,
    peso,
  }) => (
    <div
      style={{
        position: "absolute",
        left: 450 + lado * Math.cos(rad) * L - 140,
        top: 120 + lado * dy,
        width: 280,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: 4, height: 90, backgroundColor: COLORS.light, opacity: 0.6 }} />
      <div
        style={{
          width: 280,
          height: 150 + peso * 40,
          borderRadius: "24px 24px 60px 60px",
          background: `linear-gradient(170deg, ${color}55, ${color}22)`,
          border: `4px solid ${color}`,
          boxShadow: `0 0 50px ${color}55`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: 78, fontWeight: 900, color, lineHeight: 1, whiteSpace: "nowrap" }}>{cifra}</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: COLORS.white, marginTop: 8 }}>{etiqueta}</div>
      </div>
    </div>
  );
  return (
    <div style={{ position: "relative", width: 900, height: 560, scale: String(escala) }}>
      {/* pie */}
      <div style={{ position: "absolute", left: 440, top: 120, width: 20, height: 380, backgroundColor: COLORS.light, borderRadius: 10 }} />
      <div style={{ position: "absolute", left: 330, top: 490, width: 240, height: 26, backgroundColor: COLORS.light, borderRadius: 13 }} />
      {/* brazo */}
      <div
        style={{
          position: "absolute",
          left: 450 - L - 10,
          top: 110,
          width: 2 * L + 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: COLORS.white,
          rotate: `${ang}deg`,
          boxShadow: `0 0 30px ${COLORS.light}66`,
        }}
      />
      <div style={{ position: "absolute", left: 430, top: 100, width: 40, height: 40, borderRadius: 99, backgroundColor: COLORS.gold }} />
      <Plato color={DESCUENTO} cifra="−50 €" etiqueta="de descuento" lado={-1} peso={0} />
      <Plato color={GASTO} cifra="100 €" etiqueta="gastados" lado={1} peso={1} />
    </div>
  );
};

/* Lluvia de etiquetas de oferta que caen y rebotan */
const ETIQUETAS = [
  { t: "−30 %", x: 120, d: 0.2, r: -12 },
  { t: "−50 %", x: 520, d: 0.45, r: 10 },
  { t: "−70 %", x: 300, d: 0.75, r: -6 },
  { t: "−40 %", x: 590, d: 1.0, r: 14 },
  { t: "−60 %", x: 40, d: 1.25, r: 8 },
  { t: "−20 %", x: 470, d: 1.5, r: -14 },
];
const LluviaEtiquetas = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "relative", width: 870, height: 640, overflow: "hidden" }}>
      {ETIQUETAS.map((e, i) => {
        const t = frame / fps - e.d;
        if (t < 0) return null;
        // caída con rebote
        const suelo = 420 - (i % 3) * 150;
        const g = 4200;
        const tc = Math.sqrt((2 * (suelo + 300)) / g);
        let y: number;
        if (t < tc) y = -300 + 0.5 * g * t * t;
        else {
          const tb = t - tc;
          const v = g * tc * 0.35;
          y = suelo - Math.max(0, v * tb - 0.5 * g * tb * tb);
        }
        const rojo = i % 2 === 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: e.x,
              top: y,
              rotate: `${e.r + Math.sin(frame / 7 + i) * 4}deg`,
              fontSize: 76,
              fontWeight: 900,
              color: rojo ? COLORS.white : COLORS.navy,
              backgroundColor: rojo ? COLORS.red : COLORS.gold,
              padding: "14px 34px",
              borderRadius: 22,
              boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
              whiteSpace: "nowrap",
            }}
          >
            {e.t}
          </div>
        );
      })}
    </div>
  );
};

/* Cuenta atrás roja que parpadea */
const CuentaAtras = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = 2 * 3600 + 59 * 60 + 59 - Math.floor((frame / fps) * 7); // va deprisa: presión
  const hh = String(Math.floor(total / 3600)).padStart(2, "0");
  const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  const parpadeo = Math.floor(frame / 8) % 2 === 0 ? 1 : 0.55;
  const s = useSpring(0.1, 10, 0.7);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        padding: "30px 50px",
        borderRadius: 36,
        border: `5px solid ${COLORS.red}`,
        backgroundColor: "rgba(248,113,113,0.12)",
        boxShadow: `0 0 ${40 + 30 * parpadeo}px ${COLORS.red}88`,
        scale: String(0.6 + 0.4 * s),
        opacity: s,
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.red, letterSpacing: 4 }}>TERMINA EN</div>
      <div style={{ fontSize: 130, fontWeight: 900, color: COLORS.white, opacity: parpadeo, fontVariantNumeric: "tabular-nums", letterSpacing: -4 }}>
        {hh}:{mm}:{ss}
      </div>
    </div>
  );
};

/* Calendario que salta de lunes a viernes */
const DIAS = ["LUN", "MAR", "MIÉ", "JUE", "VIE"];
const Calendario = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const idx = Math.min(4, Math.max(0, Math.floor((frame / fps - 0.4) / 0.35)));
  const s = useSpring(0, 12, 0.7);
  return (
    <div style={{ display: "flex", gap: 18, opacity: s, translate: `0px ${(1 - s) * 80}px` }}>
      {DIAS.map((d, i) => {
        const activo = i === idx;
        const lunes = i === 0;
        return (
          <div
            key={d}
            style={{
              width: 150,
              height: 170,
              borderRadius: 26,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: activo ? (idx === 4 ? COLORS.red : COLORS.accent) : "rgba(255,255,255,0.08)",
              border: `3px solid ${lunes ? COLORS.gold : "rgba(255,255,255,0.2)"}`,
              scale: activo ? "1.12" : "1",
              boxShadow: activo ? `0 0 40px ${idx === 4 ? COLORS.red : COLORS.accent}99` : undefined,
            }}
          >
            <div style={{ fontSize: 40, fontWeight: 900, color: COLORS.white }}>{d}</div>
            <div style={{ fontSize: 54, fontWeight: 900, color: activo ? COLORS.white : COLORS.light }}>{23 + i}</div>
          </div>
        );
      })}
    </div>
  );
};

const Interrogante = () => {
  const frame = useCurrentFrame();
  const s = useSpring(1.6, 8, 0.8);
  return (
    <div
      style={{
        fontSize: 300,
        fontWeight: 900,
        lineHeight: 0.9,
        color: COLORS.gold,
        scale: String(s),
        rotate: `${Math.sin(frame / 8) * 6}deg`,
        filter: `drop-shadow(0 0 50px ${COLORS.gold}88)`,
      }}
    >
      ?
    </div>
  );
};

/* Reloj grande con agujas que giran rápido */
const Reloj = () => {
  const frame = useCurrentFrame();
  const s = useSpring(0.1, 10, 0.8);
  const vueltas = frame * 18;
  return (
    <div style={{ position: "relative", width: 460, height: 460, scale: String(0.3 + 0.7 * s), opacity: s }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 999,
          border: `14px solid ${COLORS.accent}`,
          background: `radial-gradient(circle at 40% 35%, ${COLORS.blue}55, ${COLORS.navy})`,
          boxShadow: `0 0 80px ${COLORS.accent}77`,
        }}
      />
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 225,
            top: 30,
            width: 10,
            height: 34,
            borderRadius: 5,
            backgroundColor: COLORS.light,
            transformOrigin: "5px 200px",
            rotate: `${i * 30}deg`,
          }}
        />
      ))}
      <div style={{ position: "absolute", left: 222, top: 90, width: 16, height: 140, borderRadius: 8, backgroundColor: COLORS.white, transformOrigin: "8px 140px", rotate: `${vueltas}deg` }} />
      <div style={{ position: "absolute", left: 220, top: 140, width: 20, height: 90, borderRadius: 10, backgroundColor: COLORS.gold, transformOrigin: "10px 90px", rotate: `${vueltas / 12}deg` }} />
      <div style={{ position: "absolute", left: 210, top: 210, width: 40, height: 40, borderRadius: 99, backgroundColor: COLORS.gold }} />
    </div>
  );
};

/* Sello verde ✓ */
const SelloOk = () => {
  const s = useSpring(0.9, 9, 0.7);
  return (
    <div
      style={{
        width: 230,
        height: 230,
        borderRadius: 999,
        border: `12px solid ${COLORS.green}`,
        color: COLORS.green,
        fontSize: 150,
        fontWeight: 900,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        rotate: `${-12 + (1 - s) * 30}deg`,
        scale: String(2.2 - 1.2 * s),
        opacity: Math.min(1, s * 2),
        backgroundColor: "rgba(34,197,94,0.12)",
        boxShadow: `0 0 50px ${COLORS.green}88`,
      }}
    >
      ✓
    </div>
  );
};

/* Paquete dibujado en código */
const Paquete = () => (
  <div style={{ position: "relative", width: 200, height: 160 }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 18, backgroundColor: COLORS.light, boxShadow: `0 20px 50px rgba(0,0,0,0.4)` }} />
    <div style={{ position: "absolute", left: 88, top: 0, width: 24, height: 160, backgroundColor: COLORS.blue }} />
    <div style={{ position: "absolute", left: 0, top: 68, width: 200, height: 24, backgroundColor: COLORS.blue }} />
  </div>
);

/* Hook visible entero desde el fotograma 0 (sin animación de entrada), con un pulso suave */
const TituloHook = () => {
  const frame = useCurrentFrame();
  const pulso = 1 + 0.02 * Math.sin(frame / 6);
  return (
    <div style={{ fontSize: 88, fontWeight: 900, lineHeight: 1.08, color: COLORS.white, textAlign: "center", maxWidth: 870, textShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>
      Ahorrar 50 € gastando 100 €{" "}
      <span style={{ color: COLORS.gold, display: "inline-block", scale: String(pulso) }}>no es ahorrar</span>
    </div>
  );
};

const ESCENAS: DefEscena[] = [
  {
    id: "hook",
    render: () => (
      <Escena sinEntrada sacudidas={[1.2]}>
        <Sfx s="impacto" volumen={0.5} />
        <Zona top={250} bottom={560} gap={30} justify="flex-start">
          <TituloHook />
          <Pildora>Ejemplo</Pildora>
          <Balanza inicio={0.4} fin={1.2} escala={0.95} />
        </Zona>
      </Escena>
    ),
  },
  {
    id: "gancho2",
    render: () => (
      <Escena fondo="azul" sonidoEntrada="swoosh">
        <Sfx s="pop" volumen={0.35} en={0.45} />
        <Sfx s="pop" volumen={0.35} en={1.5} />
        <Zona top={250} bottom={560} gap={20} justify="flex-start">
          <Palabras texto="**Viernes 27:** ofertas por todas partes" size={84} />
          <LluviaEtiquetas />
        </Zona>
      </Escena>
    ),
  },
  {
    id: "prisa",
    render: () => (
      <Escena luz="#7F1D1D">
        <Zona gap={50}>
          <Palabras texto="El descuento no es la trampa." size={76} color={COLORS.light} />
          <Palabras texto="**La prisa, sí.**" size={120} resalta={COLORS.red} delay={1.1} />
          <CuentaAtras />
        </Zona>
      </Escena>
    ),
  },
  {
    id: "lunes",
    render: () => (
      <Escena>
        <Zona gap={40}>
          <Palabras texto="¿Lo querías **el lunes?**" size={104} />
          <Calendario />
          <Interrogante />
        </Zona>
      </Escena>
    ),
  },
  {
    id: "regla",
    render: () => (
      <Escena fondo="azul" sacudidas={[0.3]} sonidoEntrada="impacto">
        <Zona gap={44}>
          <Palabras texto="La regla de las **48 horas**" size={108} />
          <Reloj />
        </Zona>
      </Escena>
    ),
  },
  {
    id: "carrito",
    render: ({ dur }) => (
      <Escena>
        <Foto src={IMG("06-carrito-lleno")} zoom={[1, 1.15]} />
        <Sfx s="pop" volumen={0.35} en={0.4} />
        <Sfx s="riser" volumen={0.35} en={Math.max(0, dur / 30 - 1.5)} />
        <Arriba gap={14}>
          <Palabras texto="Al carrito." size={92} />
          <Palabras texto="**Sin pagar.**" size={92} resalta={COLORS.red} delay={0.9} />
          <Palabras texto="**2 días.**" size={92} delay={1.8} />
        </Arriba>
      </Escena>
    ),
  },
  {
    id: "wow",
    render: () => (
      <Escena sonidoEntrada="whoosh" sacudidas={[1.4]}>
        <Foto src={IMG("07-carrito-vacio")} zoom={[1.15, 1]} />
        <Sfx s="ding" volumen={0.4} en={1.4} />
        <Arriba gap={18}>
          <Pildora>48 h después…</Pildora>
          <Palabras texto="casi todo **sobra**" size={120} delay={0.6} marcador />
        </Arriba>
        <Chispas en={1.4} x={540} y={1060} color={COLORS.accent} />
      </Escena>
    ),
  },
  {
    id: "falta",
    render: () => (
      <Escena>
        <Sfx s="pop" volumen={0.4} en={0.9} />
        <Zona gap={40}>
          <Palabras texto="¿Sigue haciendo falta?" size={88} />
          <Cristal color={COLORS.green} w={560} desde="zoom" delay={0.2}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: 260 }}>
              <Paquete />
              <div style={{ position: "absolute", right: -150, top: -10 }}>
                <SelloOk />
              </div>
            </div>
          </Cristal>
          <Palabras texto="**Cómpralo.** Con descuento y sin culpa." size={72} resalta={COLORS.green} delay={1.6} />
        </Zona>
      </Escena>
    ),
  },
  {
    id: "cta",
    subtitulosClaros: true,
    render: () => <CtaCrecer tipo="guardar" boton="GUÁRDALO" linea="Antes de pagar **el viernes**" />,
  },
  {
    id: "cierre",
    subtitulos: false,
    render: () => (
      <Escena>
        <Zona top={250} bottom={620} gap={24} justify="flex-start">
          <Palabras texto="Ahorrar 50 gastando 100… **sigue sin ser ahorrar**" size={80} stagger={0.05} />
          <Balanza inicio={0.6} fin={1.4} escala={0.8} />
        </Zona>
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

export const W4801: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4801} pista="tech-synthpop.mp3" /> : null;
