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
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import './EcommerceDashboardAdmin.scss';

const EcommerceDashboardAdmin = ({ selectedDate, totalSale }) => {
  const [stats, setStats] = useState({
    totalSale: 0,
    newOrder: 0,
    addToCart: 0,
    conversionRate: '0%',
    visitor: 0,
    orderPending: 0,
  });

  const navigate = useNavigate();

  const fetchStats = async (date) => {
    try {
      const token = localStorage.getItem('token');
      const [visitResponse, orderResponse, pendingOrderResponse] = await Promise.all([
        axios.get('/api/analytics/visit-count', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            date: date.format('YYYY-MM-DD'),
          },
        }),
        axios.get('/api/v1/orders/new-orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            date: date.format('YYYY-MM-DD'),
          },
        }),
        axios.get('/api/v1/orders/pending-orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            date: date.format('YYYY-MM-DD'),
          },
        }),
      ]);

      const visitCount = visitResponse.data.visitCount;
      const newOrdersCount = orderResponse.data.newOrdersCount;
      const orderPendingsCount = pendingOrderResponse.data.pendingOrdersCount;

      const conversionRate = visitCount > 0 ? ((newOrdersCount / visitCount) * 100).toFixed(2) : '0';

      setStats((prevStats) => ({
        ...prevStats,
        newOrder: newOrdersCount,
        visitor: visitCount,
        orderPending: orderPendingsCount,
        conversionRate: `${conversionRate}%`,
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchAddToCartStats = async (date) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/cart/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          date: date.format('YYYY-MM-DD'),
        },
      });

      const data = response.data;
      setStats((prevStats) => ({
        ...prevStats,
        addToCart: data.addToCart,
      }));
    } catch (error) {
      console.error('Error fetching add to cart stats:', error);
    }
  };

  useEffect(() => {
    fetchStats(selectedDate);
    fetchAddToCartStats(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    setStats((prevStats) => ({
      ...prevStats,
      totalSale: `$${totalSale}`,
    }));
  }, [totalSale]);

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
      color: '#faad14',
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
      color: '#eb2f96',
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
