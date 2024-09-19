import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

function TripTable({ trips, onEditTrip }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Tên Chuyến Đi</TableCell>
            <TableCell>Điểm Bắt Đầu</TableCell>
            <TableCell>Điểm Kết Thúc</TableCell>
            <TableCell>Tổng Chi Phí</TableCell>
            <TableCell>Khoảng Cách</TableCell>
            <TableCell>Ngày Bắt Đầu</TableCell>
            <TableCell>Ngày Kết Thúc</TableCell>
            <TableCell>Lịch Trình</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trips.map((trip, index) => (
            <TableRow key={trip.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{trip.tripName}</TableCell>
              <TableCell>{trip.startLocation}</TableCell>
              <TableCell>{trip.endLocation}</TableCell>
              <TableCell>{trip.totalBudget}</TableCell>
              <TableCell>{trip.distance}</TableCell>
              <TableCell>{trip.startDate}</TableCell>
              <TableCell>{trip.endDate}</TableCell>
              <TableCell>
                <Button onClick={() => onEditTrip(trip.id)}>Chỉnh Sửa</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TripTable;
