#!/usr/bin/env node
// Genera los efectos de sonido de ALIGN por síntesis, sin derechos de autor ni dependencias.
// Se ejecuta una vez; los .wav quedan en public/sfx/ y se suben al repo.
//   node scripts/sfx.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const SR = 44100;
mkdirSync("public/sfx", { recursive: true });

const wav = (name, data) => {
  const peak = Math.max(...data.map(Math.abs)) || 1;
  const buf = Buffer.alloc(44 + data.length * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + data.length * 2, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(data.length * 2, 40);
  data.forEach((v, i) => buf.writeInt16LE(Math.round((v / peak) * 0.89 * 32767), 44 + i * 2));
  writeFileSync(`public/sfx/${name}.wav`, buf);
  console.log(`${name}.wav  ${(data.length / SR).toFixed(2)} s`);
};

const len = (s) => Math.round(s * SR);
const noise = (n) => Array.from({ length: n }, () => Math.random() * 2 - 1);
// Filtro paso banda de estado variable con frecuencia que cambia en el tiempo
const svf = (x, fc, q = 0.7) => {
  let low = 0, band = 0;
  return x.map((v, i) => {
    const f = 2 * Math.sin((Math.PI * Math.min(fc(i / SR), SR / 6)) / SR);
    low += f * band;
    const high = v - low - q * band;
    band += f * high;
    return band;
  });
};
const lowpass = (x, fc) => {
  const a = Math.exp((-2 * Math.PI * fc) / SR);
  let y = 0;
  return x.map((v) => (y = (1 - a) * v + a * y));
};
const env = (n, att, rel, curve = 2) =>
  Array.from({ length: n }, (_, i) => {
    const t = i / SR, T = n / SR;
    const a = att > 0 ? Math.min(1, t / att) : 1;
    const r = Math.min(1, Math.max(0, (T - t) / rel));
    return a ** curve * r ** curve;
  });
const mul = (x, e) => x.map((v, i) => v * e[i]);
const sine = (n, f, phase = 0) => Array.from({ length: n }, (_, i) => Math.sin(2 * Math.PI * (typeof f === "function" ? f(i / SR) : f) * (i / SR) + phase));
const add = (...xs) => xs[0].map((_, i) => xs.reduce((s, x) => s + (x[i] ?? 0), 0));
const decay = (n, k) => Array.from({ length: n }, (_, i) => Math.exp((-k * i) / SR));

// whoosh: ruido filtrado cuyo tono sube y baja (paso de escena)
{
  const n = len(0.6);
  const x = svf(noise(n), (t) => 400 + 3200 * Math.sin((Math.PI * t) / 0.6), 0.5);
  wav("whoosh", mul(x, env(n, 0.32, 0.28, 2)));
}
// swoosh corto: entrada rápida de texto
{
  const n = len(0.3);
  const x = svf(noise(n), (t) => 900 + 5000 * (t / 0.3), 0.6);
  wav("swoosh", mul(x, env(n, 0.12, 0.18, 2)));
}
// pop: aparece un elemento
{
  const n = len(0.16);
  let ph = 0;
  const x = Array.from({ length: n }, (_, i) => {
    const t = i / SR;
    ph += (2 * Math.PI * (380 + 900 * Math.exp(-t * 40))) / SR;
    return Math.sin(ph);
  });
  wav("pop", mul(x, mul(decay(n, 28), env(n, 0.003, 0.02, 1))));
}
// tick: contador que sube
{
  const n = len(0.04);
  wav("tick", mul(add(sine(n, 2400), mul(noise(n), Array(n).fill(0.3))), decay(n, 180)));
}
// ding: cifra final / momento wow (campana suave)
{
  const n = len(1.6);
  const x = add(sine(n, 1046.5), mul(sine(n, 1568), Array(n).fill(0.5)), mul(sine(n, 2093), Array(n).fill(0.25)));
  wav("ding", mul(x, mul(decay(n, 3.2), env(n, 0.004, 0.05, 1))));
}
// riser: tensión antes del wow
{
  const n = len(1.5);
  const x = svf(noise(n), (t) => 600 + 6000 * (t / 1.5) ** 2, 0.4);
  const tone = sine(n, (t) => 200 + 300 * (t / 1.5));
  wav("riser", mul(add(x, mul(tone, Array(n).fill(0.15))), env(n, 1.4, 0.08, 2)));
}
// impacto: golpe grave al revelar
{
  const n = len(0.8);
  let ph = 0;
  const kick = Array.from({ length: n }, (_, i) => {
    const t = i / SR;
    ph += (2 * Math.PI * (45 + 120 * Math.exp(-t * 30))) / SR;
    return Math.sin(ph);
  });
  const thump = lowpass(noise(n), 300);
  wav("impacto", mul(add(kick, mul(thump, Array(n).fill(2))), mul(decay(n, 5), env(n, 0.002, 0.1, 1))));
}
// click: botón / CTA
{
  const n = len(0.03);
  wav("click", mul(svf(noise(n), () => 4000, 0.3), decay(n, 220)));
}
