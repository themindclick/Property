import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createSeedVisits } from '../data/visits.js';

const VisitsContext = createContext(null);

export function VisitsProvider({ children }) {
  const [visits, setVisits] = useState(createSeedVisits);

  const addVisit = useCallback((data) => {
    const visit = { ...data, id: `v${Date.now()}` };
    setVisits((prev) => [...prev, visit]);
    return visit;
  }, []);

  const updateVisit = useCallback((id, patch) => {
    setVisits((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  }, []);

  const removeVisit = useCallback((id) => {
    setVisits((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const value = useMemo(
    () => ({ visits, addVisit, updateVisit, removeVisit }),
    [visits, addVisit, updateVisit, removeVisit],
  );
  return <VisitsContext.Provider value={value}>{children}</VisitsContext.Provider>;
}

export function useVisits() {
  const ctx = useContext(VisitsContext);
  if (!ctx) throw new Error('useVisits must be used inside <VisitsProvider>');
  return ctx;
}
