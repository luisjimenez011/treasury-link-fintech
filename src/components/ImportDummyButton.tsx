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

      // ✅ Refrescar dashboard automáticamente tras importar
      setTimeout(() => {
        window.location.reload();
      }, 600);

    } catch (err: any) {
      setResult({ error: err.message });
    }

    setLoading(false);
  }

  return (
    <div className="my-8">
      {/* ✅ BOTÓN FINTECH PRO */}
      <button
        onClick={handleImport}
        disabled={loading}
        className={`
          w-full py-4 rounded-xl font-semibold text-white text-[15px]
          transition-all duration-200 shadow-lg backdrop-blur-sm
          bg-gradient-to-br from-blue-600 to-blue-400
          border border-white/20
          ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.015]"}
        `}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <span className="
              w-5 h-5 border-2 border-white/40 border-t-white rounded-full
              animate-spin
            "></span>
            Importando…
          </span>
        ) : (
          "Importar datos financieros de prueba"
        )}
      </button>

      {/* ✅ TARJETA GLASS CON RESULTADO */}
      {result && (
        <div
          className="
            mt-5 p-4 rounded-xl text-sm font-mono whitespace-pre-wrap
            bg-white/10 border border-white/20 text-white
            shadow-xl backdrop-blur-xl
          "
        >
          {JSON.stringify(result, null, 2)}
        </div>
      )}
    </div>
  );
}
