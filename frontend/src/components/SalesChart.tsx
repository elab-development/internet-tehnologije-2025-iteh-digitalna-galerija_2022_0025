import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  artworksByCategory: Array<{ name: string; count: number }>;
};

export default function SalesChart({ artworksByCategory }: Props) {
  const data = {
    labels: artworksByCategory.map(cat => cat.name),
    datasets: [
      {
        label: 'Broj umetničkih dela',
        data: artworksByCategory.map(cat => cat.count),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Broj umetničkih dela po kategorijama',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
          callback: function(value: number) {
            return Number.isInteger(value) ? value : '';
          }
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
}
