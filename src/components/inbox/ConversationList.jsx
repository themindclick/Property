import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { inboxSummary } from '../../data/inbox.js';
import Avatar from '../ui/Avatar.jsx';
import LeadBadge from '../ui/LeadBadge.jsx';

const tabs = [
  { id: 'all', label: 'All', count: inboxSummary.active },
  { id: 'unread', label: 'Unread', count: inboxSummary.waiting },
  { id: 'hot', label: 'Hot', count: inboxSummary.hot },
];

// Micro-icon showing who is handling (and typing in) the chat: AI or a human.
function HandlerIcon({ aiActive, typing }) {
  const base =
    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold';
  const pulse = typing ? 'animate-pulse' : '';
  return aiActive ? (
    <span className={`${base} ${pulse} bg-emerald-100 text-emerald-700`} title="AI is handling this chat">
      AI
      <span className="sr-only">handled by AI{typing ? ', typing' : ''}</span>
    </span>
  ) : (
    <span className={`${base} ${pulse} bg-amber-100 text-amber-700`} title="Human agent is handling this chat">
      H
      <span className="sr-only">handled by a human agent{typing ? ', typing' : ''}</span>
    </span>
  );
}

export default function ConversationList({
  items,
  activeId,
  onSelect,
  query,
  onQueryChange,
  filter,
  onFilterChange,
  className = '',
}) {
  return (
    <section
      className={`flex w-full shrink-0 flex-col border-r border-slate-200 bg-white lg:w-[280px] ${className}`}
      aria-label="Conversations"
    >
      <div className="px-4 pb-3 pt-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-slate-900">Conversations</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {inboxSummary.waiting} waiting · {inboxSummary.active} active
            </p>
          </div>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
            aria-label="Start new conversation"
          >
            <Plus className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          <label className="relative flex-1">
            <span className="sr-only">Search chats</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search chats"
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
            />
          </label>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
            aria-label="Filter conversations"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-slate-200 px-4 pb-3" role="tablist" aria-label="Conversation filter">
        {tabs.map((tab) => {
          const selected = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onFilterChange(tab.id)}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold ${
                selected ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
              <span
                className={`rounded px-1.5 text-[11px] ${
                  selected ? 'bg-emerald-100' : 'bg-transparent'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto">
        {items.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-slate-400">No conversations match.</li>
        )}
        {items.map((c) => {
          const selected = c.id === activeId;
          return (
            <li key={c.id} className="border-b border-slate-100">
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                aria-current={selected ? 'true' : undefined}
                className={`flex w-full gap-3 border-l-[3px] px-4 py-4 text-left transition-colors ${
                  selected
                    ? 'border-emerald-500 bg-emerald-50/70'
                    : 'border-transparent hover:bg-slate-50'
                }`}
              >
                <Avatar initials={c.initials} tone={c.avatarTone} size="md" />
                <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="flex items-center gap-2">
                    <span className="flex-1 truncate text-sm font-semibold text-slate-900">
                      {c.name}
                    </span>
                    <LeadBadge level={c.urgency} />
                    <span className="w-6 text-right text-[11px] text-slate-400">{c.time}</span>
                  </span>
                  <span className="w-fit max-w-full truncate rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-500">
                    {c.property}
                  </span>
                  <span className="flex items-center gap-2">
                    <span
                      className={`flex-1 truncate text-xs ${
                        c.unread ? 'font-medium text-slate-700' : 'text-slate-400'
                      }`}
                    >
                      {c.preview}
                    </span>
                    <HandlerIcon aiActive={c.aiActive} typing={c.typing} />
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
