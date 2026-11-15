import { formatPrice, typeLabel } from '../data/properties.js';

// Template-based stand-in for POST /ai/copywriter. The shape of the result
// ({ en: { facebook, seo }, si: { facebook, seo } }) is what the real API should return.

const plural = (n, word) => `${n} ${word}${Number(n) === 1 ? '' : 's'}`;

const siTypeIndefinite = { land: 'ඉඩමක්', house: 'නිවසක්', apartment: 'අපාර්ට්මන්ට් එකක්' };

const en = {
  house: [
    (c) => `Find your next chapter at ${c.title}—premium living in ${c.loc}, now from ${c.price}. ${c.size}. Book your private viewing today.`,
    (c) => `${c.title} is waiting for you in ${c.loc}. ${c.size}, from ${c.price}. Message us to arrange a private viewing.`,
  ],
  apartment: [
    (c) => `Elevate your lifestyle at ${c.title}—apartment living in ${c.loc}, from ${c.price}. ${c.size}. Book your private viewing today.`,
    (c) => `Your new address in ${c.loc}: ${c.title}. ${c.size}, from ${c.price}. Message us to arrange a viewing.`,
  ],
  land: [
    (c) => `Secure your piece of ${c.loc}—${c.title}, ${c.size}, from ${c.price}. Message us to arrange a site visit today.`,
    (c) => `Looking to build in ${c.loc}? ${c.title} offers ${c.size} from ${c.price}. Contact us for a site visit.`,
  ],
};

const si = {
  house: [
    (c) => `${c.loc} හි ඔබේ සිහින නිවස — ${c.title}. ${c.price} සිට. ${c.sizeSi}. අදම පෞද්ගලික නැරඹීමක් වෙන්කරවා ගන්න.`,
    (c) => `${c.title} — ${c.loc} හි ඔබ බලා සිටි නිවස. ${c.sizeSi}, ${c.price} සිට. නැරඹීමට අප අමතන්න.`,
  ],
  apartment: [
    (c) => `${c.loc} හි සුවපහසු අපාර්ට්මන්ට් එකක් — ${c.title}. ${c.price} සිට. ${c.sizeSi}. අදම නැරඹීමක් වෙන්කරවා ගන්න.`,
    (c) => `${c.title} — ${c.loc} හි නවීන අපාර්ට්මන්ට් එකක්. ${c.sizeSi}, ${c.price} සිට. වැඩි විස්තර සඳහා අපට පණිවිඩයක් එවන්න.`,
  ],
  land: [
    (c) => `${c.loc} හි ඉඩමක් — ${c.title}, ${c.sizeSi}. ${c.price} සිට. අදම අපට පණිවිඩයක් එවා නැරඹීමක් වෙන්කරවා ගන්න.`,
    (c) => `${c.loc} හි ඔබේ ඉඩම සොයමින් සිටිනවාද? ${c.title} — ${c.sizeSi}, ${c.price} සිට. නැරඹීමට අප අමතන්න.`,
  ],
};

export function generateCopy(p, variant = 0) {
  const v = variant % 2;
  const isLand = p.type === 'land';
  const c = {
    title: p.title,
    loc: p.location,
    price: formatPrice(p.priceM),
    size: isLand
      ? `${p.perches} perch`
      : `${plural(p.beds, 'bedroom')}, ${plural(p.baths, 'bathroom')}, ${Number(p.areaSqft).toLocaleString('en-US')} sq ft`,
    sizeSi: isLand ? `පර්චස් ${p.perches}` : `නිදන කාමර ${p.beds}ක්, නාන කාමර ${p.baths}ක්`,
  };

  const type = typeLabel(p.type);
  return {
    en: {
      facebook: en[p.type][v](c),
      seo: `${p.title} | ${type} for sale in ${p.location}\n${p.title} is a ${p.type} for sale in ${p.location}, Sri Lanka. ${c.size}. Priced from ${c.price}. Contact us to arrange a viewing.`,
    },
    si: {
      facebook: si[p.type][v](c),
      seo: `${p.title} | ${p.location} හි විකිණීමට ඇති ${siTypeIndefinite[p.type]}\n${p.location}, ශ්‍රී ලංකාවේ විකිණීමට ඇති ${siTypeIndefinite[p.type]} — ${p.title}. ${c.sizeSi}. මිල ${c.price} සිට. නැරඹීමක් සඳහා අප අමතන්න.`,
    },
  };
}
