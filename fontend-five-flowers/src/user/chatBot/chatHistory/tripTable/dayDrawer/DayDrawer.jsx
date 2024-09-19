import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import ExpenseDrawer from '../expenseDrawer/ExpenseDrawer'; // Bảng chi phí

function DayDrawer({ itinerary }) {
  const [editableDays, setEditableDays] = useState(itinerary.days || []);

  const handleInputChange = (e, field, index) => {
    const updatedDays = [...editableDays];
    updatedDays[index] = { ...updatedDays[index], [field]: e.target.value };
    setEditableDays(updatedDays);
  };

  return (
    <>
      <h4>Danh Sách Ngày</h4>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Giờ</TableCell>
              <TableCell>Chi Tiết</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {editableDays.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography variant="body1" align="center">
                    Chưa có ngày
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              editableDays.map((day, index) => (
                <TableRow key={day.id}>
                  <TableCell>
                    <TextField
                      value={day.time || ''}
                      type="time"
                      onChange={(e) => handleInputChange(e, 'time', index)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <ExpenseDrawer day={day} /> {/* Hiển thị danh sách giờ và chi phí */}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default DayDrawer;
