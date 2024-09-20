import { Button, DatePicker, Form, message, Modal } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect } from "react";

const PopupEditDay = ({ visible, onCancel, onOk, editingRecord, token }) => {
  const [form] = Form.useForm();

  // Ensure that the initial form fields display correctly, similar to PopupEditTrip
  useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue({
        ...editingRecord,
        date: editingRecord.date ? moment(editingRecord.date).subtract(1, 'months') : null,
      });
    }
  }, [editingRecord]);

  const handleSaveEdit = async () => {
    try {
      const updatedValues = form.getFieldsValue();
      
      // Format the date correctly before sending it to the server, similar to how it's done in PopupEditTrip
      if (updatedValues.date) {
        updatedValues.date = updatedValues.date.format("YYYY-MM-DD");
      }

      // Send updated data to the server
      await axios.put(
        `http://localhost:8080/api/v1/days/update/${editingRecord.id}`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Date updated successfully");
      onOk(); // Close the modal and refresh the day list
    } catch (error) {
      message.error("An error occurred while updating the date");
      console.error("Error updating day:", error);
    }
  };

  return (
    <Modal
      title="Edit Itinerary Day"
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
          label="Itinerary Date"
          name="date"
          rules={[{ required: true, message: "Please select a date for the itinerary!" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PopupEditDay;
