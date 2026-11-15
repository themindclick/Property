import { ArrowLeft, Building2, Home, ImagePlus, Sparkles, TreePine, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PropertyCard from '../components/inventory/PropertyCard.jsx';
import TextField from '../components/ui/TextField.jsx';
import { useProperties } from '../context/PropertiesContext.jsx';
import { PROPERTY_TYPES } from '../data/properties.js';
import { extractFromText } from '../lib/extractListing.js';

const typeIcons = { land: TreePine, apartment: Building2, house: Home };

const emptyValues = {
  type: 'house',
  title: '',
  location: '',
  priceM: '',
  beds: '',
  baths: '',
  areaSqft: '',
  perches: '',
  description: '',
  image: null,
};

const toValues = (p) => ({
  type: p.type,
  title: p.title,
  location: p.location,
  priceM: String(p.priceM ?? ''),
  beds: String(p.beds ?? ''),
  baths: String(p.baths ?? ''),
  areaSqft: String(p.areaSqft ?? ''),
  perches: String(p.perches ?? ''),
  description: p.description ?? '',
  image: p.image ?? null,
});

const isWholeNumber = (v) => v !== '' && Number.isInteger(Number(v)) && Number(v) >= 0;

function validate(v) {
  const e = {};
  if (!v.title.trim()) e.title = 'Enter a property name.';
  if (!v.location.trim()) e.location = 'Enter the area or city.';
  if (!(Number(v.priceM) > 0)) e.priceM = 'Enter the asking price in LKR millions, for example 28.5.';
  if (v.type === 'land') {
    if (!(Number(v.perches) > 0)) e.perches = 'Enter the land size in perches.';
  } else {
    if (!isWholeNumber(v.beds)) e.beds = 'Enter the number of bedrooms.';
    if (!isWholeNumber(v.baths)) e.baths = 'Enter the number of bathrooms.';
    if (!(Number(v.areaSqft) > 0)) e.areaSqft = 'Enter the floor area in sq ft.';
  }
  return e;
}

const toProperty = (v) => {
  const isLand = v.type === 'land';
  return {
    type: v.type,
    title: v.title.trim(),
    location: v.location.trim(),
    priceM: Number(v.priceM),
    beds: isLand ? null : Number(v.beds),
    baths: isLand ? null : Number(v.baths),
    areaSqft: isLand ? null : Number(v.areaSqft),
    perches: isLand ? Number(v.perches) : null,
    description: v.description.trim(),
    image: v.image,
  };
};

function Section({ title, description, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      {description && <p className="mt-0.5 text-xs text-slate-400">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function PropertyFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { properties, addProperty, updateProperty } = useProperties();
  const existing = isEdit ? properties.find((p) => p.id === id) : null;

  const [values, setValues] = useState(existing ? toValues(existing) : emptyValues);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState('');
  const [pasted, setPasted] = useState('');
  const [fillMessage, setFillMessage] = useState('');
  const formRef = useRef(null);
  const blobRef = useRef(null);
  const savedRef = useRef(false);

  // Free the temporary photo URL if the form is abandoned (a saved photo must stay alive).
  useEffect(
    () => () => {
      if (blobRef.current && !savedRef.current) URL.revokeObjectURL(blobRef.current);
    },
    [],
  );

  const set = (name) => (e) => {
    const { value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return setImageError('Please choose an image file (JPG, PNG or WebP).');
    if (file.size > 5 * 1024 * 1024) return setImageError('The image must be smaller than 5 MB.');
    setImageError('');
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    blobRef.current = URL.createObjectURL(file);
    setValues((v) => ({ ...v, image: blobRef.current }));
  };

  const removeImage = () => {
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    blobRef.current = null;
    setValues((v) => ({ ...v, image: null }));
  };

  const quickFill = () => {
    const { found, count } = extractFromText(pasted);
    if (count === 0) {
      setFillMessage('I could not find any property details in that text. Try including price, size and location.');
      return;
    }
    setValues((v) => ({ ...v, ...found }));
    setErrors({});
    setFillMessage(`Filled ${count} ${count === 1 ? 'field' : 'fields'}. Please review them before saving.`);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }

    const data = toProperty(values);
    savedRef.current = true;
    if (isEdit) {
      updateProperty(id, data);
      navigate('/inventory', { state: { flash: `“${data.title}” was updated.`, highlightId: id } });
    } else {
      const created = addProperty(data);
      navigate('/inventory', {
        state: { flash: `“${created.title}” was added to your inventory.`, highlightId: created.id },
      });
    }
  };

  const preview = useMemo(() => {
    const t = toProperty(values);
    return {
      ...t,
      id: 'preview',
      title: t.title || 'Property name',
      location: t.location || 'Location',
      aiMatch: existing?.aiMatch ?? null,
    };
  }, [values, existing]);

  if (isEdit && !existing) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Property not found</h2>
        <p className="mt-2 text-sm text-slate-500">It may have been deleted.</p>
        <Link
          to="/inventory"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-emerald-500 px-4 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          Back to inventory
        </Link>
      </div>
    );
  }

  const isLand = values.type === 'land';

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-7 sm:px-7">
      <Link
        to="/inventory"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to inventory
      </Link>

      <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-600">
        {isEdit ? `Edit property · ${id}` : 'Add property'}
      </p>
      <h2 className="mt-1.5 text-[28px] font-bold leading-tight tracking-tight text-slate-900">
        {isEdit ? 'Update listing details' : 'Tell us about the property'}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        These details power your website listing, the AI chat assistant and buyer matching.
      </p>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_320px]">
        <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
          {!isEdit && (
            <Section
              title="Quick fill from text"
              description="Paste a WhatsApp message or listing blurb and we will pull out the basics."
            >
              <label htmlFor="pasted" className="sr-only">
                Listing text
              </label>
              <textarea
                id="pasted"
                rows={3}
                value={pasted}
                onChange={(e) => setPasted(e.target.value)}
                placeholder="e.g. 12.5 perch land in Kottawa, LKR 12.8M, close to the highway"
                className="block w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
              />
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={quickFill}
                  disabled={!pasted.trim()}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-sidebar px-4 text-xs font-semibold text-white hover:bg-sidebar-active disabled:opacity-40"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Extract details
                </button>
                {fillMessage && (
                  <p role="status" className="text-xs text-slate-500">
                    {fillMessage}
                  </p>
                )}
              </div>
            </Section>
          )}

          <Section title="Basic details">
            <fieldset>
              <legend className="mb-1.5 text-xs font-semibold text-slate-700">Property type</legend>
              <div className="grid grid-cols-3 gap-2">
                {PROPERTY_TYPES.map((t) => {
                  const Icon = typeIcons[t.value];
                  return (
                    <label key={t.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value={t.value}
                        checked={values.type === t.value}
                        onChange={set('type')}
                        className="peer sr-only"
                      />
                      <span className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald-500">
                        <Icon className="h-4 w-4" /> {t.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextField
                id="title"
                label="Property name"
                required
                value={values.title}
                onChange={set('title')}
                error={errors.title}
                placeholder="e.g. Green Lane Villa"
                className="sm:col-span-2"
              />
              <TextField
                id="location"
                label="Location"
                required
                value={values.location}
                onChange={set('location')}
                error={errors.location}
                placeholder="e.g. Nugegoda"
              />
              <TextField
                id="priceM"
                label="Asking price (LKR millions)"
                required
                type="number"
                inputMode="decimal"
                min="0"
                step="0.1"
                value={values.priceM}
                onChange={set('priceM')}
                error={errors.priceM}
                hint="Enter 28.5 for LKR 28.5M."
                placeholder="28.5"
              />
            </div>
          </Section>

          <Section title={isLand ? 'Land size' : 'Specifications'}>
            {isLand ? (
              <TextField
                id="perches"
                label="Land size (perches)"
                required
                type="number"
                inputMode="decimal"
                min="0"
                step="0.1"
                value={values.perches}
                onChange={set('perches')}
                error={errors.perches}
                placeholder="12.5"
                className="sm:max-w-xs"
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-3">
                <TextField
                  id="beds"
                  label="Bedrooms"
                  required
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  value={values.beds}
                  onChange={set('beds')}
                  error={errors.beds}
                  placeholder="3"
                />
                <TextField
                  id="baths"
                  label="Bathrooms"
                  required
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  value={values.baths}
                  onChange={set('baths')}
                  error={errors.baths}
                  placeholder="2"
                />
                <TextField
                  id="areaSqft"
                  label="Floor area (sq ft)"
                  required
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={values.areaSqft}
                  onChange={set('areaSqft')}
                  error={errors.areaSqft}
                  placeholder="1420"
                />
              </div>
            )}
          </Section>

          <Section title="Cover photo" description="JPG, PNG or WebP, up to 5 MB.">
            {values.image ? (
              <div className="flex items-center gap-4">
                <img src={values.image} alt="Selected cover" className="h-24 w-36 rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <X className="h-3.5 w-3.5" /> Remove photo
                </button>
              </div>
            ) : (
              <label
                htmlFor="photo"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 hover:border-emerald-400 hover:bg-emerald-50/40 focus-within:border-emerald-500"
              >
                <ImagePlus className="h-6 w-6 text-slate-400" />
                <span className="font-semibold text-slate-700">Choose a photo</span>
                <input id="photo" type="file" accept="image/*" onChange={onFile} className="sr-only" />
              </label>
            )}
            {imageError && (
              <p role="alert" className="mt-2 text-xs font-medium text-red-600">
                {imageError}
              </p>
            )}
          </Section>

          <Section
            title="Description"
            description="Optional. Key selling points the AI assistant can mention to buyers."
          >
            <label htmlFor="description" className="sr-only">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={values.description}
              onChange={set('description')}
              placeholder="Clear deeds, 300m from the main road, quiet neighbourhood…"
              className="block w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
            />
          </Section>

          <div className="flex items-center justify-end gap-3">
            <Link
              to="/inventory"
              className="inline-flex h-11 items-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex h-11 items-center rounded-lg bg-emerald-500 px-6 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
            >
              {isEdit ? 'Save changes' : 'Add property'}
            </button>
          </div>
        </form>

        <aside className="lg:sticky lg:top-6 lg:self-start" aria-label="Listing preview">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">Live preview</p>
          <PropertyCard property={preview} readOnly />
          <p className="mt-3 text-xs text-slate-400">
            The AI match score appears after the property is saved and matched against your buyers.
          </p>
        </aside>
      </div>
    </div>
  );
}
