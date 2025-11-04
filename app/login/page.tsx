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

  // ✅ LOGIN HANDLER
  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorLogin(null);
    setLoadingLogin(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoadingLogin(false);

    if (error) return setErrorLogin(error.message);

    window.location.href = "/dashboard";
  }

  // ✅ SIGNUP HANDLER
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
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0A1A2F 0%, #0F2C49 40%, #0A1A2F 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        color: "white",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 28,
          borderRadius: 18,
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        {/* LOGO */}
        <h1
          style={{
            textAlign: "center",
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: -1,
            marginBottom: 16,
          }}
        >
          Treasury<span style={{ color: "#00E0A1" }}>Link</span>
        </h1>

        {/* Tabs LOGIN / SIGNUP */}
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: 4,
            marginBottom: 28,
          }}
        >
          <button
            onClick={() => setMode("login")}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              background: mode === "login" ? "#00E0A1" : "transparent",
              color: mode === "login" ? "#0A1A2F" : "white",
            }}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => setMode("signup")}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              background: mode === "signup" ? "#00E0A1" : "transparent",
              color: mode === "signup" ? "#0A1A2F" : "white",
            }}
          >
            Crear cuenta
          </button>
        </div>

        {/* ✅ LOGIN FORM */}
        {mode === "login" && (
          <form onSubmit={handleLogin}>
            <Field
              label="Email"
              type="email"
              value={email}
              placeholder="tu@email.com"
              onChange={(v) => setEmail(v)}
            />

            <Field
              label="Contraseña"
              type="password"
              value={password}
              onChange={(v) => setPassword(v)}
            />

            {errorLogin && (
              <p style={{ color: "#ff6b6b", marginTop: 8 }}>{errorLogin}</p>
            )}

            <button
              type="submit"
              disabled={loadingLogin}
              style={buttonStyle}
            >
              {loadingLogin ? "Ingresando…" : "Entrar"}
            </button>
          </form>
        )}

        {/* ✅ SIGNUP FORM */}
        {mode === "signup" && (
          <form onSubmit={handleSignUp}>
            <Field
              label="Email"
              type="email"
              value={signUpEmail}
              placeholder="tu@email.com"
              onChange={(v) => setSignUpEmail(v)}
            />

            <Field
              label="Contraseña"
              type="password"
              value={signUpPassword}
              onChange={(v) => setSignUpPassword(v)}
            />

            {errorSignUp && (
              <p style={{ color: "#ff6b6b", marginTop: 8 }}>{errorSignUp}</p>
            )}

            <button
              type="submit"
              disabled={loadingSignUp}
              style={buttonStyle}
            >
              {loadingSignUp ? "Creando cuenta…" : "Crear cuenta"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

/* ✅ INPUT FIELD COMPONENT */
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
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: "block",
          marginBottom: 6,
          fontSize: 14,
          opacity: 0.7,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.05)",
          color: "white",
          fontSize: 15,
        }}
      />
    </div>
  );
}

/* ✅ BOTÓN ESTILO REVOLUT/N26 */
const buttonStyle = {
  width: "100%",
  padding: "14px 0",
  marginTop: 8,
  background: "#00E0A1",
  color: "#0A1A2F",
  border: "none",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
};
