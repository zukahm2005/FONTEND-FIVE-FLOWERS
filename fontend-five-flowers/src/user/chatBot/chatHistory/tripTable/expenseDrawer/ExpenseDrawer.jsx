import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

function ExpenseDrawer({ day }) {
  const [editableHours, setEditableHours] = useState(day.hours || []);

  const handleInputChange = (e, field, index) => {
    const updatedHours = [...editableHours];
    updatedHours[index] = { ...updatedHours[index], [field]: e.target.value };
    setEditableHours(updatedHours);
  };

  return (
    <>
      <h5>Danh Sách Giờ</h5>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Chi Tiết</TableCell>
              <TableCell>Số Tiền</TableCell>
              <TableCell>Danh Mục</TableCell>
              <TableCell>Ghi Chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {editableHours.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="body1" align="center">
                    Chưa có giờ
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              editableHours.map((hour, index) => (
                <TableRow key={hour.id}>
                  <TableCell>
                    <TextField
                      value={hour.description || ''}
                      onChange={(e) => handleInputChange(e, 'description', index)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={hour.expense.amount || ''}
                      onChange={(e) => handleInputChange(e, 'amount', index)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={hour.expense.category || ''}
                      onChange={(e) => handleInputChange(e, 'category', index)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={hour.expense.note || ''}
                      onChange={(e) => handleInputChange(e, 'note', index)}
                      fullWidth
                    />
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

export default ExpenseDrawer;
