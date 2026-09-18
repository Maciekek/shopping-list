'use client';
import { useFormState } from 'react-dom';

import { SubmitFormButton } from '@/components/molecules/SubmitFormButton';
import { Input } from '@/components/atoms/Input';
import { createList } from '@/actions/lists';
import { useTranslations } from 'next-intl';

const initialState = {
  name: ''
};

export function CreateListForm() {
  const [state, formAction] = useFormState(createList, initialState);
  const t = useTranslations('CreateList');
  const tErrors = useTranslations('Errors');

  return (
    <form action={formAction} className={'px-4 pt-20 mx-auto max-w-md'}>
      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor=":r1l:-form-item"
        >
          {t('nameLabel')}
        </label>

        <Input
          aria-invalid="false"
          name="name"
          placeholder={t('namePlaceholder')}
          required={true}
        />

        <p aria-live="polite" className={'text-red-700 '}>
          {state.error ? tErrors(state.error) : null}
        </p>

        <SubmitFormButton />
      </div>
    </form>
  );
}
