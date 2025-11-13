"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// ⚙️ Configura tu Supabase (ajusta si ya tienes un cliente global)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HomePage() {
  const [session, setSession] = useState<any>(null);

  // ✅ Detecta si el usuario está logueado
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Escucha cambios en el estado de autenticación
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ✅ Función para cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-white bg-[linear-gradient(135deg,#0A1A2F_0%,#0F2C49_35%,#0A1A2F_100%)]">
      <div className="w-full max-w-sm text-center">
        {/* ✅ LOGO */}
        <h1 className="text-4xl font-semibold tracking-tight mb-3 font-[SF_Pro_Display]">
          Treasury<span className="text-[#00E0A1]">Link</span>
        </h1>

        {/* ✅ SUBTEXTO */}
        <p className="text-white/80 text-base leading-relaxed mb-10">
          La plataforma moderna que unifica tus cuentas bancarias, movimientos y flujo de tesorería.
        </p>

        {/* ✅ BOTONES PRO */}
        <div className="flex flex-col gap-3">
          {session ? (
            <>
              {/* 🔒 Cerrar sesión */}
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-[#FF5B5B] text-white font-semibold text-base shadow-[0_0_14px_rgba(255,91,91,0.35)] active:scale-[0.98] transition-all"
              >
                Cerrar sesión
              </button>

              {/* 🔗 Ir al Dashboard */}
              <Link
                href="/dashboard"
                className="w-full py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-base active:scale-[0.98] transition-all"
              >
                Ir al Dashboard
              </Link>
            </>
          ) : (
            <>
              {/* 🔑 Iniciar sesión */}
              <Link
                href="/login"
                className="w-full py-3 rounded-xl bg-[#00E0A1] text-[#0A1A2F] font-semibold text-base shadow-[0_0_14px_rgba(0,224,161,0.35)] active:scale-[0.98] transition-all"
              >
                Iniciar sesión
              </Link>

              {/* 🔗 Dashboard (opcional) */}
              <Link
                href="/dashboard"
                className="w-full py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-base active:scale-[0.98] transition-all"
              >
                Ir al Dashboard
              </Link>
            </>
          )}
        </div>

        {/* ✅ FOOTER */}
        <p className="mt-14 text-white/40 text-sm">
          © {new Date().getFullYear()} TreasuryLink — Gestión financiera inteligente
        </p>
      </div>
    </main>
  );
}
