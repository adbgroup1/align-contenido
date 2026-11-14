import { loadFont } from "@remotion/google-fonts/Inter";

// Colores de la landing de ALIGN (WEB ALIGN - SUBIR/index.html)
export const { fontFamily } = loadFont("normal", {
  weights: ["500", "700", "800", "900"],
  subsets: ["latin"],
});

// Ejemplo: 100 €/mes, 7 % anual hipotético, capitalización mensual
export const MONTHLY = 100;
export const ANNUAL_RATE = 0.07;

export const futureValue = (years: number) => {
  const r = ANNUAL_RATE / 12;
  const n = years * 12;
  return MONTHLY * (((1 + r) ** n - 1) / r);
};

export const contributed = (years: number) => MONTHLY * 12 * years;

// Separador de miles «.» siempre (Intl es-ES no agrupa números de 4 cifras)
export const euros = (value: number) =>
  String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €";
