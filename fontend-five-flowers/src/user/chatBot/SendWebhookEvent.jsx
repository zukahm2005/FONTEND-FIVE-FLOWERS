import axios from "axios";
import React, { useState } from "react";

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
      },
    ];

    setMessages(updatedMessages);

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
        // Giới hạn số lượng tin nhắn gửi đi (chỉ gửi 5 tin nhắn gần nhất)
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
        { role: "bot", content: botResponse },
      ]);
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }

    setInput("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Chatbot</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "400px",
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ width: "60%", padding: "10px", marginRight: "10px" }}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginRight: "10px" }}
          placeholder="file"
        />
        <button
          onClick={() => sendMessage("load_json")}
          style={{ padding: "10px 20px" }}
        >
          Load JSON
        </button>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ marginRight: "10px" }}
          placeholder="image"
        />{" "}
        <button
          onClick={() => sendMessage("learn_image")}
          style={{ padding: "10px 20px", marginRight: "5px" }}
        >
          Learn Image
        </button>
        <button
          onClick={() => sendMessage("ask")}
          style={{ padding: "10px 20px", marginRight: "5px" }}
        >
          Ask
        </button>
        <button
          onClick={() => sendMessage("learn")}
          style={{ padding: "10px 20px", marginRight: "5px" }}
        >
          Learn Text
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
