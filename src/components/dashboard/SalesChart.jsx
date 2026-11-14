import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { salesActivity } from '../../data/mock.js';

const ranges = [
  { value: 'thisWeek', label: 'This week' },
  { value: 'lastWeek', label: 'Last week' },
];

export default function SalesChart() {
  const [range, setRange] = useState('thisWeek');
  const data = salesActivity[range];

  // Leave a little headroom so the tallest bar does not touch the top.
  const max = useMemo(() => Math.max(...data.map((d) => d.total)) * 1.08, [data]);

  return (
    <section className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Sales activity</h2>
          <p className="mt-1 text-[13px] text-slate-400">Lead interactions over the last 7 days</p>
        </div>

        <label className="relative">
          <span className="sr-only">Time range</span>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="cursor-pointer appearance-none rounded-lg bg-transparent py-1 pl-2 pr-6 text-[13px] font-semibold text-slate-900 hover:bg-slate-50"
          >
            {ranges.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
        </label>
      </div>

      <div
        className="mt-8 flex h-[250px] items-end border-b border-slate-200"
        role="img"
        aria-label={`Daily lead interactions, ${ranges.find((r) => r.value === range).label.toLowerCase()}. Darker bars show hot or booked leads.`}
      >
        {data.map(({ day, total, qualified }) => (
          <div
            key={day}
            className="flex h-full flex-1 items-end justify-center"
            title={`${day}: ${total} interactions, ${qualified} hot or booked`}
          >
            <div
              className="relative flex w-[46px] items-end overflow-hidden rounded-t-md bg-emerald-100 transition-[height] duration-500"
              style={{ height: `${(total / max) * 100}%` }}
            >
              <div
                className="w-full rounded-t-md bg-emerald-500 transition-[height] duration-500"
                style={{ height: `${(qualified / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex" aria-hidden="true">
        {data.map(({ day }) => (
          <span key={day} className="flex-1 text-center text-xs text-slate-400">
            {day}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-5 text-xs text-slate-500">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-100" /> All interactions
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Hot or booked
        </span>
      </div>
    </section>
  );
}
