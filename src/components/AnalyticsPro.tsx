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
  // ======================
  // ✅ 1. Filtros
  // ======================
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [monthsRange, setMonthsRange] = useState<number>(6);

  const filteredTx = useMemo(() => {
    const now = new Date();
    const limit = new Date(now.setMonth(now.getMonth() - monthsRange));

    return transactions.filter((t) => {
      const d = new Date(t.transaction_date);
      const matchAcc = selectedAccount === "all" || t.account_id === selectedAccount;
      return matchAcc && d >= limit;
    });
  }, [transactions, selectedAccount, monthsRange]);

  // ======================
  // ✅ 2. Agrupar por mes
  // ======================
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

  // ======================
  // ✅ 3. Categorías
  // ======================
  const categories = useMemo(() => {
    const groups: Record<string, number> = {};

    const classify = (d: string | null) => {
      if (!d) return "Otros";
      const s = d.toLowerCase();

      if (s.includes("super") || s.includes("comida")) return "Supermercado";
      if (s.includes("gas")) return "Transporte";
      if (s.includes("suscrip") || s.includes("internet")) return "Servicios";
      if (s.includes("rest") || s.includes("cafe")) return "Restauración";
      if (s.includes("ropa")) return "Ropa";

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

  const palette = ["#00C4FF", "#FF7676", "#FFB84C", "#2ED573", "#A29BFE"];

  // ======================
  // ✅ 4. Predicción
  // ======================
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

  // =======================================
  // ✅ UI — Estilo BBVA / Revolut
  // =======================================

  return (
    <section
      style={{
        marginTop: 40,
        padding: 24,
        borderRadius: 16,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.14)",
        backdropFilter: "blur(10px)",
        color: "white",
      }}
    >
      <h2 style={{ fontSize: 22, marginBottom: 18 }}>📊 Analytics Pro</h2>

      {/* ✅ Filtros */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.12)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <option value="all">Todas las cuentas</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.bank_name}
            </option>
          ))}
        </select>

        <select
          value={monthsRange}
          onChange={(e) => setMonthsRange(Number(e.target.value))}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.12)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <option value={3}>3 meses</option>
          <option value={6}>6 meses</option>
          <option value={12}>12 meses</option>
        </select>
      </div>

      {/* ✅ GRÁFICO EVOLUTIVO */}
      <div
        style={{
          padding: 20,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.12)",
          marginBottom: 32,
        }}
      >
        <h3 style={{ marginBottom: 12, fontWeight: 500 }}>Evolución mensual</h3>

        <div
          style={{
            display: "flex",
            gap: 18,
            alignItems: "flex-end",
            height: 160,
          }}
        >
          {monthly.map(([month, value], i) => {
            const h = (Math.abs(value) / maxValue) * 100;

            return (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 14,
                    height: h,
                    borderRadius: 6,
                    background: value >= 0 ? "#2ED573" : "#FF7676",
                    margin: "0 auto 6px",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
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

      {/* ✅ PIE CHART */}
      <div
        style={{
          padding: 20,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.12)",
          marginBottom: 32,
        }}
      >
        <h3 style={{ marginBottom: 16, fontWeight: 500 }}>Gasto por categoría</h3>

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
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            }}
          />

          <div>
            {categories.map(([cat, value], i) => (
              <div
                key={i}
                style={{ display: "flex", gap: 8, marginBottom: 8 }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: palette[i % palette.length],
                  }}
                />
                <span style={{ fontSize: 14 }}>
                  <strong>{cat}</strong>: {value.toFixed(2)}€
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ PREDICCIÓN */}
      <div
        style={{
          padding: 20,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <h3 style={{ marginBottom: 14 }}>Predicción (IA simple)</h3>

        <p style={{ fontSize: 16 }}>
          🔮 Estimación del próximo mes:{" "}
          <strong>{prediction.future.toFixed(2)}€</strong>
        </p>

        {prediction.trend === "up" && (
          <p>✅ Tendencia positiva en tu saldo.</p>
        )}
        {prediction.trend === "down" && (
          <p>⚠️ Podrías gastar más de lo normal.</p>
        )}
        {prediction.trend === "neutral" && (
          <p>ℹ️ Estabilidad financiera.</p>
        )}
      </div>
    </section>
  );
}
