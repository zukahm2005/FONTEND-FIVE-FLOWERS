import { Form, Modal, TimePicker } from "antd";
import moment from "moment";
import React from "react";

const PopupEditHour = ({ visible, onCancel, onOk, form, editingRecord }) => {
  // Check and set the time value when editingRecord changes
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
      title="Edit Hour"
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Select Time" name="time">
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
