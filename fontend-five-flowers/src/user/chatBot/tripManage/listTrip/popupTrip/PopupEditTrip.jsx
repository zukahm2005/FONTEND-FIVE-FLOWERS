import { Modal, Form, Input, DatePicker, Button, message } from "antd";
import { useEffect } from "react";
import axios from "axios";
import moment from "moment";

const PopupEditTrip = ({ visible, onCancel, onOk, editingRecord, token }) => {
  const [form] = Form.useForm();

  // Đảm bảo các trường dữ liệu ban đầu hiển thị chính xác
  useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue({
        ...editingRecord,
        startDate: editingRecord.startDate ? moment(editingRecord.startDate) : null,
        endDate: editingRecord.endDate ? moment(editingRecord.endDate) : null,
      });
    }
  }, [editingRecord]);

  const handleSaveEdit = async () => {
    try {
      const updatedValues = form.getFieldsValue();

      // Định dạng lại ngày trước khi gửi lên server
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
      onOk(); // Đóng modal và cập nhật lại danh sách chuyến đi
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật chuyến đi");
      console.error("Error updating trip:", error);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa chuyến đi"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSaveEdit}>
          Lưu thay đổi
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên Chuyến Đi"
          name="tripName"
          rules={[{ required: true, message: "Vui lòng nhập tên chuyến đi!" }]}
        >
          <Input placeholder="Nhập tên chuyến đi" />
        </Form.Item>

        <Form.Item
          label="Điểm Bắt Đầu"
          name="startLocation"
          rules={[{ required: true, message: "Vui lòng nhập điểm bắt đầu!" }]}
        >
          <Input placeholder="Nhập điểm bắt đầu" />
        </Form.Item>

        <Form.Item
          label="Điểm Kết Thúc"
          name="endLocation"
          rules={[{ required: true, message: "Vui lòng nhập điểm kết thúc!" }]}
        >
          <Input placeholder="Nhập điểm kết thúc" />
        </Form.Item>

        <Form.Item
          label="Khoảng Cách"
          name="distance"
          rules={[{ required: true, message: "Vui lòng nhập khoảng cách!" }]}
        >
          <Input placeholder="Nhập khoảng cách" />
        </Form.Item>

        <Form.Item
          label="Tổng Chi Phí"
          name="totalBudget"
          rules={[{ required: true, message: "Vui lòng nhập tổng chi phí!" }]}
        >
          <Input placeholder="Nhập tổng chi phí" />
        </Form.Item>

        <Form.Item
          label="Ngày Bắt Đầu"
          name="startDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Ngày Kết Thúc"
          name="endDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PopupEditTrip;
