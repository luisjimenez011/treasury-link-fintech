"use client";

import React, { useMemo, useState } from "react";
import MonthlyEvolutionChart from "./charts/MonthlyEvolutionChart";
import CategoryDonutChart from "./charts/CategoryDonutChart";

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
    const limit = new Date();
    limit.setMonth(now.getMonth() - monthsRange);

    return transactions.filter((t) => {
      const d = new Date(t.transaction_date);
      const matchAcc =
        selectedAccount === "all" || t.account_id === selectedAccount;
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
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      map.set(key, (map.get(key) ?? 0) + t.amount);
    });

    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredTx]);

  const maxValue = Math.max(...monthly.map((m) => Math.abs(m[1]) || 1), 1);

  // ======================
  // ✅ 3. Categorías
  // ======================
  const categories = useMemo(() => {
    const groups: Record<string, number> = {};

    const classify = (d: string | null) => {
      if (!d) return "Otros";
      const s = d.toLowerCase();

      // 🛒 Supermercado / comida
      if (
        s.includes("super") ||
        s.includes("comida") ||
        s.includes("mercado") ||
        s.includes("verduler")
      )
        return "Supermercado";

      // 🍽️ Restauración
      if (
        s.includes("rest") ||
        s.includes("cafe") ||
        s.includes("café") ||
        s.includes("panadería") ||
        s.includes("comida rápida")
      )
        return "Restauración";

      // 🚗 Transporte
      if (
        s.includes("gas") ||
        s.includes("uber") ||
        s.includes("taxi") ||
        s.includes("transporte") ||
        s.includes("parking") ||
        s.includes("estacionamiento")
      )
        return "Transporte";

      // 📱 Servicios / suscripciones
      if (
        s.includes("suscrip") ||
        s.includes("internet") ||
        s.includes("app") ||
        s.includes("stream") ||
        s.includes("música")
      )
        return "Servicios digitales";

      // 🏠 Hogar (luz, agua, internet, alquiler)
      if (
        s.includes("luz") ||
        s.includes("agua") ||
        s.includes("renta") ||
        s.includes("vivienda") ||
        s.includes("servicios")
      )
        return "Hogar";

      // 🧴 Salud / farmacia
      if (s.includes("farmac") || s.includes("consult") || s.includes("salud"))
        return "Salud";

      // 🎽 Moda / ropa
      if (s.includes("ropa") || s.includes("moda")) return "Moda";

      // 📚 Educación
      if (s.includes("librería") || s.includes("libro") || s.includes("curso"))
        return "Educación";

      // 💸 Finanzas / transferencias
      if (s.includes("reembolso") || s.includes("transfer")) return "Finanzas";

      // 🎉 Ocio
      if (s.includes("cine") || s.includes("evento") || s.includes("bar"))
        return "Ocio";

      // ❓ Default
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
  // ✅ 4. Predicción IA simple
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
  // ✅ UI — Estilo BBVA / Revolut PRO
  // =======================================

  return (
    <section className="mt-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-white">
      <h2 className="text-2xl font-semibold mb-6">Analytics Pro</h2>

      {/* ✅ Filtros */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="
            flex-1 p-3 rounded-xl bg-white/10 text-white border border-white/10 
            focus:outline-none focus:ring-2 focus:ring-[#00E0A1]
          "
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
          className="
            flex-1 p-3 rounded-xl bg-white/10 text-white border border-white/10 
            focus:outline-none focus:ring-2 focus:ring-[#00E0A1]
          "
        >
          <option value={3}>3 meses</option>
          <option value={6}>6 meses</option>
          <option value={12}>12 meses</option>
        </select>
      </div>

      {/* ✅ GRÁFICO EVOLUTIVO */}
      <div className="p-5 rounded-xl bg-white/10 border border-white/10 mb-8">
        <h3 className="font-medium mb-4">Evolución mensual</h3>
        <MonthlyEvolutionChart monthly={monthly} />
      </div>

      {/* ✅ PIE CHART */}
      <div className="p-5 rounded-xl bg-white/10 border border-white/10 mb-8">
        <h3 className="font-medium mb-4">Gasto por categoría</h3>

        {categories.length === 0 ? (
          <div className="h-32 flex items-center justify-center opacity-60 text-sm">
            No hay gastos categorizados todavía.
          </div>
        ) : (
          <div className="flex gap-6">
            {/* ✅ Donut preciso */}
            <CategoryDonutChart categories={categories} palette={palette} />

            {/* ✅ Leyenda */}
            <div className="flex flex-col justify-center gap-2">
              {categories.map(([cat, value], i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ background: palette[i % palette.length] }}
                  />
                  <span>
                    <strong>{cat}</strong>: {value.toFixed(2)}€
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ✅ PREDICCIÓN */}
      <div className="p-5 rounded-xl bg-white/10 border border-white/10">
        <h3 className="font-medium mb-3">Predicción (IA simple)</h3>

        <p className="text-lg">
          🔮 Estimación del próximo mes:{" "}
          <strong>{prediction.future.toFixed(2)}€</strong>
        </p>

        {prediction.trend === "up" && (
          <p className="text-green-400 mt-2">✅ Tendencia positiva.</p>
        )}
        {prediction.trend === "down" && (
          <p className="text-red-400 mt-2">⚠️ Posible aumento de gastos.</p>
        )}
        {prediction.trend === "neutral" && (
          <p className="text-blue-300 mt-2">ℹ️ Estabilidad financiera.</p>
        )}
      </div>
    </section>
  );
}
