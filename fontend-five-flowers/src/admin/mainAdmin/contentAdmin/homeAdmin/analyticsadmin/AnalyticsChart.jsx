import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DatePicker, Select } from 'antd';
import moment from 'moment';
import './AnalyticsChart.scss'; // Import file SCSS của bạn

const { RangePicker } = DatePicker;
const { Option } = Select;

const AnalyticsChart = () => {
    const [chartData, setChartData] = useState([]);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState([moment().subtract(30, 'days'), moment()]);
    const [preset, setPreset] = useState('last30days');
    const [interval, setInterval] = useState(0);

    const generateTimePoints = (start, end) => {
        const timePoints = [];
        const duration = moment.duration(end.diff(start)).asDays();
        const isHourly = duration < 7;

        const current = moment(start).startOf('day');

        while (current <= end) {
            timePoints.push(current.clone());
            if (isHourly) {
                current.add(1, 'hours');
            } else {
                current.add(1, 'days');
            }
        }

        return timePoints;
    };

    const fetchStats = async (start, end) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/analytics/stats', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    startDate: start.toISOString(),
                    endDate: end.toISOString()
                }
            });
            const stats = response.data;
            console.log("API Response:", stats);

            if (stats && Array.isArray(stats.totalVisits)) {
                const timePoints = generateTimePoints(start, end);
                const visitDataMap = new Map();

                stats.times.forEach((time, index) => {
                    visitDataMap.set(time, stats.totalVisits[index]);
                });

                const duration = moment.duration(end.diff(start)).asDays();
                const isHourly = duration < 7;

                const filteredData = timePoints.map(timePoint => {
                    const timeLabel = isHourly ? timePoint.format('YYYY-MM-DDTHH:mm:ss') : timePoint.format('YYYY-MM-DD');
                    return {
                        time: isHourly ? timePoint.format('h:mm A') : timePoint.format('MMM D'),
                        value: visitDataMap.get(timeLabel) || 0
                    };
                });

                console.log("Filtered Data:", filteredData);
                setChartData(filteredData);

                setInterval(duration < 7 ? 2 : 3);
            } else {
                setChartData([]);
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

    const fetchYesterdayStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/analytics/stats/yesterday', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const stats = response.data;
            console.log("API Response (Yesterday):", stats);

            if (stats && Array.isArray(stats.totalVisits)) {
                const timePoints = generateTimePoints(dateRange[0], dateRange[1]);
                const visitDataMap = new Map();

                stats.times.forEach((time, index) => {
                    visitDataMap.set(time, stats.totalVisits[index]);
                });

                const duration = moment.duration(dateRange[1].diff(dateRange[0])).asDays();
                const isHourly = duration < 7;

                const filteredData = timePoints.map(timePoint => {
                    const timeLabel = isHourly ? timePoint.format('YYYY-MM-DDTHH:mm:ss') : timePoint.format('YYYY-MM-DD');
                    return {
                        time: isHourly ? timePoint.format('h:mm A') : timePoint.format('MMM D'),
                        value: visitDataMap.get(timeLabel) || 0
                    };
                });

                console.log("Filtered Data (Yesterday):", filteredData);
                setChartData(filteredData);

                setInterval(duration < 7 ? 2 : 3);
            } else {
                setChartData([]);
                setError('Invalid data format from API');
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setError('You are not authorized to view this data.');
            } else {
                setError('Failed to fetch stats');
            }
            console.error('Failed to fetch stats (Yesterday)', error);
        }
    };

    useEffect(() => {
        if (preset === 'yesterday') {
            fetchYesterdayStats();
        } else {
            const [start, end] = dateRange;
            fetchStats(start, end);
        }
    }, [dateRange, preset]);

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    const handlePresetChange = (value) => {
        let startDate, endDate;

        switch (value) {
            case 'today':
                startDate = moment().startOf('day');
                endDate = moment().endOf('day');
                break;
            case 'yesterday':
                startDate = moment().subtract(1, 'days').startOf('day');
                endDate = moment().subtract(1, 'days').endOf('day');
                break;
            case 'last7days':
                startDate = moment().subtract(7, 'days').startOf('day');
                endDate = moment().endOf('day');
                break;
            case 'last30days':
                startDate = moment().subtract(30, 'days').startOf('day');
                endDate = moment().endOf('day');
                break;
            case 'last90days':
                startDate = moment().subtract(90, 'days').startOf('day');
                endDate = moment().endOf('day');
                break;
            case 'last365days':
                startDate = moment().subtract(365, 'days').startOf('day');
                endDate = moment().endOf('day');
                break;
            default:
                startDate = moment().subtract(30, 'days');
                endDate = moment();
        }
        setPreset(value);
        console.log("Preset selected:", value, "Start:", startDate.format(), "End:", endDate.format());
        setDateRange([startDate, endDate]);
    };

    if (error) return <div>{error}</div>;

    if (chartData.length === 0) return <div>Loading...</div>;

    return (
        <div className="chart-container">
            <h2>Online store sessions</h2>
            <Select defaultValue="last30days" style={{ width: 200, marginRight: 10 }} onChange={handlePresetChange}>
                <Option value="today">Today</Option>
                <Option value="yesterday">Yesterday</Option>
                <Option value="last7days">Last 7 days</Option>
                <Option value="last30days">Last 30 days</Option>
                <Option value="last90days">Last 90 days</Option>
                <Option value="last365days">Last 365 days</Option>
            </Select>
            <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
            />
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" interval={interval} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalyticsChart;
