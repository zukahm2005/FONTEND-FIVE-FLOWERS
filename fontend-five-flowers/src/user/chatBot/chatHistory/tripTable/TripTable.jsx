import { Box, Button, Drawer, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import React, { useState } from 'react';
import ItineraryDrawer from './itineraryDrawer/ItineraryDrawer'; // Bảng lịch trình sẽ mở sau khi nhấn vào

function TripTable({ trips = [], onEditTrip }) {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenDrawer = (trip) => {
    setSelectedTrip(trip);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: '90%', margin: '0 auto', padding: 2 }}>
        <Table size="small" sx={{ '& .MuiTableCell-root': { padding: '8px 8px' } }}> {/* Giảm padding */}
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
            {trips.length === 0 ? (
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>
                  <TextField placeholder="Nhập tên chuyến đi" size="small" margin="dense" fullWidth sx={{ minWidth: '150px' }} />
                </TableCell>
                <TableCell>
                  <TextField placeholder="Nhập điểm bắt đầu" size="small" margin="dense" fullWidth sx={{ minWidth: '150px' }} />
                </TableCell>
                <TableCell>
                  <TextField placeholder="Nhập điểm kết thúc" size="small" margin="dense" fullWidth sx={{ minWidth: '150px' }} />
                </TableCell>
                <TableCell>
                  <TextField placeholder="Nhập tổng chi phí" size="small" margin="dense" fullWidth sx={{ minWidth: '100px' }} />
                </TableCell>
                <TableCell>
                  <TextField placeholder="Nhập khoảng cách" size="small" margin="dense" fullWidth sx={{ minWidth: '100px' }} />
                </TableCell>
                <TableCell>
                  <TextField type="date" size="small" margin="dense" fullWidth sx={{ minWidth: '120px' }} />
                </TableCell>
                <TableCell>
                  <TextField type="date" size="small" margin="dense" fullWidth sx={{ minWidth: '120px' }} />
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleOpenDrawer({})} sx={{ padding: '6px 12px' }}>
                    Thêm Lịch Trình
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              trips.map((trip, index) => (
                <TableRow key={trip.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <TextField defaultValue={trip.tripName || ''} size="small" margin="dense" fullWidth sx={{ minWidth: '150px' }} />
                  </TableCell>
                  <TableCell>
                    <TextField defaultValue={trip.startLocation || ''} size="small" margin="dense" fullWidth sx={{ minWidth: '150px' }} />
                  </TableCell>
                  <TableCell>
                    <TextField defaultValue={trip.endLocation || ''} size="small" margin="dense" fullWidth sx={{ minWidth: '150px' }} />
                  </TableCell>
                  <TableCell>
                    <TextField defaultValue={trip.totalBudget || ''} size="small" margin="dense" fullWidth sx={{ minWidth: '100px' }} />
                  </TableCell>
                  <TableCell>
                    <TextField defaultValue={trip.distance || ''} size="small" margin="dense" fullWidth sx={{ minWidth: '100px' }} />
                  </TableCell>
                  <TableCell>
                    <TextField type="date" defaultValue={trip.startDate || ''} size="small" margin="dense" fullWidth sx={{ minWidth: '120px' }} />
                  </TableCell>
                  <TableCell>
                    <TextField type="date" defaultValue={trip.endDate || ''} size="small" margin="dense" fullWidth sx={{ minWidth: '120px' }} />
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleOpenDrawer(trip)} sx={{ padding: '6px 12px' }}>
                      Xem Lịch Trình
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Drawer cho lịch trình */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
        <Box p={2} width={300}>
          <ItineraryDrawer trip={selectedTrip} onClose={handleCloseDrawer} />
        </Box>
      </Drawer>
    </>
  );
}

export default TripTable;
