"use client";

import React from 'react';
import { useTransactionsQuery } from '../hooks/useTransactionsQuery';

export default function TransactionsList() {
  // TanStack Query cachea el resultado (staleTime=5min) y hace SWR,
  // evitando refetches innecesarios y reduciendo la carga sobre Supabase
  // mientras percibimos una UI más rápida.
  const { data, isLoading, isError, error, refetch, isFetching } = useTransactionsQuery();

  if (isLoading) {
    return <p>Cargando transacciones…</p>;
  }

  if (isError) {
    return <p style={{ color: 'crimson' }}>Error: {(error as Error).message}</p>;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Transacciones</h3>
        <button onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? 'Actualizando…' : 'Refrescar'}
        </button>
      </div>
      {data && data.length > 0 ? (
        <ul>
          {data.map((tx) => (
            <li key={tx.id}>
              {tx.description ?? 'Sin descripción'} — Monto: {tx.amount} — Balance: {tx.current_balance}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay transacciones.</p>
      )}
    </div>
  );
}


