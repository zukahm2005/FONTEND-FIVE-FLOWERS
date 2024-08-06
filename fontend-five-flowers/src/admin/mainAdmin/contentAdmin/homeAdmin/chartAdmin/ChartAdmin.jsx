import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import moment from 'moment';
import './ChartAdmin.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartAdmin = ({ selectedDates, setTotalSale }) => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Sales',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  const fetchDailySalesTotals = async (startDate, endDate) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/orders/daily-sales-totals', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
        },
      });
      const dailySalesTotals = response.data;

      const labels = Object.keys(dailySalesTotals);
      const salesData = Object.values(dailySalesTotals);

      const displayedLabels = labels.length > 7 ? labels.slice(-7) : labels;
      const displayedSalesData = salesData.length > 7 ? salesData.slice(-7) : salesData;

      setData({
        labels: displayedLabels,
        datasets: [
          {
            label: 'Sales',
            data: displayedSalesData,
            backgroundColor: 'rgba(249, 115, 55, 0.85)',
            borderColor: 'rgb(193, 98, 77)',
            borderWidth: 1,
          },
        ],
      });

      if (dailySalesTotals[endDate.format('YYYY-MM-DD')]) {
        setTotalSale(dailySalesTotals[endDate.format('YYYY-MM-DD')]);
      } else {
        setTotalSale(0);
      }
    } catch (error) {
      console.error('Error fetching daily sales totals:', error);
    }
  };

  useEffect(() => {
    const endDate = selectedDates[1];
    const startDate = endDate.clone().subtract(6, 'days');
    fetchDailySalesTotals(startDate, endDate);
  }, [selectedDates]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `$${context.parsed.y}`;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Day',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount',
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1000,
        },
        max: 8000,
      },
    },
  };

  return (
    <div className="chart-admin-container">
      <h2>Summary</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ChartAdmin;
