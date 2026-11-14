import { Bell, ChevronRight, Menu, Search } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { navItems } from '../../config/navigation.js';
import { currentUser } from '../../data/mock.js';
import Avatar from '../ui/Avatar.jsx';

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const searchRef = useRef(null);
  const title = navItems.find((item) => pathname.startsWith(item.path))?.label ?? 'Dashboard';

  // Cmd/Ctrl + K focuses the search box.
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header className="flex h-[78px] shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[13px] text-slate-400">
            <span>PropSell AI</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>Workspace</span>
          </p>
          <h1 className="truncate text-xl font-bold leading-tight text-slate-900">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <label className="relative hidden w-[288px] md:block">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchRef}
            type="search"
            placeholder="Search anything..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-14 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-400">
            ⌘K
          </kbd>
        </label>

        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          aria-label="Notifications, new activity"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-3 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <span className="hidden h-8 w-px bg-slate-200 sm:block" aria-hidden="true" />

        <div className="flex items-center gap-3">
          <Avatar initials={currentUser.initials} tone="slate" size="lg" />
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
            <p className="text-xs text-slate-400">{currentUser.branch}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
