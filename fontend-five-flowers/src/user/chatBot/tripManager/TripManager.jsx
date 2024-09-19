import React, { useState } from 'react';
import TripTable from './TripTable';
import EditDrawer from './EditDrawer';

const tripsData = [
  { id: 1, tripName: 'Du lịch Hà Nội', startLocation: 'Bắc Ninh', endLocation: 'Hà Nội', totalBudget: 10000, distance: '40km', startDate: '19/09/2024', endDate: '21/09/2024' },
  // Các chuyến đi khác...
];

function TripManager() {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleEditTrip = (tripId) => {
    const trip = tripsData.find(t => t.id === tripId);
    setSelectedTrip(trip);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleSaveTrip = (updatedTrip) => {
    console.log('Updated Trip:', updatedTrip);
    // Xử lý lưu vào database hoặc API
  };

  return (
    <div>
      <TripTable trips={tripsData} onEditTrip={handleEditTrip} />
      <EditDrawer
        trip={selectedTrip}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onSave={handleSaveTrip}
      />
    </div>
  );
}

export default TripManager;
