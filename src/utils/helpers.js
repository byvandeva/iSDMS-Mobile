/**
 * Converts arrival purpose value (enum or string) into a clean display label.
 */
export function getPurposeString(purpose) {
  if (purpose === null || purpose === undefined || purpose === '') return 'Service';
  let raw = typeof purpose === 'object' ? (purpose.id || purpose.label || purpose.name || '') : purpose;
  let str = String(raw).trim();
  if (str === '0' || str.toLowerCase() === 'service') return 'Service';
  if (str === '1' || str.toLowerCase() === 'sales') return 'Sales';
  if (str === '2' || str.toLowerCase() === 'bodyrepair' || str.toLowerCase() === 'body repair') return 'BodyRepair';
  if (str === '3' || str.toLowerCase() === 'sparepart' || str.toLowerCase() === 'spare part') return 'SparePart';
  return str || 'Service';
}

/**
 * Converts ticket status value (enum or string) into a user-friendly Indonesian status string.
 */
export function getStatusString(status) {
  if (status === null || status === undefined || status === '') return 'Check-In';
  const s = String(status).toLowerCase().trim();
  if (s === '0' || s === 'checkedin') return 'Check-In';
  if (s === 'wabinprogress' || s === 'in progress' || s === 'inprogress') return 'Proses WAB (On Progress)';
  if (s === '1' || s === 'inspected' || s === 'wabdone') return 'Form WAB Selesai';
  if (s === '2' || s === 'assignedtostall') return 'Dikerjakan di Stall';
  if (s === '3' || s === 'inservice') return 'Dikerjakan di Stall';
  if (s === '4' || s === 'pendingadditionalapproval') return 'Menunggu Approval';
  if (s === '5' || s === 'servicecompleted') return 'Servis Selesai';
  if (s === '6' || s === 'prehandoverready') return 'Siap Penyerahan';
  if (s === '7' || s === 'handovercompleted') return 'Selesai Handover';
  if (s === '8' || s === 'checkedout') return 'Check-Out';
  return String(status);
}
