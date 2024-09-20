import { Form, Input, Modal } from "antd";
import React, { useEffect } from "react";

const PopupEditExpense = ({ visible, onCancel, onOk, form, editingRecord }) => {
  // Khi editingRecord có giá trị, đặt các trường form với dữ liệu hiện tại
  useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue({
        amount: editingRecord.amount,
        category: editingRecord.category,
        note: editingRecord.note,
      });
    }
  }, [editingRecord, form]);

  return (
    <Modal
      title="Chỉnh sửa chi phí"
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Số tiền ($)" name="amount">
          <Input />
        </Form.Item>
        <Form.Item label="Loại" name="category">
          <Input />
        </Form.Item>
        <Form.Item label="Ghi chú" name="note">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PopupEditExpense;
