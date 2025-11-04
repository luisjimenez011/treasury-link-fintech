"use client";

import React, { useState } from "react";

export default function ImportDummyButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleImport() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/import", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({ error: err.message });
    }

    setLoading(false);
  }

  return (
    <div style={{ margin: "24px 0" }}>
      {/* ✅ BOTÓN FINTECH PREMIUM */}
      <button
        onClick={handleImport}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px 18px",
          borderRadius: 12,
          background:
            "linear-gradient(135deg, rgba(30,87,255,1) 0%, rgba(0,148,255,1) 100%)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "white",
          fontWeight: 600,
          fontSize: 16,
          letterSpacing: "0.3px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          backdropFilter: "blur(4px)",
          transition: "transform 0.15s ease, opacity 0.2s",
        }}
      >
        {loading ? (
          <span style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <span
              style={{
                width: 16,
                height: 16,
                border: "3px solid rgba(255,255,255,0.4)",
                borderTopColor: "white",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            ></span>
            Importando…
          </span>
        ) : (
          "📥 Importar datos financieros de prueba"
        )}
      </button>

      {/* ✅ RESULTADO EN TARJETA GLASS */}
      {result && (
        <div
          style={{
            marginTop: 16,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            padding: 16,
            borderRadius: 12,
            color: "#eaeaea",
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            fontSize: 13,
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {JSON.stringify(result, null, 2)}
        </div>
      )}

      {/* ✅ ANIMACIÓN DEL SPINNER */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
