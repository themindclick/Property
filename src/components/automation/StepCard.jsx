import { CalendarDays, Clock, Home, MessageCircle, Minus, Plus, Sparkles, Trash2, TrendingUp } from 'lucide-react';
import { useRef, useState } from 'react';
import useDismiss from '../../hooks/useDismiss.js';
import Switch from '../ui/Switch.jsx';

export const kindStyles = {
  whatsapp: { icon: MessageCircle, cls: 'bg-blue-50 text-blue-600' },
  ai: { icon: Sparkles, cls: 'bg-emerald-50 text-emerald-600' },
  listings: { icon: Home, cls: 'bg-violet-50 text-violet-600' },
  visit: { icon: CalendarDays, cls: 'bg-amber-50 text-amber-600' },
};

export function WaitPill({ days, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useDismiss(open, ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 hover:border-emerald-300 hover:text-slate-700"
      >
        <Clock className="h-3 w-3" aria-hidden="true" />
        Wait {days} {days === 1 ? 'day' : 'days'}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Change wait time"
          className="absolute left-1/2 top-full z-10 mt-2 w-52 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 shadow-lg"
        >
          <p className="text-[11px] font-semibold text-slate-500">Wait before this step</p>
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onChange(Math.max(1, days - 1))}
              disabled={days <= 1}
              aria-label="Decrease wait by one day"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="text-sm font-bold text-slate-900" aria-live="polite">
              {days} {days === 1 ? 'day' : 'days'}
            </span>
            <button
              type="button"
              onClick={() => onChange(Math.min(30, days + 1))}
              disabled={days >= 30}
              aria-label="Increase wait by one day"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StepCard({ step, day, onToggle, onRemove }) {
  const { icon: Icon, cls } = kindStyles[step.kind];

  return (
    <article
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-card transition-opacity ${
        step.enabled ? '' : 'opacity-60'
      }`}
    >
      <div className="flex items-start gap-4">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${cls}`}>
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Day {day}
            {step.trigger && (
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-500">Trigger</span>
            )}
          </p>
          <h3 className="mt-1 text-[15px] font-bold text-slate-900">{step.title}</h3>
          <p className="mt-1 text-xs text-slate-500">{step.description}</p>
          <p className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <TrendingUp className="h-3 w-3" aria-hidden="true" /> {step.stat}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!step.trigger && (
            <button
              type="button"
              onClick={onRemove}
              className="rounded-md p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500"
              aria-label={`Remove step ${step.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <Switch checked={step.enabled} onChange={onToggle} label={`Enable ${step.title}`} />
        </div>
      </div>
    </article>
  );
}
