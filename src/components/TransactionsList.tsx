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

  // ✅ Filtro + búsqueda + orden
  const filteredTransactions = useMemo(() => {
    let tx = [...transactions];

    // Buscar por descripción
    if (search.trim() !== "") {
      tx = tx.filter((t) =>
        t.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtrar por tipo
    if (typeFilter === "income") {
      tx = tx.filter((t) => t.amount > 0);
    } else if (typeFilter === "expense") {
      tx = tx.filter((t) => t.amount < 0);
    }

    // Ordenar por fecha
    tx.sort((a, b) => {
      const dateA = new Date(a.transaction_date).getTime();
      const dateB = new Date(b.transaction_date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return tx;
  }, [transactions, search, typeFilter, sortOrder]);

  return (
    <div style={{ marginTop: 20 }}>
      <h3 style={{ marginBottom: 12 }}>Transacciones</h3>

      {/* === CONTROLES === */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {/* BUSCADOR */}
        <input
          type="text"
          placeholder="Buscar por descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
            width: "100%",
          }}
        />

        {/* FILTROS INLINE */}
        <div style={{ display: "flex", gap: 10 }}>
          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as "all" | "income" | "expense")
            }
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          >
            <option value="all">Todos</option>
            <option value="income">Ingresos</option>
            <option value="expense">Gastos</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          >
            <option value="desc">Más recientes</option>
            <option value="asc">Más antiguas</option>
          </select>
        </div>
      </div>

      {/* === LISTA DE TRANSACCIONES === */}
      {filteredTransactions.length === 0 ? (
        <p>No hay transacciones que coincidan con los filtros.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredTransactions.map((tx) => {
            const isPositive = tx.amount > 0;

            return (
              <div
                key={tx.id}
                style={{
                  padding: "14px 16px",
                  borderRadius: 10,
                  background: "#f7f7f7",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    {tx.description || "Movimiento sin descripción"}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      opacity: 0.6,
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
                    color: isPositive ? "#0f9d58" : "#d93025",
                    fontSize: 16,
                  }}
                >
                  {isPositive ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)} €
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
