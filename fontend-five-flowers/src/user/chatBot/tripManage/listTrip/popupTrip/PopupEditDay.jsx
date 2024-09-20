import { Button, DatePicker, Form, message, Modal } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect } from "react";

const PopupEditDay = ({ visible, onCancel, onOk, editingRecord, token }) => {
  const [form] = Form.useForm();

  // Đảm bảo các trường dữ liệu ban đầu hiển thị chính xác, tương tự như trong PopupEditTrip
  useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue({
        ...editingRecord,
        date: editingRecord.date ? moment(editingRecord.date) : null,
      });
    }
  }, [editingRecord]);

  const handleSaveEdit = async () => {
    try {
      const updatedValues = form.getFieldsValue();
      
      // Định dạng lại ngày trước khi gửi lên server, tương tự cách trong PopupEditTrip
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
      onOk(); // Đóng modal và cập nhật lại danh sách ngày
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật ngày");
      console.error("Error updating day:", error);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa ngày lịch trình"
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
          label="Ngày Lịch Trình"
          name="date"
          rules={[{ required: true, message: "Vui lòng chọn ngày lịch trình!" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PopupEditDay;
