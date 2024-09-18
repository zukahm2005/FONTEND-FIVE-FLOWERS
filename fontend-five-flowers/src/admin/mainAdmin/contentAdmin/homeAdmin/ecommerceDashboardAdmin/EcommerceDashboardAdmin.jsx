import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'antd';
import {
  DollarOutlined,
  PercentageOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  OrderedListOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EcommerceDashboardAdmin.scss';

const EcommerceDashboardAdmin = ({ selectedDates, totalSale }) => {
  const [stats, setStats] = useState({
    totalSale: 0,
    newOrder: 0,
    addToCart: 0,
    conversionRate: '0%',
    visitor: 0,
    orderPending: 0,
  });

  const navigate = useNavigate();

  const fetchSummary = async (startDate, endDate) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/v1/orders/summary', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
        },
      });

      const data = response.data;

      const cartResponse = await axios.get('http://localhost:8080/api/v1/cart/stats/range', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
        },
      });

      const conversionRate = data.visitors > 0 ? ((data.newOrders / data.visitors) * 100).toFixed(1) : '0.0';

      setStats({
        totalSale: `$${data.totalSales}`,
        newOrder: data.newOrders,
        addToCart: cartResponse.data.addToCart,
        conversionRate: `${conversionRate}%`,
        visitor: data.visitors,
        orderPending: data.pendingOrders,
      });
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  useEffect(() => {
    const [startDate, endDate] = selectedDates;
    fetchSummary(startDate, endDate);
  }, [selectedDates]);

  const statsData = [
    {
      title: 'Total Sale',
      value: stats.totalSale,
      icon: <DollarOutlined />,
      color: '#1890ff',
    },
    {
      title: 'New Order',
      value: stats.newOrder,
      icon: <OrderedListOutlined />,
      color: '#722ed1',
      onClick: () => navigate('/admin/orders?status=new'),
    },
    {
      title: 'Add To Cart',
      value: stats.addToCart,
      icon: <ShoppingCartOutlined />,
      color: '#eb2f96',
    },
    {
      title: 'Conversion Rate',
      value: stats.conversionRate,
      icon: <PercentageOutlined />,
      color: '#52c41a',
    },
    {
      title: 'Visitor',
      value: stats.visitor,
      icon: <EyeOutlined />,
      color: '#f5222d',
    },
    {
      title: 'Order Pending',
      value: stats.orderPending,
      icon: <ClockCircleOutlined />,
      color: '#faad14',
      onClick: () => navigate('/admin/orders?status=pending'),
    },
  ];

  return (
    <div className='ecommerce-dashboard-container'>
      <Row gutter={[16, 16]}>
        {statsData.map((stat, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <Card
              className='stat-card'
              style={{ borderLeft: `4px solid ${stat.color}`, cursor: stat.onClick ? 'pointer' : 'default' }}
              onClick={stat.onClick}
            >
              <div className='stat-card-body'>
                <div className='stat-card-icon' style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className='stat-card-content'>
                  <div className='stat-card-value'>{stat.value}</div>
                  <div className='stat-card-title'>{stat.title}</div>
                </div>
              </div>
              <div className='stat-card-footer'>
                <a href='#'>
                  More info <span>&#8594;</span>
                </a>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default EcommerceDashboardAdmin;
