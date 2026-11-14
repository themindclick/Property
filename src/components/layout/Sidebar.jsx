import { Home, MoreHorizontal, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { navItems } from '../../config/navigation.js';
import { aiEngine, currentUser, navCounts } from '../../data/mock.js';
import Avatar from '../ui/Avatar.jsx';

const badgeTone = {
  danger: 'bg-rose-500',
  neutral: 'bg-slate-600',
};

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[254px] shrink-0 flex-col bg-sidebar text-slate-300 transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main navigation"
      >
        {/* Brand */}
        <div className="flex h-[78px] items-center justify-between border-b border-white/5 px-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <Home className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <span className="text-xl font-bold tracking-tight text-white">
              PropSell <span className="text-emerald-400">AI</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 pt-8">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Workspace
          </p>
          <ul className="space-y-1">
            {navItems.map(({ path, label, icon: Icon, badge }) => {
              const count = badge ? navCounts[badge.key] : 0;
              return (
                <li key={path}>
                  <NavLink
                    to={path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[15px] font-medium transition-colors ${
                        isActive
                          ? 'bg-sidebar-active text-white'
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`h-5 w-5 shrink-0 ${isActive ? 'text-emerald-400' : ''}`}
                          strokeWidth={1.75}
                        />
                        <span className="flex-1 leading-snug">{label}</span>
                        {count > 0 && (
                          <span
                            className={`flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-1.5 text-xs font-bold text-white ${
                              badgeTone[badge.tone]
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* AI engine status */}
        <div className="px-3 pb-3">
          <div className="rounded-xl border border-white/10 bg-sidebar-raised px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                {aiEngine.online && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                )}
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    aiEngine.online ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
              </span>
              <span className="text-sm font-semibold text-white">
                {aiEngine.online ? 'AI Engine is online' : 'AI Engine is offline'}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              {aiEngine.accuracyToday}% response accuracy today
            </p>
          </div>
        </div>

        {/* Current user */}
        <div className="flex items-center gap-3 border-t border-white/5 px-4 py-4">
          <Avatar initials={currentUser.initials} tone="sun" size="lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{currentUser.name}</p>
            <p className="truncate text-xs text-slate-500">{currentUser.role}</p>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-white/5 hover:text-white"
            aria-label="Account options"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </aside>
    </>
  );
}
