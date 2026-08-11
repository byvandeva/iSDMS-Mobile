import httpClient from '../../../config/services/httpClient';

export async function fetchMobileBookings() {
  try {
    const res = await httpClient.get('/services/wab/bookings');
    return res.data;
  } catch (err) {
    return [
      { sdmsBookingId: 'B-001', customerName: 'Budi Santoso', arrivalPurpose: 'Service', licensePlate: 'B 1234 ABC', bookingTime: '09:00', categoryPassComm: 'Passenger', vehicleModel: 'Suzuki XL7 Alpha' },
      { sdmsBookingId: 'B-002', customerName: 'Siti Rahma', arrivalPurpose: 'Service', licensePlate: 'B 5678 XYZ', bookingTime: '10:30', categoryPassComm: 'Passenger', vehicleModel: 'Suzuki All New Ertiga' },
      { sdmsBookingId: 'B-003', customerName: 'PT Trans Jaya', arrivalPurpose: 'Service', licensePlate: 'B 9999 SZK', bookingTime: '11:00', categoryPassComm: 'Commercial', vehicleModel: 'Suzuki Carry Pick Up' }
    ];
  }
}

export async function fetchMobileTickets() {
  try {
    const res = await httpClient.get('/services/wab/tickets');
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function submitMobileCheckIn(data) {
  const res = await httpClient.post('/services/wab/check-in', data);
  return res.data;
}

export async function submitMobileWabForm(data) {
  const res = await httpClient.post('/services/wab/form', data);
  return res.data;
}
