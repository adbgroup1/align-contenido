#!/usr/bin/env node
// Plan B de la investigación, sin Gemini: reúne lo que se puede saber de un Short sin verlo, para que Claude
// (el propio agente) escriba la ficha. Usa solo la YouTube Data API, que sí funciona en la nube.
//   node scripts/datos-videos.mjs --n 5          → los 5 primeros candidatos sin ver de candidatos.json
//   node scripts/datos-videos.mjs <url|id> …     → vídeos concretos
// Salida por vídeo:
//   ../investigacion/datos/<id>.json  título, descripción, etiquetas, duración, cifras y 20 comentarios top
//   ../investigacion/datos/<id>.jpg   miniatura (si la red de la nube deja bajar de i.ytimg.com)
// No marca «visto»: eso lo hace el agente al escribir la ficha.
// Requiere GOOGLE_API_KEY (o GEMINI_API_KEY) con «YouTube Data API v3».
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const KEY = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
if (!KEY) throw new Error("Falta GOOGLE_API_KEY o GEMINI_API_KEY.");
const API = "https://www.googleapis.com/youtube/v3";
const get = async (ruta, params) => {
  const u = new URL(`${API}/${ruta}`);
  Object.entries({ ...params, key: KEY }).forEach(([k, v]) => u.searchParams.set(k, String(v)));
  const r = await fetch(u);
  if (!r.ok) throw new Error(`YouTube ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
};

const args = process.argv.slice(2);
const nIdx = args.indexOf("--n");
const candPath = "../investigacion/candidatos.json";
const cand = existsSync(candPath) ? JSON.parse(readFileSync(candPath, "utf8")) : [];
const idDe = (s) => (s.match(/(?:shorts\/|v=|youtu\.be\/)([\w-]{11})/) || [])[1] ?? (/^[\w-]{11}$/.test(s) ? s : null);
let ids = args.filter((a, i) => nIdx < 0 || (i !== nIdx && i !== nIdx + 1)).map(idDe).filter(Boolean);
if (nIdx >= 0) ids = cand.filter((c) => !c.visto).slice(0, Number(args[nIdx + 1])).map((c) => c.id);
mkdirSync("../investigacion/datos", { recursive: true });

let ok = 0;
let miniaturas = 0;
for (const id of ids) {
  try {
    const v = (await get("videos", { part: "snippet,contentDetails,statistics", id })).items?.[0];
    if (!v) { console.log(`FALLO ${id}: no existe o es privado`); continue; }
    let comentarios = [];
    try {
      const c = await get("commentThreads", { part: "snippet", videoId: id, order: "relevance", maxResults: 20, textFormat: "plainText" });
      comentarios = (c.items ?? []).map((t) => {
        const s = t.snippet.topLevelComment.snippet;
        return { texto: s.textDisplay.slice(0, 300), likes: s.likeCount };
      });
    } catch (e) {
      comentarios = [{ texto: `sin dato (${e.message.slice(0, 60)})`, likes: 0 }];
    }
    const t = v.snippet.thumbnails ?? {};
    const miniUrl = (t.maxres ?? t.standard ?? t.high ?? t.medium ?? t.default)?.url;
    let miniatura = null;
    if (miniUrl) {
      try {
        const r = await fetch(miniUrl);
        if (r.ok) {
          writeFileSync(`../investigacion/datos/${id}.jpg`, Buffer.from(await r.arrayBuffer()));
          miniatura = `investigacion/datos/${id}.jpg`;
          miniaturas++;
        }
      } catch {}
    }
    const c = cand.find((x) => x.id === id);
    writeFileSync(`../investigacion/datos/${id}.json`, JSON.stringify({
      id,
      url: `https://www.youtube.com/shorts/${id}`,
      titulo: v.snippet.title,
      canal: v.snippet.channelTitle,
      publicado: v.snippet.publishedAt?.slice(0, 10),
      duracion: v.contentDetails.duration,
      idioma: v.snippet.defaultAudioLanguage ?? v.snippet.defaultLanguage ?? null,
      descripcion: (v.snippet.description ?? "").slice(0, 1500),
      etiquetas: v.snippet.tags ?? [],
      vistas: Number(v.statistics.viewCount ?? 0),
      likes: Number(v.statistics.likeCount ?? 0),
      comentarios_total: Number(v.statistics.commentCount ?? 0),
      suscriptores: c?.suscriptores ?? null,
      ratio: c?.ratio ?? null,
      miniatura,
      comentarios_top: comentarios,
    }, null, 1));
    ok++;
    console.log(`OK ${id}${miniatura ? " · con miniatura" : " · sin miniatura"}`);
  } catch (e) {
    console.log(`FALLO ${id}: ${e.message}`);
    if (/YouTube 403|quota/i.test(e.message)) break; // cuota del día de YouTube agotada
  }
}
console.log(`Datos nuevos: ${ok} · miniaturas: ${miniaturas}`);
