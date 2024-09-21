import { EllipsisOutlined } from "@ant-design/icons";
import { Dropdown, Form, Menu, message, Modal, Table } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import AddTripForm from "../addTripForm/AddTripForm";
import PopupEditItineraryDate from "./popupTrip/PopupEditDay";
import PopupEditExpense from "./popupTrip/PopupEditExpense";
import PopupEditHour from "./popupTrip/PopupEditHour";
import PopupEditItinerary from "./popupTrip/PopupEditItinerary";
import PopupEditTrip from "./popupTrip/PopupEditTrip";
import "./tripList.scss"; // Import SCSS file to customize scrollbar

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null); // Used to store information of the record being edited
  const [form] = Form.useForm();
  const [editExpenseModalVisible, setEditExpenseModalVisible] = useState(false); // State to show the Expense popup
  const [editItineraryDateModalVisible, setEditItineraryDateModalVisible] =
    useState(false);
  const [editHourModalVisible, setEditHourModalVisible] = useState(false); // State to show the popup
  const [editItineraryModalVisible, setEditItineraryModalVisible] =
    useState(false);
  const [editingItinerary, setEditingItinerary] = useState(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [itineraryForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false); // State để điều khiển modal

  useEffect(() => {
    if (userId && token) {
      fetchTrips();
    } else {
      message.error("User ID or token not found");
    }
  }, [userId]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/trips/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data); // Check the data returned from API

      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
      message.error("An error occurred while loading the trip list");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updatedValues = form.getFieldsValue(); // Get values from the form

      // Format the date correctly before sending to the server
      if (updatedValues.startDate) {
        updatedValues.startDate = updatedValues.startDate.format("YYYY-MM-DD");
      }
      if (updatedValues.endDate) {
        updatedValues.endDate = updatedValues.endDate.format("YYYY-MM-DD");
      }

      // Send the updated data to the server
      await axios.put(
        `http://localhost:8080/api/v1/trips/update/${editingRecord.id}`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Update successful");
      setEditModalVisible(false);
      fetchTrips(); // Reload the trip list after updating
    } catch (error) {
      console.error("Error updating trip:", error);
      message.error("An error occurred while updating");
    }
  };

  // Edit functions for each type
  const editTrip = (record) => {
    setEditingRecord(record);
    setEditModalVisible(true);

    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? moment(record.startDate) : null,
      endDate: record.endDate ? moment(record.endDate) : null,
      distance: record.distance, // Set value for distance
      totalBudget: record.totalBudget, // Set value for total budget
    });
  };

  const editItinerary = async (record) => {
    setEditingRecord(record);
    setEditModalVisible(true);
    form.setFieldsValue(record); // Set form value with itinerary data
  };

  const editItineraryDate = (record) => {
    setEditingRecord(record);
    setEditItineraryDateModalVisible(true);
  };

  const editHour = (record) => {
    setEditingRecord(record); // Set value for the record being edited
    setEditHourModalVisible(true); // Show popup
  };

  // Function to open popup to edit itinerary title
  const editItineraryTitle = (itinerary) => {
    setEditingItinerary(itinerary);
    setEditItineraryModalVisible(true);
    itineraryForm.setFieldsValue({
      title: itinerary.title, // Set itinerary title value
    });
  };

  // Function to save itinerary title
  const handleSaveItineraryTitle = async () => {
    try {
      const updatedValues = itineraryForm.getFieldsValue(); // Get values from the form
      await axios.put(
        `http://localhost:8080/api/v1/itineraries/update/${editingItinerary.id}`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Itinerary description updated successfully");
      setEditItineraryModalVisible(false);
      await fetchTrips(); // Ensure that the list is reloaded
    } catch (error) {
      console.error("Error updating itinerary:", error);
      message.error("An error occurred while updating itinerary description");
    }
  };

  const handleSaveEditHour = async () => {
    try {
      const updatedValues = form.getFieldsValue(); // Get values from the form
      if (updatedValues.time) {
        updatedValues.time = updatedValues.time.format("HH:mm"); // Format the time before saving
      }

      // Send the updated data to the server
      await axios.put(
        `http://localhost:8080/api/v1/hours/update/${editingRecord.id}`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Hour updated successfully");
      setEditHourModalVisible(false); // Close the popup after saving
      fetchTrips(); // Reload the trip list
    } catch (error) {
      console.error("Error updating hour:", error);
      message.error("An error occurred while updating hour");
    }
  };

  const handleSaveEditDay = async () => {
    try {
      const updatedValues = form.getFieldsValue();
      if (updatedValues.date) {
        updatedValues.date = updatedValues.date.format("YYYY-MM-DD");
      }

      // Send the updated data to the server
      await axios.put(
        `http://localhost:8080/api/v1/days/update/${editingRecord.id}`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Day updated successfully");
      setEditItineraryDateModalVisible(false);
      fetchTrips(); // Reload the list after updating
    } catch (error) {
      console.error("Error updating day:", error);
      message.error("An error occurred while updating day");
    }
  };

  const handleSaveEditExpense = async () => {
    try {
      const updatedValues = form.getFieldsValue(); // Get values from the form

      // Send the updated data to the server
      await axios.put(
        `http://localhost:8080/api/v1/expenses/update/${editingRecord.id}`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Expense updated successfully");
      setEditExpenseModalVisible(false);
      fetchTrips(); // Reload the trip list after updating
    } catch (error) {
      console.error("Error updating expense:", error);
      message.error("An error occurred while updating expense");
    }
  };

  // Function to edit Expense
  const editExpense = async (record) => {
    setEditingRecord(record);
    setEditExpenseModalVisible(true);
    form.setFieldsValue(record); // Set form value with expense data
  };

  // Delete functions for each type
  const deleteTrip = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/trips/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: [id], // Send an array of IDs
      });
      message.success("Trip deleted successfully");
      fetchTrips(); // Reload the list after deletion
    } catch (error) {
      console.error("Error deleting trip:", error);
      message.error("An error occurred while deleting trip");
    }
  };

  const deleteItinerary = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/itineraries/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: [id],
      });
      message.success("Itinerary deleted successfully");
      fetchTrips();
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      message.error("An error occurred while deleting itinerary");
    }
  };

  const deleteDay = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/days/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: [id],
      });
      message.success("Day deleted successfully");
      fetchTrips();
    } catch (error) {
      console.error("Error deleting day:", error);
      message.error("An error occurred while deleting day");
    }
  };

  const deleteHour = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/hours/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: [id],
      });
      message.success("Hour deleted successfully");
      fetchTrips();
    } catch (error) {
      console.error("Error deleting hour:", error);
      message.error("An error occurred while deleting hour");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/expenses/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: [id], // Send an array of IDs
      });
      message.success("Expense deleted successfully");
      fetchTrips(); // Reload the trip list after deletion
    } catch (error) {
      console.error("Error deleting expense:", error);
      message.error("An error occurred while deleting expense");
    }
  };

  const addItinerary = async (trip) => {
    // Create a new itinerary with valid default values
    const newItinerary = {
      description: "New Itinerary", // Set default description value
      days: [
        {
          date: moment().format("YYYY-MM-DD"), // Set the current date as default
          hours: [
            {
              time: moment().format("HH:mm"), // Set the current time as default
              expenses: [{ amount: 0, category: "no data", note: "no data" }], // Set default amount to 0 and default category
            },
          ],
        },
      ],
    };

    try {
      // Add the new itinerary to the trip's itinerary list
      const updatedTrip = {
        ...trip,
        itineraries: [...trip.itineraries, newItinerary], // Add new itinerary to the list
      };

      // Send PUT request to update the trip with the new itinerary
      await axios.put(
        `http://localhost:8080/api/v1/trips/update/${trip.id}`,
        updatedTrip,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
        }
      );

      // Success message and reload trip list
      message.success("New itinerary added successfully!");
      fetchTrips(); // Reload the trip list
    } catch (error) {
      // Handle error and show message to the user
      console.error("Error adding itinerary:", error);
      message.error("An error occurred while adding the itinerary.");
    }
  };
  const addDay = async (itinerary) => {
    // Tạo ngày mới với các giá trị mặc định
    const newDay = {
      date: moment().format("YYYY-MM-DD"), // Đặt ngày hiện tại làm mặc định
      hours: [
        {
          time: moment().format("HH:mm"), // Đặt giờ hiện tại làm mặc định
          expenses: [{ amount: 0, category: "no data", note: "no data" }], // Các giá trị mặc định cho giờ và chi phí
        },
      ],
    };

    try {
      // Gửi yêu cầu thêm ngày mới vào lịch trình (POST request)
      const response = await axios.post(
        `http://localhost:8080/api/v1/itineraries/${itinerary.id}/days`,
        newDay,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm header Authorization
          },
        }
      );

      // Thông báo thành công và tải lại danh sách chuyến đi
      message.success("New day added successfully!");
      fetchTrips(); // Tải lại danh sách chuyến đi
    } catch (error) {
      // Xử lý lỗi và hiển thị thông báo cho người dùng
      console.error("Error adding day:", error);
      message.error("An error occurred while adding the day.");
    }
  };
  const addHour = async (day) => {
    if (!day || !day.itinerary || !day.itinerary.id) {
      message.error("Itinerary ID not found for the selected day");
      return;
    }

    // Tạo giờ mới với các giá trị mặc định
    const newHour = {
      time: moment().format("HH:mm"), // Đặt giờ hiện tại làm mặc định
      expenses: [{ amount: 0, category: "no data", note: "no data" }], // Các giá trị mặc định cho chi phí
    };

    try {
      // Gửi yêu cầu thêm giờ mới vào ngày cụ thể (POST request)
      const response = await axios.post(
        `http://localhost:8080/api/v1/itineraries/${day.itinerary.id}/days/${day.id}/hours`,
        newHour,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm header Authorization
          },
        }
      );

      // Thông báo thành công và tải lại danh sách chuyến đi
      message.success("New hour added successfully!");
      fetchTrips(); // Tải lại danh sách chuyến đi để cập nhật giao diện
    } catch (error) {
      // Xử lý lỗi và hiển thị thông báo cho người dùng
      console.error("Error adding hour:", error);
      message.error("An error occurred while adding the hour.");
    }
  };
  const addExpenseToHour = async (hour) => {
    const newExpense = {
      amount: 0, // Giá trị mặc định ban đầu cho chi phí
      category: "No data",
      note: "No note",
    };

    try {
      // Gửi yêu cầu POST để thêm chi phí vào giờ cụ thể
      const response = await axios.post(
        `http://localhost:8080/api/v1/hours/${hour.id}/expenses`,
        newExpense,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Hiển thị thông báo thành công và tải lại danh sách chuyến đi
      message.success("New expense added successfully!");
      fetchTrips(); // Tải lại danh sách chuyến đi để cập nhật giao diện
    } catch (error) {
      console.error("Error adding expense:", error);
      message.error("An error occurred while adding the expense.");
    }
  };

  // Render Menu hành động (Edit, Delete, Add)
  const renderActionMenu = (record, type) => (
    <Menu>
      <Menu.Item
        onClick={() => {
          if (type === "trip") editTrip(record);
          else if (type === "itinerary")
            editItineraryTitle(record); // Đảm bảo đúng hàm được gọi
          else if (type === "day") editItineraryDate(record);
          else if (type === "hour") editHour(record);
          else if (type === "expense") editExpense(record);
        }}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          if (type === "trip") deleteTrip(record.id);
          else if (type === "itinerary") deleteItinerary(record.id);
          else if (type === "day") deleteDay(record.id);
          else if (type === "hour") deleteHour(record.id);
          else if (type === "expense") deleteExpense(record.id);
        }}
      >
        Delete
      </Menu.Item>
      {type === "trip" && (
        <Menu.Item
          onClick={() => addItinerary(record)} // Thêm lịch trình mới
        >
          Add Itinerary
        </Menu.Item>
      )}
      {type === "itinerary" && (
        <Menu.Item
          onClick={() => addDay(record)} // Thêm ngày mới vào lịch trình
        >
          Add Day
        </Menu.Item>
      )}
      {type === "day" && (
        <Menu.Item
          onClick={() => addHour(record)} // Thêm giờ mới vào ngày
        >
          Add Hour
        </Menu.Item>
      )}
      {type === "hour" && (
        <Menu.Item
          onClick={() => addExpenseToHour(record)} // Gọi hàm để thêm chi phí vào giờ
        >
          Add Expense
        </Menu.Item>
      )}
    </Menu>
  );

  // Render the expense table with the action menu for each expense
  const renderExpenseTable = (expenses) => {
    // Tính tổng chi phí đã chi
    const totalExpenses = expenses.reduce(
      (acc, expense) => acc + parseFloat(expense.amount || 0),
      0
    );

    return (
      <div className="expense-table-container">
        <Table
          dataSource={expenses}
          columns={[
            {
              title: "Expense ($)",
              dataIndex: "amount",
              key: "amount",
              render: (amount) => `${amount} `,
            },
            { title: "Category", dataIndex: "category", key: "category" },
            { title: "Note", dataIndex: "note", key: "note" },
            {
              title: "",
              key: "action",
              render: (_, record) => (
                <Dropdown
                  overlay={renderActionMenu(record, "expense")}
                  trigger={["click"]}
                >
                  <div className="dropdown-small">
                    <EllipsisOutlined rotate={90} />
                  </div>
                </Dropdown>
              ),
            },
          ]}
          pagination={false}
          rowKey="id"
          size="small"
        />
      </div>
    );
  };

  const calculateTotalExpenses = (itineraries) => {
    return itineraries.reduce((totalTripExpense, itinerary) => {
      const itineraryExpense = itinerary.days.reduce((totalDayExpense, day) => {
        return (
          totalDayExpense +
          day.hours.reduce((totalHourExpense, hour) => {
            return (
              totalHourExpense +
              hour.expenses.reduce(
                (totalExpense, expense) =>
                  totalExpense + parseFloat(expense.amount || 0),
                0
              )
            );
          }, 0)
        );
      }, 0);
      return totalTripExpense + itineraryExpense;
    }, 0);
  };
  // Hàm tính tổng chi tiêu của một ngày
  const calculateDayExpenses = (day) => {
    return day.hours.reduce((acc, hour) => {
      return (
        acc +
        hour.expenses.reduce(
          (hourAcc, expense) => hourAcc + parseFloat(expense.amount || 0),
          0
        )
      );
    }, 0);
  };
  const renderTripDetails = (trip) => {
    // Tính tổng chi tiêu của chuyến đi
    const totalExpenses = trip.itineraries.reduce((total, itinerary) => {
      return (
        total +
        itinerary.days.reduce((dayTotal, day) => {
          return (
            dayTotal +
            day.hours.reduce((hourTotal, hour) => {
              return (
                hourTotal +
                hour.expenses.reduce((expenseTotal, expense) => {
                  return expenseTotal + parseFloat(expense.amount || 0);
                }, 0)
              );
            }, 0)
          );
        }, 0)
      );
    }, 0);

    // Tính số tiền còn lại
    const remainingBudget = trip.totalBudget - totalExpenses;

    return (
      <div className="trip-details">
        {/* Không cần hiển thị thông tin tripName */}
        <div
          className="remaining-budget"
          style={{ position: "absolute", bottom: "10px", right: "10px" }}
        >
          <p>
            <b
              style={{
                color: "rgb(6, 201, 87)", // Luôn hiển thị màu đỏ
              }}
            >
              Remaining Budget: {remainingBudget} $
            </b>
          </p>
        </div>
      </div>
    );
  };

  // Hiển thị chi tiết lịch trình với tổng chi phí cho ngày và giờ
  const renderItineraryDetails = (itineraries) =>
    itineraries.map((itinerary, iIndex) => (
      <div className="itinerary-container">
        <div key={iIndex}>
          <div className="itinerary-header">
            <h4>{`Itinerary ${iIndex + 1}: ${itinerary.description}`}</h4>
            <Dropdown
              overlay={renderActionMenu(itinerary, "itinerary")}
              trigger={["click"]}
            >
              <div className="dropdown-small">
                <EllipsisOutlined rotate={90} />
              </div>
            </Dropdown>
          </div>

          {/* Lặp qua các ngày trong lịch trình */}
          {itinerary.days && itinerary.days.length > 0 ? (
            itinerary.days.map((day, dIndex) => {
              const dayDate = moment(day.date, "YYYY-MM-DD");
              const dayExpenses = calculateDayExpenses(day); // Tổng chi phí của ngày

              return (
                <div key={dIndex}>
                  <div className="day-header">
                    <p>
                      {`Day ${dIndex + 1}: ${
                        dayDate.isValid()
                          ? dayDate.format("DD/MM/YYYY")
                          : "Invalid date"
                      } `}
                      <span
                        style={{
                          color: "red", // Luôn hiển thị màu đỏ
                        }}
                      >
                        (- {dayExpenses} $)
                      </span>{" "}
                      {/* Hiển thị tổng chi phí của ngày */}
                    </p>
                    <Dropdown
                      overlay={renderActionMenu({ ...day, itinerary }, "day")}
                      trigger={["click"]}
                    >
                      <div className="dropdown-small">
                        <EllipsisOutlined rotate={90} />
                      </div>
                    </Dropdown>
                  </div>

                  <div className="scroll-container info-details-itinerary">
                    {/* Lặp qua các giờ trong ngày */}
                    {day.hours && day.hours.length > 0 ? (
                      day.hours.map((hour, hIndex) => {
                        const hourTime = moment(hour.time, "HH:mm").isValid()
                          ? moment(hour.time, "HH:mm").format("HH:mm")
                          : "Invalid time";

                        const hourExpenses = hour.expenses.reduce(
                          (acc, expense) =>
                            acc + parseFloat(expense.amount || 0),
                          0
                        ); // Tổng chi phí cho giờ

                        return (
                          <div key={hIndex}>
                            <div className="hour-header">
                              <p>
                                Time: {hourTime}{" "}
                                <span
                                  style={{
                                    color: "red", // Luôn hiển thị màu đỏ
                                  }}
                                >
                                  (- {hourExpenses} $)
                                </span>{" "}
                                {/* Hiển thị tổng chi phí của giờ */}
                              </p>
                              <Dropdown
                                overlay={renderActionMenu(hour, "hour")}
                                trigger={["click"]}
                              >
                                <div className="dropdown-small">
                                  <EllipsisOutlined rotate={90} />
                                </div>
                              </Dropdown>
                            </div>
                            {/* Hiển thị bảng chi phí cho mỗi giờ */}
                            {renderExpenseTable(hour.expenses)}
                          </div>
                        );
                      })
                    ) : (
                      <p>No hours available</p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No days available</p>
          )}
        </div>
      </div>
    ));

  // Table structure for displaying trips
  const columns = [
    {
      title: "Trip Name",
      dataIndex: "tripName",
      key: "tripName",
    },
    {
      title: "Start Location",
      dataIndex: "startLocation",
      key: "startLocation",
    },
    {
      title: "End Location",
      dataIndex: "endLocation",
      key: "endLocation",
    },
    {
      title: "Distance(km)",
      dataIndex: "distance",
      key: "distance",
      render: (distance) => `${distance} `, // Display distance with km unit
    },
    {
      title: "Budget($)",
      dataIndex: "totalBudget",
      key: "totalBudget",
      render: (budget) => `${budget} `, // Display total cost
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => {
        return date ? moment(date).format("DD/MM/YYYY") : "Invalid date";
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => {
        return date ? moment(date).format("DD/MM/YYYY") : "Invalid date";
      },
    },

    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Dropdown
          overlay={renderActionMenu(record, "trip")}
          trigger={["click"]}
        >
          <div className="dropdown-small">
            <EllipsisOutlined rotate={90} />
          </div>
        </Dropdown>
      ),
    },
  ];
  const handleAddTrip = () => {
    setIsModalVisible(true); // Hiển thị modal khi nhấn nút "+"
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Đóng modal
  };
  return (
    <div>
      <div className="title-trip-list">
        <h2>
          Trip List{" "}
          <button
            type="primary"
            className="add-trip-btn"
            onClick={handleAddTrip} // Gọi hàm để mở modal
          >
            <p>
              <FaPlus />
            </p>
          </button>
        </h2>
      </div>

      <Table
        columns={columns}
        dataSource={trips}
        rowKey="id"
        loading={loading}
        pagination={false} // Bỏ phân trang bằng cách đặt thuộc tính pagination={false}
        expandable={{
          expandedRowRender: (record) => (
            <>
              {renderItineraryDetails(record.itineraries, record.totalBudget)}
              {renderTripDetails(record)}
            </>
          ),
        }}
        style={{ maxWidth: "1000px", margin: "0 auto" }}
      />

      {/* Modal to edit Trip */}
      <PopupEditTrip
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => {
          setEditModalVisible(false);
          fetchTrips(); // Reload the list after updating
        }}
        editingRecord={editingRecord} // Record being edited
        token={token}
      />

      <PopupEditExpense
        visible={editExpenseModalVisible}
        onCancel={() => setEditExpenseModalVisible(false)}
        onOk={handleSaveEditExpense}
        form={form}
        editingRecord={editingRecord}
      />
      <PopupEditItineraryDate
        visible={editItineraryDateModalVisible}
        onCancel={() => setEditItineraryDateModalVisible(false)}
        onOk={() => {
          setEditItineraryDateModalVisible(false);
          fetchTrips(); // Call function to reload list after updating
        }}
        editingRecord={editingRecord}
        token={token}
      />

      <PopupEditHour
        visible={editHourModalVisible}
        onCancel={() => setEditHourModalVisible(false)}
        onOk={handleSaveEditHour}
        form={form}
        editingRecord={editingRecord}
      />
      <PopupEditItinerary
        visible={editItineraryModalVisible}
        onCancel={() => setEditItineraryModalVisible(false)}
        onOk={handleSaveItineraryTitle}
        form={itineraryForm} // Use separate form for Itinerary
        editingItinerary={editingItinerary}
      />

      <Modal
        title="Add New Trip"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width="600px" // Điều chỉnh chiều rộng
        style={{ top: 0 }} // Đảm bảo modal bắt đầu từ đỉnh màn hình
        bodyStyle={{ height: "100vh", overflowY: "auto" }} // Điều chỉnh chiều cao và thêm cuộn dọc
      >
        {/* Hiển thị component AddTrip bên trong modal */}
        <AddTripForm />
      </Modal>
    </div>
  );
};

export default TripList;
