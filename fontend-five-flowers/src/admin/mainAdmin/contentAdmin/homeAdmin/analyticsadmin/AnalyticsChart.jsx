import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './AnalyticsChart.scss'; // Import file SCSS của bạn

const AnalyticsChart = () => {
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token'); // Lấy token từ localStorage
                const response = await axios.get('/api/analytics/stats', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const stats = response.data;
                console.log("API Response:", stats);

                if (stats && stats.dates && stats.totalVisits) {
                    const data = {
                        labels: stats.dates,
                        datasets: [
                            {
                                label: 'Jun 14 - Jul 13, 2024',
                                data: stats.totalVisits,
                                fill: false,
                                backgroundColor: 'rgba(75,192,192,0.6)',
                                borderColor: 'rgba(75,192,192,1)',
                                tension: 0.4, // Độ cong của đường nối giữa các điểm
                            },
                            {
                                label: 'May 15 - Jun 13, 2024',
                                data: stats.totalVisits.map(v => v * 0.9), // Thêm dữ liệu giả cho ví dụ
                                fill: false,
                                backgroundColor: 'rgba(192,75,192,0.6)',
                                borderColor: 'rgba(192,75,192,1)',
                                tension: 0.4, // Độ cong của đường nối giữa các điểm
                            }
                        ],
                    };
                    setChartData(data);
                } else {
                    setError('Invalid data format from API');
                }
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    setError('You are not authorized to view this data.');
                } else {
                    setError('Failed to fetch stats');
                }
                console.error('Failed to fetch stats', error);
            }
        };

        fetchStats();
    }, []);

    if (error) return <div>{error}</div>;

    if (!chartData) return <div>Loading...</div>;

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 200, // Đặt bước nhảy là 200
                    callback: function(value) {
                        return value; // Hiển thị giá trị mặc định
                    }
                },
                suggestedMin: 0, // Đặt giá trị tối thiểu cho trục y
                suggestedMax: 400 // Đặt giá trị tối đa cho trục y
            }
        }
    };

    return (
        <div>
             <div className="chart-container">
            <h2>Analytics Chart</h2>
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default AnalyticsChart;
