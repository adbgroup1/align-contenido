import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { DefEscena, Montaje, PropsVoz } from "../kit";
import { Aviso, clamp, en, F, Noticiero, Quincena, useSeg } from "../estilos";

// W49-29 · «ÚLTIMA HORA: quincena reportada como desaparecida» · Reel · ESTILO noticiero · CIERRE remate
// («Seguiremos informando», sin CTA). Testigos con voz propia: mamá y primo. Sin cifras externas.

export const EXTRA_W4929: Record<string, number> = { hook: 0.3, banda: 0.5, cierre: 1.4 };

/** Lo que sale en la pantalla central del noticiero, según la escena. */
const Pantalla: React.FC<{ id: string }> = ({ id }) => {
  const t = useSeg();
  if (id === "mama" || id === "primo") {
    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", top: 380, left: 100, right: 140, height: 760, borderRadius: 20, background: id === "mama" ? "#FDE68A" : "#BAE6FD", overflow: "hidden", border: "6px solid #fff" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 330 }}>{id === "mama" ? "👩🏽" : "🧢"}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 760, backdropFilter: "blur(0px)" }} />
          <div style={{ position: "absolute", left: 30, bottom: 30, background: "rgba(0,0,0,0.75)", color: "#fff", fontFamily: F.roboto, fontWeight: 700, fontSize: 38, padding: "8px 18px" }}>
            {id === "mama" ? "TESTIGO · su mamá" : "SOSPECHOSO · el primo"}
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  if (id === "banda") {
    const k = interpolate(t, [1.4, 1.8], [0, 1], clamp);
    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", top: 400, left: 100, right: 140, display: "flex", justifyContent: "space-around", fontSize: 170, opacity: k, scale: String(0.6 + 0.4 * k) }}>
          <span>🌮</span>
          <span>🍟</span>
          <span>🥤</span>
        </div>
        <div style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", fontFamily: F.anton, fontSize: 80, color: "#FCA5A5", opacity: k }}>«LOS ANTOJITOS»</div>
      </AbsoluteFill>
    );
  }
  // retrato de la desaparecida
  const se = id === "cierre";
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 360, left: 200, width: 620, height: 800, background: "#FEF9C3", border: "8px solid #111", rotate: se ? "-3deg" : "0deg", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
        <div style={{ textAlign: "center", fontFamily: F.anton, fontSize: 110, color: "#111", marginTop: 10 }}>SE BUSCA</div>
        <div style={{ position: "relative", height: 470 }}>
          <Quincena x={310} y={240} escala={0.95} gesto={se ? "triste" : "feliz"} />
        </div>
        <div style={{ textAlign: "center", fontFamily: F.roboto, fontWeight: 900, fontSize: 42, color: "#111" }}>QUINCENA</div>
        <div style={{ textAlign: "center", fontFamily: F.roboto, fontSize: 32, color: "#444" }}>Vista por última vez: hace 36 horas</div>
      </div>
    </AbsoluteFill>
  );
};

const ESCENAS: DefEscena[] = ["hook", "vista", "mama", "banda", "primo", "consejo", "cierre"].map((id) => ({
  id,
  subtitulos: id === "consejo" ? undefined : false,
  estiloSub: "limpio",
  render: () => (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1210 }}>
        <Pantalla id={id} />
      </div>
      {id === "cierre" ? <Aviso y={1525} /> : null}
    </AbsoluteFill>
  ),
}));

export const W4929: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? (
    <Montaje
      videoId={videoId}
      voz={voz}
      escenas={ESCENAS}
      extra={EXTRA_W4929}
      pista="minimal-ambient-tech.mp3"
      subY={1500}
      fondoFijo={({ inicios }) => (
        <Noticiero
          titulares={[
            { en: 0, texto: "Desaparece quincena a 36 horas de haber llegado" },
            { en: en(inicios, "vista", 0), texto: "Última vez vista en la tiendita de la esquina", etiqueta: "EN DESARROLLO" },
            { en: en(inicios, "mama", 0), texto: "Madre: «Yo le dije que no saliera sola»", etiqueta: "TESTIMONIO" },
            { en: en(inicios, "banda", 0), texto: "Investigan a banda de «Los Antojitos»", etiqueta: "ÚLTIMA HORA" },
            { en: en(inicios, "primo", 0), texto: "Primo niega todo: «Yo nomás le pedí 200»", etiqueta: "EXCLUSIVA" },
            { en: en(inicios, "consejo", 0), texto: "Expertos: denle un trabajo a cada peso desde el día 1", etiqueta: "RECOMENDACIÓN" },
            { en: en(inicios, "cierre", 0), texto: "Seguiremos informando", etiqueta: "EN VIVO" },
          ]}
          cintillo="Aguinaldo visto en centro comercial, testigos dicen que ya no estaba completo • Renta exige su parte • Tarjeta de crédito no hace comentarios"
        />
      )}
    />
  ) : null;
