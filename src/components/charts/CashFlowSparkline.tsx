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

export default function CashFlowSparkline({ chart }: { chart: any[] }) {
  // Si no hay datos, mostramos un placeholder
  if (!chart || chart.length === 0) {
    return (
      <div className="h-16 flex items-center justify-center text-sm opacity-60">
        No hay datos recientes disponibles.
      </div>
    );
  }

  // Etiquetas: "10 Nov", "11 Nov"...
  const labels = chart.map((c) => {
    const [month, day] = c.date.split("-");
    return `${day}/${month}`;
  });

  // Valores: importes diarios
  const values = chart.map((c) => c.amount);

  const data = {
    labels,
    datasets: [
      {
        label: "Flujo de efectivo diario (€)",
        data: values,
        borderColor: "#00E0A1",
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointRadius: 3,
        pointBorderWidth: 1.5,
        pointBackgroundColor: "#0A1A2F",
        pointBorderColor: "#00E0A1",
        backgroundColor: (ctx: any) => {
          const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
          g.addColorStop(0, "rgba(0,224,161,0.25)");
          g.addColorStop(1, "rgba(0,224,161,0)");
          return g;
        },
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#0A1A2F",
        titleColor: "#00E0A1",
        bodyColor: "#FFFFFF",
        padding: 10,
        borderColor: "#00E0A1",
        borderWidth: 1,
        callbacks: {
          title: (items: any) => `Día ${items[0].label}`,
          label: (item: any) =>
            `Flujo: ${item.raw > 0 ? "+" : ""}${item.raw.toFixed(2)} €`,
        },
      },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <div className="relative">
      <Line data={data} options={options} height={80} />
    </div>
  );
}
