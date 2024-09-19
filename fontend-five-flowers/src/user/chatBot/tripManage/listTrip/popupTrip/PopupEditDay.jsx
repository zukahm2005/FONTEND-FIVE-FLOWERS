import React from "react";
import { Modal, Form, DatePicker } from "antd";
import moment from "moment";

const PopupEditDay = ({ visible, onCancel, onOk, form, editingRecord }) => {
  React.useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue({
        ...editingRecord,
        // Sử dụng kiểm tra tương tự như PopupEditTrip, không cần isValid()
        date: editingRecord.date ? moment(editingRecord.date) : null,
      });
    }
  }, [editingRecord, form]);

  const handleDateChange = (date) => {
    form.setFieldsValue({ date });
  };

  return (
    <Modal
      title="Chỉnh sửa Ngày"
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="date"
          label="Chọn Ngày"
          rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            value={form.getFieldValue("date") ? moment(form.getFieldValue("date")) : null}
            onChange={handleDateChange}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PopupEditDay;
