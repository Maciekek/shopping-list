import { getLocale, getTranslations } from 'next-intl/server';
import { LegalPage } from '@/components/legal/LegalPage';
import { PrivacyPl } from '@/components/legal/PrivacyPl';
import { PrivacyEn } from '@/components/legal/PrivacyEn';

export async function generateMetadata() {
  const t = await getTranslations('Meta');
  return { title: `${t('privacyTitle')} - Shopylist` };
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  const t = await getTranslations();

  return (
    <LegalPage
      title={t('Meta.privacyTitle')}
      updatedLabel={t('Legal.updated')}
      backLabel={t('Legal.back')}
    >
      {locale === 'en' ? <PrivacyEn /> : <PrivacyPl />}
    </LegalPage>
  );
}
