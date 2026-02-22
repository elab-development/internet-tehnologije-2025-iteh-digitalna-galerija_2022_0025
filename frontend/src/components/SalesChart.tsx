import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
  labels: ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun'],
  datasets: [
    {
      label: 'Prodaja po mesecima',
      data: [120, 150, 180, 90, 200, 170],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Analiza prodaje po mesecima',
    },
  },
};

export default function SalesChart() {
  return <Bar data={data} options={options} />;
}
