import { Modal, Form, Input, DatePicker, Button, message } from "antd";
import { useEffect } from "react";
import axios from "axios";
import moment from "moment";

const PopupEditTrip = ({ visible, onCancel, onOk, editingRecord, token }) => {
  const [form] = Form.useForm();

  // Ensure the initial form fields display the correct data
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

      // Reformat the dates before sending to the server
      if (updatedValues.startDate) {
        updatedValues.startDate = updatedValues.startDate.format("YYYY-MM-DD");
      }
      if (updatedValues.endDate) {
        updatedValues.endDate = updatedValues.endDate.format("YYYY-MM-DD");
      }

      // Send the updated data to the server
      await axios.put(
        `http://localhost:8080/api/v1/trips/update/${editingRecord.id}`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Update successful");
      onOk(); // Close the modal and refresh the trip list
    } catch (error) {
      message.error("An error occurred while updating the trip");
      console.error("Error updating trip:", error);
    }
  };

  return (
    <Modal
      title="Edit Trip"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSaveEdit}>
          Save Changes
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Trip Name"
          name="tripName"
          rules={[{ required: true, message: "Please enter the trip name!" }]}
        >
          <Input placeholder="Enter trip name" />
        </Form.Item>

        <Form.Item
          label="Start Location"
          name="startLocation"
          rules={[{ required: true, message: "Please enter the start location!" }]}
        >
          <Input placeholder="Enter start location" />
        </Form.Item>

        <Form.Item
          label="End Location"
          name="endLocation"
          rules={[{ required: true, message: "Please enter the end location!" }]}
        >
          <Input placeholder="Enter end location" />
        </Form.Item>

        <Form.Item
          label="Distance"
          name="distance"
          rules={[{ required: true, message: "Please enter the distance!" }]}
        >
          <Input placeholder="Enter distance" />
        </Form.Item>

        <Form.Item
          label="Total Budget"
          name="totalBudget"
          rules={[{ required: true, message: "Please enter the total budget!" }]}
        >
          <Input placeholder="Enter total budget" />
        </Form.Item>

        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: "Please select the start date!" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true, message: "Please select the end date!" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PopupEditTrip;
