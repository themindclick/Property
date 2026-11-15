import { Building2, Home, TreePine } from 'lucide-react';

const placeholders = {
  land: { icon: TreePine, bg: 'from-emerald-100 via-emerald-200 to-lime-300', fg: 'text-emerald-700' },
  apartment: { icon: Building2, bg: 'from-sky-100 via-sky-200 to-indigo-300', fg: 'text-indigo-700' },
  house: { icon: Home, bg: 'from-amber-100 via-amber-200 to-orange-300', fg: 'text-orange-700' },
};

// Shows the uploaded cover photo, or a type-based placeholder until one exists.
export default function PropertyImage({ property }) {
  if (property.image) {
    return (
      <img
        src={property.image}
        alt={`${property.title} cover photo`}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    );
  }
  const { icon: Icon, bg, fg } = placeholders[property.type] ?? placeholders.house;
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-linear-to-br ${bg} ${fg}`}
      role="img"
      aria-label={`${property.title} placeholder image`}
    >
      <Icon className="h-14 w-14 opacity-50" strokeWidth={1.25} />
    </div>
  );
}
