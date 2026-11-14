const styles = {
  hot: 'bg-red-50 text-red-600 border-red-200',
  warm: 'bg-amber-50 text-amber-600 border-amber-200',
  cold: 'bg-blue-50 text-blue-600 border-blue-200',
};

// Lead urgency from NLP intent analysis: HOT (red), WARM (amber), COLD (blue).
export default function LeadBadge({ level }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-bold uppercase leading-none tracking-wide ${styles[level]}`}
    >
      {level}
    </span>
  );
}
