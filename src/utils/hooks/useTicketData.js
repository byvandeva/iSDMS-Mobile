import { useState, useEffect, useCallback } from 'react';
import { fetchTickets } from '../services/api';

/**
 * Hook that polls for ticket data every 10 seconds.
 * Exposes tickets, loading state, and a manual refresh.
 */
export function useTicketData(pollingIntervalMs = 10000) {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchTickets();
      setTickets(data);
    } catch (err) {
      console.warn('useTicketData: failed to fetch tickets', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, pollingIntervalMs);
    return () => clearInterval(interval);
  }, [load, pollingIntervalMs]);

  const applyUpdate = useCallback((updatedTicket) => {
    const id = updatedTicket.ticketId || updatedTicket.TicketId;
    setTickets(prev => {
      const index = prev.findIndex(t => (t.ticketId || t.TicketId) === id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = updatedTicket;
        return updated;
      }
      return [updatedTicket, ...prev];
    });
  }, []);

  return { tickets, setTickets, isLoading, refresh: load, applyUpdate };
}
