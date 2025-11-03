"use client";

import React from 'react';
import type { BankAccount } from '../types/models';

type Props = {
  transactions: Array<{ amount: number; description: string | null; transaction_date?: string | null }>;
  bankAccounts: BankAccount[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(value);
}

export default function CashFlowSummary({ transactions, bankAccounts }: Props) {
  const consolidatedBalance = bankAccounts.reduce((sum, acc) => sum + (acc.current_balance ?? 0), 0);

  // Flujo neto (últimos 30 días): suma de montos negativos
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const netCashFlowLast30Days = transactions.reduce((sum, tx) => {
    const dateStr = tx.transaction_date ?? undefined;
    if (!dateStr) return sum;
    const txDate = new Date(dateStr);
    if (isNaN(txDate.getTime())) return sum;
    if (txDate >= thirtyDaysAgo && txDate <= now && tx.amount < 0) {
      return sum + tx.amount;
    }
    return sum;
  }, 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Saldo consolidado</div>
        <div style={{ fontSize: 24, fontWeight: 600 }}>{formatCurrency(consolidatedBalance)}</div>
      </div>
      <div style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Flujo neto (últimos 30 días)</div>
        <div style={{ fontSize: 24, fontWeight: 600 }}>{formatCurrency(netCashFlowLast30Days)}</div>
      </div>
    </div>
  );
}


