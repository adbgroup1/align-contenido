#!/usr/bin/env node
// Busca Shorts virales en YouTube (YouTube Data API v3, misma clave de Google que Gemini).
//   node scripts/buscar-shorts.mjs "motion graphics finance" "kinetic typography explainer" --max 40
// Salida: ../investigacion/candidatos.json (añade sin repetir) con vistas, canal y ratio vistas/suscriptores.
// Requiere GOOGLE_API_KEY (o GEMINI_API_KEY) con «YouTube Data API v3» activada en su proyecto.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

//   Opciones: --max N (por consulta, 25) · --region MX (país de YouTube) · --dias N (antigüedad máxima, 365;
//   con --dias 30 sale lo que funciona ahora) · --idioma es (relevanceLanguage)
const args = process.argv.slice(2);
const opcion = (n, porDefecto) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : porDefecto;
};
const conValor = new Set(["--max", "--region", "--dias", "--idioma"].map((n) => args.indexOf(n) + 1).filter((i) => i > 0));
const max = Number(opcion("--max", 25));
const region = opcion("--region");
const idioma = opcion("--idioma");
const dias = Number(opcion("--dias", 365));
const consultas = args.filter((a, i) => !a.startsWith("--") && !conValor.has(i));
const KEY = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
if (!KEY) throw new Error("Falta GOOGLE_API_KEY o GEMINI_API_KEY.");
const API = "https://www.googleapis.com/youtube/v3";
const get = async (ruta, params) => {
  const u = new URL(`${API}/${ruta}`);
  Object.entries({ ...params, key: KEY }).forEach(([k, v]) => u.searchParams.set(k, String(v)));
  const r = await fetch(u);
  if (!r.ok) throw new Error(`YouTube ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r.json();
};

const salida = "../investigacion/candidatos.json";
mkdirSync("../investigacion", { recursive: true });
const previos = existsSync(salida) ? JSON.parse(readFileSync(salida, "utf8")) : [];
const vistos = new Set(previos.map((c) => c.id));
const hace = new Date(Date.now() - dias * 864e5).toISOString();

for (const q of consultas) {
  const ids = [];
  let pageToken;
  while (ids.length < max) {
    const s = await get("search", {
      part: "id",
      q: `${q} #shorts`,
      type: "video",
      videoDuration: "short",
      order: "viewCount",
      publishedAfter: hace,
      maxResults: 50,
      ...(region ? { regionCode: region } : {}),
      ...(idioma ? { relevanceLanguage: idioma } : {}),
      ...(pageToken ? { pageToken } : {}),
    });
    ids.push(...s.items.map((i) => i.id.videoId));
    pageToken = s.nextPageToken;
    if (!pageToken) break;
  }
  const nuevos = ids.filter((id) => !vistos.has(id)).slice(0, max);
  for (let i = 0; i < nuevos.length; i += 50) {
    const v = await get("videos", { part: "snippet,statistics,contentDetails", id: nuevos.slice(i, i + 50).join(",") });
    const canales = [...new Set(v.items.map((x) => x.snippet.channelId))];
    const c = await get("channels", { part: "statistics", id: canales.join(",") });
    const subs = Object.fromEntries(c.items.map((x) => [x.id, Number(x.statistics.subscriberCount || 0)]));
    for (const x of v.items) {
      const vistas = Number(x.statistics.viewCount || 0);
      const s = subs[x.snippet.channelId] || 1;
      previos.push({
        id: x.id,
        url: `https://www.youtube.com/shorts/${x.id}`,
        titulo: x.snippet.title,
        canal: x.snippet.channelTitle,
        publicado: x.snippet.publishedAt.slice(0, 10),
        duracion: x.contentDetails.duration,
        vistas,
        suscriptores: s,
        ratio: Math.round((vistas / s) * 10) / 10,
        consulta: q,
        visto: false,
      });
      vistos.add(x.id);
    }
  }
  console.log(`${q}: ${nuevos.length} nuevos`);
}
previos.sort((a, b) => b.vistas - a.vistas);
writeFileSync(salida, JSON.stringify(previos, null, 1));
console.log(`Total candidatos: ${previos.length} → ${salida}`);
