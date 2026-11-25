import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../brand";
import {
  Bocadillo,
  Chispas,
  Cifra,
  CtaCrecer,
  DefEscena,
  ease,
  Escena,
  Fondo,
  Montaje,
  Personaje,
  Pildora,
  PropsVoz,
  Rotulo,
  Sfx,
  SUELO_Y,
  useSpring,
} from "../kit";

// W49-07 · «Mismo aguinaldo, dos eneros» · Reel · Comparación A/B en pantalla partida · H5 · CTA COMPARTIR
// Ejemplo: 15 días de un sueldo de $12,000 → $6,000 de aguinaldo (LFT art. 87); $6,000 ÷ 3 = $2,000.
// Beto (rojo, gorra) y Memo (verde, lentes) siempre iguales. Todo DIBUJO.

export const EXTRA_W4907: Record<string, number> = { hook: 0.2, enero: 0.3, cuesta: 0.7, cta: 0.5 };

const BETO = COLORS.red;
const MEMO = COLORS.green;
const IZQ = 270; // centro de la mitad izquierda
const DER = 790; // centro de la mitad derecha (respeta los 120 px de la derecha)
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pesos = (v: number) => "$" + String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/* ---------- Dibujos propios ---------- */

/** Sobre de papel con su etiqueta (aguinaldo, gustos, enero, colchón). */
const Sobre: React.FC<{ texto: string; cifra?: string; ancho?: number; color?: string; lleno?: boolean; gorro?: boolean }> = ({
  texto,
  cifra,
  ancho = 230,
  color = COLORS.paper,
  lleno = true,
  gorro = false,
}) => {
  const h = ancho * 0.64;
  return (
    <div style={{ position: "relative", width: ancho, height: h }}>
      <svg width={ancho} height={h} viewBox="0 0 100 64" style={{ overflow: "visible", filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.35))" }}>
        {lleno ? <rect x={14} y={-10} width={72} height={30} rx={3} fill={COLORS.green} stroke={COLORS.navy} strokeWidth={2} /> : null}
        <rect x={2} y={4} width={96} height={58} rx={6} fill={color} stroke={COLORS.navy} strokeWidth={2.5} />
        <path d="M2 8 L50 36 L98 8" fill="none" stroke={COLORS.navy} strokeWidth={2.5} strokeLinejoin="round" opacity={0.5} />
        {gorro ? (
          <g transform="translate(80 2) rotate(20)">
            <path d="M-14 0 L14 0 L4 -30 Z" fill={COLORS.red} stroke={COLORS.navy} strokeWidth={2} strokeLinejoin="round" />
            <rect x={-16} y={-3} width={32} height={7} rx={3.5} fill={COLORS.white} stroke={COLORS.navy} strokeWidth={1.5} />
            <circle cx={4} cy={-31} r={5} fill={COLORS.white} stroke={COLORS.navy} strokeWidth={1.5} />
          </g>
        ) : null}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: h * 0.42,
          textAlign: "center",
          fontFamily,
          fontWeight: 900,
          color: COLORS.navy,
          fontSize: ancho * 0.13,
          lineHeight: 1,
        }}
      >
        {texto}
        {cifra ? <div style={{ fontSize: ancho * 0.17, color: COLORS.blue }}>{cifra}</div> : null}
      </div>
    </div>
  );
};

/** Bolsa de compras con asa. */
const Bolsa: React.FC<{ color: string; ancho?: number; letrero?: string }> = ({ color, ancho = 110, letrero }) => (
  <div style={{ position: "relative", width: ancho, height: ancho * 1.15 }}>
    <svg width={ancho} height={ancho * 1.15} viewBox="0 0 100 115" style={{ overflow: "visible", filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.35))" }}>
      <path d="M32 30 Q32 6 50 6 Q68 6 68 30" fill="none" stroke={COLORS.navy} strokeWidth={6} strokeLinecap="round" />
      <path d="M10 30 H90 L84 112 H16 Z" fill={color} stroke={COLORS.navy} strokeWidth={4} strokeLinejoin="round" />
      <rect x={20} y={40} width={22} height={8} rx={4} fill={COLORS.white} opacity={0.35} />
      <circle cx={38} cy={58} r={4} fill={COLORS.navy} />
      <circle cx={62} cy={58} r={4} fill={COLORS.navy} />
      <path d="M40 76 Q50 84 60 76" fill="none" stroke={COLORS.navy} strokeWidth={4} strokeLinecap="round" />
    </svg>
    {letrero ? (
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: -62,
          translate: "-50% 0",
          whiteSpace: "nowrap",
          background: COLORS.white,
          color: COLORS.red,
          border: `4px solid ${COLORS.navy}`,
          borderRadius: 14,
          padding: "4px 12px",
          fontFamily,
          fontWeight: 900,
          fontSize: 30,
          rotate: "-6deg",
        }}
      >
        {letrero}
      </div>
    ) : null}
  </div>
);

/** Algo que cae con muelle hasta su sitio (pop y rebote). */
const Cae: React.FC<{ x: number; y: number; delay?: number; desde?: number; children: React.ReactNode; rot?: number }> = ({
  x,
  y,
  delay = 0,
  desde = 260,
  children,
  rot = 0,
}) => {
  const s = useSpring(delay, 9, 0.6);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y - (1 - s) * desde,
        translate: "-50% -50%",
        opacity: Math.min(1, s * 3),
        rotate: `${rot * (1 - s)}deg`,
        scale: String(0.6 + 0.4 * Math.min(1, s)),
      }}
    >
      {children}
    </div>
  );
};

const Divisor: React.FC<{ opacidad?: number }> = ({ opacidad = 1 }) => {
  const s = Math.max(0.6, useSpring(0, 18, 0.8));
  return (
    <div
      style={{
        position: "absolute",
        left: 532,
        top: 420,
        width: 8,
        height: 840 * s,
        borderRadius: 4,
        background: `linear-gradient(180deg, ${BETO}, ${COLORS.white}, ${MEMO})`,
        boxShadow: `0 0 30px ${COLORS.white}88`,
        opacity: 0.8 * opacidad,
      }}
    />
  );
};

const Nombre: React.FC<{ x: number; texto: string; color: string; y?: number; opacidad?: number }> = ({ x, texto, color, y = 430, opacidad = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      translate: "-50% 0",
      fontFamily,
      fontWeight: 900,
      fontSize: 64,
      letterSpacing: 4,
      color,
      opacity: opacidad,
      textShadow: `0 0 30px ${color}88`,
    }}
  >
    {texto}
  </div>
);

/** Composición del gancho (se reutiliza al final para el bucle). */
const Partida: React.FC<{ congelar?: boolean }> = ({ congelar = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = congelar ? 0 : frame / fps;
  // los sobres ya se ven en el fotograma 0 y caen a las manos a los 0,25 s
  const caida = interpolate(t, [0, 0.25], [0, 1], { ...clamp, easing: ease });
  const bote = t > 0.25 && t < 0.6 ? Math.sin(((t - 0.25) / 0.35) * Math.PI) * 18 : 0;
  const ySobre = 930 + (1 - caida) * -110 - bote;
  return (
    <>
      <Rotulo texto="Mismo aguinaldo. **Dos eneros.**" delay={congelar ? -2 : -0.3} size={56} />
      <Divisor />
      <Nombre x={IZQ} texto="BETO" color={BETO} y={470} />
      <Nombre x={DER} texto="MEMO" color={MEMO} y={470} />
      <Personaje x={IZQ} y={SUELO_Y} escala={1.4} color={BETO} expresion="sorpresa" pose="brazos-arriba" accesorio="gorra" colorAccesorio={COLORS.navy} semilla={0} />
      <Personaje x={DER} y={SUELO_Y} escala={1.4} color={MEMO} expresion="sorpresa" pose="brazos-arriba" accesorio="gafas" semilla={2} />
      <div style={{ position: "absolute", left: IZQ, top: ySobre - 190, translate: "-50% 0", rotate: "-8deg" }}>
        <Sobre texto="Aguinaldo" cifra="$6,000" ancho={240} />
      </div>
      <div style={{ position: "absolute", left: DER, top: ySobre - 190, translate: "-50% 0", rotate: "8deg" }}>
        <Sobre texto="Aguinaldo" cifra="$6,000" ancho={240} />
      </div>
    </>
  );
};

/* ---------- Escenas ---------- */

const Hook = () => (
  <Escena sinEntrada luz="#7F1D1D" sacudidas={[0.25]}>
    <Sfx s="impacto" volumen={0.5} />
    <Sfx s="pop" volumen={0.45} en={0.25} />
    <Partida />
    <div style={{ position: "absolute", top: 412, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <Pildora delay={0.4} size={32}>
        Ejemplo: 15 días de un sueldo de $12,000
      </Pildora>
    </div>
  </Escena>
);

const BOLSAS: [number, number, string][] = [
  [110, 860, COLORS.gold],
  [430, 840, COLORS.accent],
  [90, 1100, COLORS.blue],
  [455, 1090, "#EC4899"],
  [270, 700, COLORS.gold],
  [150, 980, "#A855F7"],
];

const Gasta = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Escena luz="#7F1D1D">
      <Divisor />
      <Nombre x={IZQ} texto="BETO" color={BETO} />
      <Nombre x={DER} texto="MEMO" color={MEMO} opacidad={0.45} />
      {/* contador del sobre de Beto */}
      <div style={{ position: "absolute", left: IZQ, top: 520, translate: "-50% 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily, fontWeight: 800, fontSize: 34, color: COLORS.light }}>Día 1–2</div>
        <Cifra a={0} de={6000} inicio={0.2} fin={2.4} size={92} color={BETO} formato={pesos} />
      </div>
      <Personaje x={IZQ} y={SUELO_Y} escala={1.4} color={BETO} expresion="feliz" pose="brazos-arriba" accesorio="gorra" colorAccesorio={COLORS.navy} salto={1.6} />
      {BOLSAS.map(([x, y, c], i) => (
        <Cae key={i} x={x} y={y} delay={0.25 + i * 0.3} desde={-120} rot={i % 2 ? 25 : -25}>
          <Bolsa color={c} ancho={100} />
        </Cae>
      ))}
      {BOLSAS.map((_, i) => (i % 2 === 0 ? <Sfx key={i} s="pop" volumen={0.32} en={0.25 + i * 0.3} /> : null))}
      <Bocadillo texto="¡Me lo merezco!" x={IZQ} y={660} ancho={400} size={50} delay={1.45} colaX={0} />
      {/* Memo, quieto y en segundo plano */}
      <div style={{ opacity: 0.5 + 0.1 * Math.sin(frame / fps) }}>
        <Personaje x={DER} y={SUELO_Y} escala={1.4} color={MEMO} expresion="pensativo" pose="piensa" accesorio="gafas" mirar="izq" semilla={2} />
        <div style={{ position: "absolute", left: DER - 150, top: 920, rotate: "4deg" }}>
          <Sobre texto="Aguinaldo" cifra="$6,000" ancho={200} />
        </div>
      </div>
    </Escena>
  );
};

const Parte = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const corte = 0.45;
  const sCorte = interpolate(t, [corte - 0.15, corte], [1, 0], clamp);
  // el sobre de «Gustos» se pone el gorrito y se va a la posada
  const vaPosada = interpolate(t, [3.3, 4.6], [0, 1], { ...clamp, easing: Easing2 });
  const SOBRES: [string, number][] = [
    ["Gustos", 0],
    ["Enero", 1],
    ["Colchón", 2],
  ];
  return (
    <Escena luz="#14532D">
      <Divisor />
      <Nombre x={IZQ} texto="BETO" color={BETO} opacidad={0.45} />
      <Nombre x={DER} texto="MEMO" color={MEMO} />
      {/* Beto: sin sobre, rodeado de bolsas */}
      <div style={{ opacity: 0.55 }}>
        <Personaje x={IZQ} y={SUELO_Y} escala={1.4} color={BETO} expresion="neutral" pose="quieto" accesorio="gorra" colorAccesorio={COLORS.navy} mirar="der" />
        {BOLSAS.slice(0, 4).map(([x, y, c], i) => (
          <div key={i} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%" }}>
            <Bolsa color={c} ancho={90} />
          </div>
        ))}
        <div style={{ position: "absolute", left: IZQ, top: 560, translate: "-50% 0", fontFamily, fontWeight: 900, fontSize: 92, color: BETO }}>$0</div>
      </div>
      <Personaje x={DER} y={SUELO_Y} escala={1.4} color={MEMO} expresion="feliz" pose="senala" accesorio="gafas" mirar="izq" semilla={2} />
      {/* tijeretazo: el sobre grande se parte en tres */}
      <div style={{ position: "absolute", left: DER, top: 620, translate: "-50% 0", opacity: sCorte, scale: String(1 + (1 - sCorte) * 0.3) }}>
        <Sobre texto="Aguinaldo" cifra="$6,000" ancho={240} />
      </div>
      <TijeraCorte x={DER} y={700} en={corte} />
      <Sfx s="swoosh" volumen={0.4} en={corte - 0.1} />
      {SOBRES.map(([txt, i]) => {
        const x = 615 + i * 125;
        const y = 690 + i * 0;
        const esGustos = i === 0;
        return (
          <div
            key={txt}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              translate: esGustos ? `${vaPosada * 520}px ${-vaPosada * 120}px` : undefined,
              rotate: esGustos ? `${Math.sin(t * 14) * 6 * vaPosada}deg` : undefined,
            }}
          >
            <Cae x={x} y={y} delay={corte + 0.1 + i * 0.55} desde={-80}>
              <Sobre texto={txt} cifra="$2,000" ancho={118} gorro={esGustos && t > 3.1} />
            </Cae>
          </div>
        );
      })}
      {[0, 1, 2].map((i) => (
        <Sfx key={i} s="pop" volumen={0.38} en={corte + 0.1 + i * 0.55} />
      ))}
      {t > 3.1 ? (
        <div style={{ position: "absolute", left: 700, top: 560, fontFamily, fontWeight: 900, fontSize: 34, color: COLORS.gold, opacity: interpolate(t, [3.1, 3.4, 4.4, 4.7], [0, 1, 1, 0], clamp), rotate: "-6deg" }}>
          ¡a la posada! 🎄
        </div>
      ) : null}
    </Escena>
  );
};
const Easing2 = (x: number) => x * x;

const TijeraCorte: React.FC<{ x: number; y: number; en: number }> = ({ x, y, en }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame / fps, [en - 0.3, en + 0.1], [0, 1], clamp);
  const o = interpolate(frame / fps, [en - 0.3, en - 0.2, en + 0.2, en + 0.4], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: x - 180 + p * 360, top: y, translate: "-50% -50%", opacity: o, fontSize: 90 }}>
      ✂️
      <div style={{ position: "absolute", left: -p * 360 + 40, top: 50, width: p * 360, height: 6, background: COLORS.white, borderRadius: 3, boxShadow: `0 0 20px ${COLORS.white}` }} />
    </div>
  );
};

const DIAS = ["20 DIC", "24 DIC", "25 DIC", "31 DIC", "1 ENE", "6 ENE", "10 ENE", "13 ENE", "15 ENE"];

const Enero = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const idx = Math.min(DIAS.length - 1, Math.floor(interpolate(t, [0.05, 0.95], [0, DIAS.length - 1], clamp)));
  const fijo = idx === DIAS.length - 1;
  const golpe = useSpring(1.0, 8, 0.6);
  const pagina = (t * 9.5) % 1;
  const [dia, mes] = DIAS[idx].split(" ");
  return (
    <Escena fondo="azul" sacudidas={[1.0]}>
      {DIAS.slice(0, -1).map((_, i) => (
        <Sfx key={i} s="tick" volumen={0.25} en={0.05 + (i * 0.9) / (DIAS.length - 1)} />
      ))}
      <Sfx s="impacto" volumen={0.45} en={1.0} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", top: -120 }}>
        <div style={{ position: "relative", width: 560, height: 620, scale: String(fijo ? 1 + 0.12 * Math.sin(Math.min(1, golpe) * Math.PI) : 1) }}>
          <div style={{ position: "absolute", inset: 0, background: COLORS.white, borderRadius: 40, boxShadow: "0 40px 80px rgba(0,0,0,0.45)", overflow: "hidden" }}>
            <div style={{ height: 160, background: mes === "ENE" ? COLORS.red : COLORS.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 900, fontSize: 96, color: COLORS.white, letterSpacing: 8 }}>
              {mes}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 460, fontFamily, fontWeight: 900, fontSize: 300, color: COLORS.navy, fontVariantNumeric: "tabular-nums" }}>
              {dia}
            </div>
          </div>
          {!fijo ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 160,
                height: 460,
                background: COLORS.paper,
                borderRadius: "0 0 40px 40px",
                transformOrigin: "50% 0%",
                rotate: `${pagina * 50}deg`,
                translate: `${pagina * 300}px ${-pagina * 200}px`,
                opacity: 1 - pagina,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              }}
            />
          ) : null}
          {[150, 410].map((x) => (
            <div key={x} style={{ position: "absolute", left: x, top: -26, width: 34, height: 70, borderRadius: 17, background: COLORS.navy }} />
          ))}
        </div>
      </AbsoluteFill>
      {fijo ? <Chispas en={1.0} x={540} y={760} color={COLORS.red} n={18} /> : null}
    </Escena>
  );
};

/* La cuesta de enero: un cerro; Beto la sube a la izquierda y Memo la baja a la derecha */
const CIMA_Y = 760;
const PEND = (SUELO_Y - CIMA_Y) / 540; // px de subida por px
const yCuesta = (x: number) => (x <= 540 ? SUELO_Y - x * PEND : CIMA_Y + (x - 540) * PEND);
const ANG = (Math.atan(PEND) * 180) / Math.PI;

const Cuesta: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const fin = dur / fps;
  // Beto sube despacio (y se resbala un poco); Memo baja con la patineta
  const xb = interpolate(t, [0, fin], [300, 440], clamp) - Math.max(0, Math.sin(t * 2.2)) * 10;
  const xm = interpolate(t, [1.9, 3.3], [560, 900], { ...clamp, easing: (x) => x * x });
  const llega = t > 3.3;
  const sudor = (k: number) => ((t * 1.4 + k * 0.33) % 1);
  return (
    <Escena fondo="noche" luz="#1E3A8A" sacudidas={[3.3]}>
      <Rotulo texto="La **cuesta de enero**" delay={0.05} />
      {/* cerro */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="cerro" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#334155" />
            <stop offset="1" stopColor={COLORS.deep} />
          </linearGradient>
        </defs>
        <path d={`M0 ${SUELO_Y} L540 ${CIMA_Y} L1080 ${SUELO_Y} L1080 1920 L0 1920 Z`} fill="url(#cerro)" stroke={COLORS.light} strokeOpacity={0.5} strokeWidth={6} strokeLinejoin="round" />
        {/* banderita en la cima */}
        <line x1={540} y1={CIMA_Y} x2={540} y2={CIMA_Y - 120} stroke={COLORS.light} strokeWidth={6} />
        <path d={`M540 ${CIMA_Y - 120} L620 ${CIMA_Y - 100 + Math.sin(t * 6) * 6} L540 ${CIMA_Y - 80} Z`} fill={COLORS.red} />
        <text x={560} y={CIMA_Y - 130} fill={COLORS.white} fontFamily={fontFamily} fontWeight={900} fontSize={34}>
          ENERO
        </text>
      </svg>
      {/* bolsas de diciembre que persiguen a Beto */}
      {[0, 1].map((i) => {
        const x = xb - 130 - i * 105 + Math.sin(t * 8 + i) * 6;
        const brinca = Math.abs(Math.sin(t * 7 + i * 1.3)) * 26;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: yCuesta(x) - 110 - brinca, translate: "-50% 0", rotate: `${-ANG * 0.5}deg`, opacity: interpolate(t, [0.2 + i * 0.3, 0.5 + i * 0.3], [0, 1], clamp) }}>
            <Bolsa color={i ? COLORS.accent : COLORS.gold} ancho={90} letrero={i ? undefined : "abono 1 de 6"} />
          </div>
        );
      })}
      <Personaje x={xb} y={yCuesta(xb)} escala={1.15} color={BETO} expresion="preocupado" pose="encoge" accesorio="gorra" colorAccesorio={COLORS.navy} mirar="der" anda />
      {/* sudor */}
      {[0, 1, 2].map((k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            left: xb + 60 + k * 18,
            top: yCuesta(xb) - 290 + sudor(k) * 60,
            width: 16,
            height: 22,
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            background: COLORS.light,
            opacity: 1 - sudor(k),
          }}
        />
      ))}
      {/* cartera vacía con telaraña */}
      <div style={{ position: "absolute", left: xb - 135, top: yCuesta(xb) - 210, rotate: "-10deg" }}>
        <svg width={110} height={80} viewBox="0 0 110 80">
          <rect x={4} y={10} width={102} height={66} rx={10} fill={COLORS.choco} stroke={COLORS.navy} strokeWidth={4} />
          <path d="M14 20 L54 46 M96 20 L54 46 M54 14 L54 70 M20 60 L54 46 L90 62" stroke={COLORS.white} strokeOpacity={0.8} strokeWidth={2} fill="none" />
          <path d="M34 33 Q54 40 74 33 M28 54 Q54 58 82 54" stroke={COLORS.white} strokeOpacity={0.8} strokeWidth={2} fill="none" />
        </svg>
      </div>
      {/* Memo baja en patineta con el sobre de enero lleno */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          transformOrigin: `${xm}px ${yCuesta(xm)}px`,
          rotate: llega ? "0deg" : `${ANG * 0.85}deg`,
        }}
      >
        <Personaje x={xm} y={yCuesta(xm) - 24} escala={1.15} color={MEMO} expresion="feliz" pose="brazos-arriba" accesorio="gafas" semilla={2} salto={3.35} />
        <svg width={200} height={50} style={{ position: "absolute", left: xm - 100, top: yCuesta(xm) - 30 }}>
          <rect x={4} y={4} width={192} height={18} rx={9} fill={COLORS.gold} stroke={COLORS.navy} strokeWidth={4} />
          <circle cx={40} cy={34} r={11} fill={COLORS.navy} />
          <circle cx={160} cy={34} r={11} fill={COLORS.navy} />
        </svg>
        <div style={{ position: "absolute", left: xm + 50, top: yCuesta(xm) - 360, rotate: "10deg" }}>
          <Sobre texto="Enero" cifra="$2,000" ancho={150} />
        </div>
      </div>
      <Sfx s="swoosh" volumen={0.4} en={1.9} />
      <Sfx s="ding" volumen={0.4} en={3.3} />
      <Chispas en={3.3} x={900} y={1000} color={MEMO} />
    </Escena>
  );
};

const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  // bucle: en los últimos 10 fotogramas vuelve la pantalla partida del gancho
  const vuelta = interpolate(frame, [dur - 10, dur - 2], [0, 1], clamp);
  return (
    <>
      <CtaCrecer tipo="compartir" boton="MÁNDASELO" linea="a tu cuate que **ya se lo gastó**" />
      <Personaje x={150} y={1250} escala={0.95} color={BETO} expresion="neutral" pose="encoge" accesorio="gorra" colorAccesorio={COLORS.navy} mirar="izq" entra="izq" delay={0.6} />
      <div style={{ position: "absolute", top: 1272, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: 28, fontWeight: 700, color: COLORS.navy }}>
        Contenido informativo, no es asesoramiento financiero.
      </div>
      {vuelta > 0 ? (
        <AbsoluteFill style={{ opacity: vuelta }}>
          <AbsoluteFill style={{ fontFamily }}>
            <Fondo luz="#7F1D1D" />
            <Partida congelar />
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}
    </>
  );
};

const ESCENAS: DefEscena[] = [
  { id: "hook", render: () => <Hook /> },
  { id: "gasta", render: () => <Gasta /> },
  { id: "parte", render: () => <Parte /> },
  { id: "enero", render: () => <Enero /> },
  { id: "cuesta", render: ({ dur }) => <Cuesta dur={dur} /> },
  { id: "cta", subtitulosClaros: true, render: ({ dur }) => <Cta dur={dur} /> },
];

export const W4907: React.FC<PropsVoz> = ({ voz, videoId }) =>
  voz ? <Montaje videoId={videoId} voz={voz} escenas={ESCENAS} extra={EXTRA_W4907} pista="tech-synthpop.mp3" /> : null;
