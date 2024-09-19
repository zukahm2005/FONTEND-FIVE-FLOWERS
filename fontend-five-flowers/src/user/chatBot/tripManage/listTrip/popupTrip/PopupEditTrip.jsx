import { DatePicker, Form, Input, Modal } from "antd";
import moment from "moment";
import React from "react";

const PopupEditTrip = ({ visible, onCancel, onOk, form, editingRecord }) => {
  // Đảm bảo các trường ngày hiển thị đúng
  React.useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue({
        ...editingRecord,
        startDate: editingRecord.startDate
          ? moment(editingRecord.startDate)
          : null,
        endDate: editingRecord.endDate ? moment(editingRecord.endDate) : null,
      });
    }
  }, [editingRecord, form]);

  return (
    <Modal
      title="Chỉnh sửa chuyến đi"
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
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
        <Form.Item label="Khoảng Cách" name="distance">
  <Input />
</Form.Item>
        <Form.Item label="Tổng Chi Phí" name="totalBudget">
          <Input />
        </Form.Item>

        <Form.Item label="Ngày Bắt Đầu" name="startDate">
  <DatePicker
    format="YYYY-MM-DD"
    value={form.getFieldValue("startDate") ? moment.utc(form.getFieldValue("startDate")) : null}
    onChange={(date) => form.setFieldsValue({ startDate: date })}
  />
</Form.Item>

<Form.Item label="Ngày Kết Thúc" name="endDate">
  <DatePicker
    format="YYYY-MM-DD"
    value={form.getFieldValue("endDate") ? moment.utc(form.getFieldValue("endDate")) : null}
    onChange={(date) => form.setFieldsValue({ endDate: date })}
  />
</Form.Item>


      </Form>
    </Modal>
  );
};

export default PopupEditTrip;
