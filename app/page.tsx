import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0A1A2F 0%, #0F2C49 35%, #0A1A2F 100%)",
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
          textAlign: "center",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 8,
            letterSpacing: -0.5,
          }}
        >
          Treasury<span style={{ color: "#00E0A1" }}>Link</span>
        </div>

        <p
          style={{
            opacity: 0.8,
            fontSize: 16,
            marginBottom: 40,
            lineHeight: "24px",
          }}
        >
          La plataforma moderna que unifica todas tus cuentas bancarias,
          transacciones y flujo de tesorería en un solo lugar.
        </p>

        {/* BOTONES */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <Link
            href="/login"
            style={{
              padding: "14px 18px",
              background: "#00E0A1",
              color: "#0A1A2F",
              borderRadius: 12,
              fontWeight: 600,
              textAlign: "center",
              textDecoration: "none",
              fontSize: 16,
            }}
          >
            Iniciar sesión
          </Link>

          <Link
            href="/dashboard"
            style={{
              padding: "14px 18px",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(6px)",
              borderRadius: 12,
              fontWeight: 500,
              textAlign: "center",
              textDecoration: "none",
              color: "white",
              fontSize: 16,
            }}
          >
            Ir al Dashboard
          </Link>
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: 60, opacity: 0.4, fontSize: 13 }}>
          © {new Date().getFullYear()} TreasuryLink — Gestión financiera inteligente
        </div>
      </div>
    </main>
  );
}
