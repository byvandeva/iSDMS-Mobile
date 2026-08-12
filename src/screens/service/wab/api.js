import httpClient from '../../../config/services/httpClient';

export function normalizeSdmsBooking(raw) {
  if (!raw) return null;
  return {
    companyCode: raw.CompanyCode || raw.companyCode || '',
    branchCode: raw.BranchCode || raw.branchCode || '',
    sdmsBookingId: raw.BookingNo || raw.bookingNo || raw.sdmsBookingId || '',
    bookingNo: raw.BookingNo || raw.bookingNo || raw.sdmsBookingId || '',
    reservasiDate: raw.ReservasiDate || raw.reservasiDate || '',
    reservasiTime: raw.ReservasiTime || raw.reservasiTime || raw.bookingTime || '',
    bookingTime: raw.ReservasiTime || raw.reservasiTime || raw.bookingTime || '',
    stallCode: raw.StallCode || raw.stallCode || '',
    bookingSource: raw.BookingSource || raw.bookingSource || 'SDMS',
    customerName: raw.CustomerName || raw.customerName || '',
    customerPhone: raw.TelponNo || raw.telponNo || raw.customerPhone || '',
    telponNo: raw.TelponNo || raw.telponNo || raw.customerPhone || '',
    licensePlate: (raw.PoliceRegNo || raw.policeRegNo || raw.licensePlate || '').toUpperCase(),
    policeRegNo: (raw.PoliceRegNo || raw.policeRegNo || raw.licensePlate || '').toUpperCase(),
    vehicleModel: raw.GroupCode || raw.groupCode || raw.vehicleModel || '',
    groupCode: raw.GroupCode || raw.groupCode || raw.vehicleModel || '',
    odometer: raw.Odometer || raw.odometer || 0,
    serviceType: raw.JobType || raw.jobType || raw.serviceType || 'Periodic Service',
    jobType: raw.JobType || raw.jobType || raw.serviceType || 'Periodic Service',
    jobTime: raw.JobTime || raw.jobTime || null,
    additionalTime: raw.AdditionalTime ?? raw.additionalTime ?? 0,
    finishJobTime: raw.FinishJobTime || raw.finishJobTime || null,
    finishTime: raw.FinishTime || raw.finishTime || null,
    serviceRequest: raw.ServiceRequest || raw.serviceRequest || '1',
    remark: raw.Remark || raw.remark || null,
    serviceAdvisor: raw.ServiceAdvisor || raw.serviceAdvisor || '',
    foremanId: raw.ForemanID || raw.foremanId || null,
    mechanicId: raw.MechanicID || raw.mechanicId || null,
    createdBy: raw.CreatedBy || raw.createdBy || '',
    createdDate: raw.CreatedDate || raw.createdDate || '',
    updatedBy: raw.UpdatedBy || raw.updatedBy || '',
    updatedDate: raw.UpdatedDate || raw.updatedDate || '',
    arrivalPurpose: raw.arrivalPurpose || 'Service',
    isPriorityBooking: true,
  };
}

export async function fetchMobileBookings() {
  try {
    const res = await httpClient.get('/services/wab/bookings');
    const rawList = res.data || res || [];
    return Array.isArray(rawList) ? rawList.map(normalizeSdmsBooking) : [];
  } catch (err) {
    return [
      normalizeSdmsBooking({
        CompanyCode: "6006406",
        BranchCode: "6006401",
        BookingNo: "BO401/25/002479",
        ReservasiDate: "2026-02-26 00:00:00.000",
        ReservasiTime: "09:30",
        StallCode: "STALL-01",
        BookingSource: "NEW",
        CustomerName: "ANANTYA NALA PRABATA",
        TelponNo: "08118207657",
        PoliceRegNo: "B1697TYK",
        GroupCode: "SWIFT (CBU)",
        Odometer: "2222222",
        JobType: "PAKET 10.000 KM",
        ServiceAdvisor: "58970"
      }),
      normalizeSdmsBooking({
        CompanyCode: "6006406",
        BranchCode: "6006401",
        BookingNo: "BO401/25/002480",
        ReservasiDate: "2026-02-26 00:00:00.000",
        ReservasiTime: "10:30",
        StallCode: "STALL-02",
        BookingSource: "SDMS",
        CustomerName: "Siti Rahma",
        TelponNo: "089876543210",
        PoliceRegNo: "B5678XYZ",
        GroupCode: "SUZUKI ALL NEW ERTIGA HYBRID",
        Odometer: "15000",
        JobType: "GENERAL REPAIR",
        ServiceAdvisor: "58970"
      })
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
