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
// Escribe los números con letras en «texto» («cinco mil pesos», no «$5,000»): la voz los lee mejor.
//
// PERSONAJES (27 nov): un vídeo puede tener varias voces. En guion.json:
//   "reparto": { "narrador": "<voice_id>", "mama": "<voice_id>", "compa": "<voice_id>" }
//   y en cada escena "personaje": "mama" (sin personaje = "narrador", que usa la voz de la rotación).
//   Los nombres del reparto también pueden ser claves de "personajes" en voces.json (voces fijas de la serie).
// ACTUACIÓN: con el modelo eleven_v3 el texto admite etiquetas entre corchetes ([laughs], [sarcastic], [sighs],
//   [whispers], [excited]…). Se envían a ElevenLabs pero NO salen en los subtítulos. Con otro modelo se quitan.
// MODELO: "modelo" en guion.json → "modelo" en voces.json → ELEVENLABS_MODEL_ID → eleven_multilingual_v2.

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
console.log(`Voz del narrador: ${VOICE_ID}`);
const MODEL_ID = guion.modelo ?? voces.modelo ?? process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2";
console.log(`Modelo: ${MODEL_ID}`);
const vozDe = (personaje) => {
  if (!personaje || personaje === "narrador") return guion.reparto?.narrador ?? VOICE_ID;
  const ref = guion.reparto?.[personaje] ?? personaje; // el reparto puede dar un voice_id o un rol de voces.json
  const v = voces.personajes?.[ref]?.id ?? (/^[A-Za-z0-9]{18,}$/.test(ref) ? ref : null);
  if (v) return v;
  // sin voz fija para ese personaje: una de la rotación distinta de la del narrador (siempre la misma por nombre)
  const otras = (voces.rotacion ?? []).filter((x) => x !== VOICE_ID);
  if (!otras.length) throw new Error(`El personaje «${personaje}» no tiene voz: añádelo a "reparto" en guion.json o a "personajes" en voces.json`);
  const h = [...personaje].reduce((a, c) => a + c.charCodeAt(0), 0);
  console.warn(`«${personaje}» sin voz fija: uso una de la rotación`);
  return otras[h % otras.length];
};
// Etiquetas de actuación [así]: se quitan para los subtítulos (y del audio si el modelo no es v3)
const ETIQUETA = /\[[^\]]*\]\s*/g;
const sinEtiquetas = (x) => x.replace(ETIQUETA, "").replace(/\s+/g, " ").trim();
const esV3 = (m) => /v3/.test(m);

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
  let enCorchete = false;
  al.characters.forEach((c, i) => {
    if (c === "[") enCorchete = true;
    if (enCorchete) {
      if (c === "]") enCorchete = false;
      return;
    }
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

const elevenlabs = async (texto, anterior, siguiente, voiceId = VOICE_ID, modelo = MODEL_ID) => {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("Falta ELEVENLABS_API_KEY (variables del entorno de la nube).");
  if (!VOICE_ID) throw new Error("Falta la voz: pon «principal» en voces.json o ELEVENLABS_VOICE_ID en el entorno.");
  const v3 = esV3(modelo);
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      text: v3 ? texto : sinEtiquetas(texto),
      model_id: modelo,
      language_code: "es",
      previous_text: v3 ? undefined : sinEtiquetas(anterior || "") || undefined,
      next_text: v3 ? undefined : sinEtiquetas(siguiente || "") || undefined,
      voice_settings: v3
        ? { stability: 0.5, similarity_boost: 0.8, ...(voces.ajustesV3 ?? {}), ...(guion.ajustes ?? {}) }
        : { stability: 0.4, similarity_boost: 0.8, style: 0.45, use_speaker_boost: true, speed: 1.05, ...(voces.ajustes ?? {}), ...(guion.ajustes ?? {}) },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const j = await res.json();
  const al = j.alignment ?? j.normalized_alignment;
  // si el modelo no devuelve tiempos, se estiman por longitud de palabra (aviso en la consola)
  if (!al) console.warn(`Sin alignment con ${modelo}: tiempos estimados`);
  return { audio: Buffer.from(j.audio_base64, "base64"), palabras: al ? palabrasDesdeCaracteres(al) : null };
};

mkdirSync(dir, { recursive: true });
const escenas = [];
for (const [i, e] of guion.escenas.entries()) {
  const archivo = `${e.id}.${usarSay ? "wav" : "mp3"}`;
  const ruta = join(dir, archivo);
  let palabras;
  const limpio = sinEtiquetas(e.texto);
  const personaje = e.personaje ?? "narrador";
  if (usarSay) {
    // prueba local: voces de macOS de México, una por personaje
    const VOCES_SAY = ["Paulina", "Eddy (Spanish (Mexico))", "Flo (Spanish (Mexico))", "Reed (Spanish (Mexico))", "Grandma (Spanish (Mexico))", "Rocko (Spanish (Mexico))"];
    const reparto = ["narrador", ...Object.keys(guion.reparto ?? {}).filter((k) => k !== "narrador")];
    const vs = VOCES_SAY[Math.max(0, reparto.indexOf(personaje)) % VOCES_SAY.length];
    execFileSync("say", ["-v", vs, "-r", "195", "--file-format=WAVE", "--data-format=LEI16@44100", "-o", ruta, limpio]);
  } else {
    let r;
    try {
      r = await elevenlabs(e.texto, guion.escenas[i - 1]?.texto, guion.escenas[i + 1]?.texto, vozDe(personaje), MODEL_ID);
    } catch (err) {
      if (!esV3(MODEL_ID)) throw err;
      console.warn(`v3 falló en ${e.id} (${err.message.slice(0, 120)}); repito con eleven_multilingual_v2`);
      r = await elevenlabs(e.texto, guion.escenas[i - 1]?.texto, guion.escenas[i + 1]?.texto, vozDe(personaje), "eleven_multilingual_v2");
    }
    writeFileSync(ruta, r.audio);
    palabras = r.palabras;
  }
  const segundos = duracion(ruta);
  escenas.push({ id: e.id, personaje, texto: limpio, archivo, segundos, palabras: palabras ?? palabrasEstimadas(limpio, segundos) });
  console.log(`${e.id} (${personaje}): ${segundos.toFixed(2)} s`);
}

writeFileSync(
  join(dir, "voz.json"),
  JSON.stringify({ proveedor: usarSay ? "say (prueba)" : "elevenlabs", modelo: usarSay ? "say" : MODEL_ID, voz: usarSay ? "Paulina" : VOICE_ID, reparto: guion.reparto ?? null, escenas }, null, 1),
);
if (!existsSync(join(dir, "voz.json"))) process.exit(1);
console.log(`Listo: ${join(dir, "voz.json")}`);
