import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ChatHistory from "../chatHistory/ChatHistory"; // Import ChatHistory component
import TripPlanner from "../TripPlanner";

export default function ChatWindow() {
  const [open, setOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState(null); // Save selected conversation ID
  const [chatList, setChatList] = useState([]); // Store the list of conversations
  const [editingId, setEditingId] = useState(null); // Save the ID of the conversation being edited
  const [newName, setNewName] = useState(""); // Save the new name of the schedule
  const [menuAnchor, setMenuAnchor] = useState(null); // Used to open the Menu
  const [selectedChatId, setSelectedChatId] = useState(null); // Store selected chat ID when opening the menu

  // Fetch conversation list from the server
  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/bot/history"
        ); // API to fetch conversation list
        setChatList(response.data); // Save the list into state
      } catch (error) {
        console.error("Error fetching conversation list:", error);
      }
    };

    fetchChatList();
  }, []);

  // Get the conversation name based on selected ID
  const getConversationName = (id) => {
    const conversation = chatList.find((chat) => chat.id === id);
    return conversation
      ? conversation.name || `Schedule ${chatList.indexOf(conversation) + 1}`
      : "";
  };

  // Open the popup and set the selected conversation
  const handleClickOpen = (conversationId) => {
    if (!editingId) {
      setSelectedConversationId(conversationId); // Update the selected conversation
      setOpen(true); // Open the popup
    }
  };

  // Close the popup
  const handleClose = () => {
    setOpen(false);
  };

  // Enable edit mode for a name
  const handleEditClick = (id, currentName, e) => {
    e.stopPropagation(); // Prevent the popup from opening when clicking on the menu
    setEditingId(id); // Set the ID of the conversation being edited
    setNewName(currentName); // Set the current name in the input field for editing
    setMenuAnchor(null); // Close the menu
  };

  // Save the new name
  const handleSaveName = async (id) => {
    try {
      // Send API request to update the new name
      await axios.put(`http://localhost:8080/api/v1/bot/updateName/${id}`, {
        name: newName,
      });

      // Update the list with the new name
      setChatList((prevChatList) =>
        prevChatList.map((chat) =>
          chat.id === id ? { ...chat, name: newName } : chat
        )
      );

      // End edit mode
      setEditingId(null);
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  // Delete a schedule
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/bot/delete/${id}`);
      setChatList((prevChatList) =>
        prevChatList.filter((chat) => chat.id !== id)
      );
      setMenuAnchor(null); // Close the menu
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  // Open the menu
  const handleMenuClick = (event, chatId) => {
    event.stopPropagation(); // Prevent overlapping with other events
    setMenuAnchor(event.currentTarget);
    setSelectedChatId(chatId);
  };

  // Close the menu
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <div className="chat-window-container">
      <Grid container style={{ height: "50rem" }}>
        {/* Sidebar */}
        <Grid item xs={2}>
          <Box
            sx={{
              height: "50rem",
              bgcolor: "#f5f5f5",
              padding: 2,
              paddingTop: "7rem",
              boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)", // Add right side shadow
            }}
          >
            <div className="title-chat-window-container">
              <p
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Schedule History
              </p>
            </div>
            <List>
              {chatList.map((chat, index) => (
                <ListItem
                  button
                  key={chat.id}
                  onClick={() => handleClickOpen(chat.id)}
                  sx={{
                    transition: "background-color 0.3s, transform 0.3s",
                    borderRadius: "10px",
                    cursor: "pointer", // Add pointer cursor for ListItem
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                      transform: "scale(1.01)",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  {editingId === chat.id ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <TextField
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        size="small"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveName(chat.id)} // Save when clicking the button
                        style={{
                          marginLeft: "10px",
                          padding: "5px 10px",
                          backgroundColor: "orange",
                          border: "none",
                          cursor: "pointer",
                          color: "white",
                          borderRadius: "5px",
                        }}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <ListItemText
                        primary={chat.name || `Schedule ${index + 1}`}
                        sx={{ cursor: "pointer" }} // Add pointer cursor to the schedule name
                      />
                      <p
                        style={{
                          cursor: "pointer",
                          color: "orange",
                          marginLeft: "10px",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onClick={(e) => handleMenuClick(e, chat.id)} // Open the menu on click
                      >
                        ⋮
                      </p>
                    </>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>

        {/* Main Content */}
        <Grid item xs={10}>
          <Box
            sx={{
              height: "100%",
              padding: 2,
              paddingTop: "7rem",
              bgcolor: "#ffffff",
            }}
          >
            <TripPlanner />
          </Box>
        </Grid>

        {/* Edit and Delete Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={(e) =>
              handleEditClick(
                selectedChatId,
                getConversationName(selectedChatId),
                e
              )
            }
          >
            Edit
          </MenuItem>
          <MenuItem onClick={() => handleDelete(selectedChatId)}>
            Delete
          </MenuItem>
        </Menu>

        {/* Dialog Popup for Chat History */}
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
          <DialogTitle style={{ color: "white", backgroundColor: "#333" }}>
            {getConversationName(selectedConversationId)}
          </DialogTitle>
          <DialogContent style={{ overflowY: "auto", maxHeight: "70vh" }}>
            <ChatHistory conversationId={selectedConversationId} />
          </DialogContent>
        </Dialog>
      </Grid>
    </div>
  );
}
