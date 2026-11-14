import { Link } from 'react-router-dom';

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-7 sm:px-7">
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
