import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../sendWebhookEvent.scss"; // Sử dụng cùng file style

export default function ChatHistory() {
  const [history, setHistory] = useState([]);

  // Fetch lịch sử chat từ server
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/bot/history"
        );
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="chat-container">
      <div className="header-chatbox-container">
        <h2 className="chat-history-title">Lịch sử Chatbot</h2>
      </div>
      <div className="chat-box">
        {history.map((message, index) => (
          <div key={index} className="chat-message bot">
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
                {message.botResponse}
              </ReactMarkdown>
            </div>
            <div className="message-time">{new Date(message.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
