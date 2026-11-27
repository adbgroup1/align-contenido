#!/usr/bin/env node
// CASTING DE VOCES MEXICANAS (27 nov). Andrés: «las voces no suenan nada mexicano». Este script:
//   1) busca en la Voice Library voces con acento mexicano, jóvenes y de personaje/redes/conversación (no
//      narradores ni call center), por orden de tendencia;
//   2) opcional (--diseno): diseña con Voice Design voces a medida (chilango, mamá, abuelita, compa…);
//   3) genera de cada una la MISMA muestra con humor, con el modelo eleven_v3 (y etiquetas de actuación);
//   4) hace que Gemini ESCUCHE cada muestra y puntúe de 1 a 10: acento mexicano, coloquial, gracia, claridad;
//   5) deja el ranking en ../media/pruebas/casting/RANKING.md y casting.json;
//   6) con --aplicar, pone en voces.json la rotación (las 4 mejores de narrador) y el reparto de personajes.
//
//   node scripts/casting-voces.mjs --n 12 --diseno --aplicar
//
// Necesita ELEVENLABS_API_KEY (api.elevenlabs.io) y, para puntuar, GEMINI_API_KEY (generativelanguage.googleapis.com).
// Si Gemini falla, el ranking queda sin nota y no se aplica nada (lo dice el resumen).

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const N = Number(args[args.indexOf("--n") + 1] || 12) || 12;
const DISENO = args.includes("--diseno");
const APLICAR = args.includes("--aplicar");
// --repuntuar: no genera nada; vuelve a puntuar con Gemini las muestras de casting.json que se quedaron sin nota
// (p. ej. por un 503) y rehace el ranking (y voces.json con --aplicar). Úsalo con otro GEMINI_MODEL si el de siempre falla.
const REPUNTUAR = args.includes("--repuntuar");
// --ids id[:rol],id[:rol]…: prueba esas voces de la Voice Library (con el rol que se busca: mama, abuelita, tia,
// villano, compa, narrador…) y las AÑADE a casting.json, sin repetir las que ya están. Sirve para los personajes
// cuando Voice Design no está disponible (la clave necesita el permiso voice_generation).
const IDS = args.includes("--ids") ? args[args.indexOf("--ids") + 1].split(",").map((x) => x.split(":")) : null;
const MODELO = process.env.CASTING_MODELO ?? "eleven_v3";
const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) throw new Error("Falta ELEVENLABS_API_KEY.");
const API = "https://api.elevenlabs.io";
const H = { "xi-api-key": KEY, "Content-Type": "application/json" };
const GEMINI = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";

// Muestra: coloquial, con chiste, cambio de tono y etiquetas de actuación (v3). Igual para todas.
const MUESTRA =
  "[excited] ¡No manches, ya cayó la quincena! [laughs] … [sarcastic] Y para el martes ya ando bien bruja, contando moneditas para el camión. " +
  "[sighs] Neta, no es que gane poquito, es que la lana se me va en puro antojito. " +
  "[mischievously] Ahorita te digo el truco… pero no le digas a mi mamá.";
const sinEtiquetas = (x) => x.replace(/\[[^\]]*\]\s*/g, "");

const MALAS = /(corporate|narrat|audiobook|news|call ?center|contact center|documentar|meditat|calm|elegant|ivr|e-?learning|commercial|professional)/i;

const buscar = async (params) => {
  const u = new URL(`${API}/v1/shared-voices`);
  for (const [k, v] of Object.entries({ page_size: 100, ...params })) {
    for (const x of [].concat(v)) u.searchParams.append(k, String(x));
  }
  const r = await fetch(u, { headers: H });
  if (!r.ok) {
    console.warn(`shared-voices ${r.status} con ${u.search}: ${(await r.text()).slice(0, 160)}`);
    return [];
  }
  return (await r.json()).voices ?? [];
};

// 1 · Candidatas, de más a menos filtro
const pasos = [
  { language: "es", accent: "mexican", locale: "es-MX", age: "young", use_cases: ["characters_animation", "social_media", "conversational"], sort: "trending" },
  { language: "es", accent: "mexican", age: "young", sort: "trending" },
  { language: "es", accent: "mexican", sort: "trending" },
  { language: "es", search: "chilango" },
  { language: "es", search: "mexicano joven" },
];
const vistos = new Set();
let cand = [];
for (const p of REPUNTUAR || IDS ? [] : pasos) {
  for (const v of await buscar(p)) {
    if (vistos.has(v.voice_id)) continue;
    vistos.add(v.voice_id);
    const texto = `${v.name} ${v.description ?? ""} ${v.descriptive ?? ""} ${v.use_case ?? ""} ${v.category ?? ""}`;
    if (MALAS.test(texto)) continue;
    // 27 nov: las búsquedas por texto traían voces en inglés o indonesio; solo español con acento mexicano
    if (v.language !== "es" || (v.accent && v.accent !== "mexican")) continue;
    cand.push({ fuente: "biblioteca", id: v.voice_id, owner: v.public_owner_id, nombre: v.name, genero: v.gender, edad: v.age, uso: v.use_case, acento_biblioteca: v.accent, descripcion: (v.description ?? "").slice(0, 160) });
  }
  if (cand.length >= N * 2) break;
}
// mitad y mitad por género
const h = cand.filter((v) => v.genero === "male");
const m = cand.filter((v) => v.genero === "female");
const elegidas = [];
for (let i = 0; elegidas.length < N && (i < h.length || i < m.length); i++) {
  if (h[i]) elegidas.push(h[i]);
  if (m[i] && elegidas.length < N) elegidas.push(m[i]);
}
console.log(`Biblioteca: ${cand.length} candidatas tras filtrar; pruebo ${elegidas.length}.`);

// 2 · Voice Design (opcional)
const DISENOS = [
  { rol: "chilango", genero: "male", desc: "Mexican man, 28 years old, from Mexico City, strong chilango accent, very colloquial Mexican Spanish, TikTok creator energy: fast, playful, witty, friendly sarcasm, like telling gossip to a buddy. Clean close studio mic, no reverb." },
  { rol: "chilanga", genero: "female", desc: "Mexican woman, 26 years old, from Mexico City, natural chilanga accent, colloquial Mexican Spanish, funny and expressive, dramatic reactions, like a best friend venting about money. Clean close studio mic, no reverb." },
  { rol: "mama", genero: "female", desc: "Mexican mother in her fifties from Mexico City, warm but scolding, classic Mexican mom intonation, colloquial Mexican Spanish, slightly exasperated and funny. Clean studio mic." },
  { rol: "abuelita", genero: "female", desc: "Elderly Mexican grandmother, 78 years old, sweet, slow, raspy, rural-urban Mexican accent, tender and wise, colloquial Mexican Spanish. Clean studio mic." },
  { rol: "compa", genero: "male", desc: "Young Mexican guy, 24, northern Mexican accent from Monterrey, laid back, always asking to borrow money, charming and shameless, colloquial Mexican Spanish. Clean studio mic." },
];
const disenar = async (d) => {
  const r = await fetch(`${API}/v1/text-to-voice/design`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({ voice_description: d.desc, model_id: "eleven_ttv_v3", text: sinEtiquetas(MUESTRA).replace("…", "").slice(0, 999), guidance_scale: 4 }),
  });
  if (!r.ok) {
    console.warn(`Voice Design ${d.rol}: ${r.status} ${(await r.text()).slice(0, 200)}`);
    return null;
  }
  const j = await r.json();
  return j.previews ?? [];
};

const dir = "../media/pruebas/casting";
mkdirSync(dir, { recursive: true });
const raw = "https://raw.githubusercontent.com/adbgroup1/align-contenido/main/media/pruebas/casting";

const tts = async (id, modelo = MODELO) => {
  const v3 = /v3|v4/.test(modelo);
  const r = await fetch(`${API}/v1/text-to-speech/${id}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({ text: v3 ? MUESTRA : sinEtiquetas(MUESTRA), model_id: modelo, language_code: "es", voice_settings: { stability: 0.4, similarity_boost: 0.75 } }),
  });
  if (!r.ok) return { error: `${r.status} ${(await r.text()).slice(0, 160)}` };
  const j = await r.json();
  return { audio: Buffer.from(j.audio_base64, "base64"), alignment: !!(j.alignment ?? j.normalized_alignment) };
};
const anadir = (v) =>
  fetch(`${API}/v1/voices/add/${v.owner}/${v.id}`, { method: "POST", headers: H, body: JSON.stringify({ new_name: `ALIGN MX · ${v.nombre}`.slice(0, 60) }) });

// 4 · Gemini escucha y puntúa
const puntuar = async (buf) => {
  if (!GEMINI) return null;
  const prompt =
    "Eres director de casting en Ciudad de México. Escucha esta voz en off para reels de humor sobre dinero dirigidos a mexicanos de 22 a 35 años. " +
    "Puntúa de 1 a 10, con criterio duro (un 8 es una voz que un chilango juraría que es de CDMX): " +
    "acento (¿suena claramente mexicano, de CDMX o del centro, y no latino neutro, español ni caribeño?), " +
    "coloquial (¿suena a un cuate hablando y no a locutor, comercial o call center?), " +
    "gracia (¿transmite humor, actitud, cambios de tono?), claridad (¿se entiende todo?), " +
    "y edad_aparente (número). Devuelve SOLO JSON: {\"acento\":n,\"coloquial\":n,\"gracia\":n,\"claridad\":n,\"edad_aparente\":n,\"genero\":\"hombre|mujer\",\"rol_ideal\":\"narrador|narradora|mama|abuelita|compa|tia|villano|otro\",\"comentario\":\"una línea\"}";
  for (let intento = 0; intento < 3; intento++) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI}`, {
      method: "POST",
      signal: AbortSignal.timeout(180000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ inline_data: { mime_type: "audio/mpeg", data: buf.toString("base64") } }, { text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
      }),
    }).catch((e) => ({ ok: false, status: e.name }));
    if (r.ok) {
      const j = await r.json();
      try {
        return JSON.parse(j.candidates?.[0]?.content?.parts?.[0]?.text ?? "null");
      } catch {
        return null;
      }
    }
    console.warn(`Gemini ${GEMINI_MODEL} ${r.status}`);
    await new Promise((s) => setTimeout(s, r.status === 429 ? 20000 : 4000));
  }
  return null;
};

const filas = REPUNTUAR || IDS ? JSON.parse(readFileSync(`${dir}/casting.json`, "utf8")).filas : [];
if (IDS) {
  // busca cada voz en la biblioteca (por su nombre no se puede: se pide la página de voces mexicanas y se filtra)
  const todas = [];
  for (const p of [{ gender: "male" }, { gender: "female" }, { gender: "male", sort: "cloned_by_count" }, { gender: "female", sort: "cloned_by_count" }, { gender: "female", age: "old" }, { gender: "male", age: "old" }, { gender: "female", age: "middle_aged" }, { gender: "male", age: "middle_aged" }])
    todas.push(...(await buscar({ language: "es", accent: "mexican", ...p })));
  for (const [id, rol] of IDS) {
    if (filas.some((f) => f.id === id)) continue;
    const v = todas.find((x) => x.voice_id === id);
    if (!v) {
      console.warn(`${id}: no está en la Voice Library (español, acento mexicano)`);
      continue;
    }
    elegidas.push({ fuente: "biblioteca", rol, id, owner: v.public_owner_id, nombre: v.name, genero: v.gender, edad: v.age, uso: v.use_case, acento_biblioteca: v.accent, descripcion: (v.description ?? "").slice(0, 160) });
  }
}
if (REPUNTUAR) {
  for (const f of filas) {
    if (f.nota || !existsSync(`${dir}/${f.archivo}`)) continue;
    if (f.acento_biblioteca && f.acento_biblioteca !== "mexican") continue; // no entran igualmente: no gasto cuota
    f.modelo_nota = GEMINI_MODEL;
    f.nota = await puntuar(readFileSync(`${dir}/${f.archivo}`));
    console.log(`${f.nombre}: ${f.nota ? `acento ${f.nota.acento}, coloquial ${f.nota.coloquial}, gracia ${f.nota.gracia}` : "sin nota"}`);
  }
}
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 28);

const base = IDS ? filas.length : 0; // con --ids, los archivos nuevos siguen la numeración de casting.json
for (const [i, v] of elegidas.entries()) {
  let r = await tts(v.id);
  if (r.error && v.owner) {
    await anadir(v);
    r = await tts(v.id);
  }
  if (r.error) {
    console.warn(`${v.nombre}: ${r.error}`);
    continue;
  }
  const archivo = `${String(i + 1 + base).padStart(2, "0")}-${slug(v.nombre)}.mp3`;
  writeFileSync(`${dir}/${archivo}`, r.audio);
  const nota = await puntuar(r.audio);
  filas.push({ ...v, archivo, alignment: r.alignment, nota });
  console.log(`${v.nombre}: ${nota ? `acento ${nota.acento}, coloquial ${nota.coloquial}, gracia ${nota.gracia}` : "sin nota"}`);
}

if (DISENO && !REPUNTUAR && !IDS) {
  for (const d of DISENOS) {
    const previews = await disenar(d);
    if (!previews) continue;
    for (const [k, p] of previews.entries()) {
      const buf = Buffer.from(p.audio_base_64, "base64");
      const archivo = `d-${d.rol}-${k + 1}.mp3`;
      writeFileSync(`${dir}/${archivo}`, buf);
      const nota = await puntuar(buf);
      filas.push({ fuente: "diseno", rol: d.rol, genero: d.genero, generado: p.generated_voice_id, desc: d.desc, nombre: `Diseño ${d.rol} ${k + 1}`, archivo, nota });
      console.log(`Diseño ${d.rol} ${k + 1}: ${nota ? `acento ${nota.acento}, coloquial ${nota.coloquial}` : "sin nota"}`);
    }
  }
}

const total = (f) => (f.nota ? f.nota.acento * 0.4 + f.nota.coloquial * 0.3 + f.nota.gracia * 0.2 + f.nota.claridad * 0.1 : -1);
filas.sort((a, b) => total(b) - total(a));
writeFileSync(`${dir}/casting.json`, JSON.stringify({ fecha: new Date().toISOString(), modelo: MODELO, muestra: MUESTRA, filas }, null, 1));
const md = [
  "# Casting de voces mexicanas",
  "",
  `*${new Date().toISOString().slice(0, 10)} · modelo ${MODELO} · nota de Gemini (${GEMINI_MODEL}) escuchando (acento 40 %, coloquial 30 %, gracia 20 %, claridad 10 %)*`,
  "",
  `Muestra: «${sinEtiquetas(MUESTRA)}»`,
  "",
  "| # | Voz | Fuente | Total | Acento | Coloquial | Gracia | Rol ideal | Comentario | Escuchar |",
  "|---|---|---|---|---|---|---|---|---|---|",
  ...filas.map(
    (f, i) =>
      `| ${i + 1} | ${f.nombre} | ${f.fuente} | ${total(f) >= 0 ? total(f).toFixed(1) : "—"} | ${f.nota?.acento ?? "—"} | ${f.nota?.coloquial ?? "—"} | ${f.nota?.gracia ?? "—"} | ${f.nota?.rol_ideal ?? f.rol ?? ""} | ${(f.nota?.comentario ?? "").replace(/\|/g, "/")} | [mp3](${raw}/${f.archivo}) |`,
  ),
  "",
].join("\n");
writeFileSync(`${dir}/RANKING.md`, md);
console.log(md);

// 6 · Aplicar a voces.json: solo voces con acento ≥ 7
if (APLICAR) {
  if (!filas.some((f) => f.nota)) {
    console.log("Sin notas de Gemini: no aplico nada.");
    process.exit(0);
  }
  // 27 nov: Gemini dio 9 de acento «chilango» a una voz de España de control, así que su nota sola no basta: además
  // la voz tiene que estar etiquetada con acento mexicano en la biblioteca (o ser un diseño a medida mexicano).
  const buenas = filas.filter((f) => f.nota && f.nota.acento >= 7 && f.nota.claridad >= 6 && (f.fuente === "diseno" || f.acento_biblioteca === "mexican"));
  // guarda las voces diseñadas buenas (ocupan hueco: solo la mejor de cada rol)
  const guardar = async (f) => {
    if (f.fuente !== "diseno") return f.id;
    const r = await fetch(`${API}/v1/text-to-voice`, {
      method: "POST",
      headers: H,
      body: JSON.stringify({ voice_name: `ALIGN MX · ${f.rol}`, voice_description: f.desc, generated_voice_id: f.generado, labels: { accent: "mexican", rol: f.rol } }),
    });
    if (!r.ok) {
      console.warn(`No se pudo guardar ${f.nombre}: ${r.status}`);
      return null;
    }
    return (await r.json()).voice_id;
  };
  const voces = JSON.parse(readFileSync("voces.json", "utf8"));
  const usados = new Set();
  const mejorDe = (cond) => buenas.find((f) => cond(f) && !usados.has(f.archivo));
  const personajes = {};
  for (const rol of ["mama", "abuelita", "compa", "tia", "villano"]) {
    // primero la voz que se buscó para ese rol (--ids id:rol o un diseño); si no, la que Gemini ve para ese rol
    const f = mejorDe((x) => x.rol === rol) ?? mejorDe((x) => !x.rol && x.nota.rol_ideal === rol);
    if (!f) continue;
    const id = await guardar(f);
    if (id) {
      personajes[rol] = { id, nombre: f.nombre, nota: total(f) };
      usados.add(f.archivo);
    }
  }
  const narr = [];
  for (const f of buenas) {
    if (narr.length >= 4 || usados.has(f.archivo)) continue;
    if (f.rol && !["narrador", "narradora", "chilango", "chilanga"].includes(f.rol)) continue; // voces buscadas para un personaje
    if (!["narrador", "narradora", "otro", undefined].includes(f.nota.rol_ideal) && f.fuente === "diseno" && !["chilango", "chilanga"].includes(f.rol)) continue;
    const id = await guardar(f);
    if (!id) continue;
    narr.push({ id, nombre: f.nombre, genero: f.genero, nota: total(f) });
    usados.add(f.archivo);
  }
  if (narr.length >= 2) {
    voces.rotacion_anterior = voces.rotacion;
    voces.rotacion = narr.map((x) => x.id);
    voces.principal = { id: narr[0].id, nombre: narr[0].nombre, ganadora: false };
    voces.en_prueba = narr;
  }
  voces.personajes = { ...(voces.personajes ?? {}), ...personajes };
  voces.modelo = MODELO;
  voces.casting = `media/pruebas/casting/RANKING.md (${new Date().toISOString().slice(0, 10)})`;
  writeFileSync("voces.json", JSON.stringify(voces, null, 1) + "\n");
  console.log(`voces.json: rotación ${narr.map((x) => x.nombre).join(", ") || "(sin cambios)"}; personajes ${Object.keys(personajes).join(", ") || "(ninguno)"}`);
}
if (!existsSync(`${dir}/RANKING.md`)) process.exit(1);
