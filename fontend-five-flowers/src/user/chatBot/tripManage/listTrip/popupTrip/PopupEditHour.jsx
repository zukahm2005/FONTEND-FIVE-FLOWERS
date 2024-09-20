import React from "react";
import { Modal, Form, TimePicker } from "antd";
import moment from "moment";

const PopupEditHour = ({ visible, onCancel, onOk, form, editingRecord }) => {
  // Kiểm tra và set giá trị time khi editingRecord thay đổi
  React.useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue({
        ...editingRecord,
        time: editingRecord.time && moment(editingRecord.time, "HH:mm").isValid()
          ? moment(editingRecord.time, "HH:mm")
          : null,
      });
    }
  }, [editingRecord, form]);

  return (
    <Modal
      title="Chỉnh sửa Giờ"
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Chọn Giờ" name="time">
          <TimePicker
            format="HH:mm"
            value={
              form.getFieldValue("time") && moment(form.getFieldValue("time"), "HH:mm").isValid()
                ? moment(form.getFieldValue("time"), "HH:mm")
                : null
            }
            onChange={(time) => form.setFieldsValue({ time })}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PopupEditHour;
