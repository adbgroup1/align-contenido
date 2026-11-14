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

// Paleta de marca para los reels
export const COLORS = {
  navy: "#0F172A",
  deep: "#0B1224",
  blue: "#1D4ED8",
  light: "#C7D7FE",
  accent: "#7C9BFF",
  white: "#FFFFFF",
  grey: "#64748B",
  paper: "#F7F9FC",
  green: "#22C55E",
  red: "#F87171",
  gold: "#FBBF24",
  choco: "#7C4A2D",
  chocoLight: "#A0673F",
};

// Zona segura vertical 1080×1920 (GUIA.md)
export const SAFE = { top: 220, bottom: 420, left: 90, right: 120 };

// Valor futuro con aportación y tipo como parámetro (capitalización mensual)
export const futureValueAt = (monthly: number, annualRate: number, months: number) => {
  if (months <= 0) return 0;
  const r = annualRate / 12;
  return monthly * (((1 + r) ** months - 1) / r);
};
