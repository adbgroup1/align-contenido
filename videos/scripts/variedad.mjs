#!/usr/bin/env node
// CONTROL DE VARIEDAD (27 nov). Andrés: «los vídeos son todos iguales… siempre el formato y la manera es la misma,
// y pones la misma pantalla de CTA». Este script lo impide con datos, no con buenas intenciones.
//
//   node scripts/variedad.mjs W49-31 --estilo chat --formato historia --cierre remate --pista lay-back.mp3 --tema mexico
//      → comprueba contra los últimos vídeos de registro.json y, si pasa, lo apunta. Si no pasa, sale con código 2
//        y dice qué cambiar. Producción lo ejecuta ANTES de renderizar; el manager, al aprobar guiones.
//   node scripts/variedad.mjs --ver   → enseña los últimos 10 y el reparto de estilos, cierres y temas.
//
// Reglas (se pueden cambiar aquí si los datos lo piden; apúntalo en investigacion/EXPERIMENTOS.md):
//   · el estilo no se repite en ninguno de los 2 vídeos anteriores (salvo --escalar, para escalar a propósito);
//   · en los últimos 7, como mucho 2 del mismo estilo;
//   · el cierre no se repite en el vídeo anterior, y la tarjeta (cierre «tarjeta») como mucho 2 de cada 7;
//   · la pista de música no se repite en los 2 anteriores;
//   · de cada 10, al menos 3 son de tema «general» (para todo hispano) y al menos 5 de «mexico».

import { existsSync, readFileSync, writeFileSync } from "node:fs";

const RUTA = "registro.json";
const reg = existsSync(RUTA) ? JSON.parse(readFileSync(RUTA, "utf8")) : { videos: [] };
const args = process.argv.slice(2);
const val = (k) => (args.includes(`--${k}`) ? args[args.indexOf(`--${k}`) + 1] : undefined);

const ESTILOS = ["chat", "notas", "banco", "ticket", "noticiero", "rpg", "split", "buscador", "libreta", "collage", "documental", "cinetica", "ranking", "grafica", "meme", "telenovela", "blob", "carrusel", "otro"];
const CIERRES = ["remate", "bucle", "personaje", "pregunta", "comentario", "serie", "tarjeta", "silencio", "guardar"];

if (args.includes("--ver")) {
  const ult = reg.videos.slice(-10);
  console.table(ult.map((v) => ({ id: v.id, estilo: v.estilo, formato: v.formato, cierre: v.cierre, pista: v.pista, tema: v.tema })));
  const cuenta = (k) => Object.entries(ult.reduce((a, v) => ((a[v[k]] = (a[v[k]] ?? 0) + 1), a), {})).map(([x, n]) => `${x} ${n}`).join(" · ");
  console.log(`Estilos: ${cuenta("estilo")}\nCierres: ${cuenta("cierre")}\nTemas: ${cuenta("tema")}`);
  process.exit(0);
}

const id = args[0];
const nuevo = { id, estilo: val("estilo"), formato: val("formato") ?? "", cierre: val("cierre"), pista: val("pista") ?? "ninguna", tema: val("tema") ?? "mexico", fecha: new Date().toISOString().slice(0, 10) };
if (!id || !nuevo.estilo || !nuevo.cierre) {
  console.error("Uso: node scripts/variedad.mjs <ID> --estilo <e> --cierre <c> [--formato f] [--pista p] [--tema mexico|general] [--escalar]");
  process.exit(1);
}
if (!ESTILOS.includes(nuevo.estilo)) console.warn(`Estilo nuevo «${nuevo.estilo}»: añádelo a ESTILOS y a KIT.md si se queda.`);
if (!CIERRES.includes(nuevo.cierre)) console.warn(`Cierre nuevo «${nuevo.cierre}»: añádelo a CIERRES si se queda.`);

const previos = reg.videos.filter((v) => v.id !== id);
const ult = (n) => previos.slice(-n);
const fallos = [];
if (!args.includes("--escalar") && ult(2).some((v) => v.estilo === nuevo.estilo))
  fallos.push(`El estilo «${nuevo.estilo}» ya está en uno de los 2 anteriores (${ult(2).map((v) => `${v.id}: ${v.estilo}`).join(", ")}). Cambia de estilo o usa --escalar si es a propósito (apúntalo en la hipótesis).`);
if (ult(6).filter((v) => v.estilo === nuevo.estilo).length >= 2) fallos.push(`Ya hay 2 vídeos «${nuevo.estilo}» en los últimos 7.`);
if (ult(1).some((v) => v.cierre === nuevo.cierre)) fallos.push(`El cierre «${nuevo.cierre}» es el mismo que el del vídeo anterior.`);
if (nuevo.cierre === "tarjeta" && ult(6).filter((v) => v.cierre === "tarjeta").length >= 2) fallos.push("Ya hay 2 tarjetas de CTA en los últimos 7: cierra con remate, bucle, personaje, pregunta o comentario.");
if (nuevo.pista !== "ninguna" && ult(2).some((v) => v.pista === nuevo.pista)) fallos.push(`La pista «${nuevo.pista}» sonó en uno de los 2 anteriores.`);
const diez = [...ult(9).filter((v) => !String(v.fecha).startsWith("antes")), nuevo]; // la regla de temas cuenta desde el 27 nov
if (diez.length >= 10 && diez.filter((v) => v.tema === "general").length < 3) fallos.push("En los últimos 10 hay menos de 3 de tema «general»: este debería serlo.");

if (fallos.length) {
  console.error(`✗ ${id} no pasa el control de variedad:\n- ${fallos.join("\n- ")}`);
  process.exit(2);
}
reg.videos = [...previos, nuevo];
writeFileSync(RUTA, JSON.stringify(reg, null, 1) + "\n");
console.log(`✓ ${id} pasa el control de variedad (${nuevo.estilo} · ${nuevo.cierre} · ${nuevo.pista} · ${nuevo.tema}). Apuntado en ${RUTA}.`);
