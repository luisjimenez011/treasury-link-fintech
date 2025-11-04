import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies as nextCookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

// ✅ Versión CORRECTA para Next.js 16 (cookies() es ASÍNCRONO)
export function createSupabaseServerClient(cookieStore: any): SupabaseClient {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async get(name: string) {
        const store = await cookieStore;
        const raw = store.get(name);
        return typeof raw === "string" ? raw : raw?.value;
      },
      async set(name: string, value: string, options: CookieOptions) {
        try {
          const store = await cookieStore;
          if (typeof store.set === "function") {
            store.set(name, value, options as any);
          }
        } catch {}
      },
      async remove(name: string, options: CookieOptions) {
        try {
          const store = await cookieStore;
          if (typeof store.delete === "function") {
            store.delete(name, options as any);
          } else if (typeof store.set === "function") {
            store.set(name, "", { ...(options as any), maxAge: 0 });
          }
        } catch {}
      },
    },
  });
}

// ✅ Versión usada SOLO en Middleware (reqCookies + resCookies)
export function createSupabaseMiddlewareClient(reqCookies: any, resCookies: any) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        const raw = reqCookies?.get?.(name);
        return typeof raw === "string" ? raw : raw?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          if (typeof resCookies?.set === "function") {
            resCookies.set(name, value, options as any);
          }
        } catch {}
      },
      remove(name: string, options: CookieOptions) {
        try {
          if (typeof resCookies?.delete === "function") {
            resCookies.delete(name, options as any);
          } else if (typeof resCookies?.set === "function") {
            resCookies.set(name, "", { ...(options as any), maxAge: 0 });
          }
        } catch {}
      },
    },
  });
}

// ✅ Helper opcional: obtener cookieStore correctamente en RSC/Route Handler
export function getCookieStore() {
  return nextCookies();
}
