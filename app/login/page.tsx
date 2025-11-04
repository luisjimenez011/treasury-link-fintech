"use client";

import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { createClient } from "../../src/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  // LOGIN STATES
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // SIGNUP STATES (AQUÍ FALTABAN)
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);

  // LOGIN
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    window.location.href = '/dashboard';
  }

  // SIGN UP
  async function handleSignUp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSignUpError(null);
    setSignUpLoading(true);

    const { error: signUpErr } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword
    });

    setSignUpLoading(false);

    if (signUpErr) {
      setSignUpError(signUpErr.message);
      return;
    }

    window.location.href = '/dashboard';
  }

  return (
    <div style={{ maxWidth: 360, margin: '72px auto', padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Iniciar sesión</h1>

      {/* LOGIN FORM */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: 6 }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 6 }}>
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        {error && <p style={{ color: 'crimson', marginBottom: 12 }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      <hr style={{ margin: '24px 0' }} />

      {/* SIGNUP FORM */}
      <h2 style={{ marginBottom: 12, fontSize: 18 }}>Crear cuenta</h2>
      <form onSubmit={handleSignUp}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="signup-email" style={{ display: 'block', marginBottom: 6 }}>
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            value={signUpEmail}
            required
            onChange={(e) => setSignUpEmail(e.target.value)}
            placeholder="tu@email.com"
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="signup-password" style={{ display: 'block', marginBottom: 6 }}>
            Contraseña
          </label>
          <input
            id="signup-password"
            type="password"
            value={signUpPassword}
            required
            onChange={(e) => setSignUpPassword(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        {signUpError && (
          <p style={{ color: 'crimson', marginBottom: 12 }}>{signUpError}</p>
        )}

        <button type="submit" disabled={signUpLoading} style={{ width: '100%', padding: 10 }}>
          {signUpLoading ? 'Creando cuenta…' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
}
