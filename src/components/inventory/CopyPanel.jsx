import { Check, Copy, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const labels = {
  facebook: { en: 'English · Facebook Ad', si: 'සිංහල · Facebook දැන්වීම' },
  seo: { en: 'English · SEO description', si: 'සිංහල · SEO විස්තරය' },
};

function CopyBlock({ label, text, sinhala }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked (insecure context); the text stays selectable.
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className={`text-[11px] font-bold text-emerald-900 ${sinhala ? 'font-sinhala' : ''}`}>{label}</p>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p
        lang={sinhala ? 'si' : 'en'}
        className={`mt-1.5 whitespace-pre-line text-xs leading-relaxed text-slate-700 ${sinhala ? 'font-sinhala' : ''}`}
      >
        {text}
      </p>
    </div>
  );
}

export function CopySkeleton() {
  return (
    <div
      className="mt-4 space-y-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Writing English and Sinhala copy…</span>
      {[100, 90, 70, 100, 80].map((w, i) => (
        <div
          key={i}
          className="h-2.5 animate-pulse rounded bg-emerald-200/70 motion-reduce:animate-none"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

export default function CopyPanel({ copy, format, onFormatChange, onRegenerate }) {
  return (
    <div
      className="mt-4 space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3"
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-md bg-white/70 p-0.5">
          {[
            ['facebook', 'Facebook Ad'],
            ['seo', 'SEO'],
          ].map(([id, text]) => (
            <button
              key={id}
              type="button"
              aria-pressed={format === id}
              onClick={() => onFormatChange(id)}
              className={`rounded px-2 py-1 text-[10px] font-bold ${
                format === id ? 'bg-emerald-500 text-white' : 'text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              {text}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onRegenerate}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100"
        >
          <RefreshCw className="h-3 w-3" /> Regenerate
        </button>
      </div>

      <CopyBlock label={labels[format].en} text={copy.en[format]} />
      <CopyBlock label={labels[format].si} text={copy.si[format]} sinhala />
    </div>
  );
}
