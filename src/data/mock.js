// Replace these with API calls (TanStack Query hooks) once the backend is ready.

export const currentUser = {
  name: 'Sahan N.',
  firstName: 'Sahan',
  initials: 'SN',
  role: 'Senior Sales Agent',
  branch: 'Colombo Branch',
};

export const navCounts = {
  unreadChats: 8,
  upcomingVisits: 3,
};

export const aiEngine = {
  online: true,
  accuracyToday: 98.6,
};

export const stats = [
  { id: 'active-leads', label: 'Active leads', value: '248', note: '+12.5%', icon: 'users', tone: 'blue' },
  { id: 'hot-leads', label: 'Hot leads', value: '18', note: '5 need action', icon: 'zap', tone: 'red' },
  { id: 'visits', label: 'Visits this week', value: '12', note: '+3 vs last week', icon: 'calendar', tone: 'amber' },
  { id: 'ai-conversations', label: 'AI conversations', value: '1,284', note: '94% resolved', icon: 'sparkles', tone: 'emerald' },
];

// `total` = all lead interactions, `qualified` = the hot / booked share.
export const salesActivity = {
  thisWeek: [
    { day: 'Mon', total: 49, qualified: 12 },
    { day: 'Tue', total: 68, qualified: 23 },
    { day: 'Wed', total: 53, qualified: 14 },
    { day: 'Thu', total: 84, qualified: 35 },
    { day: 'Fri', total: 73, qualified: 26 },
    { day: 'Sat', total: 100, qualified: 50 },
    { day: 'Sun', total: 82, qualified: 33 },
  ],
  lastWeek: [
    { day: 'Mon', total: 41, qualified: 9 },
    { day: 'Tue', total: 55, qualified: 17 },
    { day: 'Wed', total: 60, qualified: 18 },
    { day: 'Thu', total: 72, qualified: 28 },
    { day: 'Fri', total: 66, qualified: 22 },
    { day: 'Sat', total: 91, qualified: 41 },
    { day: 'Sun', total: 70, qualified: 24 },
  ],
};

export const priorityChats = [
  { id: 'c1', name: 'Kasun Perera', initials: 'KP', avatarTone: 'indigo', lastMessage: 'Can we visit this Saturday morning?', urgency: 'hot' },
  { id: 'c2', name: 'Nimali Fernando', initials: 'NF', avatarTone: 'rose', lastMessage: 'I need more details about the loan.', urgency: 'warm' },
  { id: 'c3', name: 'Dinesh Silva', initials: 'DS', avatarTone: 'amber', lastMessage: 'Is the price negotiable?', urgency: 'warm' },
  { id: 'c4', name: 'Amaya Jayasinghe', initials: 'AJ', avatarTone: 'cyan', lastMessage: 'Thanks, I will discuss with my family.', urgency: 'cold' },
];
