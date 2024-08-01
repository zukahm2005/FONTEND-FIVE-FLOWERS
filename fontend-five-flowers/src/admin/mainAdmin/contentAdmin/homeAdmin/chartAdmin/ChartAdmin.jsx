import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import './ChartAdmin.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartAdmin = ({ selectedDate, setTotalSale }) => {
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

      // Set total sales for the selected date
      const selectedDateString = selectedDate.format('YYYY-MM-DD');
      if (dailySalesTotals[selectedDateString]) {
        setTotalSale(dailySalesTotals[selectedDateString]);
      } else {
        setTotalSale(0); // Set to 0 if there's no sales data for the selected date
      }

      setData({
        labels,
        datasets: [
          {
            label: 'Sales',
            data: salesData,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching daily sales totals:', error);
    }
  };

  useEffect(() => {
    const endDate = selectedDate;
    const startDate = selectedDate.clone().subtract(6, 'days');
    fetchDailySalesTotals(startDate, endDate);
  }, [selectedDate]);

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
          stepSize: 500,
        },
        max: 4500,
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
