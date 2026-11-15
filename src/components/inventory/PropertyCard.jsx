import { Bath, BedDouble, Loader2, MapPin, MoreHorizontal, Scan, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useDismiss from '../../hooks/useDismiss.js';
import { generateCopy } from '../../lib/copywriter.js';
import { formatPrice, typeLabel } from '../../data/properties.js';
import CopyPanel, { CopySkeleton } from './CopyPanel.jsx';
import PropertyImage from './PropertyImage.jsx';

function Spec({ icon: Icon, label, sr }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-slate-500">
      <Icon className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
      <span aria-hidden="true">{label}</span>
      <span className="sr-only">{sr}</span>
    </span>
  );
}

function CardMenu({ property, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useDismiss(open, ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Options for ${property.title}`}
        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-8 z-10 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          <Link
            role="menuitem"
            to={`/inventory/${property.id}/edit`}
            className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Edit property
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              if (window.confirm(`Delete “${property.title}”? This cannot be undone.`)) {
                onDelete(property.id);
              }
            }}
            className="block w-full px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function PropertyCard({ property, highlighted = false, readOnly = false, onDelete }) {
  const [status, setStatus] = useState('idle'); // idle | loading | ready
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState('facebook');
  const [variant, setVariant] = useState(0);
  const [copy, setCopy] = useState(null);
  const timer = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (highlighted) cardRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [highlighted]);

  // Simulates the AI call; swap for POST /ai/copywriter.
  const generate = (nextVariant) => {
    setStatus('loading');
    setOpen(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setCopy(generateCopy(property, nextVariant));
      setVariant(nextVariant);
      setStatus('ready');
    }, 900);
  };

  const onCopywriterClick = () => {
    if (status === 'idle') generate(0);
    else if (status === 'ready') setOpen((o) => !o);
  };

  const isLand = property.type === 'land';
  const buttonLabel =
    status === 'loading' ? 'Generating copy…' : status === 'ready' ? (open ? 'Hide generated copy' : 'Show generated copy') : 'AI Copywriter';

  return (
    <article
      ref={cardRef}
      className={`flex flex-col overflow-hidden rounded-xl border bg-white shadow-card transition-shadow ${
        highlighted ? 'border-emerald-400 ring-2 ring-emerald-300' : 'border-slate-200'
      }`}
    >
      <div className="relative h-[150px] shrink-0">
        <PropertyImage property={property} />
        <span className="absolute left-3 top-3 rounded bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-800 shadow-sm">
          {typeLabel(property.type)}
        </span>
        <span className="absolute right-3 top-3 rounded bg-emerald-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
          {property.aiMatch ? `${property.aiMatch}% AI match` : 'New'}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-bold leading-snug text-slate-900">{property.title}</h3>
          {!readOnly && <CardMenu property={property} onDelete={onDelete} />}
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
          <MapPin className="h-3 w-3" aria-hidden="true" /> {property.location}
        </p>

        <p className="mt-3 border-b border-slate-100 pb-4 text-[17px] font-bold text-slate-900">
          {formatPrice(property.priceM)}
        </p>

        <div className="flex items-center gap-4 py-3.5">
          {isLand ? (
            <Spec icon={Scan} label={`${property.perches || '—'} perch`} sr={`${property.perches} perches`} />
          ) : (
            <>
              <Spec icon={BedDouble} label={property.beds ?? '—'} sr={`${property.beds} bedrooms`} />
              <Spec icon={Bath} label={property.baths ?? '—'} sr={`${property.baths} bathrooms`} />
              <Spec
                icon={Scan}
                label={`${Number(property.areaSqft || 0).toLocaleString('en-US')} sq ft`}
                sr={`${property.areaSqft} square feet`}
              />
            </>
          )}
        </div>

        {!readOnly && (
          <>
            <button
              type="button"
              onClick={onCopywriterClick}
              disabled={status === 'loading'}
              aria-expanded={status === 'ready' ? open : undefined}
              className={`flex h-10 w-full items-center justify-center gap-2 rounded-lg text-xs font-semibold text-white transition-colors disabled:cursor-wait ${
                status === 'ready' && open ? 'bg-slate-600 hover:bg-slate-700' : 'bg-sidebar hover:bg-sidebar-active'
              }`}
            >
              {status === 'loading' ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {buttonLabel}
            </button>

            {open && status === 'loading' && <CopySkeleton />}
            {open && status === 'ready' && (
              <CopyPanel
                copy={copy}
                format={format}
                onFormatChange={setFormat}
                onRegenerate={() => generate((variant + 1) % 2)}
              />
            )}
          </>
        )}
      </div>
    </article>
  );
}
