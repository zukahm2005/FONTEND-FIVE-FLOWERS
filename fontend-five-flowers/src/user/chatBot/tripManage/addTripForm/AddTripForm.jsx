import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Select,
  TimePicker,
} from "antd";
import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import "./addTripForm.scss";

// Import your JSON files
import canthoPhuQuoc from "./sampleTrips/canthoPhuQuoc.json";
import danangHoiAn from "./sampleTrips/danang-hoian.json";
import hueNhaTrang from "./sampleTrips/hue-NhaTrang.json";
import nhatrangDaLat from "./sampleTrips/nhatrang-DaLat.json";
import sampleTrips from "./sampleTrips/sampleTrips.json";
import sapaLaoCai from "./sampleTrips/sapa-LaoCai.json";

const { Option } = Select;

const AddTripForm = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [groupSizes, setGroupSizes] = useState([]);
  const [itineraries, setItineraries] = useState([]); // Initialize empty to add manually

  const allTrips = [
    ...sampleTrips.sampleTrips,
    ...sapaLaoCai.sampleTrips,
    ...danangHoiAn.sampleTrips,
    ...hueNhaTrang.sampleTrips,
    ...nhatrangDaLat.sampleTrips,
    ...canthoPhuQuoc.sampleTrips,
  ];

  // Automatically fill data when selecting an available trip
  const handleTripChange = (value) => {
    const selectedTrip = allTrips.find((trip) => trip.tripName === value);
    if (selectedTrip) {
      form.setFieldsValue({
        tripName: selectedTrip.tripName,
        startLocation: selectedTrip.startLocation,
        endLocation: selectedTrip.endLocation,
        distance: selectedTrip.distance,
        totalBudget: selectedTrip.totalBudget,
        startDate: selectedTrip.startDate
          ? moment(selectedTrip.startDate, "YYYY-MM-DD")
          : null,
        endDate: selectedTrip.endDate
          ? moment(selectedTrip.endDate, "YYYY-MM-DD")
          : null,
      });
      setCategories(selectedTrip.categories || []);
      setGroupSizes([]); // Reset when the trip changes
      setItineraries(selectedTrip.itineraries || []); // Assign itineraries from available data
    }
  };

  // Update group sizes and assign corresponding data when selecting a category
  const handleCategoryChange = (value) => {
    const selectedCategory = categories.find(
      (category) => category.categoryName === value
    );
    if (selectedCategory) {
      setGroupSizes(selectedCategory.groupSizeOptions || []);
      setItineraries([]); // Clear itineraries when selecting a new category
    }
  };

  // Automatically fill itinerary data when selecting group size
  const handleGroupSizeChange = (value) => {
    const selectedGroupSize = groupSizes.find(
      (groupSize) => groupSize.groupSize === value
    );
    if (selectedGroupSize) {
      setItineraries(selectedGroupSize.itineraries || []); // Fill itineraries from available data
    }
  };

  // Add itinerary manually
  const addItineraryManually = () => {
    const newItinerary = {
      description: "",
      days: [
        {
          date: null,
          hours: [
            {
              time: null,
              expenses: [{ amount: "", category: "", note: "" }],
            },
          ],
        },
      ],
    };
    setItineraries([...itineraries, newItinerary]); // Add itinerary manually
  };

  const addDay = (itineraryIndex) => {
    const newItineraries = [...itineraries];
    newItineraries[itineraryIndex].days.push({
      date: null,
      hours: [
        { time: null, expenses: [{ amount: "", category: "", note: "" }] },
      ],
    });
    setItineraries(newItineraries);
  };

  const handleDateChange = (itineraryIndex, dayIndex, date) => {
    console.log("Selected date for day", dayIndex, ":", date); // Kiểm tra giá trị ngày được chọn
    const updatedItineraries = [...itineraries];
    updatedItineraries[itineraryIndex].days[dayIndex].date = date
      ? date.format("YYYY-MM-DD")
      : null; // Format thành chuỗi "YYYY-MM-DD" hoặc gán null nếu không có giá trị
    setItineraries(updatedItineraries);
    console.log("Updated itineraries: ", updatedItineraries);
  };
  

  const removeDay = (itineraryIndex, dayIndex) => {
    const newItineraries = [...itineraries];
    newItineraries[itineraryIndex].days.splice(dayIndex, 1);
    setItineraries(newItineraries);
  };

  const addHour = (itineraryIndex, dayIndex) => {
    const newItineraries = [...itineraries];
    newItineraries[itineraryIndex].days[dayIndex].hours.push({
      time: null,
      expenses: [{ amount: "", category: "", note: "" }],
    });
    setItineraries(newItineraries);
  };

  const removeHour = (itineraryIndex, dayIndex, hourIndex) => {
    const newItineraries = [...itineraries];
    newItineraries[itineraryIndex].days[dayIndex].hours.splice(hourIndex, 1);
    setItineraries(newItineraries);
  };

  const addExpense = (itineraryIndex, dayIndex, hourIndex) => {
    const newItineraries = [...itineraries];
    newItineraries[itineraryIndex].days[dayIndex].hours[
      hourIndex
    ].expenses.push({
      amount: "",
      category: "",
      note: "",
    });
    setItineraries(newItineraries);
  };

  const removeExpense = (itineraryIndex, dayIndex, hourIndex, expenseIndex) => {
    const newItineraries = [...itineraries];
    newItineraries[itineraryIndex].days[dayIndex].hours[
      hourIndex
    ].expenses.splice(expenseIndex, 1);
    setItineraries(newItineraries);
  };

  const onFinish = async (values) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        message.error("User ID or token not found in localStorage");
        return;
      }

      const tripData = {
        ...values,
        startDate: values.startDate
          ? values.startDate.format("YYYY-MM-DD")
          : null, // Format startDate
        endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null, // Format endDate
        itineraries: itineraries.map((itinerary) => ({
          ...itinerary,
          days: itinerary.days.map((day) => ({
            ...day,
            date: day.date ? day.date : null // Kiểm tra và gán date đúng nếu có giá trị
          })),
        })),
        user: {
          id: userId,
        },
      };

      console.log("Trip Data sent to server:", tripData);

      await axios.post("http://localhost:8080/api/v1/trips/add", [tripData], {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("Trip added successfully!");
    } catch (error) {
      console.error(error);
      message.error("An error occurred while adding the trip.");
    }
  };

  const removeItinerary = (index) => {
    const newItineraries = [...itineraries];
    newItineraries.splice(index, 1); // Remove the selected itinerary
    setItineraries(newItineraries);
  };

  return (
    <div className="add-trip-container">
      <h2>Add Trip</h2>
      <label>Select an available trip: </label>

      <Select
        placeholder="Select a sample trip"
        style={{ width: 200, marginBottom: 20 }}
        onChange={handleTripChange}
      >
        {allTrips.map((trip) => (
          <Option key={trip.tripName} value={trip.tripName}>
            {trip.tripName}
          </Option>
        ))}
      </Select>

      {/* Select category */}
      {categories.length > 0 && (
        <Select
          placeholder="Select category"
          style={{ width: 200, marginLeft: 20 }}
          onChange={handleCategoryChange}
        >
          {categories.map((category) => (
            <Option key={category.categoryName} value={category.categoryName}>
              {category.categoryName}
            </Option>
          ))}
        </Select>
      )}

      {/* Select group size */}
      {groupSizes.length > 0 && (
        <Select
          placeholder="Select group size"
          style={{ width: 200, marginLeft: 20 }}
          onChange={handleGroupSizeChange}
        >
          {groupSizes.map((groupSize) => (
            <Option key={groupSize.groupSize} value={groupSize.groupSize}>
              {groupSize.groupSize}
            </Option>
          ))}
        </Select>
      )}

      <Form form={form} onFinish={onFinish} layout="vertical">
        <div className="header-add-trip-container">
          <div className="name-trip">
            <Form.Item
              label="Trip Name"
              name="tripName"
              rules={[{ required: true, message: "Please enter trip name!" }]}
            >
              <Input placeholder="Enter trip name" />
            </Form.Item>
          </div>
          <div className="start-point-trip">
            <Form.Item
              label="Start Location"
              name="startLocation"
              rules={[
                { required: true, message: "Please enter start location!" },
              ]}
            >
              <Input placeholder="Enter start location" />
            </Form.Item>
          </div>
          <div className="end-point-trip">
            <Form.Item
              label="End Location"
              name="endLocation"
              rules={[
                { required: true, message: "Please enter end location!" },
              ]}
            >
              <Input placeholder="Enter end location" />
            </Form.Item>
          </div>
          <div className="budget-trip-container">
            <Form.Item
              label="Budget ($)"
              name="totalBudget"
              rules={[{ required: true, message: "Please enter budget!" }]}
            >
              <Input placeholder="Enter budget" />
            </Form.Item>
          </div>
          <div className="distance-trip-container">
            <Form.Item
              label="Distance (km)"
              name="distance"
              rules={[{ required: true, message: "Please enter distance!" }]}
            >
              <Input placeholder="Enter distance" />
            </Form.Item>
          </div>
          <div className="start-date-trip">
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: "Please select a start date!" }]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
          </div>
          <div className="end-date-trip">
            <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true, message: "Please select an end date!" }]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
          </div>
        </div>
        <Divider />
        <h3>Itinerary</h3>
        {itineraries.length > 0 ? (
          itineraries.map((itinerary, itineraryIndex) => (
            <div key={itineraryIndex} style={{ marginBottom: "20px" }}>
              <div className="itinerary-header">
                <Form.Item
                  label={`Itinerary ${itineraryIndex + 1} Description`}
                  style={{ display: "block" }}
                >
                  <Input
                    value={itinerary.description}
                    onChange={(e) =>
                      setItineraries((prevItineraries) => {
                        const newItineraries = [...prevItineraries];
                        newItineraries[itineraryIndex].description =
                          e.target.value;
                        return newItineraries;
                      })
                    }
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
                      onChange={(date) =>
                        handleDateChange(itineraryIndex, dayIndex, date)
                      }
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>

                  <div className="button-container-btn">
                    <Button
                      type="dashed"
                      onClick={() => addDay(itineraryIndex)}
                      style={{
                        display: "block",
                        width: "fit-content",
                        marginTop: "10px",
                      }}
                    >
                      + Add Day
                    </Button>

                    <Button
                      type="danger"
                      className="remove-btn"
                      onClick={() => removeDay(itineraryIndex, dayIndex)}
                      style={{
                        display: "block",
                        width: "fit-content",
                        marginTop: "10px",
                      }}
                    >
                      Remove Day
                    </Button>
                  </div>

                  {day.hours.map((hour, hourIndex) => (
                    <div key={hourIndex} style={{ marginBottom: "16px" }}>
                      <Form.Item
                        label={`Hour ${hourIndex + 1}`}
                        style={{ display: "block" }}
                      >
                        <TimePicker
                          value={hour.time ? moment(hour.time, "HH:mm") : null}
                          onChange={(time) =>
                            setItineraries((prevItineraries) => {
                              const newItineraries = [...prevItineraries];
                              newItineraries[itineraryIndex].days[dayIndex]
                                .hours[hourIndex].time = time
                                ? time.format("HH:mm")
                                : null;
                              return newItineraries;
                            })
                          }
                          format="HH:mm"
                        />
                      </Form.Item>

                      <div className="button-container-btn">
                        <Button
                          type="dashed"
                          onClick={() => addHour(itineraryIndex, dayIndex)}
                          style={{
                            display: "block",
                            width: "fit-content",
                            marginTop: "10px",
                          }}
                        >
                          + Add Hour
                        </Button>

                        <Button
                          type="danger"
                          className="remove-btn"
                          onClick={() =>
                            removeHour(itineraryIndex, dayIndex, hourIndex)
                          }
                          style={{
                            display: "block",
                            width: "fit-content",
                            marginTop: "10px",
                          }}
                        >
                          Remove Hour
                        </Button>
                      </div>

                      {hour.expenses.map((expense, expenseIndex) => (
                        <div
                          key={expenseIndex}
                          style={{ marginLeft: "20px", marginBottom: "8px" }}
                        >
                          <Form.Item
                            label={`Expense ${expenseIndex + 1}`}
                            className="form-input-expense"
                          >
                            <Input
                              value={expense.amount}
                              onChange={(e) =>
                                setItineraries((prevItineraries) => {
                                  const newItineraries = [...prevItineraries];
                                  newItineraries[itineraryIndex].days[
                                    dayIndex
                                  ].hours[hourIndex].expenses[expenseIndex]
                                    .amount = e.target.value;
                                  return newItineraries;
                                })
                              }
                              placeholder="Enter amount"
                            />
                            <Input
                              value={expense.category}
                              onChange={(e) =>
                                setItineraries((prevItineraries) => {
                                  const newItineraries = [...prevItineraries];
                                  newItineraries[itineraryIndex].days[
                                    dayIndex
                                  ].hours[hourIndex].expenses[expenseIndex]
                                    .category = e.target.value;
                                  return newItineraries;
                                })
                              }
                              placeholder="Enter expense category"
                            />
                            <Input
                              value={expense.note}
                              onChange={(e) =>
                                setItineraries((prevItineraries) => {
                                  const newItineraries = [...prevItineraries];
                                  newItineraries[itineraryIndex].days[
                                    dayIndex
                                  ].hours[hourIndex].expenses[expenseIndex]
                                    .note = e.target.value;
                                  return newItineraries;
                                })
                              }
                              placeholder="Enter note"
                            />
                          </Form.Item>

                          <div className="button-container-btn">
                            <Button
                              type="dashed"
                              onClick={() =>
                                addExpense(itineraryIndex, dayIndex, hourIndex)
                              }
                              style={{
                                display: "block",
                                width: "fit-content",
                                marginTop: "10px",
                              }}
                            >
                              + Add Expense
                            </Button>

                            <Button
                              type="danger"
                              className="remove-btn"
                              onClick={() =>
                                removeExpense(
                                  itineraryIndex,
                                  dayIndex,
                                  hourIndex,
                                  expenseIndex
                                )
                              }
                              style={{
                                display: "block",
                                width: "fit-content",
                                marginTop: "10px",
                              }}
                            >
                              Remove Expense
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No itineraries</p>
        )}
        <div className="button-container-btn">
          <Button type="dashed" onClick={addItineraryManually}>
            Add Itinerary Manually
          </Button>
          <Button
            className="remove-btn"
            type="danger"
            onClick={() => setItineraries([])} // Clears all itineraries
          >
            Remove Itinerary
          </Button>
        </div>{" "}
        <Button type="primary" htmlType="submit" style={{ display: "block" }}>
          Save Trip
        </Button>{" "}
      </Form>
    </div>
  );
};

export default AddTripForm;
