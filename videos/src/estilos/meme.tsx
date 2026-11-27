// ESTILO «meme»: el formato de meme de siempre. Franja blanca arriba con el texto en negro y en minúsculas
// normales («yo después de pagar la tarjeta el día 16:») y debajo la reacción (un dibujo, un personaje, una cifra).
// El texto de arriba cambia en cada golpe. Sin subtítulos grandes: el chiste está en el texto + la imagen.
import React from "react";
import { entrada, F, useSeg } from "./comun";

export type TextoMeme = { en: number; texto: string };

export const Meme: React.FC<{
  textos: TextoMeme[];
  children?: React.ReactNode; // la reacción, debajo de la franja (de y = alto a y = 1500)
  alto?: number; // alto de la franja blanca (por defecto 640)
  fondo?: string; // fondo de la zona de reacción
}> = ({ textos, children, alto = 640, fondo = "#000" }) => {
  const t = useSeg();
  const actual = textos.filter((x) => t >= x.en).pop() ?? textos[0];
  const k = entrada(t, actual.en, 0.2);
  return (
    <div style={{ position: "absolute", inset: 0, background: fondo, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: alto, left: 0, right: 0, bottom: 0 }}>{children}</div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: alto,
          background: "#fff",
          display: "flex",
          alignItems: "flex-end",
          padding: "0 70px 40px 70px",
        }}
      >
        <div style={{ fontFamily: F.roboto, fontWeight: 500, fontSize: actual.texto.length > 70 ? 52 : 60, lineHeight: 1.2, color: "#000", opacity: Math.min(1, k * 2) }}>
          {actual.texto}
        </div>
      </div>
    </div>
  );
};
