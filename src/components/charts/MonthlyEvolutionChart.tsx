"use client";

import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, LinearScale, CategoryScale, PointElement, Tooltip, Filler);

export default function MonthlyEvolutionChart({
  monthly,
}: {
  monthly: [string, number][];
}) {
  if (monthly.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center opacity-50">
        No hay datos suficientes.
      </div>
    );
  }

  // ✅ Labels y valores reales
  const labels = monthly.map(([month]) => month.slice(5));
  const realValues = monthly.map(([_, v]) => v);

  // ✅ AMPLIFICACIÓN VISUAL (Opción B)
  const min = Math.min(...realValues);
  const max = Math.max(...realValues);

  // Evita división entre 0 si todos los valores son iguales
  const amplifiedValues =
    max - min === 0
      ? realValues.map(() => 50) // todos iguales → barra centrada
      : realValues.map((v) => {
          // Normalización 0-1
          const normalized = (v - min) / (max - min);
          // Amplificación visual (ajusta 0.65 para más curva)
          return normalized * 100 * 0.65 + 20;
        });

  const data = {
    labels,
    datasets: [
      {
        label: "",
        data: amplifiedValues,
        fill: true,
        borderColor: "#00E0A1",
        borderWidth: 3,
        tension: 0.45,
        pointRadius: 4,
        pointBorderWidth: 2,
        pointBackgroundColor: "#0A1A2F",
        pointBorderColor: "#00E0A1",
        backgroundColor: (ctx: any) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(0,224,161,0.35)");
          gradient.addColorStop(1, "rgba(0,224,161,0)");
          return gradient;
        },
      },
    ],
  };

  const options: any = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0A1A2F",
        titleColor: "#00E0A1",
        bodyColor: "white",
        padding: 12,
        borderColor: "#00E0A1",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: "white", padding: 8 },
        grid: { display: false },
      },
      y: {
        ticks: { display: false },
        grid: { display: false },
        suggestedMin: 0,
        suggestedMax: 120,
      },
    },
  };

  return <Line data={data} options={options} height={140} />;
}
