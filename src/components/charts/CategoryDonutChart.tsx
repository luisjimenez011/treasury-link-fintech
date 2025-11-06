"use client";

import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryDonutChart({
  categories,
  palette,
}: {
  categories: [string, number][];
  palette: string[];
}) {
  const labels = categories.map(([c]) => c);
  const values = categories.map(([_, v]) => v);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: palette.map((c) =>
          `linear-gradient(135deg, ${c}AA, ${c})`
        ),
        hoverBackgroundColor: palette,
        borderWidth: 3,
        borderColor: "#0A1A2F",
        spacing: 4,
      },
    ],
  };

  const options: any = {
    cutout: "68%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#0A1A2F",
        titleColor: "#00E0A1",
        bodyColor: "white",
        padding: 10,
        borderColor: "#00E0A1",
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="w-[160px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
      <Doughnut data={data} options={options} />
    </div>
  );
}
