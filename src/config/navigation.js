import {
  CalendarDays,
  Home,
  LayoutGrid,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

// `badge.key` maps to a count in data/mock.js (navCounts).
export const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  {
    path: '/inbox',
    label: 'WhatsApp Live Inbox',
    icon: MessageCircle,
    badge: { key: 'unreadChats', tone: 'danger' },
  },
  { path: '/inventory', label: 'Property Inventory', icon: Home },
  { path: '/automation', label: 'AI Automation Rules', icon: Sparkles },
  {
    path: '/calendar',
    label: 'Site-Visit Calendar',
    icon: CalendarDays,
    badge: { key: 'upcomingVisits', tone: 'neutral' },
  },
];
