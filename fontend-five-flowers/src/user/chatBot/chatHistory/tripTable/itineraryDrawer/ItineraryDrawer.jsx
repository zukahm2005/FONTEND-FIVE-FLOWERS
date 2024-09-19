import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import DayDrawer from '../dayDrawer/DayDrawer'; // Bảng ngày

function ItineraryDrawer({ trip }) {
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [drawerPosition, setDrawerPosition] = useState({ top: 0, left: 0 });

  const handleOpenDrawer = (itinerary, event) => {
    const buttonRect = event.target.getBoundingClientRect();
    setDrawerPosition({ top: buttonRect.top, left: buttonRect.left });
    setSelectedItinerary(itinerary);
    setShowDetails(true);
  };

  const handleCloseDrawer = () => {
    setShowDetails(false);
  };

  return (
    <>
      <h3>Lịch Trình cho {trip?.tripName || 'Chuyến đi mới'}</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ngày</TableCell>
              <TableCell>Chi Tiết</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trip?.itineraries?.length > 0 ? (
              trip.itineraries.map((itinerary) => (
                <TableRow key={itinerary.id}>
                  <TableCell>{itinerary.date || 'Không có ngày'}</TableCell>
                  <TableCell>
                    <Button onClick={(e) => handleOpenDrawer(itinerary, e)}>Xem Ngày</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>
                  <p>Chưa có lịch trình</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, top: drawerPosition.top, left: drawerPosition.left }}
          animate={{ opacity: 1, scale: 1, top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.3)',
          }}
        >
          <DayDrawer itinerary={selectedItinerary} onClose={handleCloseDrawer} />
          <Button onClick={handleCloseDrawer}>Đóng</Button>
        </motion.div>
      )}
    </>
  );
}

export default ItineraryDrawer;
