import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/atoms/Button';

export function SubmitFormButton() {
  const { pending } = useFormStatus();
  const t = useTranslations('Form');

  return (
    <Button disabled={pending} type={'submit'}>
      {pending ? t('submitting') : t('submit')}
    </Button>
  );
}
