const tones = {
  indigo: 'bg-indigo-100 text-indigo-700',
  rose: 'bg-rose-100 text-rose-700',
  amber: 'bg-amber-100 text-amber-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  slate: 'bg-slate-800 text-white',
  sun: 'bg-linear-to-br from-amber-300 to-orange-400 text-slate-800',
};

const sizes = {
  xs: 'h-7 w-7 text-[9px]',
  sm: 'h-9 w-9 text-[11px]',
  md: 'h-10 w-10 text-xs',
  lg: 'h-11 w-11 text-[13px]',
};

export default function Avatar({ initials, tone = 'slate', size = 'md', className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold ${tones[tone]} ${sizes[size]} ${className}`}
    >
      {initials}
    </span>
  );
}
