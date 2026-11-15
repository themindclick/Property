// Local-time date helpers (no timezone surprises: visits are stored as "YYYY-MM-DD" keys).

const pad = (n) => String(n).padStart(2, '0');

export const startOfWeek = (d) => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); // Monday
  return x;
};

export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fromKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const month = (d, style) => d.toLocaleDateString('en-US', { month: style });

export function formatRange(start) {
  const end = addDays(start, 6);
  if (start.getMonth() === end.getMonth()) {
    return `${month(start, 'long')} ${start.getDate()}–${end.getDate()}, ${end.getFullYear()}`;
  }
  if (start.getFullYear() === end.getFullYear()) {
    return `${month(start, 'short')} ${start.getDate()} – ${month(end, 'short')} ${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${month(start, 'short')} ${start.getDate()}, ${start.getFullYear()} – ${month(end, 'short')} ${end.getDate()}, ${end.getFullYear()}`;
}

export const dayHeader = (d) => `${d.toLocaleDateString('en-US', { weekday: 'short' })} ${d.getDate()}`;

export const longDay = (d) =>
  d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
