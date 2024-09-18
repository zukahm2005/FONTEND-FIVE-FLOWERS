import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./chatHistory.scss";

export default function ChatHistory({ chatId }) {
  const [history, setHistory] = useState([]); // Lưu lịch sử chat
  const [loading, setLoading] = useState(false); // Trạng thái loading khi đang fetch data
  const [error, setError] = useState(null); // Lưu thông báo lỗi (nếu có)

  // Hàm fetch lịch sử chat dựa vào chatId và userId
  useEffect(() => {
    const fetchChatHistory = async () => {
      const token = localStorage.getItem("token");   // Lấy token từ localStorage
  
      // Kiểm tra nếu token thiếu
      if (!token) {
        setError("token bị thiếu.");
        console.error("token is missing");
        return;
      }
  
      setLoading(true); // Bắt đầu loading khi fetch dữ liệu
  
      try {
        // Gửi request lấy dữ liệu lịch sử chat từ server
        const response = await axios.get(
          `http://localhost:8080/api/v1/bot/history/chat/${chatId}`, // API để lấy lịch sử theo chatId
          {
            headers: {
              Authorization: `Bearer ${token}`,  // Thêm token vào headers
            },
          }
        );
        
        console.log("Response data:", response.data); // In ra dữ liệu trả về từ API
        setHistory([response.data]); // Lưu lịch sử chat vào state
      } catch (error) {
        setError("Lỗi khi lấy dữ liệu từ server.");
        console.error("Error fetching chat history:", error);
      } finally {
        setLoading(false); // Dừng loading sau khi fetch xong
      }
    };
  
    // Chỉ fetch khi có chatId
    if (chatId) {
      fetchChatHistory();
    }
  }, [chatId]); // Theo dõi chatId, fetch lại dữ liệu nếu chatId thay đổi
  
  // Xử lý khi không có lịch sử hoặc đang loading
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

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
