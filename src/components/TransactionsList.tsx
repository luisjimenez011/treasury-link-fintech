"use client";

import React, { useState, useMemo } from "react";

type Tx = {
  id: string;
  description: string | null;
  amount: number;
  transaction_date: string;
  account_id: string;
};

export default function TransactionsList({ transactions }: { transactions: Tx[] }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // ✅ Lógica: Filtros + Búsqueda + Orden
  const filteredTransactions = useMemo(() => {
    let tx = [...transactions];

    if (search.trim() !== "") {
      tx = tx.filter((t) =>
        t.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter === "income") tx = tx.filter((t) => t.amount > 0);
    if (typeFilter === "expense") tx = tx.filter((t) => t.amount < 0);

    tx.sort((a, b) => {
      const A = new Date(a.transaction_date).getTime();
      const B = new Date(b.transaction_date).getTime();
      return sortOrder === "asc" ? A - B : B - A;
    });

    return tx;
  }, [transactions, search, typeFilter, sortOrder]);

  return (
    <section style={{ marginTop: 30 }}>
      <h2 style={{ fontSize: 22, marginBottom: 16, color: "white" }}>💳 Movimientos</h2>

      {/* ================================ */}
      {/* ✅ CONTROLES FILTRO + SEARCH */}
      {/* ================================ */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 20,
          background: "rgba(255,255,255,0.05)",
          padding: 16,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Buscador */}
        <input
          type="text"
          placeholder="🔍 Buscar movimiento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 12,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.08)",
            color: "white",
            outline: "none",
          }}
        />

        {/* Filtros */}
        <div style={{ display: "flex", gap: 10 }}>
          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as "all" | "income" | "expense")
            }
            style={selectStyle}
          >
            <option value="all">Todos</option>
            <option value="income">Ingresos</option>
            <option value="expense">Gastos</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            style={selectStyle}
          >
            <option value="desc">Más recientes</option>
            <option value="asc">Más antiguas</option>
          </select>
        </div>
      </div>

      {/* ================================ */}
      {/* ✅ LISTA DE TRANSACCIONES */}
      {/* ================================ */}
      {filteredTransactions.length === 0 ? (
        <p style={{ color: "#ccc" }}>No hay transacciones que coincidan.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filteredTransactions.map((tx) => (
            <TransactionItem key={tx.id} tx={tx} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ✅ Estilos base para selects */
const selectStyle: React.CSSProperties = {
  flex: 1,
  padding: 12,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  outline: "none",
  appearance: "none",
};

/* ✅ Tarjeta de movimiento estilo BBVA/Revolut */
function TransactionItem({ tx }: { tx: Tx }) {
  const isPositive = tx.amount > 0;

  return (
    <div
      style={{
        padding: "16px 18px",
        borderRadius: 14,
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "transform 0.15s ease, background 0.15s ease",
      }}
    >
      <div>
        <div
          style={{
            fontWeight: 600,
            fontSize: 16,
            color: "white",
            marginBottom: 4,
          }}
        >
          {tx.description || "Movimiento sin descripción"}
        </div>

        <div
          style={{
            fontSize: 13,
            opacity: 0.6,
            color: "#ddd",
          }}
        >
          {new Date(tx.transaction_date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
          })}
        </div>
      </div>

      <div
        style={{
          fontWeight: 700,
          fontSize: 18,
          color: isPositive ? "#00d97e" : "#ff5b5b",
        }}
      >
        {isPositive ? `+${tx.amount.toFixed(2)}€` : `${tx.amount.toFixed(2)}€`}
      </div>
    </div>
  );
}
