import { ArrowLeft, MoreHorizontal, PanelRight, Phone, Video } from 'lucide-react';
import Avatar from '../ui/Avatar.jsx';
import AiToggleBar from './AiToggleBar.jsx';
import Composer from './Composer.jsx';
import MessageFeed from './MessageFeed.jsx';

const iconButton =
  'flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50';

export default function ChatPanel({
  conversation,
  onToggleAi,
  onSend,
  onVoiceNote,
  onBack,
  onOpenDrawer,
  className = '',
}) {
  return (
    <section className={`min-w-0 flex-1 flex-col bg-white ${className}`} aria-label="Active chat">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Back to conversations"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Avatar initials={conversation.initials} tone={conversation.avatarTone} size="md" />
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <span className="truncate">{conversation.name}</span>
              {conversation.online && (
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"
                  role="img"
                  aria-label="Online"
                />
              )}
            </p>
            <p className="truncate text-xs text-slate-400">
              {conversation.phone} · {conversation.lastSeen}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className={iconButton} aria-label="Call buyer">
            <Phone className="h-4 w-4" />
          </button>
          <button type="button" className={`${iconButton} hidden sm:flex`} aria-label="Video call">
            <Video className="h-4 w-4" />
          </button>
          <button type="button" className={iconButton} aria-label="More options">
            <MoreHorizontal className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onOpenDrawer}
            className={`${iconButton} xl:hidden`}
            aria-label="Open lead intelligence"
          >
            <PanelRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <AiToggleBar aiActive={conversation.aiActive} onToggle={onToggleAi} />
      <MessageFeed conversation={conversation} />
      <Composer aiActive={conversation.aiActive} onSend={onSend} onVoiceNote={onVoiceNote} />
    </section>
  );
}
