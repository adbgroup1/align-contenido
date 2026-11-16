#!/usr/bin/env node
// Genera las imágenes de un vídeo (fondos de escena) con una API de imágenes.
//
//   node scripts/imagenes.mjs <ID>                     → Gemini (GEMINI_API_KEY), proveedor por defecto
//   node scripts/imagenes.mjs <ID> --openai            → OpenAI (OPENAI_API_KEY)
//   node scripts/imagenes.mjs <ID> --solo 03-llenando  → solo esa imagen
//   node scripts/imagenes.mjs <ID> --forzar            → rehace las que ya existen
//   node scripts/imagenes.mjs <ID> --plan              → enseña los encargos sin llamar a ninguna API
//
// Entrada:  public/img/<ID>/imagenes.json
//   {
//     "estilo": "bloque de estilo común (en inglés), se añade a cada encargo",
//     "imagenes": [
//       { "id": "01-hucha", "prompt": "A small clear glass jar…" },
//       { "id": "03-llenando", "prompt": "The same jar, half full…", "ref": "01-hucha" }
//     ]
//   }
//   "ref" = imagen ya generada que se pasa como referencia para mantener el mismo objeto
//   (solo con Gemini; con OpenAI se ignora y la coherencia depende del texto).
// Salida:   public/img/<ID>/<id>.png (vertical 9:16, no se sube al repo) y <id>.jpg (la que usa el vídeo)
//
// Las imágenes que ya existen no se rehacen (se pueden poner a mano, p. ej., hechas en ChatGPT web).

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [id, ...flags] = process.argv.slice(2);
if (!id) {
  console.error("Uso: node scripts/imagenes.mjs <ID> [--openai] [--solo <imagen>] [--forzar] [--plan]");
  process.exit(1);
}
const proveedor = flags.includes("--openai") ? "openai" : "gemini";
const forzar = flags.includes("--forzar");
const plan = flags.includes("--plan");
const solo = flags.includes("--solo") ? flags[flags.indexOf("--solo") + 1] : null;

const dir = join("public", "img", id);
const def = JSON.parse(readFileSync(join(dir, "imagenes.json"), "utf8"));
// Composición pensada para el kit: texto arriba (0–35 %), objeto en el centro (35–70 %), subtítulos abajo
const REGLAS = "Vertical 9:16 composition. Place the main subject in the middle band of the frame (between 35% and 70% of the height). Keep the top third and the bottom quarter as calm, dark, empty background for overlaid text. No text, no letters, no numbers, no logos, no watermarks.";
const prompt = (img) => [img.prompt, def.estilo, REGLAS].filter(Boolean).join(" ");

// Modelos por defecto; se cambian con variables de entorno sin tocar el código
const GEMINI_MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image";
const OPENAI_MODEL = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";

const gemini = async (img) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Falta GEMINI_API_KEY");
  const parts = [{ text: prompt(img) }];
  if (img.ref) {
    const refPath = join(dir, `${img.ref}.png`);
    if (!existsSync(refPath)) throw new Error(`La referencia ${img.ref}.png no existe todavía`);
    parts.unshift({ inlineData: { mimeType: "image/png", data: readFileSync(refPath).toString("base64") } });
    parts[1].text = `Keep exactly the same object, materials, camera angle and lighting as the reference image. ${parts[1].text}`;
  }
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "9:16" } },
      }),
    },
  );
  const json = await res.json();
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${json.error?.message ?? "error"}`);
  const data = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;
  if (!data) throw new Error(`Gemini no devolvió imagen (${json.candidates?.[0]?.finishReason ?? "sin motivo"})`);
  return Buffer.from(data, "base64");
};

const openai = async (img) => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("Falta OPENAI_API_KEY");
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: OPENAI_MODEL, prompt: prompt(img), size: "1024x1536", n: 1 }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${json.error?.message ?? "error"}`);
  const data = json.data?.[0]?.b64_json;
  if (!data) throw new Error("OpenAI no devolvió imagen");
  return Buffer.from(data, "base64");
};

let fallos = 0;
for (const img of def.imagenes) {
  if (solo && img.id !== solo) continue;
  const out = join(dir, `${img.id}.png`);
  if (existsSync(out) && !forzar) {
    console.log(`= ${img.id}: ya existe`);
    continue;
  }
  if (plan) {
    console.log(`· ${img.id}${img.ref ? ` (ref ${img.ref})` : ""}: ${prompt(img)}`);
    continue;
  }
  try {
    const buf = await (proveedor === "openai" ? openai(img) : gemini(img));
    writeFileSync(out, buf);
    // Copia JPG ligera (~200 KB) para el vídeo y el repo; el PNG solo sirve de referencia y no se sube
    try {
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", out, "-q:v", "3", out.replace(/\.png$/, ".jpg")]);
    } catch {
      console.warn(`  ! sin ffmpeg: convierte ${img.id}.png a .jpg antes de usarla`);
    }
    console.log(`✓ ${img.id} (${proveedor}, ${(buf.length / 1e6).toFixed(1)} MB)`);
  } catch (e) {
    fallos++;
    console.error(`✗ ${img.id}: ${e.message}`);
  }
}
if (fallos) process.exit(1);
