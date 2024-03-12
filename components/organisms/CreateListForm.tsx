'use client';
import { useFormState } from 'react-dom';
import { createListAction } from '@/app/lists/actions/list';
import { SubmitFormButton } from '@/components/molecules/SubmitFormButton';
import { Input } from '@/components/atoms/Input';

const initialState = {
  name: ''
};

export function CreateListForm() {
  const [state, formAction] = useFormState(createListAction, initialState);

  return (
    <form action={formAction} className={'px-4 pt-20 mx-auto max-w-md'}>
      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor=":r1l:-form-item"
        >
          List name
        </label>

        <Input
          aria-invalid="false"
          name="name"
          placeholder={'Shopping list for the party'}
          required={true}
        />

        <p aria-live="polite" className={'text-red-700 '}>
          {state.errors?.name.map((error: string) => error)}
        </p>

        <SubmitFormButton />
      </div>
    </form>
  );
}
