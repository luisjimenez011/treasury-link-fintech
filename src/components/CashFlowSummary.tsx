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
  bankAccounts,
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

      const inside30 = d >= last30 && d <= now;

      if (inside30) {
        if (tx.amount > 0) income += tx.amount;
        else expenses += Math.abs(tx.amount);

        chart.push({
          date: d.toISOString().slice(5, 10),
          amount: tx.amount,
        });
      }
    });

    const net = income - expenses;

    let insightMsg = "";
    if (net > 0) insightMsg = "Buen mes: generaste ahorro neto.";
    else if (expenses > income * 1.2)
      insightMsg = "Atención: tus gastos superan tus ingresos.";
    else insightMsg = "Flujo negativo, pero dentro de lo normal.";

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
    <section
      style={{
        padding: 20,
        borderRadius: 16,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(10px)",
        marginBottom: 24,
        color: "white",
      }}
    >
      <h2 style={{ fontSize: 22, marginBottom: 16 }}>🔎 Resumen financiero</h2>

      {/* GRID DE TARJETAS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <Card title="Saldo consolidado" value={formatCurrency(consolidatedBalance)} />
        <Card title="Flujo neto (30 días)" value={formatCurrency(net30)} />

        <Card title="Ingresos (30 días)" value={formatCurrency(income30)} color="#00d97e" />
        <Card title="Gastos (30 días)" value={formatCurrency(expenses30)} color="#ff5b5b" />
      </div>

      {/* INSIGHT */}
      <div
        style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 12,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          fontSize: 15,
        }}
      >
        💡 {insight}
      </div>

      {/* MINI SPARKLINE */}
      <div
        style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 12,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <div style={{ opacity: 0.7, marginBottom: 10 }}>Actividad últimos 30 días</div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 6,
            height: 100,
          }}
        >
          {monthlyChart.map((entry, i) => {
            const height = (Math.abs(entry.amount) / maxAbs) * 100;
            const color = entry.amount > 0 ? "#00d97e" : "#ff5b5b";

            return (
              <div
                key={i}
                style={{
                  width: 8,
                  height,
                  background: color,
                  borderRadius: 6,
                  boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
                  transition: "height 0.3s ease",
                }}
                title={`${entry.date}: ${entry.amount}€`}
              ></div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

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
    <div
      style={{
        padding: 16,
        borderRadius: 14,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.14)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div style={{ fontSize: 13, opacity: 0.7 }}>{title}</div>
      <div
        style={{
          marginTop: 4,
          fontSize: 24,
          fontWeight: 600,
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}
