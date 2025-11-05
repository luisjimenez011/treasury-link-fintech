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
    <section className="mt-10">
      <h2 className="text-2xl font-semibold text-white mb-4">Movimientos</h2>

      {/* ====================== */}
      {/* ✅ FILTROS Y BÚSQUEDA */}
      {/* ====================== */}
      <div className="flex flex-col gap-4 mb-6 p-5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl">
        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar movimiento…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white 
            focus:ring-2 focus:ring-emerald-400/40 outline-none placeholder-white/40
          "
        />

        {/* Selects */}
        <div className="flex gap-3">
          <Select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as "all" | "income" | "expense")
            }
            options={[
              { value: "all", label: "Todos" },
              { value: "income", label: "Ingresos" },
              { value: "expense", label: "Gastos" },
            ]}
          />

          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            options={[
              { value: "desc", label: "Más recientes" },
              { value: "asc", label: "Más antiguas" },
            ]}
          />
        </div>
      </div>

      {/* ====================== */}
      {/* ✅ LISTADO */}
      {/* ====================== */}
      {filteredTransactions.length === 0 ? (
        <p className="text-white/60 text-sm">No hay transacciones que coincidan.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredTransactions.map((tx) => (
            <TransactionItem key={tx.id} tx={tx} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ============================
   ✅ SELECT COMPONENT PRO
   ============================ */
function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="
        flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white 
        outline-none appearance-none focus:ring-2 focus:ring-emerald-400/40
      "
    >
      {options.map((op) => (
        <option key={op.value} value={op.value} className="text-black">
          {op.label}
        </option>
      ))}
    </select>
  );
}

/* ============================
   ✅ ITEM PRO (BBVA / Revolut)
   ============================ */
function TransactionItem({ tx }: { tx: Tx }) {
  const isPositive = tx.amount > 0;

  return (
    <div
      className="
        p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md
        shadow-lg flex justify-between items-center
        transition-all hover:bg-white/20 hover:scale-[1.01]
      "
    >
      {/* Texto */}
      <div>
        <div className="text-base font-semibold text-white">
          {tx.description || "Movimiento sin descripción"}
        </div>

        <div className="text-xs text-white/60 mt-1">
          {new Date(tx.transaction_date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
          })}
        </div>
      </div>

      {/* Importe */}
      <div
        className={`
          text-lg font-semibold
          ${isPositive ? "text-emerald-400" : "text-red-400"}
        `}
      >
        {isPositive ? `+${tx.amount.toFixed(2)}€` : `${tx.amount.toFixed(2)}€`}
      </div>
    </div>
  );
}
