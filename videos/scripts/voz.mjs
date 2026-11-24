#!/usr/bin/env node
// Genera la voz en off de un vídeo, escena a escena, con los tiempos de cada palabra.
//
//   node scripts/voz.mjs W47-02            → ElevenLabs (necesita ELEVENLABS_API_KEY)
//   node scripts/voz.mjs W47-02 --say      → voz de macOS, solo para pruebas en local
//
// Entrada:  public/voz/<ID>/guion.json  →  { "escenas": [ { "id": "hook", "texto": "…" }, … ] }
// Salida:   public/voz/<ID>/<escena>.mp3  y  public/voz/<ID>/voz.json
//           voz.json = { proveedor, voz, escenas: [ { id, texto, archivo, segundos, palabras: [{ t, inicio, fin }] } ] }
//
// Escribe los números con letras en «texto» («cien euros», no «100 €»): la voz los lee mejor.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [id, ...flags] = process.argv.slice(2);
if (!id) {
  console.error("Uso: node scripts/voz.mjs <ID> [--say]");
  process.exit(1);
}
const usarSay = flags.includes("--say");
const dir = join("public", "voz", id);
const guion = JSON.parse(readFileSync(join(dir, "guion.json"), "utf8"));

// Qué voz se usa, por orden: «voz» del guion.json (prueba de una voz concreta) → la ya asignada a este vídeo en
// voces.json → si no hay ganadora, la de «rotacion» menos usada (H6: la voz la deciden los datos) → «principal»
// → ELEVENLABS_VOICE_ID del entorno (reserva). La asignación se guarda en voces.json: haz commit de ese archivo.
const voces = existsSync("voces.json") ? JSON.parse(readFileSync("voces.json", "utf8")) : {};
const elegirVoz = () => {
  if (guion.voz) return guion.voz;
  voces.asignadas ??= {};
  if (voces.asignadas[id]) return voces.asignadas[id];
  const rot = voces.principal?.ganadora ? [] : voces.rotacion ?? [];
  if (!rot.length || usarSay) return voces.principal?.id || process.env.ELEVENLABS_VOICE_ID || "";
  const usos = (v) => Object.values(voces.asignadas).filter((x) => x === v).length;
  const voz = [...rot].sort((a, b) => usos(a) - usos(b))[0];
  voces.asignadas[id] = voz;
  writeFileSync("voces.json", JSON.stringify(voces, null, 1) + "\n");
  return voz;
};
const VOICE_ID = elegirVoz();
console.log(`Voz: ${VOICE_ID}`);
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2";

// Duración: WAV por cabecera; MP3 con ffprobe (en la nube) o, si no hay, con el de Remotion
const duracion = (archivo) => {
  if (archivo.endsWith(".wav")) {
    const b = readFileSync(archivo);
    const dataPos = b.indexOf("data");
    return b.readUInt32LE(dataPos + 4) / b.readUInt32LE(28);
  }
  const args = ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", archivo];
  try {
    return Number(execFileSync("ffprobe", args).toString().trim());
  } catch {
    return Number(execFileSync("npx", ["remotion", "ffprobe", ...args]).toString().trim());
  }
};

// Agrupa tiempos por carácter (ElevenLabs) en palabras
const palabrasDesdeCaracteres = (al) => {
  const out = [];
  let actual = null;
  al.characters.forEach((c, i) => {
    if (/\s/.test(c)) {
      if (actual) out.push(actual);
      actual = null;
      return;
    }
    if (!actual) actual = { t: "", inicio: al.character_start_times_seconds[i], fin: 0 };
    actual.t += c;
    actual.fin = al.character_end_times_seconds[i];
  });
  if (actual) out.push(actual);
  return out;
};

// Sin tiempos reales (voz de macOS): reparte la duración según la longitud de cada palabra
const palabrasEstimadas = (texto, segundos) => {
  const ws = texto.split(/\s+/).filter(Boolean);
  const pesos = ws.map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").length + 2 + (/[.,;:!?…]$/.test(w) ? 3 : 0));
  const total = pesos.reduce((a, b) => a + b, 0);
  const util = segundos * 0.94;
  let t = segundos * 0.03;
  return ws.map((w, i) => {
    const d = (pesos[i] / total) * util;
    const p = { t: w, inicio: t, fin: t + d };
    t += d;
    return p;
  });
};

const elevenlabs = async (texto, anterior, siguiente) => {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("Falta ELEVENLABS_API_KEY (variables del entorno de la nube).");
  if (!VOICE_ID) throw new Error("Falta la voz: pon «principal» en voces.json o ELEVENLABS_VOICE_ID en el entorno.");
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      text: texto,
      model_id: MODEL_ID,
      language_code: "es",
      previous_text: anterior || undefined,
      next_text: siguiente || undefined,
      voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true, speed: 1.05, ...(voces.ajustes ?? {}) },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const j = await res.json();
  return { audio: Buffer.from(j.audio_base64, "base64"), palabras: palabrasDesdeCaracteres(j.alignment) };
};

mkdirSync(dir, { recursive: true });
const escenas = [];
for (const [i, e] of guion.escenas.entries()) {
  const archivo = `${e.id}.${usarSay ? "wav" : "mp3"}`;
  const ruta = join(dir, archivo);
  let palabras;
  if (usarSay) {
    execFileSync("say", ["-v", "Mónica", "-r", "190", "--file-format=WAVE", "--data-format=LEI16@44100", "-o", ruta, e.texto]);
  } else {
    const r = await elevenlabs(e.texto, guion.escenas[i - 1]?.texto, guion.escenas[i + 1]?.texto);
    writeFileSync(ruta, r.audio);
    palabras = r.palabras;
  }
  const segundos = duracion(ruta);
  escenas.push({ id: e.id, texto: e.texto, archivo, segundos, palabras: palabras ?? palabrasEstimadas(e.texto, segundos) });
  console.log(`${e.id}: ${segundos.toFixed(2)} s`);
}

writeFileSync(
  join(dir, "voz.json"),
  JSON.stringify({ proveedor: usarSay ? "say (prueba)" : "elevenlabs", voz: usarSay ? "Mónica" : VOICE_ID, escenas }, null, 1),
);
if (!existsSync(join(dir, "voz.json"))) process.exit(1);
console.log(`Listo: ${join(dir, "voz.json")}`);
