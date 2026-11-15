import { addDays, startOfWeek, toKey } from '../lib/dates.js';

export const TIME_SLOTS = ['09:00', '10:30', '12:00', '14:00', '16:00'];

export const VISIT_STATUS = {
  confirmed: 'Confirmed',
  pending: 'Awaiting confirmation',
};

// Mock visits, placed relative to the current week so the demo always has data.
// Replace with GET /visits?from=&to= once the API exists.
export function createSeedVisits() {
  const monday = startOfWeek(new Date());
  const on = (offset) => toKey(addDays(monday, offset));
  return [
    { id: 'v1', buyerId: 'c3', buyerName: 'Dinesh Silva', property: 'Malabe House', date: on(0), time: '09:00', status: 'confirmed', urgency: 'cold' },
    { id: 'v2', buyerId: 'c1', buyerName: 'Kasun Perera', property: 'Nugegoda 12P Land', date: on(0), time: '10:30', status: 'confirmed', urgency: 'hot' },
    { id: 'v3', buyerId: 'c2', buyerName: 'Nimali Fernando', property: 'Lakeview Residences', date: on(0), time: '14:00', status: 'confirmed', urgency: 'warm' },
    { id: 'v4', buyerId: 'c5', buyerName: 'Ruwan Weerasinghe', property: 'Kottawa 10P Land', date: on(2), time: '12:00', status: 'pending', urgency: 'hot' },
    { id: 'v5', buyerId: 'c4', buyerName: 'Amaya Jayasinghe', property: 'Colombo 07 Apartment', date: on(4), time: '09:00', status: 'pending', urgency: 'cold' },
  ];
}
