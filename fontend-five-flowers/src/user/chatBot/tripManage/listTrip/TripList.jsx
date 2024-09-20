import { EllipsisOutlined } from "@ant-design/icons";
import { Dropdown, Form, Menu, message, Table } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import PopupEditItineraryDate from "./popupTrip/PopupEditDay";
import PopupEditExpense from "./popupTrip/PopupEditExpense";
import PopupEditHour from "./popupTrip/PopupEditHour";
import PopupEditItinerary from "./popupTrip/PopupEditItinerary";
import PopupEditTrip from "./popupTrip/PopupEditTrip";
import "./tripList.scss"; // Import file SCSS để tùy chỉnh thanh cuộn

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null); // Dùng để lưu thông tin của record đang chỉnh sửa
  const [form] = Form.useForm();
  const [editExpenseModalVisible, setEditExpenseModalVisible] = useState(false); // Trạng thái hiển thị popup cho Expense
  const [editItineraryDateModalVisible, setEditItineraryDateModalVisible] =
    useState(false);
  const [editHourModalVisible, setEditHourModalVisible] = useState(false); // Trạng thái hiển thị popup
  const [editItineraryModalVisible, setEditItineraryModalVisible] =
    useState(false);
  const [editingItinerary, setEditingItinerary] = useState(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [itineraryForm] = Form.useForm();

  useEffect(() => {
    if (userId && token) {
      fetchTrips();
    } else {
      message.error("Không tìm thấy userId hoặc token");
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

      console.log(response.data); // Kiểm tra dữ liệu trả về từ API

      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
      message.error("Có lỗi xảy ra khi tải danh sách chuyến đi");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updatedValues = form.getFieldsValue(); // Lấy giá trị từ form

      // Định dạng lại ngày cho đúng trước khi gửi lên server
      if (updatedValues.startDate) {
        updatedValues.startDate = updatedValues.startDate.format("YYYY-MM-DD");
      }
      if (updatedValues.endDate) {
        updatedValues.endDate = updatedValues.endDate.format("YYYY-MM-DD");
      }

      // Gửi dữ liệu cập nhật lên server
      await axios.put(
        `http://localhost:8080/api/v1/trips/update/${editingRecord.id}`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Cập nhật thành công");
      setEditModalVisible(false);
      fetchTrips(); // Tải lại danh sách sau khi cập nhật
    } catch (error) {
      console.error("Error updating trip:", error);
      message.error("Có lỗi xảy ra khi cập nhật");
    }
  };

  // Các hàm edit riêng lẻ cho từng loại
  const editTrip = (record) => {
    setEditingRecord(record);
    setEditModalVisible(true);

    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? moment(record.startDate) : null,
      endDate: record.endDate ? moment(record.endDate) : null,
      distance: record.distance, // Gán giá trị cho khoảng cách
      totalBudget: record.totalBudget, // Gán giá trị cho tổng chi phí
    });
  };

  const editItinerary = async (record) => {
    setEditingRecord(record);
    setEditModalVisible(true);
    form.setFieldsValue(record); // Đặt giá trị form với dữ liệu itinerary
  };
  const editItineraryDate = (record) => {
    setEditingRecord(record);
    setEditItineraryDateModalVisible(true);
  };

  const editHour = (record) => {
    setEditingRecord(record); // Đặt giá trị cho record đang chỉnh sửa
    setEditHourModalVisible(true); // Hiển thị popup
  };
  // Hàm mở popup chỉnh sửa tiêu đề lịch trình
  const editItineraryTitle = (itinerary) => {
    setEditingItinerary(itinerary);
    setEditItineraryModalVisible(true);
    itineraryForm.setFieldsValue({
      title: itinerary.title, // Đặt giá trị tiêu đề lịch trình
    });
  };

  // Hàm lưu tiêu đề lịch trình
  const handleSaveItineraryTitle = async () => {
    try {
      const updatedValues = itineraryForm.getFieldsValue(); // Lấy giá trị từ form
      await axios.put(
        `http://localhost:8080/api/v1/itineraries/update/${editingItinerary.id}`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Cập nhật mô tả lịch trình thành công");
      setEditItineraryModalVisible(false);
      await fetchTrips(); // Đảm bảo rằng danh sách được tải lại
    } catch (error) {
      console.error("Error updating itinerary:", error);
      message.error("Có lỗi xảy ra khi cập nhật mô tả lịch trình");
    }
  };

  const handleSaveEditHour = async () => {
    try {
      const updatedValues = form.getFieldsValue(); // Lấy giá trị từ form
      if (updatedValues.time) {
        updatedValues.time = updatedValues.time.format("HH:mm"); // Định dạng giờ trước khi lưu
      }

      // Gửi dữ liệu cập nhật lên server
      await axios.put(
        `http://localhost:8080/api/v1/hours/update/${editingRecord.id}`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Cập nhật giờ thành công");
      setEditHourModalVisible(false); // Đóng popup sau khi lưu
      fetchTrips(); // Tải lại danh sách chuyến đi
    } catch (error) {
      console.error("Error updating hour:", error);
      message.error("Có lỗi xảy ra khi cập nhật giờ");
    }
  };
  const handleSaveEditDay = async () => {
    try {
      const updatedValues = form.getFieldsValue();
      if (updatedValues.date) {
        updatedValues.date = updatedValues.date.format("YYYY-MM-DD");
      }

      // Gửi dữ liệu cập nhật lên server
      await axios.put(
        `http://localhost:8080/api/v1/days/update/${editingRecord.id}`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Cập nhật ngày thành công");
      setEditItineraryDateModalVisible(false);
      fetchTrips(); // Tải lại danh sách sau khi cập nhật
    } catch (error) {
      console.error("Error updating day:", error);
      message.error("Có lỗi xảy ra khi cập nhật ngày");
    }
  };

  const handleSaveEditExpense = async () => {
    try {
      const updatedValues = form.getFieldsValue(); // Lấy giá trị từ form

      // Gửi dữ liệu cập nhật lên server
      await axios.put(
        `http://localhost:8080/api/v1/expenses/update/${editingRecord.id}`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Cập nhật chi phí thành công");
      setEditExpenseModalVisible(false);
      fetchTrips(); // Tải lại danh sách sau khi cập nhật
    } catch (error) {
      console.error("Error updating expense:", error);
      message.error("Có lỗi xảy ra khi cập nhật chi phí");
    }
  };

  // Thêm hàm chỉnh sửa Expense
  const editExpense = async (record) => {
    setEditingRecord(record);
    setEditExpenseModalVisible(true);
    form.setFieldsValue(record); // Đặt giá trị form với dữ liệu expense
  };

  // Các hàm xóa riêng lẻ cho từng loại
  const deleteTrip = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/trips/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: [id], // Gửi mảng các ID lên
      });
      message.success("Xóa chuyến đi thành công");
      fetchTrips(); // Tải lại danh sách sau khi xóa
    } catch (error) {
      console.error("Error deleting trip:", error);
      message.error("Có lỗi xảy ra khi xóa chuyến đi");
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
      message.success("Xóa lịch trình thành công");
      fetchTrips();
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      message.error("Có lỗi xảy ra khi xóa lịch trình");
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
      message.success("Xóa ngày thành công");
      fetchTrips();
    } catch (error) {
      console.error("Error deleting day:", error);
      message.error("Có lỗi xảy ra khi xóa ngày");
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
      message.success("Xóa giờ thành công");
      fetchTrips();
    } catch (error) {
      console.error("Error deleting hour:", error);
      message.error("Có lỗi xảy ra khi xóa giờ");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/expenses/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: [id], // Gửi mảng ID
      });
      message.success("Xóa chi phí thành công");
      fetchTrips(); // Tải lại danh sách chuyến đi sau khi xóa
    } catch (error) {
      console.error("Error deleting expense:", error);
      message.error("Có lỗi xảy ra khi xóa chi phí");
    }
  };

  // Render Menu hành động (Edit, Delete)
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
    </Menu>
  );

  // Render bảng chi phí với menu hành động cho từng Expense
  const renderExpenseTable = (expenses) => (
    <div className="expense-table-container">
      <Table
        dataSource={expenses}
        columns={[
          {
            title: "Chi phí ($)",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => `${amount} $`,
          },
          { title: "Loại", dataIndex: "category", key: "category" },
          { title: "Ghi chú", dataIndex: "note", key: "note" },
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

  // Render chi tiết lịch trình với menu hành động cho từng loại
  const renderItineraryDetails = (itineraries) =>
    itineraries.map((itinerary, iIndex) => (
      <div key={iIndex}>
        <div className="itinerary-header">
          <h4>{`Lịch Trình ${iIndex + 1}: ${itinerary.description}`}</h4>
          <Dropdown
            overlay={renderActionMenu(itinerary, "itinerary")}
            trigger={["click"]}
          >
            <div className="dropdown-small">
              <EllipsisOutlined rotate={90} />
            </div>
          </Dropdown>
        </div>

        {itinerary.days.map((day, dIndex) => {
          // Đảm bảo xử lý đúng ngày với moment theo định dạng chuẩn ISO 8601
          const dayDate = moment(day.date, "YYYY-MM-DD"); // Đảm bảo rằng định dạng ngày là chính xác

          return (
            <div key={dIndex}>
              <div className="day-header">
                <p>{`Ngày ${dIndex + 1}: ${
                  dayDate.isValid()
                    ? dayDate.format("DD/MM/YYYY") // Hiển thị ngày đúng định dạng
                    : "Ngày không hợp lệ"
                }`}</p>
                <Dropdown
                  overlay={renderActionMenu(day, "day")}
                  trigger={["click"]}
                >
                  <div className="dropdown-small">
                    <EllipsisOutlined rotate={90} />
                  </div>
                </Dropdown>
              </div>

              <div className="scroll-container">
                {day.hours.map((hour, hIndex) => {
                  const hourTime = moment(hour.time, "HH:mm"); // Xử lý giờ với định dạng HH:mm

                  return (
                    <div key={hIndex}>
                      <div className="hour-header">
                        <p>{`Giờ: ${
                          hourTime.isValid()
                            ? hourTime.format("HH:mm") // Hiển thị giờ đúng định dạng
                            : "Giờ không hợp lệ"
                        }`}</p>
                        <Dropdown
                          overlay={renderActionMenu(hour, "hour")}
                          trigger={["click"]}
                        >
                          <div className="dropdown-small">
                            <EllipsisOutlined rotate={90} />
                          </div>
                        </Dropdown>
                      </div>
                      {renderExpenseTable(hour.expenses)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    ));

  // Cấu trúc bảng hiển thị chuyến đi
  const columns = [
    {
      title: "Tên Chuyến Đi",
      dataIndex: "tripName",
      key: "tripName",
    },
    {
      title: "Điểm Bắt Đầu",
      dataIndex: "startLocation",
      key: "startLocation",
    },
    {
      title: "Điểm Kết Thúc",
      dataIndex: "endLocation",
      key: "endLocation",
    },
    {
      title: "Khoảng Cách",
      dataIndex: "distance",
      key: "distance",
      render: (distance) => `${distance} `, // Hiển thị khoảng cách có đơn vị km
    },
    {
      title: "Tổng Chi Phí ($)",
      dataIndex: "totalBudget",
      key: "totalBudget",
      render: (budget) => `${budget} $`, // Hiển thị tổng chi phí
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => {
        return date ? moment(date).format("DD/MM/YYYY") : "Ngày không hợp lệ";
      },
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => {
        return date ? moment(date).format("DD/MM/YYYY") : "Ngày không hợp lệ";
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

  return (
    <div>
      <h2>Danh Sách Các Chuyến Đi</h2>
      <Table
        columns={columns}
        dataSource={trips}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        expandable={{
          expandedRowRender: (record) =>
            renderItineraryDetails(record.itineraries),
        }}
        style={{ maxWidth: "1000px", margin: "0 auto" }}
      />

      {/* Modal chỉnh sửa Trip */}
      <PopupEditTrip
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => {
          setEditModalVisible(false);
          fetchTrips(); // Tải lại danh sách sau khi cập nhật
        }}
        editingRecord={editingRecord} // Record đang được chỉnh sửa
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
          fetchTrips(); // Gọi hàm tải lại danh sách sau khi cập nhật
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
        form={itineraryForm} // Sử dụng form riêng cho Itinerary
        editingItinerary={editingItinerary}
      />
    </div>
  );
};

export default TripList;
