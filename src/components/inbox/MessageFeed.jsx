import { Bot, Check, CheckCheck, UserRound } from 'lucide-react';
import { useEffect, useRef } from 'react';
import Avatar from '../ui/Avatar.jsx';

const bubbleStyles = {
  buyer: 'rounded-tl-sm border border-slate-200 bg-white text-slate-800',
  ai: 'rounded-tr-sm border border-emerald-200 bg-emerald-100 text-slate-800',
  agent: 'rounded-tr-sm border border-amber-300 bg-white text-slate-800',
};

function SenderBadge({ from }) {
  if (from === 'ai') {
    return (
      <span className="mb-1 inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
        <Bot className="h-3 w-3" /> AI Automated Response
      </span>
    );
  }
  return (
    <span className="mb-1 inline-flex items-center gap-1 rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
      <UserRound className="h-3 w-3" /> Agent Reply
    </span>
  );
}

function Message({ message, buyer }) {
  const isBuyer = message.from === 'buyer';
  const Tick = message.status === 'read' ? CheckCheck : Check;

  return (
    <div className={`flex items-end gap-3 ${isBuyer ? '' : 'justify-end'}`}>
      {isBuyer && <Avatar initials={buyer.initials} tone={buyer.avatarTone} size="xs" />}
      <div className={`flex max-w-[78%] flex-col ${isBuyer ? 'items-start' : 'items-end'}`}>
        {!isBuyer && <SenderBadge from={message.from} />}
        <p
          className={`rounded-xl px-4 py-3 text-[13.5px] leading-relaxed shadow-card ${bubbleStyles[message.from]}`}
        >
          {message.text}
        </p>
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-400">
          {message.time}
          {!isBuyer && <Tick className="h-3.5 w-3.5 text-emerald-500" aria-label={message.status ?? 'sent'} />}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator({ name, buyer }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar initials={buyer.initials} tone={buyer.avatarTone} size="xs" />
      <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 motion-reduce:animate-none"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </span>
      <span className="text-xs text-slate-400">{name} is typing...</span>
    </div>
  );
}

export default function MessageFeed({ conversation }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [conversation.id, conversation.messages.length]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-canvas px-4 py-5 sm:px-6" aria-live="polite">
      <div className="mb-6 flex justify-center">
        <span className="rounded-full bg-slate-200/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          {conversation.startedAt}
        </span>
      </div>

      <div className="space-y-5">
        {conversation.messages.map((m) => (
          <Message key={m.id} message={m} buyer={conversation} />
        ))}
        {conversation.buyerTyping && (
          <TypingIndicator name={conversation.name.split(' ')[0]} buyer={conversation} />
        )}
      </div>
      <div ref={endRef} />
    </div>
  );
}
