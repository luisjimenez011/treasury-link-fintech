import React from "react";
import { cookies } from "next/headers";
import ImportDummyButton from "../../src/components/ImportDummyButton";
import { createSupabaseServerClient } from "../../src/lib/supabase/server";
import TransactionsList from "../../src/components/TransactionsList";
import CashFlowSummary from "../../src/components/CashFlowSummary";
import AnalyticsPro from "../../src/components/AnalyticsPro";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient(cookieStore);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return (
      <div style={{ maxWidth: 720, margin: "48px auto", padding: 24 }}>
        <h1>Dashboard</h1>
        <p>No has iniciado sesión. Redirigiendo...</p>
      </div>
    );
  }

  // ✅ Cargar CUENTAS
  const { data: bankAccounts, error: accError } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("user_id", user.id);

  if (accError) {
    return <p>Error cargando cuentas: {accError.message}</p>;
  }

  // ✅ Cargar TRANSACCIONES
  const { data: transactions, error: txError } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("transaction_date", { ascending: false });

  if (txError) {
    return <p>Error cargando transacciones: {txError.message}</p>;
  }

  // ✅ RE-CALCULAR SALDOS por cuenta
  const accountsWithComputedBalance = (bankAccounts ?? []).map((acc) => {
    const balance = (transactions ?? [])
      .filter((t) => t.account_id === acc.id)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      ...acc,
      computed_balance: balance,
    };
  });

  // ✅ Calcular saldo consolidado a partir de computed_balance
  const consolidatedBalance = accountsWithComputedBalance.reduce(
    (sum, acc) => sum + acc.computed_balance,
    0
  );

  return (
    <div style={{ maxWidth: 720, margin: "48px auto", padding: 24 }}>
      <h1>Dashboard de Tesorería</h1>
      <p>Usuario: {user.email}</p>

      <ImportDummyButton />

      {/* ✅ Resumen de caja con saldos REALES */}
      <div style={{ marginTop: 16, marginBottom: 24 }}>
        <CashFlowSummary
          transactions={transactions ?? []}
          bankAccounts={accountsWithComputedBalance}
          consolidatedBalance={consolidatedBalance}
        />
      </div>

      <AnalyticsPro
        transactions={transactions ?? []}
        accounts={accountsWithComputedBalance}
      />

      <h2 style={{ marginTop: 24 }}>Cuentas Bancarias</h2>

      {accountsWithComputedBalance.length ? (
        <ul>
          {accountsWithComputedBalance.map((acc) => (
            <li key={acc.id}>
              <strong>{acc.bank_name}</strong> — Saldo:{" "}
              {acc.computed_balance.toFixed(2)} €
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay cuentas registradas.</p>
      )}

      <div style={{ marginTop: 32 }}>
        <TransactionsList transactions={transactions ?? []} />
      </div>
    </div>
  );
}

