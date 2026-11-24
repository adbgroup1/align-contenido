#!/usr/bin/env node
// Busca voces con acento mexicano en la biblioteca de ElevenLabs y genera una muestra de cada una con un guion
// de ALIGN para México (con broma), para meterlas en la rotación de voces (H6).
//
//   node scripts/probar-voces.mjs            → 6 voces (mezcla de hombre y mujer)
//   node scripts/probar-voces.mjs --n 8
//
// Salida: ../media/pruebas/voces-mx/<n>-<nombre>.mp3 y ../media/pruebas/voces-mx/LISTA.md (con los enlaces raw).
// Si voces.json no tiene «principal», pone la primera como provisional.
// Necesita ELEVENLABS_API_KEY y el dominio api.elevenlabs.io.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const n = Number(args[args.indexOf("--n") + 1] || 6) || 6;
const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) throw new Error("Falta ELEVENLABS_API_KEY.");
const API = "https://api.elevenlabs.io";
const H = { "xi-api-key": KEY, "Content-Type": "application/json" };

const TEXTO =
  "¿Neta te llegó la quincena el viernes y el lunes ya estás contando monedas? " +
  "Tranqui, no es brujería: es que no tienes sistema. " +
  "Aparta tu ahorro el mismo día que cobras, antes de que el Oxxo se entere. " +
  "Mándaselo a tu cuate que vive a meses sin intereses.";

const buscar = async (params) => {
  const u = new URL(`${API}/v1/shared-voices`);
  Object.entries({ page_size: 40, ...params }).forEach(([k, v]) => u.searchParams.set(k, String(v)));
  const r = await fetch(u, { headers: H });
  if (!r.ok) throw new Error(`shared-voices ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return (await r.json()).voices ?? [];
};

// 1 · Candidatas: acento mexicano en español; si no sale nada, búsqueda por texto
let candidatas = await buscar({ language: "es", accent: "mexican", sort: "usage_character_count_1y" });
if (candidatas.length < n) candidatas.push(...(await buscar({ search: "mexican", language: "es" })));
if (candidatas.length < n) candidatas.push(...(await buscar({ search: "mexicano" })));
const vistos = new Set();
candidatas = candidatas.filter((v) => !vistos.has(v.voice_id) && vistos.add(v.voice_id));
// Mitad hombre y mitad mujer, las más usadas primero
const porGenero = (g) => candidatas.filter((v) => (v.gender ?? "").toLowerCase() === g);
const elegidas = [];
const [h, m] = [porGenero("male"), porGenero("female")];
for (let i = 0; elegidas.length < n && (i < h.length || i < m.length); i++) {
  if (h[i]) elegidas.push(h[i]);
  if (m[i] && elegidas.length < n) elegidas.push(m[i]);
}
for (const v of candidatas) if (elegidas.length < n && !elegidas.includes(v)) elegidas.push(v);
if (!elegidas.length) throw new Error("ElevenLabs no ha devuelto ninguna voz mexicana.");

// 2 · Muestra de cada una (si la voz compartida no está en la cuenta, se añade primero)
const tts = (id) =>
  fetch(`${API}/v1/text-to-speech/${id}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({
      text: TEXTO,
      model_id: "eleven_multilingual_v2",
      language_code: "es",
      voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true, speed: 1.05 },
    }),
  });
const anadir = (v) =>
  fetch(`${API}/v1/voices/add/${v.public_owner_id}/${v.voice_id}`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({ new_name: `ALIGN MX · ${v.name}`.slice(0, 60) }),
  });

const dir = "../media/pruebas/voces-mx";
mkdirSync(dir, { recursive: true });
const raw = "https://raw.githubusercontent.com/adbgroup1/align-contenido/main/media/pruebas/voces-mx";
const filas = [];
for (const [i, v] of elegidas.entries()) {
  const nombre = `${String(i + 1).padStart(2, "0")}-${v.name.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30)}`;
  let id = v.voice_id;
  let r = await tts(id);
  if (!r.ok && v.public_owner_id) {
    const a = await anadir(v);
    if (a.ok) {
      id = (await a.json()).voice_id ?? id;
      r = await tts(id);
    } else {
      console.log(`${v.name}: no se pudo añadir a la cuenta (${a.status}: ${(await a.text()).slice(0, 120)})`);
    }
  }
  if (!r.ok) {
    console.log(`${v.name}: FALLO ${r.status}: ${(await r.text()).slice(0, 160)}`);
    continue;
  }
  writeFileSync(`${dir}/${nombre}.mp3`, Buffer.from(await r.arrayBuffer()));
  console.log(`${nombre}: OK (${id})`);
  filas.push({ n: i + 1, nombre: v.name, id, genero: v.gender ?? "", edad: v.age ?? "", estilo: v.descriptive ?? v.use_case ?? "", acento: v.accent ?? "", url: `${raw}/${nombre}.mp3` });
}

writeFileSync(
  `${dir}/LISTA.md`,
  [
    "# Voces mexicanas para ALIGN (muestras)",
    "",
    `Guion de la muestra: «${TEXTO}»`,
    "",
    "| # | Voz | Género | Edad | Estilo | Acento | ID | Escuchar |",
    "|---|---|---|---|---|---|---|---|",
    ...filas.map((f) => `| ${f.n} | ${f.nombre} | ${f.genero} | ${f.edad} | ${f.estilo} | ${f.acento} | \`${f.id}\` | [mp3](${f.url}) |`),
    "",
    "La voz la decide el bucle (H6): Resultados mete o saca voces de «rotacion» en videos/voces.json.",
  ].join("\n"),
);

// 3 · Principal provisional si no hay ninguna
if (filas.length && existsSync("voces.json")) {
  const voces = JSON.parse(readFileSync("voces.json", "utf8"));
  voces.en_prueba = [...(voces.en_prueba ?? []), ...filas.map(({ nombre, id, genero }) => ({ nombre, id, genero }))]
    .filter((v, i, a) => a.findIndex((w) => w.id === v.id) === i);
  if (!voces.principal) {
    voces.principal = { id: filas[0].id, nombre: filas[0].nombre, provisional: true };
  }
  writeFileSync("voces.json", JSON.stringify(voces, null, 1) + "\n");
}
console.log(`Listo: ${filas.length} muestras en ${dir}`);
