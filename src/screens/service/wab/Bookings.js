import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { globalStyles } from '../../../config/theme';

export default function BookingListScreen({
  bookings,
  bookingSearchQuery,
  setBookingSearchQuery,
  onOpenWalkInModal,
  onCheckInBooking,
}) {
  const filteredBookings = bookings.filter(b => {
    const q = bookingSearchQuery.toLowerCase().trim();
    if (!q) return true;
    const plateMatch = (b.policeRegNo || b.licensePlate || '').toLowerCase().includes(q);
    const modelMatch = (b.groupCode || b.vehicleModel || '').toLowerCase().includes(q);
    const custMatch = (b.customerName || '').toLowerCase().includes(q);
    const idMatch = (b.bookingNo || b.sdmsBookingId || '').toLowerCase().includes(q);
    return plateMatch || modelMatch || custMatch || idMatch;
  });

  return (
    <View style={globalStyles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={globalStyles.cardTitle}>List Booking</Text>
        <TouchableOpacity style={[globalStyles.actionBtn, { marginTop: 0, paddingHorizontal: 12 }]} onPress={onOpenWalkInModal}>
          <Text style={globalStyles.actionBtnText}>+ Walk-In</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[globalStyles.input, { marginBottom: 14 }]}
        placeholder="Cari Booking ID, Customer, atau Plat..."
        value={bookingSearchQuery}
        onChangeText={setBookingSearchQuery}
      />

      {filteredBookings.length === 0 ? (
        <Text style={{ color: '#94a3b8', textAlign: 'center', padding: 20 }}>Tidak ada data booking yang cocok.</Text>
      ) : (
        filteredBookings.map((b, idx) => (
          <View key={b.bookingNo || b.sdmsBookingId || idx} style={globalStyles.itemBox}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text style={globalStyles.queueBadge}>{b.bookingNo || b.sdmsBookingId}</Text>
              <Text style={globalStyles.plateText}>{b.policeRegNo || b.licensePlate}</Text>
            </View>

            <Text style={globalStyles.customerText}>{b.customerName}</Text>
            <Text style={globalStyles.subDetailText}>{b.groupCode || b.vehicleModel} &bull; Jam: {b.reservasiTime || b.bookingTime || '09:30'}</Text>

            <TouchableOpacity style={globalStyles.actionBtn} onPress={() => onCheckInBooking(b)}>
              <Text style={globalStyles.actionBtnText}>+ Check-In</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
}
