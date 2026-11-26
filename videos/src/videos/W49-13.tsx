import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../brand";
import { Bocadillo, Chispas, CtaCrecer, DefEscena, Escena, Fondo, Montaje, Personaje, Pildora, PropsVoz, Rotulo, Sfx, SUELO_Y } from "../kit";

// W49-13 · «Rompe el muro de tu deuda» · Reel · Reto / videojuego con contador · H12
// Ejemplo hipotético: saldo $5,000, 36 % anual + IVA 16 % sobre intereses = 3.48 % al mes (cálculo propio).
// Mes 1: 5,000 × 3.48 % = $174 de intereses; de un pago de $250, $76 van a la deuda.
// Pagando $250/mes: 35 meses y $8,703 pagados. Pagando $1,000/mes: 6 meses y $5,592. (Comprobado en código.)
// Toño (frijol azul con casco de obra) contra el muro (ladrillos con cara burlona y lentes). Todo DIBUJO.

export const EXTRA_W4913: Record<string, number> = { hook: 0.2, porque: 0.4, nivel: 0.5, powerup: 0.3, cae: 0.9, cta: 0.9 };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pesos = (v: number) => "$" + String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const TONO = { color: "#60A5FA", accesorio: "casco" as const, colorAccesorio: COLORS.gold, semilla: 1 };
const TX = 250;
const ROJO = "#B91C1C";
const HIPO = "Ejemplo hipotético · 36 % anual + IVA";

const useSeg = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/* ---------- HUD de videojuego: vida de la deuda ---------- */
const Hud: React.FC<{ vida: number; nivel?: string }> = ({ vida, nivel = "NIVEL 1 · DEUDA" }) => {
  const t = useSeg();
  const k = Math.max(0, Math.min(1, vida / 5000));
  return (
    <div style={{ position: "absolute", top: 400, left: 90, right: 120, fontFamily }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 900, color: COLORS.white, letterSpacing: 3, marginBottom: 8 }}>
        <span>{nivel}</span>
        <span style={{ color: COLORS.red, fontVariantNumeric: "tabular-nums" }}>{pesos(vida)}</span>
      </div>
      <div style={{ height: 40, borderRadius: 8, border: `5px solid ${COLORS.white}`, background: "#1E293B", padding: 4, boxShadow: "0 0 0 4px #0B1224" }}>
        <div style={{ height: "100%", width: `${k * 100}%`, borderRadius: 3, background: `repeating-linear-gradient(90deg, ${COLORS.red} 0 26px, #DC2626 26px 30px)`, boxShadow: `0 0 ${12 + 6 * Math.sin(t * 8)}px ${COLORS.red}` }} />
      </div>
    </div>
  );
};

/* ---------- El muro ---------- */
const COLS = 3;
const FILAS = 6;
const BW = 150;
const BH = 78;
const MX = 560; // izquierda del muro
const MY = SUELO_Y - FILAS * BH; // arriba del muro

const Muro: React.FC<{ grieta?: number; cae?: number; boca?: "burla" | "grita" | "seria"; lentes?: number; nuevos?: number }> = ({ grieta = 0, cae = 0, boca = "burla", lentes = 0, nuevos = 0 }) => {
  const t = useSeg();
  const frame = useCurrentFrame();
  const parpadeo = frame % 80 < 4 ? 0.1 : 1;
  const ladrillos = [];
  for (let f = 0; f < FILAS; f++) {
    for (let c = 0; c < COLS + (f % 2); c++) {
      const off = f % 2 ? -BW / 2 : 0;
      const x = MX + c * BW + off;
      const w = f % 2 && (c === 0 || c === COLS) ? BW / 2 : BW;
      const xx = f % 2 && c > 0 ? x : f % 2 ? MX : x;
      const arriba = f < 3;
      const k = arriba ? cae : 0;
      const dir = c % 2 ? 1 : -1;
      ladrillos.push(
        <div
          key={`${f}-${c}`}
          style={{
            position: "absolute",
            left: xx + dir * k * (200 + f * 60),
            top: MY + f * BH + k * k * 900 - k * 150,
            width: w - 6,
            height: BH - 6,
            background: `linear-gradient(180deg, #DC2626, ${ROJO})`,
            border: "4px solid #7F1D1D",
            borderRadius: 8,
            rotate: `${dir * k * (90 + f * 40)}deg`,
            opacity: 1 - Math.max(0, k - 0.8) * 5,
          }}
        />,
      );
    }
  }
  // cara (en la mitad de abajo si cae la de arriba)
  const caraY = MY + (cae > 0.5 ? 3.7 : 1.8) * BH;
  const cx = MX + (COLS * BW) / 2;
  return (
    <>
      {ladrillos}
      {/* letrero */}
      {cae < 0.3 ? (
        <div style={{ position: "absolute", left: cx, top: MY - 70, translate: "-50% 0", fontFamily, fontWeight: 900, fontSize: 44, color: COLORS.white, background: "#7F1D1D", padding: "6px 22px", borderRadius: 12, border: `4px solid ${COLORS.white}`, whiteSpace: "nowrap", opacity: 1 - cae * 3 }}>
          DEUDA $5,000
        </div>
      ) : null}
      {/* cara */}
      <svg width={300} height={200} viewBox="0 0 300 200" style={{ position: "absolute", left: cx - 150, top: caraY, overflow: "visible" }}>
        {[100, 200].map((ex) => (
          <g key={ex} transform={`translate(${ex} 60) scale(1 ${parpadeo})`}>
            <ellipse rx={30} ry={boca === "grita" ? 36 : 28} fill={COLORS.white} stroke="#450A0A" strokeWidth={5} />
            <circle cx={boca === "burla" ? -8 : 0} cy={4} r={12} fill="#450A0A" />
          </g>
        ))}
        {/* cejas */}
        {boca === "grita" ? (
          <path d="M70 14 L128 24 M230 14 L172 24" stroke="#450A0A" strokeWidth={9} strokeLinecap="round" />
        ) : (
          <path d="M72 30 L128 18 M172 22 L228 30" stroke="#450A0A" strokeWidth={9} strokeLinecap="round" />
        )}
        {boca === "burla" ? <path d="M95 130 Q170 175 215 118" stroke="#450A0A" strokeWidth={10} fill="none" strokeLinecap="round" /> : null}
        {boca === "seria" ? <path d="M110 140 H195" stroke="#450A0A" strokeWidth={10} strokeLinecap="round" /> : null}
        {boca === "grita" ? <ellipse cx={150} cy={150} rx={42} ry={36 + Math.sin(t * 30) * 4} fill="#450A0A" /> : null}
        {/* lentes que se caen */}
        <g transform={`translate(0 ${lentes * lentes * 700}) rotate(${lentes * 50} 150 60)`} opacity={1 - Math.max(0, lentes - 0.85) * 6}>
          <circle cx={100} cy={60} r={42} fill="rgba(199,215,254,0.15)" stroke="#0F172A" strokeWidth={8} />
          <circle cx={200} cy={60} r={42} fill="rgba(199,215,254,0.15)" stroke="#0F172A" strokeWidth={8} />
          <path d="M142 58 H158" stroke="#0F172A" strokeWidth={8} />
        </g>
      </svg>
      {/* grieta */}
      {grieta > 0 ? (
        <svg width={200} height={240} style={{ position: "absolute", left: MX + 20, top: MY + BH * 2.5, overflow: "visible" }}>
          <path d="M20 0 L50 60 L30 110 L70 170 L55 240" stroke="#1F0707" strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray={300} strokeDashoffset={300 - 300 * grieta * 0.35} />
        </svg>
      ) : null}
      {/* ladrillos nuevos que brotan */}
      {[0, 1, 2].map((i) => {
        const k = interpolate(nuevos, [i * 0.25, i * 0.25 + 0.4], [0, 1], clamp);
        if (k <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: MX + 10 + i * 40,
              top: MY + BH * (2.4 + i * 0.9) + (1 - k) * 300,
              width: BW - 6,
              height: BH - 6,
              background: `linear-gradient(180deg, #F87171, #DC2626)`,
              border: `4px solid ${COLORS.white}`,
              borderRadius: 8,
              scale: String(0.5 + 0.5 * k),
              rotate: `${(i - 1) * 6}deg`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily,
              fontSize: 26,
              fontWeight: 900,
              color: COLORS.white,
            }}
          >
            +interés
          </div>
        );
      })}
    </>
  );
};

/* ---------- El mazo ---------- */
const Mazo: React.FC<{ ang: number; texto: string; oro?: boolean; x?: number; y?: number; escala?: number }> = ({ ang, texto, oro, x = TX + 70, y = SUELO_Y - 250, escala = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, rotate: `${ang}deg`, scale: String(escala) }}>
    <div style={{ position: "absolute", left: -12, top: -300, width: 24, height: 320, borderRadius: 12, background: "#92400E", border: "4px solid #451A03" }} />
    <div
      style={{
        position: "absolute",
        left: -120,
        top: -400,
        width: 240,
        height: 120,
        borderRadius: 18,
        background: oro ? "linear-gradient(160deg, #FDE68A, #F59E0B 60%, #B45309)" : "linear-gradient(160deg, #94A3B8, #475569)",
        border: `6px solid ${COLORS.navy}`,
        boxShadow: oro ? `0 0 50px ${COLORS.gold}` : "0 10px 20px rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
        fontWeight: 900,
        fontSize: 54,
        color: COLORS.navy,
      }}
    >
      {texto}
    </div>
  </div>
);

/** Ángulo del mazo: arriba (-60) → golpe (60) en `en` segundos. */
const angGolpe = (t: number, en: number, desde = -70) =>
  t < en ? interpolate(t, [0, en], [desde, -95], clamp) : interpolate(t, [en, en + 0.12, en + 0.5], [-95, 62, 50], clamp);

const Destello: React.FC<{ en: number; x: number; y: number }> = ({ en, x, y }) => {
  const t = useSeg();
  const k = interpolate(t, [en, en + 0.25], [0, 1], clamp);
  if (k <= 0 || k >= 1) return null;
  return (
    <svg width={360} height={360} style={{ position: "absolute", left: x - 180, top: y - 180, opacity: 1 - k }}>
      <path d="M180 0 L205 140 L360 180 L205 220 L180 360 L155 220 L0 180 L155 140 Z" fill={COLORS.white} transform={`scale(${0.4 + k}) translate(${(1 - (0.4 + k)) * 180 / (0.4 + k)} ${(1 - (0.4 + k)) * 180 / (0.4 + k)})`} />
    </svg>
  );
};

/* ---------- Escenas ---------- */
const GOLPE = 0.35;

const Gancho: React.FC<{ congelar?: boolean }> = ({ congelar }) => {
  const t = useSeg();
  const tt = congelar ? 0 : t;
  const vida = tt < GOLPE ? 5000 : 4924;
  return (
    <>
      <Rotulo texto="Golpe de **$250**… y casi ni la rajas" delay={congelar ? -2 : -0.5} size={58} />
      <Hud vida={vida} />
      <Muro grieta={tt < GOLPE ? 0 : 1} boca="burla" />
      <Personaje x={TX} y={SUELO_Y} escala={1.7} {...TONO} expresion={tt < GOLPE + 0.6 ? "enfadado" : "sorpresa"} pose="quieto" mirar="der" />
      <Mazo ang={congelar ? -80 : angGolpe(tt, GOLPE)} texto="$250" />
    </>
  );
};

const Suelo = () => <div style={{ position: "absolute", left: 0, right: 0, top: SUELO_Y, height: 40, background: "#334155", borderTop: "6px solid #64748B" }} />;

const Hook = () => (
  <Escena sinEntrada luz="#7F1D1D" sacudidas={[GOLPE]}>
    <Suelo />
    <Gancho />
    <Destello en={GOLPE} x={MX + 40} y={MY + 260} />
    <Sfx s="impacto" volumen={0.55} en={GOLPE} />
    <Bocadillo texto="¿Eso fue todo, mijo?" x={720} y={560} ancho={460} size={44} delay={2.4} colaX={30} />
    <Sfx s="pop" volumen={0.4} en={2.4} />
  </Escena>
);

const Porque = () => {
  const t = useSeg();
  const parte = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  const grande = interpolate(t, [0.9, 1.5], [0, 1], { ...clamp, easing: (x) => x * x });
  const chico = interpolate(t, [0.9, 1.6], [0, 1], clamp);
  return (
    <Escena luz="#7F1D1D">
      <Suelo />
      <Rotulo texto="**$174** → intereses + IVA · **$76** → tu deuda" size={50} />
      <Hud vida={4924} />
      <Muro grieta={1} boca="burla" />
      {/* ladrillo comelón */}
      <div style={{ position: "absolute", left: 120, top: 640, width: 280, height: 150, borderRadius: 20, background: "#F87171", border: `6px solid ${COLORS.white}`, fontFamily, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 10, scale: String(1 + 0.08 * Math.sin(t * 14) * (grande > 0 && grande < 1 ? 1 : 0)) }}>
        <div style={{ position: "absolute", top: 18, width: 170, height: grande > 0.2 && grande < 0.95 ? 60 : 16, background: "#450A0A", borderRadius: 30 }} />
        <div style={{ fontSize: 26, fontWeight: 900, color: COLORS.white }}>INTERESES + IVA</div>
      </div>
      {/* billete que se parte */}
      <div style={{ position: "absolute", left: interpolate(t, [0, 0.6], [-300, 330], clamp) + grande * -60, top: 900 - grande * 220, scale: String(1 - grande * 0.8), opacity: 1 - Math.max(0, grande - 0.9) * 10 }}>
        <div style={{ width: 300 * (1 - parte * 0.3), height: 130, background: "#86EFAC", border: `5px solid ${COLORS.navy}`, borderRadius: 14, fontFamily, fontWeight: 900, fontSize: 56, color: "#166534", display: "flex", alignItems: "center", justifyContent: "center" }}>{parte < 0.5 ? "$250" : "$174"}</div>
      </div>
      {parte > 0.5 ? (
        <div style={{ position: "absolute", left: interpolate(chico, [0, 1], [560, MX + 60]), top: interpolate(chico, [0, 1], [920, MY + 200]), opacity: 1 - Math.max(0, chico - 0.9) * 10 }}>
          <div style={{ width: 120, height: 90, background: "#86EFAC", border: `5px solid ${COLORS.navy}`, borderRadius: 12, fontFamily, fontWeight: 900, fontSize: 38, color: "#166534", display: "flex", alignItems: "center", justifyContent: "center" }}>$76</div>
        </div>
      ) : null}
      <Personaje x={TX - 60} y={SUELO_Y} escala={1.4} {...TONO} expresion="preocupado" mirar="der" />
      <div style={{ position: "absolute", top: 1150, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Pildora size={30}>{HIPO}</Pildora>
      </div>
      <Sfx s="swoosh" volumen={0.35} en={0.1} />
      <Sfx s="pop" volumen={0.45} en={0.7} />
      <Sfx s="impacto" volumen={0.35} en={1.6} />
    </Escena>
  );
};

const Ladrillos = () => {
  const t = useSeg();
  const n = interpolate(t, [0.2, 1.4], [0, 1], clamp);
  const vida = interpolate(t, [0.2, 1.4], [4924, 4995], clamp);
  return (
    <Escena luz="#7F1D1D" sonidoEntrada="swoosh">
      <Suelo />
      <Rotulo texto="**+intereses** cada mes" size={64} />
      <Hud vida={vida} />
      <Muro grieta={1 - n} boca="burla" nuevos={n} />
      <Personaje x={TX} y={SUELO_Y} escala={1.7} {...TONO} expresion="triste" pose="encoge" mirar="der" />
      {[0, 1, 2].map((i) => (
        <Sfx key={i} s="pop" volumen={0.4} en={0.3 + i * 0.3} />
      ))}
    </Escena>
  );
};

/** Barba que crece (Toño envejece). */
const Barba: React.FC<{ x: number; escala: number; k: number }> = ({ x, escala, k }) => (
  <svg width={200 * escala} height={260 * escala} viewBox="0 0 200 260" style={{ position: "absolute", left: x - 100 * escala, top: SUELO_Y - 260 * escala, overflow: "visible", opacity: k }}>
    <path d={`M56 140 Q100 ${180 + 60 * k} 144 140 Q140 ${210 + 40 * k} 100 ${220 + 40 * k} Q60 ${210 + 40 * k} 56 140 Z`} fill="#E2E8F0" stroke={COLORS.navy} strokeWidth={3} />
  </svg>
);

const Nivel = () => {
  const t = useSeg();
  const meses = Math.round(interpolate(t, [0.1, 1.2], [0, 35], { ...clamp, easing: (x) => 1 - (1 - x) ** 2 }));
  const hoja = Math.floor(t * 14) % 12;
  const MES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  return (
    <Escena luz="#312E81" sacudidas={[1.2]}>
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 50, color: COLORS.gold, letterSpacing: 8 }}>NIVEL: PAGAR $250</div>
      <div style={{ position: "absolute", top: 340, left: 0, right: 0, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 210, color: COLORS.white, lineHeight: 1, fontVariantNumeric: "tabular-nums", textShadow: `0 0 50px ${COLORS.accent}` }}>
        {meses}
        <span style={{ fontSize: 80 }}> meses</span>
      </div>
      <div style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 62, color: COLORS.red, opacity: interpolate(t, [1.2, 1.4], [0, 1], clamp) }}>Pagas $8,703</div>
      {/* calendario que pasa hojas */}
      <div style={{ position: "absolute", left: 640, top: 800, width: 240, height: 260, borderRadius: 20, background: COLORS.paper, border: `6px solid ${COLORS.navy}`, overflow: "hidden", fontFamily, rotate: `${Math.sin(t * 20) * 3}deg` }}>
        <div style={{ height: 70, background: COLORS.red, color: COLORS.white, fontSize: 40, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{MES[hoja]}</div>
        <div style={{ fontSize: 76, fontWeight: 900, color: COLORS.navy, textAlign: "center", lineHeight: "180px" }}>{2026 + Math.floor(meses / 12)}</div>
      </div>
      <Personaje x={TX} y={SUELO_Y} escala={1.7} {...TONO} expresion="triste" pose="encoge" mirar="der" />
      <Barba x={TX} escala={1.7} k={interpolate(t, [0.2, 1.4], [0, 1], clamp)} />
      <div style={{ position: "absolute", top: 1290, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Pildora size={30}>{HIPO}</Pildora>
      </div>
      <Sfx s="riser" volumen={0.3} en={0} />
      <Sfx s="ding" volumen={0.4} en={1.2} />
    </Escena>
  );
};

const PowerUp = () => {
  const t = useSeg();
  const s = interpolate(t, [0.1, 0.5], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  return (
    <Escena luz="#78350F">
      <Suelo />
      <Rotulo texto="POWER-UP: **$1,000** al mes" size={62} />
      <Hud vida={5000} />
      <Muro boca="seria" />
      <Personaje x={TX} y={SUELO_Y} escala={1.7} {...TONO} expresion="feliz" pose="brazos-arriba" mirar="der" salto={0.15} />
      <Mazo ang={-70 + Math.sin(t * 6) * 6} texto="$1,000" oro escala={0.4 + 0.6 * s} />
      <Chispas en={0.3} x={TX + 70} y={SUELO_Y - 600} color={COLORS.gold} n={18} />
      <Sfx s="ding" volumen={0.5} en={0.25} />
      <Sfx s="ding" volumen={0.3} en={0.45} />
    </Escena>
  );
};

const Marcador: React.FC<{ on: number }> = ({ on }) => (
  <div style={{ position: "absolute", top: 380, left: 90, right: 120, display: "flex", gap: 24, opacity: on, translate: `0px ${(1 - on) * -40}px`, fontFamily }}>
    {[
      { m: "$250", d: "35 meses", p: "$8,703", c: COLORS.red },
      { m: "$1,000", d: "6 meses", p: "$5,592", c: COLORS.green },
    ].map((x) => (
      <div key={x.m} style={{ flex: 1, background: "rgba(15,23,42,0.88)", border: `5px solid ${x.c}`, borderRadius: 26, padding: "16px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 34, fontWeight: 900, color: COLORS.light }}>Mazo {x.m}</div>
        <div style={{ fontSize: 64, fontWeight: 900, color: x.c, lineHeight: 1.05 }}>{x.d}</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: COLORS.white }}>Pagas {x.p}</div>
      </div>
    ))}
  </div>
);

const Cae = () => {
  const t = useSeg();
  const G = 0.25;
  const cae = interpolate(t, [G, G + 1.0], [0, 1], clamp);
  const lentes = interpolate(t, [G + 0.1, G + 0.9], [0, 1], clamp);
  const marc = interpolate(t, [1.3, 1.6], [0, 1], clamp);
  return (
    <Escena luz="#14532D" sacudidas={[G]}>
      <Suelo />
      {marc < 1 ? <Hud vida={interpolate(t, [G, G + 0.4], [5000, 4000], clamp)} nivel="NIVEL 2 · POWER-UP" /> : null}
      <Muro cae={cae} boca="grita" lentes={lentes} />
      <Personaje x={TX} y={SUELO_Y} escala={1.7} {...TONO} expresion="feliz" pose="brazos-arriba" mirar="der" />
      <Mazo ang={angGolpe(t, G, -95)} texto="$1,000" oro />
      <Destello en={G} x={MX + 80} y={MY + 150} />
      <Bocadillo texto="¡No manches!" x={800} y={MY + 60} ancho={360} size={50} delay={G + 0.35} colaX={-40} />
      <Marcador on={marc} />
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: marc }}>
        <Pildora size={28}>{HIPO}</Pildora>
      </div>
      <Sfx s="impacto" volumen={0.6} en={G} />
      <Sfx s="swoosh" volumen={0.35} en={G + 0.3} />
      <Sfx s="ding" volumen={0.4} en={1.4} />
      <Chispas en={G} x={MX + 150} y={MY + 150} color={COLORS.gold} n={22} />
    </Escena>
  );
};

const Elige: React.FC = () => {
  const t = useSeg();
  return (
    <Escena luz="#1E3A8A" sonidoEntrada="swoosh">
      <div style={{ position: "absolute", top: 300, left: 90, right: 120, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 90, color: COLORS.white, lineHeight: 1.05 }}>
        ¿<span style={{ color: COLORS.red }}>3 años</span> o <span style={{ color: COLORS.green }}>6 meses</span>?
      </div>
      <div style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", fontFamily, fontWeight: 800, fontSize: 52, color: COLORS.light }}>Tú eliges el mazo</div>
      <Mazo ang={-20 + Math.sin(t * 4) * 5} texto="$250" x={330} y={1250} />
      <Mazo ang={20 - Math.sin(t * 4) * 5} texto="$1,000" oro x={760} y={1250} />
    </Escena>
  );
};

const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const CORTE = Math.round(1.85 * fps);
  const vuelta = interpolate(frame, [dur - 10, dur - 2], [0, 1], clamp);
  return (
    <>
      <Sequence durationInFrames={CORTE} layout="none">
        <Elige />
      </Sequence>
      <Sequence from={CORTE} layout="none">
        <CtaCrecer tipo="compartir" boton="MÁNDASELO" linea="a quien **paga el mínimo** 🧱" />
        <div style={{ position: "absolute", top: 1272, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 28, fontWeight: 700, color: COLORS.navy }}>
          Ejemplo hipotético · Contenido informativo, no es asesoramiento financiero.
        </div>
      </Sequence>
      {vuelta > 0 ? (
        <AbsoluteFill style={{ opacity: vuelta, fontFamily }}>
          <Fondo luz="#7F1D1D" />
          <Suelo />
          <Gancho congelar />
        </AbsoluteFill>
      ) : null}
    </>
  );
};

const ESCENAS: DefEscena[] = [
  { id: "hook", render: () => <Hook /> },
  { id: "porque", render: () => <Porque /> },
  { id: "ladrillos", render: () => <Ladrillos /> },
  { id: "nivel", render: () => <Nivel /> },
  { id: "powerup", render: () => <PowerUp /> },
  { id: "cae", render: () => <Cae /> },
  { id: "cta", subtitulosClaros: true, render: ({ dur }) => <Cta dur={dur} /> },
];

export const W4913: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4913} pista="tech-synthpop.mp3" /> : null;
