// Mock inventory. Replace with API calls (GET/POST /properties) later.

export const PROPERTY_TYPES = [
  { value: 'land', label: 'Land' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
];

export const typeLabel = (type) => PROPERTY_TYPES.find((t) => t.value === type)?.label ?? type;

// Price is stored in LKR millions (28.5 => "LKR 28.5M").
export const formatPrice = (priceM) => (priceM ? `LKR ${Number(priceM)}M` : 'LKR —');

// Listings that exist on the server but are not part of this mock list.
export const OTHER_LISTINGS = 44;

export const initialProperties = [
  { id: 'PS-1041', title: 'Lakeview Residences', location: 'Rajagiriya', type: 'apartment', priceM: 28.5, beds: 3, baths: 2, areaSqft: 1420, perches: null, aiMatch: 94, image: null, description: '', createdAt: 4 },
  { id: 'PS-1042', title: 'Green Lane Villa', location: 'Nugegoda', type: 'house', priceM: 36, beds: 4, baths: 3, areaSqft: 2850, perches: null, aiMatch: 91, image: null, description: '', createdAt: 3 },
  { id: 'PS-1043', title: 'Horizon Plot', location: 'Kottawa', type: 'land', priceM: 12.8, beds: null, baths: null, areaSqft: null, perches: 12.5, aiMatch: 88, image: null, description: '', createdAt: 2 },
  { id: 'PS-1044', title: 'Cinnamon Garden Home', location: 'Colombo 07', type: 'house', priceM: 85, beds: 5, baths: 4, areaSqft: 4100, perches: null, aiMatch: 82, image: null, description: '', createdAt: 1 },
];
