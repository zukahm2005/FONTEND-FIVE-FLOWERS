import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import moment from 'moment';
import './CalorieChart.css';
import DistanceTracker from './mapComponent';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);


const CalorieChart = () => {
  const [chartData, setChartData] = useState({});
  const [chartTime, setChartTime] = useState({});
  const [todayDistance, setTodayDistance] = useState(0);
  const [error, setError] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]));
      const userId = user.userId;

      if (user.roles && user.roles.includes('ROLE_USER')) {
        axios.get(`http://localhost:8080/api/v1/calorie-consumption/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => {
            const data = response.data;

            if (Array.isArray(data) && data.length > 0) {
              const aggregatedDataByDate = data.reduce((acc, entry) => {
                const date = moment(entry.createdAt).format('YYYY-MM-DD');
                if (!acc[date]) {
                  acc[date] = { calories: 0, time: 0, distance: 0 };
                }
                acc[date].calories += entry.caloriesBurned;
                acc[date].time += entry.time;
                acc[date].distance += entry.distance;
                return acc;
              }, {});

              const today = moment().format('YYYY-MM-DD'); // Ensure date format is consistent
              const dates = Object.keys(aggregatedDataByDate).slice(-15);
              const calories = dates.map(date => aggregatedDataByDate[date].calories);
              const time = dates.map(date => aggregatedDataByDate[date].time);
              const distance = dates.map(date => aggregatedDataByDate[date].distance);

              setTodayDistance(aggregatedDataByDate[today]?.distance || 0); // Set today's distance

              setChartTime({
                labels: dates,
                datasets: [
                  {
                    label: 'Time Spent (Hours)',
                    data: time,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                    fill: false,
                  },
                  {
                    label: 'Distance (Km)',
                    data: distance,
                    backgroundColor: 'rgba(255, 159, 64, 0.6)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1,
                    fill: false,
                  }
                ],
                options: {
                  scales: {
                    x: {
                      type: 'time',
                      time: {
                        unit: 'day'
                      }
                    }
                  }
                },
              });

              setChartData({
                labels: dates,
                datasets: [
                  {
                    label: 'Calories Burned',
                    data: calories,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                  }
                ]
              });
            } else {
              setError('No data available');
            }
          })
          .catch(error => {
            console.error('There was an error fetching the data!', error);
          });
      } else {
        setError('User is not authorized to view this data');
      }
    } else {
      setError('No token found');
    }
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='caloChar' >
      <DistanceTracker />
      <div style={{ margin: '20px 0', textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>
        Total Distance Traveled Today: {todayDistance} Km
      </div>
      {Object.keys(chartData).length > 0 ? (
        <>
          <Line data={chartData} />
          <Bar data={chartTime} />
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <img style={{
            width: '100%',
            margin: '30px 0'
          }} src='https://vn1.vdrive.vn/nghiahai.com/2018/10/S%E1%BB%B1-luy%E1%BB%87n-t%E1%BA%ADp-v%E1%BB%81-t%E1%BB%91c-%C4%91%E1%BB%99-gi%C3%BAp-b%E1%BA%A1n-tr%E1%BB%9F-th%C3%A0nh-m%E1%BB%99t-tay-%C4%91ua-xe-%C4%91%E1%BA%A1p-t%E1%BB%91t-h%C6%A1n-nh%C6%B0-th%E1%BA%BF-n%C3%A0o-2.jpg' />
          <p style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#ff6347',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: '#f0f0f0',
          }}>
            Start the training process
          </p>
          <button
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#ffffff',
              backgroundColor: '#ff6347',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s ease',
            }}
            type="submit"
            onMouseOver={(e) => e.target.style.backgroundColor = '#ff7f50'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ff6347'}
          >
            Start
          </button>
        </div>
      )}
    </div>
  );
}

export default CalorieChart;
