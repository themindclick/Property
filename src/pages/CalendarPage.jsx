import { Check, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ScheduleVisitModal from '../components/calendar/ScheduleVisitModal.jsx';
import VisitCard from '../components/calendar/VisitCard.jsx';
import VisitDetailsModal from '../components/calendar/VisitDetailsModal.jsx';
import { useVisits } from '../context/VisitsContext.jsx';
import { TIME_SLOTS } from '../data/visits.js';
import { addDays, dayHeader, formatRange, fromKey, longDay, startOfWeek, toKey } from '../lib/dates.js';

const iconBtn =
  'flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50';

export default function CalendarPage() {
  const { visits, updateVisit, removeVisit } = useVisits();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [schedule, setSchedule] = useState({ open: false, date: '', time: '' });
  const [selectedId, setSelectedId] = useState(null);
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    if (!flash) return undefined;
    const t = setTimeout(() => setFlash(null), 5000);
    return () => clearTimeout(t);
  }, [flash]);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const keys = days.map(toKey);
  const todayKey = toKey(new Date());

  const weekVisits = visits.filter((v) => keys.includes(v.date));
  const confirmed = weekVisits.filter((v) => v.status === 'confirmed').length;
  const pending = weekVisits.length - confirmed;
  const selected = visits.find((v) => v.id === selectedId) ?? null;

  const summary =
    weekVisits.length === 0
      ? 'No visits scheduled this week.'
      : `${confirmed} confirmed ${confirmed === 1 ? 'visit' : 'visits'} and ${pending} awaiting confirmation.`;

  const openSchedule = (date = todayKey, time = '') => setSchedule({ open: true, date, time });
  const closeSchedule = () => setSchedule((s) => ({ ...s, open: false }));

  const onSaved = (visit) => {
    closeSchedule();
    setWeekStart(startOfWeek(fromKey(visit.date)));
    setFlash(`Visit with ${visit.buyerName} scheduled for ${longDay(fromKey(visit.date))} at ${visit.time}.`);
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-7 sm:px-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-600">Site visits</p>
          <h2 className="mt-1.5 text-[28px] font-bold leading-tight tracking-tight text-slate-900">
            {formatRange(weekStart)}
          </h2>
          <p className="mt-1 text-sm text-slate-500" aria-live="polite">
            {summary}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setWeekStart(addDays(weekStart, -7))} className={iconBtn} aria-label="Previous week">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setWeekStart(startOfWeek(new Date()))}
            className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Today
          </button>
          <button type="button" onClick={() => setWeekStart(addDays(weekStart, 7))} className={iconBtn} aria-label="Next week">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => openSchedule()}
            className="ml-2 inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-500 px-5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
          >
            <Plus className="h-4 w-4" /> Schedule visit
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
          <button type="button" onClick={() => setFlash(null)} className="rounded p-1 hover:bg-emerald-100" aria-label="Dismiss message">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-card">
        <table className="w-full min-w-[900px] table-fixed border-collapse">
          <caption className="sr-only">Site visits for {formatRange(weekStart)}</caption>
          <thead>
            <tr>
              <th scope="col" className="w-16 bg-white">
                <span className="sr-only">Time</span>
              </th>
              {days.map((d, i) => {
                const isToday = keys[i] === todayKey;
                return (
                  <th
                    key={keys[i]}
                    scope="col"
                    aria-current={isToday ? 'date' : undefined}
                    className={`h-10 border-l border-slate-200 text-xs font-semibold ${
                      isToday ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
                    }`}
                  >
                    {dayHeader(d)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot) => (
              <tr key={slot}>
                <th scope="row" className="border-t border-slate-200 px-2 pt-2.5 text-left align-top text-[11px] font-normal text-slate-400">
                  {slot}
                </th>
                {days.map((d, i) => {
                  const key = keys[i];
                  const inSlot = weekVisits.filter((v) => v.date === key && v.time === slot);
                  return (
                    <td key={key} className="h-[90px] border-l border-t border-slate-200 p-1.5 align-top">
                      {inSlot.length > 0 ? (
                        inSlot.map((v) => <VisitCard key={v.id} visit={v} onOpen={setSelectedId} />)
                      ) : (
                        <button
                          type="button"
                          onClick={() => openSchedule(key, slot)}
                          aria-label={`Schedule a visit on ${dayHeader(d)} at ${slot}`}
                          className="h-full w-full rounded-md text-emerald-600 opacity-0 hover:bg-emerald-50/70 hover:opacity-100 focus-visible:opacity-100"
                        >
                          <Plus className="mx-auto h-4 w-4" />
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ScheduleVisitModal open={schedule.open} initial={schedule} onClose={closeSchedule} onSaved={onSaved} />
      <VisitDetailsModal
        visit={selected}
        onClose={() => setSelectedId(null)}
        onConfirm={() => {
          updateVisit(selected.id, { status: 'confirmed' });
          setFlash(`Visit with ${selected.buyerName} confirmed.`);
          setSelectedId(null);
        }}
        onCancelVisit={() => {
          removeVisit(selected.id);
          setFlash(`Visit with ${selected.buyerName} cancelled.`);
          setSelectedId(null);
        }}
      />
    </div>
  );
}
