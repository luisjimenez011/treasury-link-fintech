"use client";

import React, { useMemo, useState } from "react";

type Tx = {
  id: string;
  amount: number;
  description: string | null;
  account_id: string;
  transaction_date: string;
};

type Account = {
  id: string;
  bank_name: string | null;
};

export default function AnalyticsPro({
  transactions,
  accounts,
}: {
  transactions: Tx[];
  accounts: Account[];
}) {
  // ===============================
  // ✅ 1. Filtros
  // ===============================
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [monthsRange, setMonthsRange] = useState<number>(6);

  const filteredTx = useMemo(() => {
    const now = new Date();
    const limit = new Date(now.setMonth(now.getMonth() - monthsRange));

    return transactions.filter((t) => {
      const d = new Date(t.transaction_date);
      const matchAcc = selectedAccount === "all" || t.account_id === selectedAccount;
      const matchDate = d >= limit;
      return matchAcc && matchDate;
    });
  }, [transactions, selectedAccount, monthsRange]);

  // ===============================
  // ✅ 2. Agrupar por mes
  // ===============================
  const monthly = useMemo(() => {
    const map = new Map<string, number>();

    filteredTx.forEach((t) => {
      const d = new Date(t.transaction_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      map.set(key, (map.get(key) ?? 0) + t.amount);
    });

    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredTx]);

  const maxValue = Math.max(...monthly.map((m) => Math.abs(m[1]) || 1));

  // ===============================
  // ✅ 3. Categorías heurísticas
  // ===============================
  const categories = useMemo(() => {
    const groups: Record<string, number> = {};

    const classify = (desc: string | null) => {
      if (!desc) return "Otros";
      const d = desc.toLowerCase();

      if (d.includes("super") || d.includes("comida") || d.includes("pan")) return "Supermercado";
      if (d.includes("gasol") || d.includes("transporte")) return "Transporte";
      if (d.includes("suscrip") || d.includes("internet") || d.includes("app")) return "Servicios";
      if (d.includes("rest") || d.includes("cafe") || d.includes("cena")) return "Restauración";
      if (d.includes("ropa")) return "Ropa";
      return "Otros";
    };

    filteredTx.forEach((t) => {
      if (t.amount < 0) {
        const c = classify(t.description);
        groups[c] = (groups[c] ?? 0) + Math.abs(t.amount);
      }
    });

    return Object.entries(groups).sort((a, b) => b[1] - a[1]);
  }, [filteredTx]);

  const palette = ["#007bff", "#ff6b6b", "#ffa502", "#2ed573", "#1e90ff", "#a29bfe"];

  // ===============================
  // ✅ 4. Predicción de flujo (regresión simple)
  // ===============================
  const prediction = useMemo(() => {
    if (monthly.length < 2) return { future: 0, trend: "neutral" };

    const values = monthly.map((m) => m[1]);

    const diffs = values.slice(1).map((v, i) => v - values[i]);
    const avgTrend = diffs.reduce((a, b) => a + b, 0) / diffs.length;

    const future = values[values.length - 1] + avgTrend;

    let trend: "up" | "down" | "neutral" = "neutral";
    if (avgTrend > 0) trend = "up";
    if (avgTrend < 0) trend = "down";

    return { future, trend };
  }, [monthly]);

  return (
    <div style={{ marginTop: 32, padding: 16 }}>
      <h2>📊 Analytics PRO</h2>

      {/* ============================================
          ✅ Filtros
      ============================================ */}
      <div style={{ display: "flex", gap: 16, marginTop: 16, marginBottom: 20 }}>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          style={{ padding: 8, borderRadius: 8 }}
        >
          <option value="all">Todas las cuentas</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.bank_name ?? "Cuenta"}
            </option>
          ))}
        </select>

        <select
          value={monthsRange}
          onChange={(e) => setMonthsRange(Number(e.target.value))}
          style={{ padding: 8, borderRadius: 8 }}
        >
          <option value={3}>Últimos 3 meses</option>
          <option value={6}>Últimos 6 meses</option>
          <option value={12}>Últimos 12 meses</option>
        </select>
      </div>

      {/* ============================================
          ✅ GRÁFICO EVOLUTIVO (BARRAS + LÍNEA)
      ============================================ */}
      <div
        style={{
          padding: 20,
          border: "1px solid #e5e7eb",
          background: "white",
          borderRadius: 12,
          marginBottom: 32,
        }}
      >
        <h3 style={{ marginBottom: 12 }}>Evolución del flujo mensual</h3>

        <div style={{ display: "flex", gap: 18, alignItems: "flex-end", height: 160 }}>
          {monthly.map(([month, value], i) => {
            const barHeight = (Math.abs(value) / maxValue) * 120;

            return (
              <div key={i} style={{ textAlign: "center" }}>
                {/* Línea del valor */}
                <div
                  style={{
                    height: 4,
                    width: "100%",
                    background: "#6366f1",
                    marginBottom: 6,
                    opacity: 0.8,
                    position: "relative",
                    top: -barHeight / 2,
                  }}
                />

                {/* Barra */}
                <div
                  style={{
                    width: 12,
                    height: barHeight,
                    background: value >= 0 ? "#2ed573" : "#ff4757",
                    borderRadius: 4,
                    margin: "0 auto 6px",
                  }}
                />

                <div style={{ fontSize: 11, opacity: 0.7 }}>
                  {month.slice(5)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================
          ✅ PIE CHART CATEGORÍAS
      ============================================ */}
      <div
        style={{
          padding: 20,
          border: "1px solid #e5e7eb",
          background: "white",
          borderRadius: 12,
          marginBottom: 32,
        }}
      >
        <h3 style={{ marginBottom: 12 }}>Distribución por categoría</h3>

        <div style={{ display: "flex", gap: 20 }}>
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: `conic-gradient(${categories
                .map(
                  ([cat, value], i) =>
                    `${palette[i % palette.length]} ${
                      (value /
                        categories.reduce((a, b) => a + b[1], 0)) *
                      360
                    }deg`
                )
                .join(",")})`,
            }}
          />

          <div>
            {categories.map(([cat, value], i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    background: palette[i % palette.length],
                    borderRadius: 3,
                  }}
                />
                <span>
                  <strong>{cat}</strong>: {value.toFixed(2)}€
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================
          ✅ PREDICCIÓN (IA SIMPLE)
      ============================================ */}
      <div
        style={{
          padding: 20,
          border: "1px solid #e5e7eb",
          background: "white",
          borderRadius: 12,
        }}
      >
        <h3 style={{ marginBottom: 12 }}>Predicción del próximo mes </h3>

        <p style={{ fontSize: 15 }}>
          🔮 El flujo estimado para el próximo mes es:{" "}
          <strong>{prediction.future.toFixed(2)}€</strong>
        </p>

        {prediction.trend === "up" && <p>✅ Tendencia positiva en tu liquidez.</p>}
        {prediction.trend === "down" && <p>⚠️ Podrías experimentar más gastos.</p>}
        {prediction.trend === "neutral" && <p>ℹ️ Tu tendencia financiera se mantiene estable.</p>}
      </div>
    </div>
  );
}
