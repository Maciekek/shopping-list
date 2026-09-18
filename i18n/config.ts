export const locales = ['pl', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pl';
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/**
 * Polish by default. English only when the browser lists English before
 * Polish in Accept-Language. Any other language falls back to Polish.
 */
export function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return defaultLocale;

  const ranked = header
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith('q='));
      return {
        lang: tag.toLowerCase().split('-')[0],
        q: q ? Number(q.slice(2)) : 1,
        index
      };
    })
    .filter((entry) => entry.lang && !Number.isNaN(entry.q))
    .sort((a, b) => b.q - a.q || a.index - b.index);

  const first = ranked.find((entry) => isLocale(entry.lang));
  return first ? (first.lang as Locale) : defaultLocale;
}
