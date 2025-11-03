import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Este cliente SSR se usa en Server Components y en el Middleware.
// Lee/escribe cookies HTTP para mantener la sesión de Supabase (RLS en PostgreSQL aísla datos por usuario).
// Acepta un cookieStore proveniente del encabezado de la solicitud (p.ej. cookies() en RSC o request/response en Middleware).
export function createSupabaseServerClient(cookieStore: any): SupabaseClient {
  const client = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        const raw = cookieStore?.get?.(name);
        return typeof raw === 'string' ? raw : raw?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          // En Middleware normalmente existe .set; en RSC podría ser read-only
          if (typeof cookieStore?.set === 'function') {
            cookieStore.set(name, value, options as any);
          }
        } catch {
          // no-op en contextos de solo lectura
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          if (typeof cookieStore?.delete === 'function') {
            cookieStore.delete(name, options as any);
          } else if (typeof cookieStore?.set === 'function') {
            cookieStore.set(name, '', { ...(options as any), maxAge: 0 });
          }
        } catch {
          // no-op en contextos de solo lectura
        }
      },
    },
  });

  return client;
}


