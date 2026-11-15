import { Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import useDismiss from '../../hooks/useDismiss.js';
import { addOptions } from '../../data/automation.js';
import { kindStyles } from './StepCard.jsx';

export default function AddStepMenu({ onAdd }) {
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
        className="flex h-10 items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-5 text-xs font-semibold text-slate-600 hover:border-emerald-400 hover:text-emerald-700"
      >
        <Plus className="h-3.5 w-3.5" /> Add another action
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-1/2 z-10 mb-2 w-72 -translate-x-1/2 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {addOptions.map((o) => {
            const { icon: Icon, cls } = kindStyles[o.kind];
            return (
              <button
                key={o.kind}
                type="button"
                role="menuitem"
                onClick={() => {
                  onAdd(o);
                  setOpen(false);
                }}
                className="flex w-full items-start gap-3 px-3 py-2.5 text-left hover:bg-slate-50"
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cls}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-xs font-semibold text-slate-800">{o.title}</span>
                  <span className="block text-[11px] text-slate-400">{o.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
