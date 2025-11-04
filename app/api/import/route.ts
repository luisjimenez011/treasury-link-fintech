import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { readFile } from "fs/promises";
import { createSupabaseServerClient } from "../../../src/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies(); // ✅ OK: el await lo hace internamente server.ts
    const supabase = createSupabaseServerClient(cookieStore);

    // ✅ Obtener usuario autenticado de forma segura
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Auth session missing!" },
        { status: 401 }
      );
    }

    // ✅ Cargar archivo JSON de /public
    const raw = await readFile(
      `${process.cwd()}/public/dummy-transactions.json`,
      "utf-8"
    );

    const parsed = JSON.parse(raw);
    const items = parsed.DUMMY_TRANSACTIONS ?? [];

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "El archivo no contiene datos válidos." },
        { status: 400 }
      );
    }

    // ✅ IDs únicos de cuenta
    const uniqueAccountIds = Array.from(
      new Set(items.map((t: any) => t.account_id))
    );

    // Mapear cuentas antiguas → nuevas UUID válidas
    const accountMap = new Map<string, string>();

    const accountsToInsert = uniqueAccountIds.map((oldId) => {
      const newId = crypto.randomUUID();
      accountMap.set(oldId, newId);

      return {
        id: newId,
        user_id: user.id,
        bank_name: "Cuenta Importada",
        current_balance: 0,
      };
    });

    // ✅ Insertar cuentas (cumple RLS)
    const { error: accountsError } = await supabase
      .from("bank_accounts")
      .insert(accountsToInsert);

    if (accountsError) {
      return NextResponse.json(
        { error: accountsError.message },
        { status: 500 }
      );
    }

    // ✅ Preparar transacciones con los IDs correctos
    const transactionsToInsert = items.map((t: any) => ({
      user_id: user.id,
      account_id: accountMap.get(t.account_id),
      amount: t.amount,
      description: t.description,
      transaction_date: t.transaction_date,
    }));

    const { error: txError } = await supabase
      .from("transactions")
      .insert(transactionsToInsert);

    if (txError) {
      return NextResponse.json({ error: txError.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      created_accounts: accountsToInsert.length,
      created_transactions: transactionsToInsert.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
