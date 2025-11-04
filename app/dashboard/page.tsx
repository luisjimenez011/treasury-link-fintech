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
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <p>No has iniciado sesión...</p>
      </main>
    );
  }

  // ✅ Cargar CUENTAS
  const { data: bankAccounts } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("user_id", user.id);

  // ✅ Cargar TRANSACCIONES
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("transaction_date", { ascending: false });

  // ✅ Recalcular saldos
  const accountsWithComputedBalance = (bankAccounts ?? []).map((acc) => {
    const balance = (transactions ?? [])
      .filter((t) => t.account_id === acc.id)
      .reduce((sum, t) => sum + t.amount, 0);

    return { ...acc, computed_balance: balance };
  });

  const consolidatedBalance = accountsWithComputedBalance.reduce(
    (sum, acc) => sum + acc.computed_balance,
    0
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 20px 80px",
        background: "linear-gradient(135deg, #0A1A2F 0%, #103656 60%, #0A1A2F)",
        color: "white",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* HEADER */}
      <header style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          Hola, {user.email?.split("@")[0]}
        </h1>
        <p style={{ opacity: 0.7 }}>Tu panel financiero inteligente</p>
      </header>

      {/* SALDO GLOBAL */}
      <section
        style={{
          padding: 24,
          borderRadius: 20,
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(10px)",
          marginBottom: 28,
        }}
      >
        <p style={{ opacity: 0.7, fontSize: 14 }}>Saldo total consolidado</p>
        <h2
          style={{
            fontSize: 38,
            fontWeight: 700,
            marginTop: 4,
          }}
        >
          {new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
          }).format(consolidatedBalance)}
        </h2>

        <div style={{ marginTop: 16 }}>
          <ImportDummyButton />
        </div>
      </section>

      {/* TARJETAS DE CUENTAS (ESTILO BBVA / REVOLUT) */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, marginBottom: 14 }}>Tus cuentas bancarias</h2>

        <div style={{ display: "grid", gap: 16 }}>
          {accountsWithComputedBalance.map((acc, i) => (
            <div
              key={acc.id}
              style={{
                padding: 20,
                borderRadius: 18,
                background:
                  "linear-gradient(135deg, #1D4F91 0%, #1B3F73 100%)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
              }}
            >
              <p style={{ fontSize: 14, opacity: 0.8 }}>{acc.bank_name}</p>
              <h3
                style={{
                  marginTop: 6,
                  fontSize: 26,
                  fontWeight: 600,
                }}
              >
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "EUR",
                }).format(acc.computed_balance)}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* CASH FLOW SUMMARY */}
      <section style={{ marginBottom: 40 }}>
        <CashFlowSummary
          transactions={transactions ?? []}
          bankAccounts={accountsWithComputedBalance}
          consolidatedBalance={consolidatedBalance}
        />
      </section>

      {/* ANALYTICS */}
      <section style={{ marginBottom: 40 }}>
        <AnalyticsPro
          transactions={transactions ?? []}
          accounts={accountsWithComputedBalance}
        />
      </section>

      {/* TRANSACCIONES */}
      <section>
        <h2 style={{ fontSize: 20, marginBottom: 14 }}>Últimos movimientos</h2>
        <TransactionsList transactions={transactions ?? []} />
      </section>
    </main>
  );
}
