import Constants from 'expo-constants';
import { Platform } from 'react-native';

function resolveHostIp() {
  try {
    const hostUri =
      Constants.expoConfig?.hostUri ||
      Constants.manifest?.debuggerHost ||
      Constants.manifest2?.extra?.expoGo?.developer?.tool ||
      '';

    if (hostUri) {
      const ip = hostUri.split(':')[0];
      if (ip && ip !== 'localhost' && ip !== '127.0.0.1') return ip;
    }
  } catch (_) {}

  if (
    typeof window !== 'undefined' &&
    window.location?.hostname &&
    window.location.hostname !== 'localhost'
  ) {
    return window.location.hostname;
  }

  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
}

export const HOST_IP   = resolveHostIp();
export const API_BASE  = `http://${HOST_IP}:5000/api`;
export const ASSET_BASE = `http://${HOST_IP}:5000`;

export async function fetchTickets() {
  try {
    const res = await fetch(`${API_BASE}/tickets`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return [];
  }
}

export async function checkInVehicle(data) {
  try {
    const payload = {
      sdmsBookingId: data.sdmsBookingId || null,
      licensePlate: (data.licensePlate || '').toUpperCase().trim(),
      vehicleModel: data.vehicleModel || 'Suzuki XL7',
      serviceType: data.serviceType || 'Periodic Service',
      arrivalPurpose: data.arrivalPurpose || 'Service',
      categoryPassComm: data.categoryPassComm || 'Passenger'
    };
    const res = await fetch(`${API_BASE}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    const isService = (data.arrivalPurpose || 'Service') === 'Service';
    const isBooking = Boolean(data.sdmsBookingId);
    let qNum = null;
    if (isService) {
      if (isBooking) {
        qNum = data.sdmsBookingId.startsWith('B-') ? data.sdmsBookingId : `B-${data.sdmsBookingId}`;
      } else {
        qNum = `W-${Math.floor(100 + Math.random() * 900)}`;
      }
    }
    return {
      ticketId: `t-${Date.now()}`,
      ticketNo: `TICK-${Date.now().toString().slice(-6)}`,
      queueNumber: qNum,
      arrivalPurpose: data.arrivalPurpose || 'Service',
      sdmsBookingId: data.sdmsBookingId || null,
      licensePlate: (data.licensePlate || 'B 1234 ABC').toUpperCase(),
      customerName: data.customerName || '-',
      customerPhone: '-',
      vehicleModel: data.vehicleModel || 'Suzuki XL7',
      serviceType: data.serviceType || 'Periodic Service',
      status: 'CheckedIn',
      checkInTime: new Date().toISOString(),
    };
  }
}

export async function submitWabForm(data) {
  try {
    const res = await fetch(`${API_BASE}/tickets/wab`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return { ticketId: data.ticketId, status: 'Inspected' };
  }
}

export async function updateWorkshopStatus(data) {
  try {
    const res = await fetch(`${API_BASE}/workshop/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return { ticketId: data.ticketId, status: data.status };
  }
}
