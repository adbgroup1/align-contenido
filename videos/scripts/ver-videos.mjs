#!/usr/bin/env node
// Gemini «ve» Shorts de YouTube (imagen + sonido) y devuelve una ficha técnica en JSON.
//   node scripts/ver-videos.mjs --n 10          → los 10 primeros candidatos sin ver de candidatos.json
//   node scripts/ver-videos.mjs <url> [<url>…]  → vídeos concretos
// Salida: ../investigacion/fichas/<id>.json  (y marca visto=true en candidatos.json)
// Requiere GEMINI_API_KEY. Modelo: GEMINI_MODEL (por defecto gemini-3.8-flash).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) throw new Error("Falta GEMINI_API_KEY.");
const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";
const ESPERA_MS = Number(process.env.GEMINI_ESPERA_MS ?? 7000); // tier gratis: ~10 peticiones/min

const args = process.argv.slice(2);
const nIdx = args.indexOf("--n");
const candPath = "../investigacion/candidatos.json";
const cand = existsSync(candPath) ? JSON.parse(readFileSync(candPath, "utf8")) : [];
let urls = args.filter((a, i) => a.startsWith("http") && (nIdx < 0 || i !== nIdx + 1));
if (nIdx >= 0) urls = cand.filter((c) => !c.visto).slice(0, Number(args[nIdx + 1])).map((c) => c.url);
mkdirSync("../investigacion/fichas", { recursive: true });

const PROMPT = `Eres director de motion graphics y experto en retención de vídeo corto vertical.
Mira este Short entero, con imagen y sonido, y analízalo para que un equipo que hace vídeos animados
en código (Remotion/React) sobre finanzas personales pueda aprender sus TÉCNICAS. No copies frases.
Responde SOLO un JSON en español con esta forma:
{
 "duracion_s": number,
 "formato": "motion sin cara | cara + gráficos | grabación de pantalla | otro",
 "nicho": string,
 "hook": {"texto_y_visual_0_3s": string, "tecnica": string, "por_que_engancha": string},
 "segundo_gancho": string,
 "escenas": [{"desde_s": number, "hasta_s": number, "que_se_ve": string, "tecnica_visual": string}],
 "ritmo": {"cortes_totales": number, "segundos_por_plano_medio": number, "comentario": string},
 "momento_wow": {"segundo": number, "que_pasa": string},
 "cierre": {"tipo": string, "hace_bucle": boolean, "cta": string},
 "tipografia": {"estilo": string, "animacion": string, "subtitulos": string},
 "color_y_luz": string,
 "camara_y_transiciones": [string],
 "efectos": [string],
 "graficos_y_datos": string,
 "sonido": {"voz": string, "musica": string, "efectos_sonido": [string], "mezcla": string},
 "que_lo_hace_premium": [string],
 "nota_calidad_visual_1_10": number,
 "recetas_remotion": [{"tecnica": string, "como_hacerlo_en_codigo": string}],
 "idea_para_ALIGN": string
}`;

const ver = async (url) => {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ file_data: { file_uri: url } }, { text: PROMPT }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.3 },
    }),
  });
  if (!r.ok) throw new Error(`Gemini ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const j = await r.json();
  const txt = j.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
  return JSON.parse(txt);
};

let ok = 0;
for (const url of urls) {
  const id = (url.match(/(?:shorts\/|v=|youtu\.be\/)([\w-]{11})/) || [])[1] ?? url.replace(/\W+/g, "_").slice(-20);
  const destino = `../investigacion/fichas/${id}.json`;
  if (existsSync(destino)) continue;
  try {
    const ficha = await ver(url);
    const c = cand.find((x) => x.id === id);
    writeFileSync(destino, JSON.stringify({ id, url, fuente: "gemini", titulo: c?.titulo, canal: c?.canal, vistas: c?.vistas, ratio: c?.ratio, ...ficha }, null, 1));
    if (c) c.visto = true;
    ok++;
    console.log(`OK ${id} · calidad ${ficha.nota_calidad_visual_1_10}`);
  } catch (e) {
    console.log(`FALLO ${id}: ${e.message}`);
    // Gemini caído, saturado (503/500), sin cupo (429) o sin red: no insistir esta noche.
    // El agente sigue con el plan B (datos-videos.mjs + Claude). Código de salida 3 = «usa el plan B».
    if (/Gemini (5\d\d|429)|RESOURCE_EXHAUSTED|UNAVAILABLE|fetch failed|ECONN|ENOTFOUND/.test(e.message)) {
      if (cand.length) writeFileSync(candPath, JSON.stringify(cand, null, 1));
      console.log(`GEMINI NO DISPONIBLE · fichas nuevas: ${ok} · sigue con el plan B (Claude)`);
      process.exit(3);
    }
  }
  await new Promise((r) => setTimeout(r, ESPERA_MS));
}
if (cand.length) writeFileSync(candPath, JSON.stringify(cand, null, 1));
console.log(`Fichas nuevas: ${ok}`);
