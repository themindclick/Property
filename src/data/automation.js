// Mock workflow. Replace with GET/PUT /automation/workflows/:id.

export const initialSteps = [
  {
    id: 's1',
    kind: 'whatsapp',
    title: 'Initial WhatsApp Inquiry',
    description: 'AI qualifies intent, budget, preferred area and financing status.',
    stat: '< 30 sec response',
    enabled: true,
    waitDays: 0,
    trigger: true,
  },
  {
    id: 's2',
    kind: 'ai',
    title: 'Property Feedback Follow-up',
    description: 'Personalized AI message asks for feedback and detects objections.',
    stat: '72% reply rate',
    enabled: true,
    waitDays: 2,
  },
  {
    id: 's3',
    kind: 'listings',
    title: 'Dynamic Re-engagement',
    description: 'Shares alternate listings in similar neighborhoods within budget.',
    stat: '+18% recovered',
    enabled: true,
    waitDays: 11,
  },
];

export const addOptions = [
  { kind: 'whatsapp', title: 'Send WhatsApp message', description: 'Send a templated message to the buyer.' },
  { kind: 'ai', title: 'AI feedback follow-up', description: 'AI asks for feedback and detects objections.' },
  { kind: 'listings', title: 'Share matching listings', description: 'Send listings that fit the buyer’s budget and area.' },
  { kind: 'visit', title: 'Offer a site visit', description: 'Invite the buyer to book a visit slot.' },
];

export const defaultSettings = { pauseOnHuman: true, quietHours: true, optimizedTiming: false };

export const last30Days = [
  { label: 'Leads entered', value: '184' },
  { label: 'Messages sent', value: '436' },
  { label: 'Response rate', value: '68.4%' },
  { label: 'Visits booked', value: '29' },
];
