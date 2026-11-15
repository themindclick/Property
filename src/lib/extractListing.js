// Very small heuristic parser used by "Quick fill from text".
// The real system should call the backend extraction worker (OCR + LLM) instead.

const AREAS = [
  'Colombo 07', 'Colombo 03', 'Colombo 05', 'Nugegoda', 'Kottawa', 'Rajagiriya', 'Malabe',
  'Battaramulla', 'Maharagama', 'Dehiwala', 'Mount Lavinia', 'Kaduwela', 'Homagama',
  'Piliyandala', 'Kandy', 'Galle', 'Negombo',
];

export function extractFromText(input) {
  const t = input.replace(/(\d),(\d)/g, '$1$2');
  const found = {};

  const price = t.match(/(?:LKR|Rs\.?)\s*([\d.]+)\s*(m\b|mn\b|million)?/i);
  if (price) {
    let n = parseFloat(price[1]);
    if (!price[2] && n >= 100000) n /= 1e6;
    else if (!price[2]) n = NaN;
    if (n > 0) found.priceM = String(Math.round(n * 100) / 100);
  }

  const perches = t.match(/([\d.]+)\s*(?:perch(?:es)?|p\b)/i);
  if (perches) found.perches = perches[1];

  const beds = t.match(/(\d+)\s*(?:bed(?:room)?s?|br\b)/i);
  if (beds) found.beds = beds[1];
  const baths = t.match(/(\d+)\s*bath(?:room)?s?/i);
  if (baths) found.baths = baths[1];
  const sqft = t.match(/([\d.]+)\s*(?:sq\.?\s*ft|sqft|square\s*feet)/i);
  if (sqft) found.areaSqft = sqft[1];

  if (/\b(apartment|flat|condo|condominium)\b/i.test(t)) found.type = 'apartment';
  else if (/\b(house|villa|bungalow|home)\b/i.test(t)) found.type = 'house';
  else if (perches || /\b(land|plot|block)\b/i.test(t)) found.type = 'land';

  const area = AREAS.find((a) => t.toLowerCase().includes(a.toLowerCase()));
  if (area) found.location = area;

  return { found, count: Object.keys(found).length };
}
