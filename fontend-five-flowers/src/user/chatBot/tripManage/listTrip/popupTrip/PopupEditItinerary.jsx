import { Form, Input, Modal } from "antd";
import React from "react";

const PopupEditItinerary = ({ visible, onCancel, onOk, form, editingItinerary }) => {
  React.useEffect(() => {
    if (editingItinerary) {
      form.setFieldsValue({
        description: editingItinerary.description, // Đặt giá trị description cho form
      });
    }
  }, [editingItinerary, form]);

  return (
    <Modal
      title="Chỉnh sửa Mô tả Lịch trình"
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mô tả Lịch trình"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả lịch trình" }]}
        >
          <Input placeholder="Nhập mô tả lịch trình" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PopupEditItinerary;
