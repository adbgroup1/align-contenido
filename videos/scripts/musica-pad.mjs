#!/usr/bin/env node
// Pista de reserva: un pad ambiental suave generado por síntesis (sin derechos de autor).
// Solo se usa si no hay pistas de public/musica/ elegidas por Andrés.
//   node scripts/musica-pad.mjs   → public/musica/pad-align.wav (40 s, se repite en bucle)
import { mkdirSync, writeFileSync } from "node:fs";

const SR = 44100;
const T = 40;
const n = T * SR;
const L = new Float32Array(n);
const R = new Float32Array(n);
const midi = (m) => 440 * 2 ** ((m - 69) / 12);
// La menor – Fa – Do – Sol, 5 s cada acorde (tranquilo, optimista)
const acordes = [
  [57, 60, 64, 69],
  [53, 57, 60, 65],
  [48, 55, 60, 64],
  [55, 59, 62, 67],
];
const dur = 5;
for (let k = 0; k < T / dur; k++) {
  const notas = acordes[k % 4];
  const ini = k * dur - 0.8; // se solapan para que no haya cortes
  for (const [j, m] of notas.entries()) {
    const f = midi(m);
    for (let d = -1; d <= 1; d += 2) {
      const ff = f * (1 + d * 0.0025);
      let ph = Math.random() * 6.28;
      for (let i = Math.max(0, Math.floor(ini * SR)); i < Math.min(n, Math.floor((ini + dur + 1.6) * SR)); i++) {
        const t = i / SR - ini;
        const a = Math.min(1, t / 1.6) * Math.min(1, Math.max(0, (dur + 1.6 - t) / 1.6));
        ph += (2 * Math.PI * ff) / SR;
        const v = (Math.sin(ph) + 0.18 * Math.sin(2 * ph) + 0.06 * Math.sin(3 * ph)) * a * 0.09;
        if (d < 0) L[i] += v * (j % 2 ? 0.7 : 1);
        else R[i] += v * (j % 2 ? 1 : 0.7);
      }
    }
  }
  // bajo suave
  const fb = midi(notas[0] - 12);
  let ph = 0;
  for (let i = Math.max(0, Math.floor(ini * SR)); i < Math.min(n, Math.floor((ini + dur + 1.6) * SR)); i++) {
    const t = i / SR - ini;
    const a = Math.min(1, t / 1.2) * Math.min(1, Math.max(0, (dur + 1.6 - t) / 1.6));
    ph += (2 * Math.PI * fb) / SR;
    const v = Math.sin(ph) * a * 0.12;
    L[i] += v;
    R[i] += v;
  }
}
// arpegio lejano en corcheas (da movimiento sin molestar)
const bpm = 96;
const paso = 60 / bpm / 2;
for (let s = 0; s * paso < T; s++) {
  const t0 = s * paso;
  const notas = acordes[Math.floor(t0 / dur) % 4];
  const m = notas[[0, 2, 1, 3, 2, 1, 3, 2][s % 8]] + 12;
  const f = midi(m);
  let ph = 0;
  for (let i = Math.floor(t0 * SR); i < Math.min(n, Math.floor((t0 + 0.9) * SR)); i++) {
    const t = i / SR - t0;
    ph += (2 * Math.PI * f) / SR;
    const v = Math.sin(ph) * Math.exp(-t * 5) * Math.min(1, t / 0.01) * 0.045;
    const pan = s % 2 ? 0.35 : 0.65;
    L[i] += v * (1 - pan) * 2;
    R[i] += v * pan * 2;
  }
}
// eco sencillo para dar sensación de lejanía
const del = Math.floor(0.33 * SR);
for (let i = del; i < n; i++) {
  L[i] += R[i - del] * 0.3;
  R[i] += L[i - del] * 0.3;
}
// lazo suave: igualar principio y final para que el bucle no salte
const fade = 1.5 * SR;
for (let i = 0; i < fade; i++) {
  const a = i / fade;
  L[i] = L[i] * a + L[n - fade + i] * (1 - a);
  R[i] = R[i] * a + R[n - fade + i] * (1 - a);
}
const len = n - fade;
let peak = 0;
for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const buf = Buffer.alloc(44 + len * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + len * 4, 4); buf.write("WAVE", 8);
buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write("data", 36); buf.writeUInt32LE(len * 4, 40);
for (let i = 0; i < len; i++) {
  buf.writeInt16LE(Math.round((L[i] / peak) * 0.8 * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round((R[i] / peak) * 0.8 * 32767), 46 + i * 4);
}
mkdirSync("public/musica", { recursive: true });
writeFileSync("public/musica/pad-align.wav", buf);
console.log(`pad-align.wav ${(len / SR).toFixed(1)} s`);
