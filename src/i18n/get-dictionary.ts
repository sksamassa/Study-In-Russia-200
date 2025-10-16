import 'server-only';
import type { Locale } from './i18n-config';

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () => import('./dictionaries/en.json').then(module => module.default),
  fr: () => import('./dictionaries/fr.json').then(module => module.default),
  ar: () => import('./dictionaries/ar.json').then(module => module.default),
  es: () => import('./dictionaries/es.json').then(module => module.default),
  pt: () => import('./dictionaries/pt.json').then(module => module.default),
  zh: () => import('./dictionaries/zh.json').then(module => module.default),
  tr: () => import('./dictionaries/tr.json').then(module => module.default),
  hi: () => import('./dictionaries/hi.json').then(module => module.default),
  af: () => import('./dictionaries/af.json').then(module => module.default),
};

export const getDictionary = async (locale: Locale) => {
  const loader = dictionaries[locale] || dictionaries.en;
  return loader();
};
