"use client";

import React, { useState } from "react";
import type { FormEvent } from "react";
import { createClient } from "../../src/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const [mode, setMode] = useState<"login" | "signup">("login");

  // LOGIN state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [errorLogin, setErrorLogin] = useState<string | null>(null);

  // SIGNUP state
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [loadingSignUp, setLoadingSignUp] = useState(false);
  const [errorSignUp, setErrorSignUp] = useState<string | null>(null);

  // ✅ LOGIN
  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorLogin(null);
    setLoadingLogin(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoadingLogin(false);
    if (error) return setErrorLogin(error.message);

    window.location.href = "/dashboard";
  }

  // ✅ SIGNUP
  async function handleSignUp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorSignUp(null);
    setLoadingSignUp(true);

    const { error } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
    });

    setLoadingSignUp(false);
    if (error) return setErrorSignUp(error.message);

    window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-5 
      bg-gradient-to-br from-[#0A1A2F] via-[#0F2C49] to-[#0A1A2F] text-white">

      <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 
        rounded-2xl p-7 shadow-lg">

        {/* LOGO */}
        <h1 className="text-center text-3xl font-semibold mb-7 tracking-tight font-[SF Pro Display]">
          Treasury<span className="text-[#00E0A1]">Link</span>
        </h1>

        {/* ✅ TABS */}
        <div className="flex bg-white/10 p-1 rounded-xl mb-8">
          <button
            onClick={() => setMode("login")}
            className={`
              flex-1 py-2 rounded-lg font-medium transition
              ${mode === "login" ? "bg-[#00E0A1] text-[#0A1A2F]" : "text-white/80"}
            `}
          >
            Iniciar sesión
          </button>

          <button
            onClick={() => setMode("signup")}
            className={`
              flex-1 py-2 rounded-lg font-medium transition
              ${mode === "signup" ? "bg-[#00E0A1] text-[#0A1A2F]" : "text-white/80"}
            `}
          >
            Crear cuenta
          </button>
        </div>

        {/* ✅ LOGIN FORM */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <Field
              label="Email"
              type="email"
              value={email}
              placeholder="ejemplo@email.com"
              onChange={setEmail}
            />

            <Field
              label="Contraseña"
              type="password"
              value={password}
              onChange={setPassword}
            />

            {errorLogin && <p className="text-red-400 text-sm">{errorLogin}</p>}

            <button
              type="submit"
              disabled={loadingLogin}
              className="w-full py-3 mt-3 bg-[#00E0A1] text-[#0A1A2F] 
                font-semibold rounded-xl transition active:scale-[0.97]"
            >
              {loadingLogin ? "Ingresando…" : "Entrar"}
            </button>
          </form>
        )}

        {/* ✅ SIGNUP FORM */}
        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <Field
              label="Email"
              type="email"
              value={signUpEmail}
              placeholder="tu@email.com"
              onChange={setSignUpEmail}
            />

            <Field
              label="Contraseña"
              type="password"
              value={signUpPassword}
              onChange={setSignUpPassword}
            />

            {errorSignUp && <p className="text-red-400 text-sm">{errorSignUp}</p>}

            <button
              type="submit"
              disabled={loadingSignUp}
              className="w-full py-3 mt-3 bg-[#00E0A1] text-[#0A1A2F] 
                font-semibold rounded-xl transition active:scale-[0.97]"
            >
              {loadingSignUp ? "Creando cuenta…" : "Crear cuenta"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

/* ✅ COMPONENTE PRO DE INPUT */
function Field({
  label,
  type,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm mb-1 block text-white/70">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 
          text-white placeholder-white/40 focus:border-[#00E0A1] 
          focus:bg-white/10 transition outline-none
        "
      />
    </div>
  );
}
