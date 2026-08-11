/**
 * Queue Priority & Interleaving Service for Mobile Tablet App
 */

export function isPriorityBooking(item) {
  if (!item) return false;
  const sdmsId = item.sdmsBookingId || item.SdmsBookingId;
  if (!sdmsId) return false;

  if (item.isPriorityBooking !== undefined) return Boolean(item.isPriorityBooking);
  if (item.IsPriorityBooking !== undefined) return Boolean(item.IsPriorityBooking);

  if (sdmsId === 'B-004' || sdmsId.includes('SAMEDAY')) return false;
  return true;
}

export function getPriorityTier(item) {
  const hasBooking = Boolean(item?.sdmsBookingId || item?.SdmsBookingId);
  if (!hasBooking) return 'walkin';
  const isPriority = isPriorityBooking(item);
  return isPriority ? 'priority-h1' : 'sameday-booking';
}

export function interleavePriorityQueue(tickets) {
  if (!Array.isArray(tickets) || tickets.length === 0) return [];

  const priorityQueue = [];
  const walkInQueue = [];

  tickets.forEach(ticket => {
    if (isPriorityBooking(ticket)) {
      priorityQueue.push({ ...ticket });
    } else {
      walkInQueue.push({ ...ticket });
    }
  });

  const result = [];
  let pIdx = 0;
  let wIdx = 0;

  while (pIdx < priorityQueue.length || wIdx < walkInQueue.length) {
    for (let i = 0; i < 2 && pIdx < priorityQueue.length; i++) {
      result.push(priorityQueue[pIdx++]);
    }
    if (wIdx < walkInQueue.length) {
      result.push(walkInQueue[wIdx++]);
    }
  }

  return result.map((t, idx) => ({
    ...t,
    priorityCallOrder: idx + 1
  }));
}
