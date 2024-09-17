import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoMdClose, IoMdSend } from "react-icons/io";
import { RiCustomerService2Fill } from "react-icons/ri";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./sendWebhookEvent.scss";

const Chatbot = ({ onClose }) => {
  const [input, setInput] = useState("");
  const [lastBotResponse, setLastBotResponse] = useState(null); // Thêm state để lưu phản hồi cuối cùng của chatbot

  // Lấy các tin nhắn đã lưu trong sessionStorage hoặc khởi tạo với tin nhắn chào
  const [messages, setMessages] = useState(() => {
    const savedMessages = sessionStorage.getItem("chatMessages");
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            role: "bot",
            content: "Hello! How can I help you with cycle today?",
            time: new Date().toLocaleTimeString(),
          },
        ];
  });

  // Lưu các tin nhắn vào sessionStorage mỗi khi có thay đổi
  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Thêm các state cho image và file
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);

  const sendMessage = async (type) => {
    if (type === "ask" && input.trim() === "") return;

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: type === "learn_image" ? "Đang học từ hình ảnh..." : input,
        time: new Date().toLocaleTimeString(),
      },
    ];

    setMessages(updatedMessages);
    setInput("");

    try {
      let response;
      let botResponse;

      if (type === "learn") {
        response = await axios.post(
          "http://localhost:8080/api/v1/bot/learn",
          { text: input },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        botResponse = response.data.message;
      } else if (type === "learn_image") {
        const formData = new FormData();
        formData.append("file", image); // Sử dụng state image
        response = await axios.post(
          "http://localhost:8080/api/v1/bot/learn_image",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        botResponse =
          response.data.message +
          " Văn bản trích xuất: " +
          response.data.extracted_text;
      } else if (type === "load_json" || type === "upload_file") {
        const formData = new FormData();
        formData.append("file", file); // Sử dụng state file

        if (!file) {
          console.error("Chưa chọn file");
          return;
        }

        response = await axios.post(
          "http://localhost:8080/api/v1/bot/upload_file",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        botResponse = response.data.message;
      } else {
        const historyToSend = updatedMessages.slice(-5);
        response = await axios.post(
          "http://localhost:8080/api/v1/bot/ask",
          { history: historyToSend },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        botResponse = response.data.response;
      }

      setMessages([
        ...updatedMessages,
        {
          role: "bot",
          content: botResponse,
          time: new Date().toLocaleTimeString(),
        },
      ]);
      setLastBotResponse(botResponse); // Lưu phản hồi từ chatbot
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage("ask");
    }
  };

  // Hàm để lưu lại phản hồi từ chatbot
  const saveMessage = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/v1/bot/save",
        { botResponse: lastBotResponse },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Phản hồi của chatbot đã được lưu!");
    } catch (error) {
      console.error("Lỗi khi lưu tin nhắn:", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="header-chatbox-container">
        <div className="icon-customer-chat">
          <p>
            <RiCustomerService2Fill />
          </p>
        </div>
        <div className="icon-close-chat">
          <p onClick={onClose}>
            <IoMdClose />
          </p>
        </div>
      </div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            <div className="message-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => (
                    <p style={{ margin: "0.5em 0", color: "#fff" }} {...props} />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1 style={{ fontSize: "1.5em", color: "#fff" }} {...props} />
                  ),
                  img: ({ node, ...props }) => (
                    <img
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "10px",
                        marginTop: "5px",
                      }}
                      {...props}
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      style={{ color: "#007bff", textDecoration: "none" }}
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
            <div className="message-time">{msg.time}</div>
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message and press enter..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage("ask")}
          className="chat-input"
        />
        <button onClick={() => sendMessage("ask")} disabled={!input.trim()} className="send-button">
          <p>
            <IoMdSend />
          </p>
        </button>
      </div>

      {/* Nút lưu lại phản hồi sau khi chatbot trả lời */}
      {lastBotResponse && (
        <div className="save-message-container">
          <button onClick={saveMessage} className="save-button">
            Lưu lại phản hồi
          </button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
