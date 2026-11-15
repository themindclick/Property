import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { initialProperties } from '../data/properties.js';

const PropertiesContext = createContext(null);

export function PropertiesProvider({ children }) {
  const [properties, setProperties] = useState(initialProperties);
  const counter = useRef(
    Math.max(...initialProperties.map((p) => Number(p.id.replace('PS-', '')))),
  );

  const addProperty = useCallback((data) => {
    counter.current += 1;
    const property = { ...data, id: `PS-${counter.current}`, aiMatch: null, createdAt: Date.now() };
    setProperties((prev) => [property, ...prev]);
    return property;
  }, []);

  const updateProperty = useCallback((id, data) => {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  }, []);

  const deleteProperty = useCallback((id) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const value = useMemo(
    () => ({ properties, addProperty, updateProperty, deleteProperty }),
    [properties, addProperty, updateProperty, deleteProperty],
  );

  return <PropertiesContext.Provider value={value}>{children}</PropertiesContext.Provider>;
}

export function useProperties() {
  const ctx = useContext(PropertiesContext);
  if (!ctx) throw new Error('useProperties must be used inside <PropertiesProvider>');
  return ctx;
}
