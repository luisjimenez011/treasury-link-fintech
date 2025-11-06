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
  const labels = chart.map((c) => c.date);
  const values = chart.map((c) => c.amount);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: "#00E0A1",
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointRadius: 0,
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
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
  };

  return <Line data={data} options={options} height={60} />;
}
