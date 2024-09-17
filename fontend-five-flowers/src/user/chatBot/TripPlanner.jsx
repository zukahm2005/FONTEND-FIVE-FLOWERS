import { Alert, Snackbar } from "@mui/material"; // Import Snackbar và Alert từ Material UI
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./tripPlanner.scss";

const TripPlanner = ({ onClose }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    const savedMessages = sessionStorage.getItem("chatMessages");
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            role: "bot",
            content: "Hello! How can I help you with your travel itinerary using bicycles today?",
            time: new Date().toLocaleTimeString(),
          },
        ];
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false); // State cho snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Thông báo trong snackbar

  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (type) => {
    if (type === "ask" && input.trim() === "") return;

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: input,
        time: new Date().toLocaleTimeString(),
      },
    ];

    setMessages(updatedMessages);
    setInput("");

    try {
      const historyToSend = updatedMessages.slice(-5);
      const response = await axios.post(
        "http://localhost:8080/api/v1/bot/ask",
        { history: historyToSend },
        { headers: { "Content-Type": "application/json" } }
      );
      const botResponse = response.data.response;

      setMessages([
        ...updatedMessages,
        {
          role: "bot",
          content: botResponse,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage("ask");
    }
  };

  const saveSpecificMessage = async (messageContent) => {
    try {
      await axios.post(
        "http://localhost:8080/api/v1/bot/save",
        { botResponse: messageContent },
        { headers: { "Content-Type": "application/json" } }
      );
      setSnackbarMessage("Response has been saved!"); // Thông báo lưu thành công
      setSnackbarOpen(true); // Mở snackbar
    } catch (error) {
      setSnackbarMessage("Error saving message!"); // Thông báo lỗi
      setSnackbarOpen(true); // Mở snackbar
      console.error("Error saving message:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Đóng snackbar
  };

  return (
    <div className="chat-container">
      <h2 style={{ textAlign: "center", padding: "10px" }}>Advice on the schedule of traveling by bike</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            <div className="message-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => (
                    <p
                      style={{ margin: "0.5em 0", fontSize: "16px", color: "#343a40" }}
                      {...props}
                    />
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
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
            <div className="message-time" style={msg.role === "user" ? { color: "#6c757d" } : {}}>
              {msg.time}
            </div>
            {msg.role === "bot" && (
              <p className="save-button" onClick={() => saveSpecificMessage(msg.content)}>
                Save
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message and press enter..."
          onKeyPress={handleKeyPress}
          className="chat-input"
        />
        <button
          onClick={() => sendMessage("ask")}
          disabled={!input.trim()}
          className="send-button"
        >
          <IoMdSend />
        </button>
      </div>

      {/* Snackbar hiển thị thông báo */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TripPlanner;
