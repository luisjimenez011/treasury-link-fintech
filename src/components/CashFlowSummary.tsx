"use client";

import React, { useMemo } from "react";
import type { BankAccount } from "../types/models";

type Tx = {
  amount: number;
  description: string | null;
  transaction_date?: string | null;
};

type Props = {
  transactions: Tx[];
  bankAccounts: (BankAccount & { computed_balance: number })[]; // ✅ Importante
  consolidatedBalance: number; // ✅ Lo recibimos del Dashboard
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
  bankAccounts,
  consolidatedBalance,
}: Props) {
  const now = new Date();
  const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // ✅ AGREGACIONES
  const { income30, expenses30, net30, monthlyChart, insight } = useMemo(() => {
    let income = 0;
    let expenses = 0;

    const chart: { date: string; amount: number }[] = [];

    transactions.forEach((tx) => {
      if (!tx.transaction_date) return;

      const d = new Date(tx.transaction_date);
      if (isNaN(d.getTime())) return;

      const is30days = d >= last30 && d <= now;

      if (is30days) {
        if (tx.amount > 0) income += tx.amount;
        else expenses += Math.abs(tx.amount);

        chart.push({
          date: d.toISOString().slice(5, 10), // "MM-DD"
          amount: tx.amount,
        });
      }
    });

    const net = income - expenses;

    // ✅ Insight inteligente estilo Revolut/N26
    let insightMsg = "";
    if (net > 0) insightMsg = "Buen mes. Estás generando ahorro neto 👍";
    else if (expenses > income * 1.2)
      insightMsg = "Atención: has gastado bastante más de lo que ingresaste.";
    else insightMsg = "Tu flujo es negativo, pero dentro de un rango normal.";

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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        marginTop: 16,
      }}
    >
      {/* --- TOTAL BALANCE --- */}
      <Card title="Saldo consolidado" value={formatCurrency(consolidatedBalance)} />

      {/* --- NET 30 DAYS --- */}
      <Card title="Flujo neto (30 días)" value={formatCurrency(net30)} />

      {/* --- INGRESOS --- */}
      <Card title="Ingresos (30 días)" value={formatCurrency(income30)} color="#0f9d58" />

      {/* --- GASTOS --- */}
      <Card title="Gastos (30 días)" value={formatCurrency(expenses30)} color="#d93025" />

      {/* --- INSIGHT --- */}
      <div
        style={{
          gridColumn: "1 / span 2",
          padding: 16,
          borderRadius: 12,
          background: "#f3f4f6",
          fontSize: 15,
        }}
      >
        💡 {insight}
      </div>

      {/* --- MINI CHART --- */}
      <div
        style={{
          gridColumn: "1 / span 2",
          padding: 16,
          borderRadius: 12,
          background: "#ffffff",
          border: "1px solid #e5e7eb",
        }}
      >
        <div style={{ marginBottom: 8, fontSize: 14, opacity: 0.7 }}>
          Actividad últimos 30 días
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 4,
            height: 100,
          }}
        >
          {monthlyChart.map((entry, i) => {
            const h = (Math.abs(entry.amount) / maxAbs) * 100;

            return (
              <div
                key={i}
                title={`${entry.date}: ${entry.amount}€`}
                style={{
                  width: 6,
                  height: h,
                  background: entry.amount > 0 ? "#0f9d58" : "#d93025",
                  borderRadius: 4,
                }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  color = "#111",
}: {
  title: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        background: "#ffffff",
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ fontSize: 24, fontWeight: 600, color }}>{value}</div>
    </div>
  );
}
