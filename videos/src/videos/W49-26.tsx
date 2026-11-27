import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { DefEscena, Montaje, PropsVoz, Sfx } from "../kit";
import { Aguinaldo, Aviso, clamp, Cochinito, F, MarcoTelenovela, Tarjeta, TituloCapitulo, useSeg, ZoomDrama } from "../estilos";

// W49-26 · «LA TARJETA · Capítulo 1» · Reel · ESTILO telenovela con objetos con cara · CIERRE serie («Continuará»)
// Hipótesis (nueva, H-serie): una telenovela de objetos de dinero en capítulos gana seguidores (la gente vuelve
// por el capítulo 2). Sin cifras externas. Concepto, no producto: «meses sin intereses» en general.

export const EXTRA_W4926: Record<string, number> = { hook: 0.2, despues: 0.6, drama: 0.6, leccion: 0.3, continuara: 1.8 };

const Salon: React.FC<{ tono?: string }> = ({ tono = "#3B0764" }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, #7E22CE, ${tono} 70%)` }}>
    {/* cortinas */}
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 170, background: "repeating-linear-gradient(90deg,#7F1D1D 0 34px,#991B1B 34px 68px)" }} />
    <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 170, background: "repeating-linear-gradient(90deg,#991B1B 0 34px,#7F1D1D 34px 68px)" }} />
    {/* candelabro */}
    <div style={{ position: "absolute", left: 540, top: 170, translate: "-50% 0", fontSize: 120, opacity: 0.8 }}>🕯️</div>
  </AbsoluteFill>
);

const Rotulo: React.FC<{ texto: string }> = ({ texto }) => (
  <div style={{ position: "absolute", top: 330, left: 90, right: 120, textAlign: "center", fontFamily: F.playfairIt, fontSize: 64, color: "#FDE68A", textShadow: "0 3px 12px #000" }}>{texto}</div>
);

const Hook: React.FC = () => {
  const t = useSeg();
  const acerca = interpolate(t, [0, 3], [0, 60], clamp);
  return (
    <AbsoluteFill>
      <Salon />
      <Tarjeta x={330 + acerca} y={820} escala={1.15} gesto="coqueta" habla={t < 3.3} rot={-10} />
      <Aguinaldo x={760 - acerca} y={900} escala={0.95} gesto="sorpresa" />
      <div style={{ position: "absolute", top: 380, left: 0, right: 0, textAlign: "center", fontFamily: F.playfair, fontWeight: 900, fontSize: 92, color: "#FDE68A", textShadow: "0 4px 18px #000", letterSpacing: 4 }}>
        LA TARJETA
      </div>
      <div style={{ position: "absolute", top: 490, left: 0, right: 0, textAlign: "center", fontFamily: F.playfairIt, fontSize: 48, color: "#F5D0FE" }}>Capítulo 1</div>
    </AbsoluteFill>
  );
};

const Dice: React.FC<{ quien: "tarjeta" | "aguinaldo" | "cochinito"; dur: number; gestoOtro?: "sorpresa" | "triste" | "feliz" }> = ({ quien }) => {
  const t = useSeg();
  return (
    <AbsoluteFill>
      <Salon />
      <Tarjeta x={300} y={820} escala={quien === "tarjeta" ? 1.2 : 0.95} gesto={quien === "cochinito" ? "malvada" : "coqueta"} habla={quien === "tarjeta"} />
      <Aguinaldo x={760} y={880} escala={quien === "aguinaldo" ? 1.15 : 0.95} gesto={quien === "aguinaldo" ? "feliz" : "neutral"} habla={quien === "aguinaldo"} />
      {quien === "cochinito" ? <Cochinito x={540} y={1180 - interpolate(t, [0, 0.5], [-300, 0], clamp)} escala={0.8} gesto="llora" habla /> : null}
    </AbsoluteFill>
  );
};

const Despues: React.FC = () => <TituloCapitulo capitulo="" titulo="12 meses después…" en={0} />;

const Cuentas: React.FC = () => {
  const t = useSeg();
  const recibos = ["Pantalla · 12 meses", "Celular · 18 meses", "Viaje · 6 meses", "Tenis · 3 meses", "Colchón · 12 meses"];
  return (
    <AbsoluteFill>
      <Salon tono="#1E1B4B" />
      <Tarjeta x={300} y={700} escala={1.05} gesto="malvada" habla />
      <Aguinaldo x={760} y={1150} escala={0.8} gesto="sorpresa" rot={-12} />
      {recibos.map((r, i) => {
        const k = interpolate(t, [0.6 + i * 0.9, 0.9 + i * 0.9], [0, 1], clamp);
        return (
          <div
            key={r}
            style={{
              position: "absolute",
              left: 520 + (i % 2) * 30,
              maxWidth: 410,
              top: 330 + i * 110,
              rotate: `${(i % 2 ? 4 : -5) * k}deg`,
              background: "#fff",
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: 32,
              padding: "12px 18px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
              opacity: k,
              scale: String(0.5 + 0.5 * k),
              borderTop: "6px dashed #DC2626",
            }}
          >
            🧾 {r}
          </div>
        );
      })}
      {recibos.map((_, i) => (
        <Sfx key={i} s="pop" volumen={0.3} en={0.6 + i * 0.9} />
      ))}
    </AbsoluteFill>
  );
};

const Drama: React.FC = () => (
  <AbsoluteFill>
    <Salon tono="#450A0A" />
    <ZoomDrama en={0.2} x={540} y={880}>
      <Aguinaldo x={540} y={900} escala={1.3} gesto="sorpresa" habla rot={0} />
    </ZoomDrama>
  </AbsoluteFill>
);

const Leccion: React.FC = () => {
  const t = useSeg();
  return (
    <AbsoluteFill>
      <Salon tono="#1E1B4B" />
      <Cochinito x={540} y={820} escala={1.1} gesto={t < 3 ? "triste" : "feliz"} />
      <Rotulo texto="Suma tus meses antes de firmar el siguiente." />
    </AbsoluteFill>
  );
};

const Continuara: React.FC<{ dur: number }> = () => {
  const t = useSeg();
  const k = interpolate(t, [0.6, 1.4], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Cochinito x={540} y={760} escala={0.9} gesto="llora" habla={t < 1.1} />
      <div style={{ position: "absolute", top: 1080, left: 0, right: 0, textAlign: "center", fontFamily: F.playfairIt, fontSize: 110, color: "#FDE68A", opacity: k, letterSpacing: 2 }}>
        Continuará…
      </div>
      <div style={{ position: "absolute", top: 1230, left: 0, right: 0, textAlign: "center", fontFamily: F.roboto, fontWeight: 700, fontSize: 40, color: "#E9D5FF", opacity: k }}>
        Capítulo 2: la Tarjeta conoce a la Tía Chuy
      </div>
      <Aviso y={1440} />
      <Sfx s="riser" volumen={0.3} en={0.5} />
    </AbsoluteFill>
  );
};

const ESCENAS: DefEscena[] = [
  { id: "hook", render: () => <Hook /> },
  { id: "aguinaldo", render: ({ dur }) => <Dice quien="aguinaldo" dur={dur} /> },
  { id: "cochinito", render: ({ dur }) => <Dice quien="cochinito" dur={dur} /> },
  { id: "despues", subtitulos: false, render: () => <Despues /> },
  { id: "cuentas", render: () => <Cuentas /> },
  { id: "drama", render: () => <Drama /> },
  { id: "leccion", render: () => <Leccion /> },
  { id: "continuara", subtitulos: false, render: ({ dur }) => <Continuara dur={dur} /> },
];

export const W4926: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? (
    <Montaje
      videoId={videoId}
      voz={voz}
      escenas={ESCENAS}
      extra={EXTRA_W4926}
      pista={null}
      subtitulos="limpio"
      subY={470}
      capa={() => <MarcoTelenovela />}
    />
  ) : null;
