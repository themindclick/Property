import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatPanel from '../components/inbox/ChatPanel.jsx';
import ContextDrawer from '../components/inbox/ContextDrawer.jsx';
import ConversationList from '../components/inbox/ConversationList.jsx';
import { conversations as initialConversations } from '../data/inbox.js';

const nowTime = () =>
  new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

const uid = (prefix) => `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;

export default function InboxPage() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState(initialConversations);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [mobileChatOpen, setMobileChatOpen] = useState(Boolean(params.get('chat')));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const requestedId = params.get('chat');
  const activeId = items.some((c) => c.id === requestedId) ? requestedId : items[0].id;
  const active = items.find((c) => c.id === activeId);

  const update = useCallback(
    (id, fn) => setItems((prev) => prev.map((c) => (c.id === id ? fn(c) : c))),
    [],
  );

  // Opening a chat marks it as read.
  useEffect(() => {
    update(activeId, (c) => (c.unread ? { ...c, unread: false } : c));
  }, [activeId, update]);

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((c) => {
      if (filter === 'unread' && !c.unread) return false;
      if (filter === 'hot' && c.urgency !== 'hot') return false;
      if (!q) return true;
      return [c.name, c.property, c.preview].some((v) => v.toLowerCase().includes(q));
    });
  }, [items, query, filter]);

  const selectChat = (id) => {
    setParams({ chat: id }, { replace: true });
    setMobileChatOpen(true);
  };

  const addActivity = (id, entry) =>
    update(id, (c) => ({ ...c, activity: [{ id: uid('a'), ...entry }, ...c.activity] }));

  const toggleAi = () => {
    const turningOff = active.aiActive;
    update(activeId, (c) => ({
      ...c,
      aiActive: !c.aiActive,
      activity: [
        {
          id: uid('a'),
          type: turningOff ? 'handoff' : 'ai',
          title: turningOff ? 'AI paused for human takeover' : 'AI auto-reply resumed',
          detail: 'Just now',
        },
        ...c.activity,
      ],
    }));
  };

  // Any agent-sent message is a human override, so the AI pauses automatically.
  const sendAgentMessage = (text) => {
    const body = text.trim();
    if (!body) return;
    update(activeId, (c) => ({
      ...c,
      aiActive: false,
      preview: body,
      time: 'now',
      buyerTyping: false,
      messages: [...c.messages, { id: uid('m'), from: 'agent', text: body, time: nowTime(), status: 'sent' }],
      activity: c.aiActive
        ? [
            { id: uid('a'), type: 'handoff', title: 'AI paused for human takeover', detail: 'Agent replied · just now' },
            ...c.activity,
          ]
        : c.activity,
    }));
  };

  const quickSend = (listing) =>
    sendAgentMessage(`Sharing a listing you may like: ${listing.title} · ${listing.price}`);

  const addNote = (text) =>
    addActivity(activeId, { type: 'note', title: 'Internal note added', detail: `${text} · just now` });

  const addVoiceNote = useCallback(
    (transcript) =>
      update(activeId, (c) => ({
        ...c,
        activity: [
          { id: uid('a'), type: 'voice', title: 'Voice memo transcribed', detail: `${transcript} · just now` },
          ...c.activity,
        ],
      })),
    [activeId, update],
  );

  return (
    <div className="relative flex h-full overflow-hidden bg-white">
      <ConversationList
        items={visibleItems}
        activeId={activeId}
        onSelect={selectChat}
        query={query}
        onQueryChange={setQuery}
        filter={filter}
        onFilterChange={setFilter}
        className={mobileChatOpen ? 'hidden lg:flex' : 'flex'}
      />

      <ChatPanel
        key={activeId}
        conversation={active}
        onToggleAi={toggleAi}
        onSend={sendAgentMessage}
        onVoiceNote={addVoiceNote}
        onBack={() => setMobileChatOpen(false)}
        onOpenDrawer={() => setDrawerOpen(true)}
        className={mobileChatOpen ? 'flex' : 'hidden lg:flex'}
      />

      {drawerOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/40 xl:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
      <ContextDrawer
        conversation={active}
        onQuickSend={quickSend}
        onAddNote={addNote}
        onClose={() => setDrawerOpen(false)}
        className={
          drawerOpen
            ? 'fixed inset-y-0 right-0 z-30 flex shadow-2xl xl:static xl:shadow-none'
            : 'hidden xl:flex'
        }
      />
    </div>
  );
}
