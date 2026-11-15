import { Sparkles, UserRound } from 'lucide-react';

// The hybrid-control switch: AI auto-replying (green) vs paused for human takeover (amber).
export default function AiToggleBar({ aiActive, onToggle }) {
  return (
    <div
      className={`flex items-center justify-between border-b px-4 py-2.5 transition-colors ${
        aiActive ? 'border-slate-200 bg-white' : 'border-amber-200 bg-amber-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            aiActive ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-100 text-amber-600'
          }`}
        >
          {aiActive ? <Sparkles className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            AI Assistant
          </p>
          <p
            className={`text-xs font-bold ${aiActive ? 'text-emerald-600' : 'text-amber-600'}`}
            aria-live="polite"
          >
            {aiActive ? 'ACTIVE · Auto-replying' : 'PAUSED FOR HUMAN TAKEOVER'}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={aiActive}
        aria-label="AI assistant auto-reply"
        onClick={onToggle}
        className={`relative h-7 w-[50px] shrink-0 rounded-full transition-colors ${
          aiActive ? 'bg-emerald-500' : 'bg-amber-500'
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
            aiActive ? 'translate-x-[22px]' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
