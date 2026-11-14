import { Link } from 'react-router-dom';
import { priorityChats } from '../../data/mock.js';
import Avatar from '../ui/Avatar.jsx';
import LeadBadge from '../ui/LeadBadge.jsx';

export default function PriorityInbox() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">Priority inbox</h2>
        <Link to="/inbox" className="text-[13px] font-semibold text-emerald-600 hover:text-emerald-700">
          View inbox →
        </Link>
      </div>

      <ul className="mt-5 divide-y divide-slate-100">
        {priorityChats.map((chat) => (
          <li key={chat.id}>
            <Link
              to={`/inbox?chat=${chat.id}`}
              className="-mx-2 flex items-center gap-3.5 rounded-lg px-2 py-3.5 hover:bg-slate-50"
            >
              <Avatar initials={chat.initials} tone={chat.avatarTone} size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{chat.name}</p>
                <p className="mt-0.5 truncate text-xs text-slate-400">{chat.lastMessage}</p>
              </div>
              <LeadBadge level={chat.urgency} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
