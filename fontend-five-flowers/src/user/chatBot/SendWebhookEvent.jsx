import axios from "axios";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Import gfm để có các tính năng markdown mở rộng
import "./sendWebhookEvent.scss"; // Import file CSS

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
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
    setInput(""); // Trống ô input ngay sau khi gửi tin nhắn

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
        formData.append("file", image);
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
        formData.append("file", file);

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
        const historyToSend = updatedMessages.slice(-5); // Giới hạn số lượng tin nhắn gửi đi (chỉ gửi 5 tin nhắn gần nhất)
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
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage("ask");
    }
  };

  return (
    <div className="chat-container">
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
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          className="chat-input"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="send-button"
        >
          Send
        </button>
        <button onClick={() => sendMessage("learn")} className="learn-button">
          Learn Text
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
