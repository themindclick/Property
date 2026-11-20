import { CalendarDays, Clock, Home, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { VISIT_STATUS } from '../../data/visits.js';
import { fromKey, longDay } from '../../lib/dates.js';
import Modal from '../ui/Modal.jsx';

function Body({ visit, onConfirm, onCancelVisit, onClose }) {
  const [askCancel, setAskCancel] = useState(false);
  const pending = visit.status === 'pending';

  return (
    <div>
      <span
        className={`inline-flex rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
          pending
            ? 'border-amber-200 bg-amber-50 text-amber-700'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
        }`}
      >
        {VISIT_STATUS[visit.status]}
      </span>

      <p className="mt-3 text-base font-bold text-slate-900">{visit.buyerName}</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-600">
        <li className="flex items-center gap-2.5">
          <Home className="h-4 w-4 text-slate-400" aria-hidden="true" /> {visit.property}
        </li>
        <li className="flex items-center gap-2.5">
          <CalendarDays className="h-4 w-4 text-slate-400" aria-hidden="true" /> {longDay(fromKey(visit.date))}
        </li>
        <li className="flex items-center gap-2.5">
          <Clock className="h-4 w-4 text-slate-400" aria-hidden="true" /> {visit.time}
        </li>
      </ul>

      {askCancel ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-semibold text-red-700">Cancel this visit?</p>
          <p className="mt-0.5 text-xs text-red-600">The slot becomes free again. The buyer is not notified automatically.</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => onCancelVisit(visit)}
              className="h-9 rounded-lg bg-red-600 px-4 text-xs font-semibold text-white hover:bg-red-700"
            >
              Yes, cancel visit
            </button>
            <button
              type="button"
              onClick={() => setAskCancel(false)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Keep visit
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {pending && (
            <button
              type="button"
              onClick={() => onConfirm(visit)}
              className="h-10 rounded-lg bg-emerald-500 px-4 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              Confirm visit
            </button>
          )}
          {visit.buyerId && (
            <Link
              to={`/inbox?chat=${visit.buyerId}`}
              onClick={onClose}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <MessageCircle className="h-4 w-4" /> Open chat
            </Link>
          )}
          <button
            type="button"
            onClick={() => setAskCancel(true)}
            className="ml-auto h-10 rounded-lg px-3 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Cancel visit
          </button>
        </div>
      )}
    </div>
  );
}

export default function VisitDetailsModal({ visit, onClose, onConfirm, onCancelVisit }) {
  return (
    <Modal open={Boolean(visit)} onClose={onClose} title="Site visit">
      {visit && (
        <Body visit={visit} onConfirm={onConfirm} onCancelVisit={onCancelVisit} onClose={onClose} />
      )}
    </Modal>
  );
}