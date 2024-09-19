import React, { useState } from 'react';
import { Drawer, Button, TextField, Typography } from '@mui/material';

function EditDrawer({ trip, open, onClose, onSave }) {
  const [formState, setFormState] = useState(trip);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    onSave(formState);
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div style={{ width: 300, padding: 20 }}>
        <Typography variant="h6">Chỉnh Sửa Thông Tin</Typography>
        <TextField
          label="Tên Chuyến Đi"
          name="tripName"
          value={formState.tripName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Điểm Bắt Đầu"
          name="startLocation"
          value={formState.startLocation}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Tổng Chi Phí"
          name="totalBudget"
          value={formState.totalBudget}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button onClick={handleSave} variant="contained" color="primary">
          Lưu
        </Button>
      </div>
    </Drawer>
  );
}

export default EditDrawer;
