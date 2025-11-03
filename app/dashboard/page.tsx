import React from 'react';
import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '../../src/lib/supabase/server';

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

  return (
    <div style={{ maxWidth: 720, margin: '48px auto', padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Usuario: {session.user.email}</p>
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
    </div>
  );
}


