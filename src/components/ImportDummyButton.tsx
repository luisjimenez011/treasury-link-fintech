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
      <button 
        onClick={handleImport} 
        disabled={loading}
        style={{ padding: 10, width: "100%" }}
      >
        {loading ? "Importando…" : "Importar datos financieros de prueba"}
      </button>

      {result && (
        <pre style={{ 
          background: "#f5f5f5", 
          padding: 16, 
          marginTop: 12, 
          borderRadius: 8, 
          whiteSpace: "pre-wrap" 
        }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
