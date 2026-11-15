import { Check, Play, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import AddStepMenu from '../components/automation/AddStepMenu.jsx';
import StepCard, { WaitPill } from '../components/automation/StepCard.jsx';
import { OptimizationCard, SafetyCard, StatsCard } from '../components/automation/WorkflowSidebar.jsx';
import { defaultSettings, initialSteps } from '../data/automation.js';

const snapshot = (steps, settings) => JSON.stringify({ steps, settings });
const timeNow = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

export default function AutomationPage() {
  const [steps, setSteps] = useState(initialSteps);
  const [settings, setSettings] = useState(defaultSettings);
  const [published, setPublished] = useState(() => snapshot(initialSteps, defaultSettings));
  const [lastEdited, setLastEdited] = useState('09:32 AM');
  const [flash, setFlash] = useState(null);

  const dirty = snapshot(steps, settings) !== published;

  useEffect(() => {
    if (!flash) return undefined;
    const t = setTimeout(() => setFlash(null), 4500);
    return () => clearTimeout(t);
  }, [flash]);

  const edit = (setter) => (value) => {
    setter(value);
    setLastEdited(timeNow());
  };
  const changeSteps = edit(setSteps);
  const changeSettings = edit(setSettings);

  // Day numbers are cumulative: each step happens `waitDays` after the previous one.
  const days = steps.reduce((acc, s, i) => [...acc, i === 0 ? 1 : acc[i - 1] + s.waitDays], []);

  const updateStep = (id, patch) =>
    changeSteps(steps.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const removeStep = (step) => {
    if (window.confirm(`Remove “${step.title}” from this workflow?`)) {
      changeSteps(steps.filter((s) => s.id !== step.id));
    }
  };

  const addStep = (option) =>
    changeSteps([
      ...steps,
      {
        id: `s${Date.now()}`,
        kind: option.kind,
        title: option.title,
        description: option.description,
        stat: 'New step',
        enabled: true,
        waitDays: 7,
      },
    ]);

  const saveDraft = () => {
    setLastEdited(timeNow());
    setFlash('Draft saved. Publish when you are ready to make it live.');
  };

  const publish = () => {
    setPublished(snapshot(steps, settings));
    setFlash(`Workflow published. ${steps.filter((s) => s.enabled).length} active steps are now live.`);
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-7 sm:px-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Lead nurture workflow</h2>
          <p className="mt-1 text-sm text-slate-500">
            Keep every buyer engaged with human-quality, context-aware follow-ups.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={saveDraft}
            className="h-10 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={publish}
            disabled={!dirty}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-500 px-5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            <Play className="h-3.5 w-3.5" /> Publish workflow
          </button>
        </div>
      </div>

      {flash && (
        <div
          role="status"
          className="mt-5 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <Check className="h-4 w-4 shrink-0" />
          <span className="flex-1">{flash}</span>
          <button
            type="button"
            onClick={() => setFlash(null)}
            className="rounded p-1 hover:bg-emerald-100"
            aria-label="Dismiss message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card" aria-label="Workflow editor">
          <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-6 py-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Residential Buyer · Smart Follow-up</h3>
              <p className="mt-1 text-[11px] text-slate-400">Last edited today at {lastEdited}</p>
            </div>
            <span
              role="status"
              className={`rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                dirty
                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700'
              }`}
            >
              {dirty ? 'Unpublished changes' : 'Live'}
            </span>
          </header>

          <div
            className="px-4 py-8 sm:px-8"
            style={{
              backgroundImage: 'radial-gradient(#d5dbe3 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            <ol className="mx-auto max-w-[630px]">
              {steps.map((step, i) => (
                <li key={step.id}>
                  {i > 0 && (
                    <div className="flex flex-col items-center">
                      <span className="h-6 border-l border-dashed border-slate-300" aria-hidden="true" />
                      <WaitPill
                        days={step.waitDays}
                        onChange={(value) => updateStep(step.id, { waitDays: value })}
                      />
                      <span className="h-6 border-l border-dashed border-slate-300" aria-hidden="true" />
                    </div>
                  )}
                  <StepCard
                    step={step}
                    day={days[i]}
                    onToggle={(enabled) => updateStep(step.id, { enabled })}
                    onRemove={() => removeStep(step)}
                  />
                </li>
              ))}
            </ol>

            <div className="mt-6 flex justify-center">
              <AddStepMenu onAdd={addStep} />
            </div>
          </div>
        </section>

        <aside className="space-y-5" aria-label="Workflow insights">
          <OptimizationCard
            applied={settings.optimizedTiming}
            onToggle={() => changeSettings({ ...settings, optimizedTiming: !settings.optimizedTiming })}
          />
          <StatsCard />
          <SafetyCard settings={settings} onChange={changeSettings} />
        </aside>
      </div>
    </div>
  );
}
