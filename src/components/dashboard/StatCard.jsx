import { CalendarDays, Sparkles, Users, Zap } from 'lucide-react';

const icons = {
  users: Users,
  zap: Zap,
  calendar: CalendarDays,
  sparkles: Sparkles,
};

const tones = {
  blue: 'bg-blue-50 text-blue-500',
  red: 'bg-red-50 text-red-500',
  amber: 'bg-amber-50 text-amber-500',
  emerald: 'bg-emerald-50 text-emerald-500',
};

export default function StatCard({ label, value, note, icon, tone }) {
  const Icon = icons[icon];
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <span className="text-xs font-bold text-emerald-600">{note}</span>
      </div>
      <p className="mt-5 text-[32px] font-bold leading-none tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-2 text-[13px] text-slate-500">{label}</p>
    </article>
  );
}
