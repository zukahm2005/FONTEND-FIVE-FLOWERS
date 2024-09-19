import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, TimePicker, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

const AddTripForm = () => {
  const [form] = Form.useForm();
  const [itineraries, setItineraries] = useState([{ description: '', days: [{ date: '', hours: [{ time: '', expenses: [{ amount: '', category: '', note: '' }] }] }] }]);

  const addItinerary = () => {
    setItineraries([...itineraries, { description: '', days: [{ date: '', hours: [{ time: '', expenses: [{ amount: '', category: '', note: '' }] }] }] }]);
  };

  const addDay = (index) => {
    const newItineraries = [...itineraries];
    newItineraries[index].days.push({ date: '', hours: [{ time: '', expenses: [{ amount: '', category: '', note: '' }] }] });
    setItineraries(newItineraries);
  };

  const addHour = (itineraryIndex, dayIndex) => {
    const newItineraries = [...itineraries];
    newItineraries[itineraryIndex].days[dayIndex].hours.push({ time: '', expenses: [{ amount: '', category: '', note: '' }] });
    setItineraries(newItineraries);
  };

  const onFinish = async (values) => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        message.error('Không tìm thấy userId hoặc token trong localStorage');
        return;
      }

      const tripData = {
        ...values,
        startDate: values.startDate ? moment(values.startDate).format('YYYY-MM-DD') : null,
        endDate: values.endDate ? moment(values.endDate).format('YYYY-MM-DD') : null,
        itineraries,
        user: {
          id: userId,
        },
      };

      const response = await axios.post('http://localhost:8080/api/v1/trips/add', [tripData], {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success('Thêm chuyến đi thành công!');
    } catch (error) {
      console.error(error);
      message.error('Có lỗi xảy ra khi thêm chuyến đi.');
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item label="Tên Chuyến Đi" name="tripName" rules={[{ required: true, message: 'Vui lòng nhập tên chuyến đi!' }]}>
        <Input placeholder="Nhập tên chuyến đi" />
      </Form.Item>
      <Form.Item label="Điểm Bắt Đầu" name="startLocation" rules={[{ required: true, message: 'Vui lòng nhập điểm bắt đầu!' }]}>
        <Input placeholder="Nhập điểm bắt đầu" />
      </Form.Item>
      <Form.Item label="Điểm Kết Thúc" name="endLocation" rules={[{ required: true, message: 'Vui lòng nhập điểm kết thúc!' }]}>
        <Input placeholder="Nhập điểm kết thúc" />
      </Form.Item>
      <Form.Item label="Tổng Chi Phí" name="totalBudget" rules={[{ required: true, message: 'Vui lòng nhập tổng chi phí!' }]}>
        <Input placeholder="Nhập tổng chi phí" />
      </Form.Item>
      <Form.Item label="Khoảng Cách" name="distance" rules={[{ required: true, message: 'Vui lòng nhập khoảng cách!' }]}>
        <Input placeholder="Nhập khoảng cách" />
      </Form.Item>
      <Form.Item label="Ngày Bắt Đầu" name="startDate" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}>
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item label="Ngày Kết Thúc" name="endDate" rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}>
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>

      <h3>Lịch Trình</h3>
      {itineraries.map((itinerary, index) => (
        <div key={index}>
          <Form.Item label={`Mô tả Lịch Trình ${index + 1}`}>
            <Input
              value={itinerary.description}
              onChange={(e) => {
                const newItineraries = [...itineraries];
                newItineraries[index].description = e.target.value;
                setItineraries(newItineraries);
              }}
              placeholder="Nhập mô tả lịch trình"
            />
          </Form.Item>
          {itinerary.days.map((day, dayIndex) => (
            <div key={dayIndex}>
              <Form.Item label={`Ngày ${dayIndex + 1}`}>
                <DatePicker
                  value={day.date ? moment(day.date) : null}
                  onChange={(date) => {
                    const newItineraries = [...itineraries];
                    newItineraries[index].days[dayIndex].date = date;
                    setItineraries(newItineraries);
                  }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
              {day.hours.map((hour, hourIndex) => (
                <div key={hourIndex}>
                  <Form.Item label={`Giờ ${hourIndex + 1}`}>
                    {/* Thay thế Input bằng TimePicker */}
                    <TimePicker
                      value={hour.time ? moment(hour.time, 'HH:mm') : null}
                      onChange={(time) => {
                        const newItineraries = [...itineraries];
                        newItineraries[index].days[dayIndex].hours[hourIndex].time = time ? time.format('HH:mm') : '';
                        setItineraries(newItineraries);
                      }}
                      format="HH:mm"
                      placeholder="Chọn giờ"
                    />
                  </Form.Item>
                  {hour.expenses.map((expense, expenseIndex) => (
                    <div key={expenseIndex}>
                      <Form.Item label={`Chi Phí ${expenseIndex + 1}`}>
                        <Input
                          value={expense.amount}
                          onChange={(e) => {
                            const newItineraries = [...itineraries];
                            newItineraries[index].days[dayIndex].hours[hourIndex].expenses[expenseIndex].amount = e.target.value;
                            setItineraries(newItineraries);
                          }}
                          placeholder="Nhập số tiền"
                        />
                        <Input
                          value={expense.category}
                          onChange={(e) => {
                            const newItineraries = [...itineraries];
                            newItineraries[index].days[dayIndex].hours[hourIndex].expenses[expenseIndex].category = e.target.value;
                            setItineraries(newItineraries);
                          }}
                          placeholder="Nhập loại chi phí"
                        />
                        <Input
                          value={expense.note}
                          onChange={(e) => {
                            const newItineraries = [...itineraries];
                            newItineraries[index].days[dayIndex].hours[hourIndex].expenses[expenseIndex].note = e.target.value;
                            setItineraries(newItineraries);
                          }}
                          placeholder="Nhập ghi chú"
                        />
                      </Form.Item>
                    </div>
                  ))}
                </div>
              ))}
              <Button type="dashed" onClick={() => addHour(index, dayIndex)}>
                + Thêm giờ
              </Button>
            </div>
          ))}
          <Button type="dashed" onClick={() => addDay(index)}>
            + Thêm ngày
          </Button>
        </div>
      ))}

      <Button type="dashed" onClick={addItinerary} style={{ marginBottom: 16 }}>
        + Thêm lịch trình mới
      </Button>
      <Button type="primary" htmlType="submit">
        Lưu Chuyến Đi
      </Button>
    </Form>
  );
};

export default AddTripForm;
