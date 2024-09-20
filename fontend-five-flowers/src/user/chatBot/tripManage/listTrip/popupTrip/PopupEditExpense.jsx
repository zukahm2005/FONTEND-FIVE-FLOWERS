import { Form, Input, Modal } from "antd";
import React, { useEffect } from "react";

const PopupEditExpense = ({ visible, onCancel, onOk, form, editingRecord }) => {
  // When editingRecord has a value, set form fields with the current data
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
      title="Edit Expense"
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Amount ($)" name="amount">
          <Input />
        </Form.Item>
        <Form.Item label="Category" name="category">
          <Input />
        </Form.Item>
        <Form.Item label="Note" name="note">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PopupEditExpense;
