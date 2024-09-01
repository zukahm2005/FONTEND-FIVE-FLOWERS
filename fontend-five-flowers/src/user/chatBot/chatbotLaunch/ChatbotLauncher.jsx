import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import Chatbot from "../SendWebhookEvent"; // Đảm bảo đường dẫn đúng tới component Chatbot

const ChatbotLauncher = () => {
  const [open, setOpen] = useState(false);
  const [renderChatbot, setRenderChatbot] = useState(false);

  const handleToggle = () => {
    if (open) {
      // Đợi thời gian animation trước khi ẩn Chatbot
      setTimeout(() => setRenderChatbot(false), 300); // 300ms khớp với thời gian của animation trong CSS
    } else {
      setRenderChatbot(true);
    }
    setOpen(!open);
  };

  return (
    <div style={{ position: "fixed", bottom: "80px", right: "30px", color: "white" }}>
      {/* Icon để mở cửa sổ chatbot */}
      <IconButton
        color="inherit"
        aria-label="open chatbot"
        onClick={handleToggle}
        style={{ marginBottom: "10px" }}
      >
        <IoChatbubbleEllipsesOutline fontSize="27px" />
      </IconButton>

      {/* Cửa sổ Chatbot với hiệu ứng mở và đóng */}
      <Box
        className={`chatbox-container ${open ? "open" : "close"}`} // Thêm class dựa trên trạng thái
      >
        {renderChatbot && <Chatbot onClose={handleToggle} />}
      </Box>
    </div>
  );
};

export default ChatbotLauncher;
