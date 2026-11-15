// Card colour follows lead temperature: red = hot, amber = warm, blue = cold.
const tones = {
  hot: 'border-l-red-500 bg-red-50',
  warm: 'border-l-amber-400 bg-amber-50',
  cold: 'border-l-blue-500 bg-blue-50',
};

export default function VisitCard({ visit, onOpen }) {
  const pending = visit.status === 'pending';
  return (
    <button
      type="button"
      onClick={() => onOpen(visit.id)}
      aria-label={`${visit.time} visit with ${visit.buyerName} at ${visit.property}, ${
        pending ? 'awaiting confirmation' : 'confirmed'
      }`}
      className={`flex h-[76px] w-full flex-col rounded-md border-l-[3px] px-2.5 py-2 text-left transition-shadow hover:shadow-md ${
        tones[visit.urgency] ?? tones.warm
      } ${pending ? 'outline-1 -outline-offset-1 outline-dashed outline-slate-300' : ''}`}
    >
      <span className="text-[11px] font-bold text-slate-900">
        {visit.time}
        {pending && <span className="ml-1.5 font-semibold text-amber-600">· Pending</span>}
      </span>
      <span className="mt-1 truncate text-xs font-semibold text-slate-900">{visit.buyerName}</span>
      <span className="truncate text-[11px] text-slate-500">{visit.property}</span>
    </button>
  );
}
