import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import { motion } from "framer-motion"; // Import Framer Motion
import React, { useEffect, useState } from "react";
import { FaClipboardList } from "react-icons/fa";
import { IoIosCloseCircleOutline, IoMdSend } from "react-icons/io";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TripList from "./tripManage/listTrip/TripList";
import "./tripPlanner.scss";

const TripPlanner = ({ userId }) => {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [extraRequest, setExtraRequest] = useState("");
  const [messages, setMessages] = useState(() => {
    const savedMessages = sessionStorage.getItem("chatMessages");
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            role: "bot",
            content:
              "Hello! How can I help you with your travel itinerary using bicycles today?",
            time: new Date().toLocaleTimeString(),
          },
        ];
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentStartLocation, setCurrentStartLocation] = useState("");
  const [currentEndLocation, setCurrentEndLocation] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State quản lý sidebar

  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    const combinedMessage = `Start: ${startLocation}, End: ${endLocation}. Request: ${extraRequest}`;
    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: combinedMessage,
        time: new Date().toLocaleTimeString(),
      },
    ];
    setMessages(updatedMessages);
    setCurrentStartLocation(startLocation);
    setCurrentEndLocation(endLocation);
    setStartLocation("");
    setEndLocation("");
    setExtraRequest("");

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

  const saveSpecificMessage = async (messageContent) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/bot/save",
        {
          botResponse: messageContent,
          startLocation: currentStartLocation,
          endLocation: currentEndLocation,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setConversationId(response.data.conversationId);
      setSnackbarMessage("Response has been saved!");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Error saving message!");
      setSnackbarOpen(true);
      console.error("Error saving message:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Đóng/mở sidebar
  };

  return (
    <div className="chat-container">
      <h2 style={{ textAlign: "center", padding: "10px" }}>
        Advice on the schedule of traveling by bike
      </h2>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            <div className="message-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => (
                    <p
                      style={{
                        margin: "0.5em 0",
                        fontSize: "16px",
                        color: "#343a40",
                      }}
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
            <div
              className="message-time"
              style={msg.role === "user" ? { color: "#6c757d" } : {}}
            >
              {msg.time}
            </div>
            {msg.role === "bot" && (
              <p
                className="save-button"
                onClick={() => saveSpecificMessage(msg.content)}
              >
                Save
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <div className="locations-start-end">
          <div className="locations-start">
            <p>From:</p>
            <input
              type="text"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              placeholder="Start location"
              className="chat-input start-end-input"
            />
          </div>
          <div className="locations-end">
            <input
              type="text"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              placeholder="End location"
              className="chat-input start-end-input"
            />
          </div>
        </div>
        <div className="request-chat-bot">
          <input
            type="text"
            value={extraRequest}
            onChange={(e) => setExtraRequest(e.target.value)}
            placeholder="Additional request (e.g., calculate cost)"
            className="chat-input extra-request-input"
          />
          <div className="button-group">
            <div className="send-button" onClick={sendMessage}>
              <p>
                <IoMdSend />
              </p>
            </div>
            <div className="save-info-button" onClick={toggleSidebar}>
              <p>
                <FaClipboardList />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar trượt từ phải */}
      <motion.div
        initial={{ x: "100%" }} // Sidebar bắt đầu ngoài màn hình
        animate={{ x: isSidebarOpen ? "0%" : "100%" }} // Trượt vào khi mở
        transition={{ type: "spring", stiffness: 300, damping: 30 }} // Hiệu ứng mượt mà
        className="sidebar"
      > <div className="button-close-sidebar-trip">
         <p onClick={toggleSidebar}>
          <IoIosCloseCircleOutline />
          
        </p>
      </div>
       
        <TripList/>
      </motion.div>

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
