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
        backgroundColor: 'rgba(13, 148, 136, 0.4)',
        borderColor: '#14b8a6',
        borderWidth: 2,
        borderRadius: 4,
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
        ticks: { color: '#94a3b8' },
        grid: { color: '#334155' }
      },
      x: {
        ticks: { color: '#f8fafc', font: { size: 10 } },
        grid: { color: '#334155' }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="card" style={{ height: '320px' }}>
      <div className="card-title">📈 Category Readiness Breakdown</div>
      <div style={{ height: '240px', position: 'relative' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
