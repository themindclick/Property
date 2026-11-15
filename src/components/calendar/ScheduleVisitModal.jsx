import { useState } from 'react';
import { useProperties } from '../../context/PropertiesContext.jsx';
import { useVisits } from '../../context/VisitsContext.jsx';
import { conversations } from '../../data/inbox.js';
import { TIME_SLOTS, VISIT_STATUS } from '../../data/visits.js';
import Modal from '../ui/Modal.jsx';
import TextField from '../ui/TextField.jsx';

function Form({ initial, onClose, onSaved }) {
  const { properties } = useProperties();
  const { visits, addVisit } = useVisits();
  const [values, setValues] = useState({
    buyerId: '',
    property: '',
    date: initial.date,
    time: initial.time,
    status: 'confirmed',
  });
  const [errors, setErrors] = useState({});

  const set = (name) => (e) => {
    const { value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, slot: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const found = {};
    if (!values.buyerId) found.buyerId = 'Choose a buyer.';
    if (!values.property) found.property = 'Choose a property.';
    if (!values.date) found.date = 'Pick a date.';
    if (!values.time) found.time = 'Pick a time.';
    if (!found.date && !found.time && visits.some((v) => v.date === values.date && v.time === values.time)) {
      found.time = 'That time slot is already booked. Choose another.';
    }
    if (Object.values(found).some(Boolean)) {
      setErrors(found);
      requestAnimationFrame(() => e.target.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }

    const buyer = conversations.find((c) => c.id === values.buyerId);
    const visit = addVisit({
      buyerId: buyer.id,
      buyerName: buyer.name,
      property: values.property,
      date: values.date,
      time: values.time,
      status: values.status,
      urgency: buyer.urgency,
    });
    onSaved(visit);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <TextField as="select" id="visit-buyer" label="Buyer" required value={values.buyerId} onChange={set('buyerId')} error={errors.buyerId}>
        <option value="">Select a buyer</option>
        {conversations.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </TextField>

      <TextField as="select" id="visit-property" label="Property" required value={values.property} onChange={set('property')} error={errors.property}>
        <option value="">Select a property</option>
        {properties.map((p) => (
          <option key={p.id} value={p.title}>{p.title} · {p.location}</option>
        ))}
      </TextField>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="visit-date" label="Date" required type="date" value={values.date} onChange={set('date')} error={errors.date} />
        <TextField as="select" id="visit-time" label="Time" required value={values.time} onChange={set('time')} error={errors.time}>
          <option value="">Select a time</option>
          {TIME_SLOTS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </TextField>
      </div>

      <TextField as="select" id="visit-status" label="Status" value={values.status} onChange={set('status')}>
        {Object.entries(VISIT_STATUS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </TextField>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="h-10 rounded-lg bg-emerald-500 px-5 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          Schedule visit
        </button>
      </div>
    </form>
  );
}

export default function ScheduleVisitModal({ open, initial, onClose, onSaved }) {
  return (
    <Modal open={open} onClose={onClose} title="Schedule a site visit">
      <Form initial={initial} onClose={onClose} onSaved={onSaved} />
    </Modal>
  );
}

