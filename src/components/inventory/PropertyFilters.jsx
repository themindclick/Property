import { Search, SlidersHorizontal } from 'lucide-react';
import { useRef, useState } from 'react';
import useDismiss from '../../hooks/useDismiss.js';

const types = [
  { value: 'all', label: 'All' },
  { value: 'land', label: 'Land' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
];

export const MAX_PRICE_OPTIONS = [
  { value: 'any', label: 'Any price' },
  { value: '15', label: 'Up to LKR 15M' },
  { value: '30', label: 'Up to LKR 30M' },
  { value: '50', label: 'Up to LKR 50M' },
  { value: '100', label: 'Up to LKR 100M' },
];

export const MIN_BEDS_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: '2', label: '2+ bedrooms' },
  { value: '3', label: '3+ bedrooms' },
  { value: '4', label: '4+ bedrooms' },
  { value: '5', label: '5+ bedrooms' },
];

const selectCls =
  'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none';

export default function PropertyFilters({ query, onQuery, type, onType, more, onMore }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useDismiss(open, ref, () => setOpen(false));

  const activeCount = Object.values(more).filter((v) => v !== 'any').length;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-card lg:flex-row lg:items-center">
      <label className="relative flex-1">
        <span className="sr-only">Search properties</span>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search by property, location or ID..."
          className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
        />
      </label>

      <div className="flex gap-1 overflow-x-auto rounded-lg bg-slate-50 p-1" role="group" aria-label="Property type">
        {types.map((t) => (
          <button
            key={t.value}
            type="button"
            aria-pressed={type === t.value}
            onClick={() => onType(t.value)}
            className={`h-9 shrink-0 rounded-md px-4 text-xs font-semibold transition-colors ${
              type === t.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="dialog"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 lg:w-auto"
        >
          <SlidersHorizontal className="h-4 w-4" />
          More filters
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[11px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>

        {open && (
          <div
            role="dialog"
            aria-label="More filters"
            className="absolute right-0 top-full z-20 mt-2 w-72 space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
          >
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Max price</span>
              <select
                className={selectCls}
                value={more.maxPrice}
                onChange={(e) => onMore({ ...more, maxPrice: e.target.value })}
              >
                {MAX_PRICE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Bedrooms</span>
              <select
                className={selectCls}
                value={more.minBeds}
                onChange={(e) => onMore({ ...more, minBeds: e.target.value })}
              >
                {MIN_BEDS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <span className="mt-1 block text-[11px] text-slate-400">Land listings are hidden when this is set.</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onMore({ maxPrice: 'any', minBeds: 'any' })}
                className="h-9 flex-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 flex-1 rounded-lg bg-emerald-500 text-xs font-semibold text-white hover:bg-emerald-600"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
