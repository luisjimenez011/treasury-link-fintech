"use client";

import React, { useMemo } from "react";
import type { BankAccount } from "../types/models";
import CashFlowSparkline from "./charts/CashFlowSparkline";

type Tx = {
  amount: number;
  description: string | null;
  transaction_date?: string | null;
};

type Props = {
  transactions: Tx[];
  bankAccounts: (BankAccount & { computed_balance: number })[];
  consolidatedBalance: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function CashFlowSummary({
  transactions,
  consolidatedBalance,
}: Props) {
  const now = new Date();
  const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const { income30, expenses30, net30, monthlyChart, insight } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    const chart: { date: string; amount: number }[] = [];

    transactions.forEach((tx) => {
      if (!tx.transaction_date) return;
      const d = new Date(tx.transaction_date);
      if (isNaN(d.getTime())) return;

      const inside = d >= last30 && d <= now;

      if (inside) {
        if (tx.amount > 0) income += tx.amount;
        else expenses += Math.abs(tx.amount);

        chart.push({
          date: d.toISOString().slice(5, 10),
          amount: tx.amount,
        });
      }
    });

    const net = income - expenses;

    const insightMsg =
      net > 0
        ? "Buen mes: generaste ahorro neto."
        : expenses > income * 1.2
        ? "Atención: tus gastos superan tus ingresos."
        : "Flujo negativo, pero dentro de lo normal.";

    return {
      income30: income,
      expenses30: -expenses,
      net30: net,
      monthlyChart: chart,
      insight: insightMsg,
    };
  }, [transactions]);

  const maxAbs = Math.max(...monthlyChart.map((c) => Math.abs(c.amount)), 1);

  return (
    <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-white mb-8">
      <h2 className="text-2xl font-semibold mb-6">Resumen financiero</h2>

      {/* === GRID DE TARJETAS === */}
      <div className="grid grid-cols-2 gap-4">
        <Card
          title="Saldo consolidado"
          value={formatCurrency(consolidatedBalance)}
        />
        <Card title="Flujo neto (30 días)" value={formatCurrency(net30)} />

        <Card
          title="Ingresos (30 días)"
          value={formatCurrency(income30)}
          color="#00d97e"
        />
        <Card
          title="Gastos (30 días)"
          value={formatCurrency(expenses30)}
          color="#ff5b5b"
        />
      </div>

      {/* === INSIGHT === */}
      <div className="mt-6 p-4 rounded-xl bg-white/10 border border-white/10 text-sm leading-relaxed">
        💡 {insight}
      </div>

      {/* === MINI SPARKLINE === */}
      <div className="mt-6 p-4 rounded-xl bg-white/10 border border-white/10">
        <div className="opacity-70 mb-2">Actividad últimos 30 días</div>
        <CashFlowSparkline chart={monthlyChart} />
      </div>
    </section>
  );
}

/* ======================================================
   ✅ TARJETA PRO (Glass + sombras + tipografía SF Pro)
   ====================================================== */
function Card({
  title,
  value,
  color = "white",
}: {
  title: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
      <div className="text-xs opacity-70">{title}</div>
      <div className="mt-1 text-xl font-semibold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
