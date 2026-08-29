import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend
);

export default function CategoryChart({ categoryScores }) {
  const labels = Object.keys(categoryScores || {});
  const dataValues = Object.values(categoryScores || {});

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Readiness Score (%)',
        data: dataValues,
        backgroundColor: 'rgba(6, 182, 212, 0.35)',
        borderColor: '#38bdf8',
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(6, 182, 212, 0.65)'
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } },
        grid: { color: 'rgba(56, 189, 248, 0.1)' }
      },
      x: {
        ticks: { color: '#f8fafc', font: { family: 'Inter', size: 10, weight: '600' } },
        grid: { color: 'rgba(56, 189, 248, 0.05)' }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#38bdf8',
        bodyColor: '#f8fafc',
        borderColor: 'rgba(56, 189, 248, 0.3)',
        borderWidth: 1,
        padding: 10,
        displayColors: false
      }
    }
  };

  return (
    <div className="card" style={{ height: '340px' }}>
      <div className="card-title">📈 Category Readiness Breakdown</div>
      <div style={{ height: '260px', position: 'relative' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
