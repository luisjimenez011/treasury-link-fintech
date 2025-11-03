import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { readFile } from 'fs/promises';
import { createSupabaseServerClient } from '../../../src/lib/supabase/server';

type DummyTransaction = {
  amount: number;
  description: string;
  transaction_date: string;
  account_id: string;
};

export async function POST(_req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    // Obtiene el usuario autenticado; si no hay sesión, rechaza
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 401 });
    }
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const path = `${process.cwd()}/public/dummy-transactions.json`;
    const file = await readFile(path, 'utf-8');
    const parsed = JSON.parse(file) as { DUMMY_TRANSACTIONS: DummyTransaction[] };
    const items = parsed?.DUMMY_TRANSACTIONS ?? [];

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Sin datos para importar' }, { status: 400 });
    }

    // Prepara bank_accounts a partir de los account_id únicos del extracto
    const uniqueAccountIds = Array.from(new Set(items.map((t) => t.account_id)));
    const bankAccountsRows = uniqueAccountIds.map((id) => ({
      id,
      user_id: user.id,
      // Campos opcionales de ejemplo; tu esquema real puede diferir
      current_balance: 0,
      amount: 0,
      description: null as string | null,
    }));

    // Inserta/actualiza cuentas (si la tabla define conflicto por id)
    // Nota: RLS en Supabase protegerá estas inserciones por user_id.
    const { error: baError } = await supabase
      .from('bank_accounts')
      .upsert(bankAccountsRows, { onConflict: 'id' });
    if (baError) {
      return NextResponse.json({ error: baError.message }, { status: 400 });
    }

    // Inserta transacciones con el user_id del usuario autenticado
    // RLS garantizará que cada fila quede asociada y aislada por auth.uid().
    const transactionsRows = items.map((t) => ({
      user_id: user.id,
      amount: t.amount,
      description: t.description,
      account_id: t.account_id,
      transaction_date: t.transaction_date,
    }));

    const { error: txError, count } = await supabase
      .from('transactions')
      .insert(transactionsRows, { count: 'exact' });
    if (txError) {
      return NextResponse.json({ error: txError.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        ok: true,
        inserted_bank_accounts: bankAccountsRows.length,
        inserted_transactions: count ?? transactionsRows.length,
      },
      { status: 200 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


