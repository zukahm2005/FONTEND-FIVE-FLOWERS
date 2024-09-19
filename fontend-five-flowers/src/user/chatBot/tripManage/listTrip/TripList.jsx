import { EllipsisOutlined } from "@ant-design/icons";
import { Dropdown, Form, Input, Menu, message, Modal, Table } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import "./tripList.scss"; // Import file SCSS để tùy chỉnh thanh cuộn

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null); // Dùng để lưu thông tin của record đang chỉnh sửa
  const [form] = Form.useForm();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

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
      await axios.put(
        `http://localhost:8080/api/v1/trips/update/${editingRecord.id}`, // Thay đổi thành URL chính xác của bạn
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
  const editTrip = async (record) => {
    setEditingRecord(record);
    setEditModalVisible(true);
    form.setFieldsValue(record); // Đặt giá trị form với dữ liệu trip
  };

  const editItinerary = async (record) => {
    setEditingRecord(record);
    setEditModalVisible(true);
    form.setFieldsValue(record); // Đặt giá trị form với dữ liệu itinerary
  };

  const editDay = async (record) => {
    setEditingRecord(record);
    setEditModalVisible(true);
    form.setFieldsValue(record); // Đặt giá trị form với dữ liệu day
  };

  const editHour = async (record) => {
    setEditingRecord(record);
    setEditModalVisible(true);
    form.setFieldsValue(record); // Đặt giá trị form với dữ liệu hour
  };

  const editExpense = async (record) => {
    setEditingRecord(record);
    setEditModalVisible(true);
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
        data: [id],  // Gửi mảng ID
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
          else if (type === "itinerary") editItinerary(record);
          else if (type === "day") editDay(record);
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
            render: (amount) => `${(amount / 24000).toFixed(2)} $`,
          },
          { title: "Loại", dataIndex: "category", key: "category" },
          { title: "Ghi chú", dataIndex: "note", key: "note" },
          {
            title: "",
            key: "action",
            render: (_, record) => (
              <Dropdown overlay={renderActionMenu(record, "expense")} trigger={["click"]}>
                <div>
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
          <Dropdown overlay={renderActionMenu(itinerary, "itinerary")} trigger={["click"]}>
            <div>
              <EllipsisOutlined rotate={90} />
            </div>
          </Dropdown>
        </div>
        {itinerary.days.map((day, dIndex) => (
          <div key={dIndex}>
            <p>{`Ngày ${dIndex + 1}: ${moment(day.date).format("DD/MM/YYYY")}`}</p>
            <Dropdown overlay={renderActionMenu(day, "day")} trigger={["click"]}>
              <div>
                <EllipsisOutlined rotate={90} />
              </div>
            </Dropdown>
            <div className="scroll-container">
              {day.hours.map((hour, hIndex) => (
                <div key={hIndex}>
                  <p>{`Giờ: ${moment(hour.time, "H:mm").format("HH:mm")}`}</p>
                  <Dropdown overlay={renderActionMenu(hour, "hour")} trigger={["click"]}>
                    <div>
                      <EllipsisOutlined rotate={90} />
                    </div>
                  </Dropdown>
                  {renderExpenseTable(hour.expenses)}
                </div>
              ))}
            </div>
          </div>
        ))}
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
      title: "Tổng Chi Phí ($)",
      dataIndex: "totalBudget",
      key: "totalBudget",
      render: (budget) => `${(budget / 24000).toFixed(2)} $`,
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Dropdown overlay={renderActionMenu(record, "trip")} trigger={["click"]}>
          <div>
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
          expandedRowRender: (record) => renderItineraryDetails(record.itineraries),
        }}
        style={{ maxWidth: "1000px", margin: "0 auto" }}
      />

      {/* Modal chỉnh sửa Trip */}
      <Modal
        title="Chỉnh sửa chuyến đi"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSaveEdit}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên Chuyến Đi" name="tripName">
            <Input />
          </Form.Item>
          <Form.Item label="Điểm Bắt Đầu" name="startLocation">
            <Input />
          </Form.Item>
          <Form.Item label="Điểm Kết Thúc" name="endLocation">
            <Input />
          </Form.Item>
          <Form.Item label="Tổng Chi Phí" name="totalBudget">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TripList;
