// ESTILO «banco»: la app del banco a pantalla completa (genérica, sin marca). El saldo baja (o sube) con cada
// movimiento y cae una notificación por cada cargo. Para «a dónde se fue mi quincena», el aguinaldo que dura
// una semana, los cargos hormiga, los meses sin intereses que se acumulan…
import React from "react";
import { interpolate } from "remotion";
import { Sfx } from "../kit";
import { BarraEstado, clamp, entrada, F, pesos, useSeg } from "./comun";

export type Movimiento = { en: number; concepto: string; monto: number; icono?: string; aviso?: boolean };

export const AppBanco: React.FC<{
  saldoInicial: number;
  movimientos: Movimiento[];
  titular?: string; // «Cuenta de nómina»
  color?: string; // color de la cabecera
  sonido?: boolean;
}> = ({ saldoInicial, movimientos, titular = "Cuenta de nómina", color = "#0F3D3E", sonido = true }) => {
  const t = useSeg();
  // saldo animado: cada movimiento se aplica en 0,5 s
  const saldo = movimientos.reduce((s, m) => s + m.monto * interpolate(t, [m.en, m.en + 0.5], [0, 1], clamp), saldoInicial);
  const hechos = movimientos.filter((m) => t >= m.en).reverse();
  const ultimo = movimientos.filter((m) => t >= m.en).pop();
  const golpe = ultimo ? Math.max(0, 1 - (t - ultimo.en) / 0.4) : 0;
  const rojo = saldo < saldoInicial * 0.25;
  const notif = movimientos.filter((m) => m.aviso !== false && t >= m.en && t < m.en + 1.8).pop();
  return (
    <div style={{ position: "absolute", inset: 0, background: "#F3F4F6", fontFamily: F.roboto, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 900, background: `linear-gradient(170deg, ${color}, #111827)` }} />
      <BarraEstado color="#fff" top={180} bateria={rojo ? 9 : 41} />
      <div style={{ position: "absolute", top: 300, left: 90, right: 140, color: "#fff" }}>
        <div style={{ fontSize: 40, opacity: 0.8 }}>{titular}</div>
        <div style={{ fontSize: 34, opacity: 0.6, marginTop: 6 }}>•••• 4821</div>
        <div style={{ fontSize: 38, opacity: 0.85, marginTop: 70 }}>Saldo disponible</div>
        <div
          style={{
            fontSize: 150,
            fontWeight: 900,
            letterSpacing: -4,
            fontVariantNumeric: "tabular-nums",
            color: rojo ? "#FCA5A5" : "#fff",
            translate: `${Math.sin(t * 70) * golpe * 14}px 0px`,
            scale: String(1 + golpe * 0.04),
            transformOrigin: "left center",
          }}
        >
          {pesos(saldo, true)}
        </div>
      </div>
      {/* lista de movimientos */}
      <div style={{ position: "absolute", top: 820, left: 50, right: 50, bottom: 0, background: "#fff", borderRadius: 40, padding: "40px 44px", boxShadow: "0 -8px 30px rgba(0,0,0,0.15)" }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: "#111827", marginBottom: 20 }}>Movimientos</div>
        {hechos.slice(0, 7).map((m, i) => {
          const k = i === 0 ? entrada(t, m.en, 0.3) : 1;
          return (
            <div
              key={`${m.concepto}-${m.en}`}
              style={{ display: "flex", alignItems: "center", gap: 26, padding: "18px 0", borderBottom: "2px solid #F3F4F6", opacity: Math.min(1, k * 1.4), translate: `0px ${(1 - Math.min(1, k)) * -40}px` }}
            >
              <div style={{ width: 84, height: 84, borderRadius: 42, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46 }}>{m.icono ?? "💳"}</div>
              <div style={{ flex: 1, fontSize: 40, color: "#111827" }}>{m.concepto}</div>
              <div style={{ fontSize: 42, fontWeight: 700, color: m.monto < 0 ? "#DC2626" : "#16A34A", fontVariantNumeric: "tabular-nums" }}>
                {m.monto > 0 ? "+" : ""}
                {pesos(m.monto, true)}
              </div>
            </div>
          );
        })}
      </div>
      {/* notificación push */}
      {notif ? (
        <div
          style={{
            position: "absolute",
            top: 230 + (1 - Math.min(1, entrada(t, notif.en, 0.3))) * -260 + interpolate(t, [notif.en + 1.5, notif.en + 1.8], [0, -300], clamp),
            left: 50,
            right: 50,
            background: "rgba(255,255,255,0.97)",
            borderRadius: 34,
            padding: "26px 34px",
            boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
            display: "flex",
            gap: 24,
            alignItems: "center",
          }}
        >
          <div style={{ width: 80, height: 80, borderRadius: 20, background: color, color: "#fff", fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>$</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 30, color: "#6B7280" }}>Mi Banco · ahora</div>
            <div style={{ fontSize: 40, color: "#111827", fontWeight: 700 }}>
              {notif.monto < 0 ? "Compra aprobada" : "Depósito recibido"}: {pesos(Math.abs(notif.monto), true)}
            </div>
            <div style={{ fontSize: 34, color: "#374151" }}>{notif.concepto}</div>
          </div>
        </div>
      ) : null}
      {sonido ? movimientos.map((m, i) => <Sfx key={i} s={m.monto < 0 ? "tick" : "ding"} volumen={0.35} en={m.en} />) : null}
    </div>
  );
};
