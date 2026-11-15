// Labelled input / textarea with hint + error wiring for screen readers.
export default function TextField({
  id,
  label,
  error,
  hint,
  required = false,
  as: Tag = 'input',
  className = '',
  ...props
}) {
  const describedBy =
    [hint && !error ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') ||
    undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-slate-700">
        {label}
        {required && (
          <span aria-hidden="true" className="text-red-500">
            {' '}*
          </span>
        )}
      </label>
      <Tag
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={`block w-full rounded-lg border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none ${
          Tag === 'textarea' ? 'py-2.5' : 'h-11'
        } ${error ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'}`}
        {...props}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[11px] text-slate-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
