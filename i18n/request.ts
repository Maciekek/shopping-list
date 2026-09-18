import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import {
  LOCALE_COOKIE,
  isLocale,
  localeFromAcceptLanguage,
  type Locale
} from './config';

export default getRequestConfig(async () => {
  const cookieLocale = cookies().get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(cookieLocale)
    ? cookieLocale
    : localeFromAcceptLanguage(headers().get('accept-language'));

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
