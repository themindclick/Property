import { Check, Plus, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropertyCard from '../components/inventory/PropertyCard.jsx';
import PropertyFilters from '../components/inventory/PropertyFilters.jsx';
import { useProperties } from '../context/PropertiesContext.jsx';
import { OTHER_LISTINGS } from '../data/properties.js';

const sorters = {
  recent: (a, b) => b.createdAt - a.createdAt,
  priceAsc: (a, b) => a.priceM - b.priceM,
  priceDesc: (a, b) => b.priceM - a.priceM,
  match: (a, b) => (b.aiMatch ?? -1) - (a.aiMatch ?? -1),
};

export default function InventoryPage() {
  const { properties, deleteProperty } = useProperties();
  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [more, setMore] = useState({ maxPrice: 'any', minBeds: 'any' });
  const [sort, setSort] = useState('recent');

  // Flash message + highlight handed over by the add/edit form after saving.
  const [flash, setFlash] = useState(location.state?.flash ?? null);
  const [highlightId, setHighlightId] = useState(location.state?.highlightId ?? null);

  useEffect(() => {
    // Clear router state so a refresh does not replay the message.
    if (location.state?.flash) navigate('/inventory', { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!flash) return undefined;
    const t = setTimeout(() => {
      setFlash(null);
      setHighlightId(null);
    }, 6000);
    return () => clearTimeout(t);
  }, [flash]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return properties
      .filter((p) => {
        if (type !== 'all' && p.type !== type) return false;
        if (more.maxPrice !== 'any' && p.priceM > Number(more.maxPrice)) return false;
        if (more.minBeds !== 'any' && (p.type === 'land' || p.beds < Number(more.minBeds))) return false;
        if (!q) return true;
        return [p.title, p.location, p.id].some((v) => v.toLowerCase().includes(q));
      })
      .sort(sorters[sort]);
  }, [properties, query, type, more, sort]);

  const filtersActive = query || type !== 'all' || more.maxPrice !== 'any' || more.minBeds !== 'any';
  const resetFilters = () => {
    setQuery('');
    setType('all');
    setMore({ maxPrice: 'any', minBeds: 'any' });
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-7 sm:px-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-600">
            Property matching engine
          </p>
          <h2 className="mt-1.5 text-[28px] font-bold leading-tight tracking-tight text-slate-900">
            Your active inventory
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage {OTHER_LISTINGS + properties.length} listings and generate multilingual campaign copy with AI.
          </p>
        </div>
        <Link
          to="/inventory/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
        >
          <Plus className="h-4 w-4" /> Add property
        </Link>
      </div>

      {flash && (
        <div
          role="status"
          className="mt-5 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <Check className="h-4 w-4 shrink-0" />
          <span className="flex-1">{flash}</span>
          <button
            type="button"
            onClick={() => {
              setFlash(null);
              setHighlightId(null);
            }}
            className="rounded p-1 hover:bg-emerald-100"
            aria-label="Dismiss message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mt-6">
        <PropertyFilters
          query={query}
          onQuery={setQuery}
          type={type}
          onType={setType}
          more={more}
          onMore={setMore}
        />
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
        <p aria-live="polite">
          <span className="font-bold text-slate-800">{visible.length}</span> properties shown
        </p>
        <label className="flex items-center gap-1.5 font-medium">
          Sort:
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="cursor-pointer rounded bg-transparent py-1 font-semibold text-slate-800 hover:bg-slate-100"
          >
            <option value="recent">Recently added</option>
            <option value="priceAsc">Price: low to high</option>
            <option value="priceDesc">Price: high to low</option>
            <option value="match">Best AI match</option>
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <p className="text-base font-bold text-slate-900">
            {properties.length === 0 ? 'No properties yet' : 'No properties match your filters'}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {properties.length === 0
              ? 'Add your first listing to start matching buyers.'
              : 'Try a different search or clear the filters.'}
          </p>
          {filtersActive ? (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Clear filters
            </button>
          ) : (
            <Link
              to="/inventory/new"
              className="mt-5 inline-flex h-10 items-center rounded-lg bg-emerald-500 px-4 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              Add property
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-5">
          {visible.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              highlighted={p.id === highlightId}
              onDelete={deleteProperty}
            />
          ))}
        </div>
      )}
    </div>
  );
}
