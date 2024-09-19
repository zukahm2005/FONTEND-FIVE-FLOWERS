import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa"; // Icon Phone
import { IoMdMail } from "react-icons/io";   // Icon Email
import './replyMail.scss';

const ReplyMail = () => {
  const { id } = useParams(); // Lấy contactId từ URL
  const [contact, setContact] = useState(null); // Dữ liệu contact theo ID
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy dữ liệu contact từ API theo ID
    const fetchContactById = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/contact/${id}`);
        setContact(response.data); // Lưu dữ liệu contact cụ thể
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contact data:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchContactById(); // Chỉ gọi API khi có contactId
    }
  }, [id]);

  const handleSendMail = async () => {
    if (!contact || !message.trim()) return;

    try {
      // Gọi API để gửi phản hồi
      const response = await axios.post("http://localhost:8080/api/v1/reply/send", null, {
        params: {
          contactId: id,  // Sử dụng contactId từ URL
          message: message  // Nội dung tin nhắn phản hồi
        }
      });

      console.log("Response from server:", response.data);
      alert("Message sent successfully!");
      setMessage(""); // Xóa tin nhắn sau khi gửi
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Hiển thị khi đang load dữ liệu
  }

  if (!contact) {
    return <div>No contact data available</div>; // Hiển thị nếu không có dữ liệu contact
  }

  return (
    <div className="reply-mail-container">
      <div className="contact-info">
        <div className="reply-contact">
          <h2>Reply to Contact</h2>
        </div>
        <div className="content-reply-user">
          <p>
          <strong>Name:</strong> {contact?.name}
          </p>
          <p>
            <IoMdMail className="icon-style" /> {/* Icon email */}
            <strong>:</strong> {contact?.email}
          </p>
          <p>
            <FaPhoneAlt className="icon-style" /> {/* Icon phone */}
            <strong>:</strong> {contact?.phone}
          </p>
        </div>

        <div className="message-input-container">
          <textarea
            className="message-input"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={handleSendMail}
            className="send-button"
            disabled={!message.trim()} // Disable nút nếu không có tin nhắn
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyMail;
