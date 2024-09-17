import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./chatHistory.scss";

export default function ChatHistory({ conversationId }) {
  const [history, setHistory] = useState([]);

  // Fetch lịch sử chat từ server dựa trên conversationId
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/bot/history/${conversationId}`  // Lấy lịch sử theo conversationId
        );
        setHistory(response.data);  // Lưu lịch sử vào state
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    if (conversationId) {
      fetchHistory();
    }
  }, [conversationId]);

  return (
    <div className="chat-container">
      <div className="chat-box">
        {history.length > 0 ? (
          history.map((message, index) => (
            <div key={index} className="chat-message bot1">
              <div className="message-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ node, ...props }) => (
                      <p style={{ margin: "0.5em 0", color: "#343a40" }} {...props} />
                    ),
                    h1: ({ node, ...props }) => (
                      <h1 style={{ fontSize: "1.5em", color: "#6c757d" }} {...props} />
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
              <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        ) : (
          <p>Không có tin nhắn trong cuộc trò chuyện này.</p>
        )}
      </div>
    </div>
  );
}
