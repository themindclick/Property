import { Sparkles } from 'lucide-react';
import { last30Days } from '../../data/automation.js';

const card = 'rounded-xl border border-slate-200 bg-white p-5 shadow-card';

export function OptimizationCard({ applied, onToggle }) {
  return (
    <section className="rounded-xl bg-sidebar p-5 text-white shadow-card">
      <h3 className="flex items-center gap-2 text-sm font-bold">
        <Sparkles className="h-4 w-4 text-emerald-400" /> AI optimization
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-300">
        {applied
          ? 'Timing applied. Follow-ups now go out between 9–11 AM, adjusted for each lead.'
          : 'Best engagement is between 9–11 AM. PropSell will optimize delivery time for each lead.'}
      </p>
      <button
        type="button"
        onClick={onToggle}
        className="mt-3 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
      >
        {applied ? 'Undo recommended timing' : 'Apply recommended timing →'}
      </button>
    </section>
  );
}

export function StatsCard() {
  return (
    <section className={card}>
      <h3 className="text-sm font-bold text-slate-900">Last 30 days</h3>
      <dl className="mt-3 divide-y divide-slate-100">
        {last30Days.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-3 text-xs">
            <dt className="text-slate-500">{row.label}</dt>
            <dd className="font-bold text-slate-900">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function SafetyCard({ settings, onChange }) {
  const items = [
    { key: 'pauseOnHuman', label: 'Pause automation immediately when a human agent replies.' },
    { key: 'quietHours', label: 'Respect WhatsApp quiet hours (8 PM–8 AM).' },
  ];
  return (
    <section className={card}>
      <h3 className="text-sm font-bold text-slate-900">Safety controls</h3>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item.key}>
            <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-snug text-slate-500">
              <input
                type="checkbox"
                checked={settings[item.key]}
                onChange={(e) => onChange({ ...settings, [item.key]: e.target.checked })}
                className="mt-0.5 h-4 w-4 shrink-0 rounded accent-emerald-600"
              />
              {item.label}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
