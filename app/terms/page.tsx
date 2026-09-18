import { getLocale, getTranslations } from 'next-intl/server';
import { LegalPage } from '@/components/legal/LegalPage';
import { TermsPl } from '@/components/legal/TermsPl';
import { TermsEn } from '@/components/legal/TermsEn';

export async function generateMetadata() {
  const t = await getTranslations('Meta');
  return {
    title: t('termsTitle'),
    description: t('termsDescription'),
    alternates: { canonical: '/terms' }
  };
}

export default async function TermsPage() {
  const locale = await getLocale();
  const t = await getTranslations();

  return (
    <LegalPage
      title={t('Meta.termsTitle')}
      updatedLabel={t('Legal.updated')}
      backLabel={t('Legal.back')}
    >
      {locale === 'en' ? <TermsEn /> : <TermsPl />}
    </LegalPage>
  );
}
