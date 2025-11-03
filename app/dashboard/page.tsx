import React from 'react';
import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '../../src/lib/supabase/server';
import TransactionsList from '../../src/components/TransactionsList';
import CashFlowSummary from '../../src/components/CashFlowSummary';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <div style={{ maxWidth: 720, margin: '48px auto', padding: 24 }}>
        <h1>Dashboard</h1>
        <p>No has iniciado sesión.</p>
      </div>
    );
  }

  // RLS en PostgreSQL (Supabase) filtra automáticamente por usuario actual utilizando auth.uid().
  // Esta consulta devolverá únicamente las cuentas bancarias pertenecientes al usuario autenticado.
  const { data: bankAccounts, error } = await supabase
    .from('bank_accounts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div style={{ maxWidth: 720, margin: '48px auto', padding: 24 }}>
        <h1>Dashboard</h1>
        <p>Error cargando cuentas: {error.message}</p>
      </div>
    );
  }

  // Obtiene transacciones (sensibles) en el Server Component; RLS aplica por usuario
  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select('id, user_id, amount, description, account_id, transaction_date')
    .order('transaction_date', { ascending: false })
    .limit(200);

  if (txError) {
    return (
      <div style={{ maxWidth: 720, margin: '48px auto', padding: 24 }}>
        <h1>Dashboard</h1>
        <p>Error cargando transacciones: {txError.message}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: '48px auto', padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Usuario: {session.user.email}</p>
      <div style={{ marginTop: 16, marginBottom: 24 }}>
        <CashFlowSummary transactions={transactions ?? []} bankAccounts={bankAccounts ?? []} />
      </div>
      <h2 style={{ marginTop: 24 }}>Cuentas bancarias</h2>
      {bankAccounts && bankAccounts.length > 0 ? (
        <ul>
          {bankAccounts.map((acc: any) => (
            <li key={acc.id}>
              <strong>{acc.name ?? 'Cuenta'}</strong> — {acc.iban ?? acc.number ?? 'N/A'}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay cuentas registradas.</p>
      )}
      <div style={{ marginTop: 32 }}>
        <TransactionsList />
      </div>
    </div>
  );
}


