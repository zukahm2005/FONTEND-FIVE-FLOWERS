import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  TimePicker,
  message,
} from "antd";
import axios from "axios";
import { format } from "date-fns";
import moment from "moment";
import React, { useState } from "react";
import "./addTripForm.scss";
const AddTripForm = () => {
  const [form] = Form.useForm();
  const [itineraries, setItineraries] = useState([
    {
      description: "",
      days: [
        {
          date: "",
          hours: [
            { time: "", expenses: [{ amount: "", category: "", note: "" }] },
          ],
        },
      ],
    },
  ]);

  const addItinerary = () => {
    setItineraries([
      ...itineraries,
      {
        description: "",
        days: [
          {
            date: "",
            hours: [
              { time: "", expenses: [{ amount: "", category: "", note: "" }] },
            ],
          },
        ],
      },
    ]);
  };

  const addDay = (index) => {
    const newItineraries = [...itineraries];
    const startDate = form.getFieldValue("startDate");
    const endDate = form.getFieldValue("endDate");

    const defaultDate =
      newItineraries[index].days.length === 0
        ? startDate
        : moment(
            newItineraries[index].days[newItineraries[index].days.length - 1]
              .date
          ).add(1, "days");

    if (defaultDate.isAfter(endDate)) {
      message.error("Ngày mới không thể lớn hơn ngày kết thúc.");
      return;
    }

    newItineraries[index].days.push({
      date: defaultDate.format("YYYY-MM-DD"),
      hours: [{ time: "", expenses: [{ amount: "", category: "", note: "" }] }],
    });
    setItineraries(newItineraries);
  };

  const addHour = (itineraryIndex, dayIndex) => {
    const newItineraries = [...itineraries];
    newItineraries[itineraryIndex].days[dayIndex].hours.push({
      time: "",
      expenses: [{ amount: "", category: "", note: "" }],
    });
    setItineraries(newItineraries);
  };

  const onFinish = async (values) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        message.error("Không tìm thấy userId hoặc token trong localStorage");
        return;
      }

      const tripData = {
        ...values,
        startDate: values.startDate
          ? format(values.startDate, "yyyy-MM-dd")
          : null,
        endDate: values.endDate ? format(values.endDate, "yyyy-MM-dd") : null,
        itineraries: itineraries.map((itinerary) => ({
          ...itinerary,
          days: itinerary.days.map((day) => ({
            ...day,
            date: day.date ? format(day.date, "yyyy-MM-dd") : null,
          })),
        })),
        user: {
          id: userId,
        },
      };

      console.log("Trip Data gửi lên server:", tripData);

      await axios.post("http://localhost:8080/api/v1/trips/add", [tripData], {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("Thêm chuyến đi thành công!");
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi thêm chuyến đi.");
    }
  };

  return (
    <div className="add-trip-container">
      <h2>Add Trip</h2>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <div className="header-add-trip-container">
          <div className="name-trip">
            <Form.Item
              label="Trip Name"
              name="tripName"
              rules={[
                { required: true, message: "Please enter the trip name!" },
              ]}
            >
              <Input placeholder="Enter trip name" />
            </Form.Item>
          </div>
          <div className="start-point-trip">
            <Form.Item
              label="Start Location"
              name="startLocation"
              rules={[
                { required: true, message: "Please enter the start point!" },
              ]}
            >
              <Input placeholder="Enter start point" />
            </Form.Item>
          </div>
          <div className="end-point-trip">
            <Form.Item
              label="End Location"
              name="endLocation"
              rules={[
                { required: true, message: "Please enter the end point!" },
              ]}
            >
              <Input placeholder="Enter end point" />
            </Form.Item>
          </div>
          <div className="budget-trip-container">
            <Form.Item
              label="Total Budget"
              name="totalBudget"
              rules={[
                { required: true, message: "Please enter the total budget!" },
              ]}
            >
              <Input placeholder="Enter total budget" />
            </Form.Item>
          </div>
          <div className="distance-trip-container">
            <Form.Item
              label="Distance"
              name="distance"
              rules={[
                { required: true, message: "Please enter the distance!" },
              ]}
            >
              <Input placeholder="Enter distance" />
            </Form.Item>
          </div>
          <div className="start-date-trip">
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[
                { required: true, message: "Please select the start date!" },
              ]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                onChange={(date) => form.setFieldsValue({ startDate: date })}
              />
            </Form.Item>
          </div>
          <div className="end-date-trip">
            <Form.Item
              label="End Date"
              name="endDate"
              rules={[
                { required: true, message: "Please select the end date!" },
              ]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                onChange={(date) => form.setFieldsValue({ endDate: date })}
              />
            </Form.Item>
          </div>
        </div>

        <Divider />
        <h3>Itinerary</h3>

        {itineraries.map((itinerary, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <div className="itinerary-header">
              <Form.Item
                label={`Itinerary ${index + 1} Description`}
                style={{ display: "block" }}
              >
                <Input
                  value={itinerary.description}
                  onChange={(e) => {
                    const newItineraries = [...itineraries];
                    newItineraries[index].description = e.target.value;
                    setItineraries(newItineraries);
                  }}
                  placeholder="Enter itinerary description"
                />
              </Form.Item>
            </div>

            {itinerary.days.map((day, dayIndex) => (
              <div key={dayIndex} style={{ marginBottom: "16px" }}>
                <Form.Item
                  label={`Day ${dayIndex + 1}`}
                  style={{ display: "block" }}
                >
                  <DatePicker
                    value={day.date ? moment(day.date, "YYYY-MM-DD") : null}
                    onChange={(date) => {
                      const newItineraries = [...itineraries];
                      newItineraries[index].days[dayIndex].date = date
                        ? date.format("YYYY-MM-DD")
                        : null;
                      setItineraries(newItineraries);
                    }}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
                <Button
                  type="dashed"
                  onClick={() => addDay(index)}
                  style={{
                    display: "block",
                    width: "fit-content",
                    marginTop: "10px",
                  }}
                >
                  + Add Day
                </Button>

                {day.hours.map((hour, hourIndex) => (
                  <div key={hourIndex} style={{ marginBottom: "16px" }}>
                    <Form.Item
                      label={`Hour ${hourIndex + 1}`}
                      style={{ display: "block" }}
                    >
                      <TimePicker
                        value={hour.time ? moment(hour.time, "HH:mm") : null}
                        onChange={(time) => {
                          const newItineraries = [...itineraries];
                          newItineraries[index].days[dayIndex].hours[
                            hourIndex
                          ].time = time ? time.format("HH:mm") : "";
                          setItineraries(newItineraries);
                        }}
                        format="HH:mm"
                      />
                    </Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => addHour(index, dayIndex)}
                      style={{
                        display: "block",
                        width: "fit-content",
                        marginTop: "10px",
                      }}
                    >
                      + Add Hour
                    </Button>

                    {hour.expenses.map((expense, expenseIndex) => (
                      <div
                        key={expenseIndex}
                        style={{ marginLeft: "20px", marginBottom: "8px" }}
                      >
                        <Form.Item label={`Expense ${expenseIndex + 1}`}>
                          <Input
                            value={expense.amount}
                            onChange={(e) => {
                              const newItineraries = [...itineraries];
                              newItineraries[index].days[dayIndex].hours[
                                hourIndex
                              ].expenses[expenseIndex].amount = e.target.value;
                              setItineraries(newItineraries);
                            }}
                            placeholder="Enter amount"
                          />
                          <Input
                            value={expense.category}
                            onChange={(e) => {
                              const newItineraries = [...itineraries];
                              newItineraries[index].days[dayIndex].hours[
                                hourIndex
                              ].expenses[expenseIndex].category =
                                e.target.value;
                              setItineraries(newItineraries);
                            }}
                            placeholder="Enter category"
                          />
                          <Input
                            value={expense.note}
                            onChange={(e) => {
                              const newItineraries = [...itineraries];
                              newItineraries[index].days[dayIndex].hours[
                                hourIndex
                              ].expenses[expenseIndex].note = e.target.value;
                              setItineraries(newItineraries);
                            }}
                            placeholder="Enter note"
                          />
                        </Form.Item>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

        <Button
          type="dashed"
          onClick={addItinerary}
          style={{ marginBottom: 16, display: "block", marginTop: "10px" }}
        >
          + Add Itinerary
        </Button>

        <Button
          type="primary"
          htmlType="submit"
          style={{ marginTop: "20px", display: "block" }}
        >
          Save Trip
        </Button>
      </Form>
    </div>
  );
};

export default AddTripForm;
