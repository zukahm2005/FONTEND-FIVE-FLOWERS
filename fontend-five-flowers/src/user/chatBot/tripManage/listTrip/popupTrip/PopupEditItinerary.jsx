import { Form, Input, Modal } from "antd";
import React from "react";

const PopupEditItinerary = ({ visible, onCancel, onOk, form, editingItinerary }) => {
  React.useEffect(() => {
    if (editingItinerary) {
      form.setFieldsValue({
        description: editingItinerary.description, // Set the value of description for the form
      });
    }
  }, [editingItinerary, form]);

  return (
    <Modal
      title="Edit Itinerary Description"
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Itinerary Description"
          name="description"
          rules={[{ required: true, message: "Please enter the itinerary description" }]}
        >
          <Input placeholder="Enter itinerary description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PopupEditItinerary;
