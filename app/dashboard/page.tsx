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
      <main className="min-h-screen flex justify-center items-center text-white">
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
      className="
        min-h-screen text-white px-5 pt-6 pb-32 
        bg-gradient-to-br from-[#0A1A2F] via-[#103656] to-[#0A1A2F]
      "
    >
      {/* ✅ HEADER */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-[#00E0A1] font-[SF_Pro_Display]">
          Hola, {user.email?.split("@")[0]}
        </h1>
        <p className="text-white/60 mt-1">Tu panel financiero inteligente</p>
      </header>

      {/* ✅ SALDO GLOBAL */}
      <section
        className="
        bg-white/10 border border-white/20 rounded-2xl 
        backdrop-blur-xl p-6 shadow-xl mb-10
      "
      >
        <p className="text-white/70 text-sm">Saldo total consolidado</p>

        <h2 className="text-4xl font-semibold mt-1">
          {new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
          }).format(consolidatedBalance)}
        </h2>

        <div className="mt-4">
          <ImportDummyButton />
        </div>
      </section>

      {/* ✅ TARJETAS DE CUENTAS */}
      <section className="mb-12">
        <h2 className="text-xl mb-4 font-medium">Tus cuentas bancarias</h2>

        <div className="grid gap-5">
          {accountsWithComputedBalance.map((acc) => (
            <div
              key={acc.id}
              className="
                p-5 rounded-2xl border border-white/20 shadow-xl
                bg-gradient-to-br from-blue-700 to-blue-900
                text-white
              "
            >
              <p className="text-white/70 text-sm">{acc.bank_name}</p>

              <h3 className="text-3xl font-semibold mt-1">
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "EUR",
                }).format(acc.computed_balance)}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ CASH FLOW SUMMARY */}
      <section className="mb-12">
        <CashFlowSummary
          transactions={transactions ?? []}
          bankAccounts={accountsWithComputedBalance}
          consolidatedBalance={consolidatedBalance}
        />
      </section>

      {/* ✅ ANALYTICS PRO */}
      <section className="mb-12">
        <AnalyticsPro
          transactions={transactions ?? []}
          accounts={accountsWithComputedBalance}
        />
      </section>

      {/* ✅ LISTA DE TRANSACCIONES */}
      <section>
        <h2 className="text-xl mb-4 font-medium">Últimos movimientos</h2>
        <TransactionsList transactions={transactions ?? []} />
      </section>
    </main>
  );
}
