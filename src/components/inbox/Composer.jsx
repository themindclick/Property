import { Mic, Plus, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const MOCK_TRANSCRIPT = 'Buyer prefers a weekend visit and confirmed the loan pre-approval amount.';

function formatTimer(seconds) {
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function Composer({ aiActive, onSend, onVoiceNote }) {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('idle'); // idle | recording | transcribing
  const [seconds, setSeconds] = useState(0);
  const inputRef = useRef(null);
  const onVoiceNoteRef = useRef(onVoiceNote);
  onVoiceNoteRef.current = onVoiceNote;

  // Recording timer
  useEffect(() => {
    if (voice !== 'recording') return undefined;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [voice]);

  // Fake transcription delay, then push the note into CRM activity.
  useEffect(() => {
    if (voice !== 'transcribing') return undefined;
    const id = setTimeout(() => {
      onVoiceNoteRef.current(MOCK_TRANSCRIPT);
      setVoice('idle');
    }, 2400);
    return () => clearTimeout(id);
  }, [voice]);

  // Auto-grow the textarea (max ~5 lines).
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [text]);

  const submit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  const toggleRecording = () => {
    if (voice === 'idle') {
      setSeconds(0);
      setVoice('recording');
    } else if (voice === 'recording') {
      setVoice('transcribing');
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white px-4 pb-3 pt-3 sm:px-6">
      {voice !== 'idle' && (
        <div
          className="mb-2 flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white"
          role="status"
        >
          {voice === 'recording' ? (
            <>
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500 motion-reduce:animate-none" />
              Recording voice memo… {formatTimer(seconds)} · tap the mic again to stop
            </>
          ) : (
            <>🎙️ Agent voice memo transcribing directly into CRM customer notes...</>
          )}
        </div>
      )}

      <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-white p-2 focus-within:border-emerald-500">
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          aria-label="Attach file"
        >
          <Plus className="h-5 w-5" />
        </button>

        <label className="flex-1">
          <span className="sr-only">Write a message</span>
          <textarea
            ref={inputRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Write a message..."
            className="block max-h-[120px] w-full resize-none bg-transparent py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
        </label>

        <button
          type="button"
          onClick={toggleRecording}
          disabled={voice === 'transcribing'}
          aria-pressed={voice === 'recording'}
          aria-label={voice === 'recording' ? 'Stop voice memo' : 'Record voice memo'}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            voice === 'recording'
              ? 'bg-red-50 text-red-500'
              : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
          } disabled:opacity-50`}
        >
          <Mic className="h-[18px] w-[18px]" />
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={!text.trim()}
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-emerald-200"
        >
          <Send className="h-[18px] w-[18px]" />
        </button>
      </div>

      <div className="mt-2 flex justify-between text-[10px] text-slate-400">
        <span>Enter to send · Shift + Enter for new line</span>
        <span>
          {aiActive ? 'AI suggestions enabled · sending will pause AI' : 'AI paused · you are in control'}
        </span>
      </div>
    </div>
  );
}
