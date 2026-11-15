import {
  Building2,
  CalendarDays,
  Home,
  MapPin,
  Mic,
  Send,
  Sparkles,
  StickyNote,
  UserRound,
  X,
} from 'lucide-react';
import { useState } from 'react';

const sectionLabel = 'text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400';

const kindStyles = {
  land: { icon: MapPin, bg: 'from-emerald-200 to-emerald-400', fg: 'text-emerald-700' },
  apartment: { icon: Building2, bg: 'from-sky-200 to-sky-400', fg: 'text-sky-700' },
  house: { icon: Home, bg: 'from-amber-200 to-amber-400', fg: 'text-amber-700' },
};

const activityStyles = {
  ai: { icon: Sparkles, cls: 'bg-emerald-50 text-emerald-600' },
  visit: { icon: CalendarDays, cls: 'bg-blue-50 text-blue-500' },
  note: { icon: StickyNote, cls: 'bg-slate-100 text-slate-500' },
  voice: { icon: Mic, cls: 'bg-rose-50 text-rose-500' },
  handoff: { icon: UserRound, cls: 'bg-amber-50 text-amber-600' },
};

function ListingCard({ listing, onQuickSend }) {
  const { icon: Icon, bg, fg } = kindStyles[listing.kind];
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-2.5">
      <div className="flex gap-2.5">
        {/* Swap for <img src={listing.image} /> once listing photos come from the API */}
        <span
          className={`flex h-[46px] w-[52px] shrink-0 items-center justify-center rounded-md bg-linear-to-br ${bg} ${fg}`}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold text-slate-900">{listing.title}</p>
            <span className="text-[11px] font-bold text-emerald-600">{listing.match}%</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">{listing.price}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onQuickSend(listing)}
        className="mt-2.5 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-sidebar text-[11px] font-semibold text-white hover:bg-sidebar-active"
      >
        <Send className="h-3 w-3" /> Quick-send to chat
      </button>
    </li>
  );
}

function ActivityItem({ item }) {
  const { icon: Icon, cls } = activityStyles[item.type] ?? activityStyles.note;
  return (
    <li className="flex items-start gap-3">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${cls}`}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-800">{item.title}</p>
        <p className="mt-0.5 text-[11px] text-slate-400">{item.detail}</p>
      </div>
    </li>
  );
}

export default function ContextDrawer({ conversation, onQuickSend, onAddNote, onClose, className = '' }) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');

  const saveNote = () => {
    if (!note.trim()) return;
    onAddNote(note.trim());
    setNote('');
    setNoteOpen(false);
  };

  return (
    <aside
      className={`w-[300px] flex-col overflow-y-auto border-l border-slate-200 bg-white xl:w-[285px] ${className}`}
      aria-label="Lead intelligence"
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">
        <h2 className="text-sm font-bold text-slate-900">Lead Intelligence</h2>
        <div className="flex items-center gap-2">
          <span className="rounded border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-bold uppercase text-red-600">
            {conversation.buyIntent}% buy intent
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 xl:hidden"
            aria-label="Close lead intelligence"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-6 px-4 py-5">
        <section>
          <div className="mb-2.5 flex items-center justify-between">
            <h3 className={sectionLabel}>Parsed buyer profile</h3>
            <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
              AI updated
            </span>
          </div>
          <dl className="divide-y divide-slate-100 rounded-lg border border-slate-200">
            {conversation.profile.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 px-3 py-2.5 text-xs">
                <dt className="text-slate-400">{row.label}</dt>
                <dd className="text-right font-medium text-slate-800">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <div className="mb-2.5 flex items-center justify-between">
            <h3 className={sectionLabel}>AI-matched listings</h3>
            <button type="button" className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700">
              View all
            </button>
          </div>
          <ul className="space-y-3">
            {conversation.listings.map((l) => (
              <ListingCard key={l.id} listing={l} onQuickSend={onQuickSend} />
            ))}
          </ul>
        </section>

        <section>
          <h3 className={`${sectionLabel} mb-3`}>CRM activity</h3>
          <ul className="space-y-4">
            {conversation.activity.map((item) => (
              <ActivityItem key={item.id} item={item} />
            ))}
          </ul>

          {noteOpen ? (
            <div className="mt-5 space-y-2">
              <label className="block">
                <span className="sr-only">Internal note</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  autoFocus
                  placeholder="Only your team can see this note"
                  className="w-full resize-none rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
                />
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveNote}
                  disabled={!note.trim()}
                  className="h-8 flex-1 rounded-lg bg-emerald-500 text-xs font-semibold text-white hover:bg-emerald-600 disabled:bg-emerald-200"
                >
                  Save note
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNote('');
                    setNoteOpen(false);
                  }}
                  className="h-8 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setNoteOpen(true)}
              className="mt-5 h-9 w-full rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              + Add internal note
            </button>
          )}
        </section>
      </div>
    </aside>
  );
}
