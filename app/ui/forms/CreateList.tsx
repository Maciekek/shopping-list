'use client'
import { SubmitButton } from '../SubmitButton';
import { useFormState } from 'react-dom'
import { createListAction } from '../../lists/actions/createList';
import { Input } from '@/components/ui/input';


const initialState = {
  name: '',
}

export function CreateList() {
  const [state, formAction] = useFormState(createListAction, initialState)

  return (
    <form action={formAction} className={'w-1/3 pt-20 mx-auto'}>
      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor=":r1l:-form-item"
        >
          List name
        </label>

        <Input aria-invalid="false"
          name="name"
          required={true}
        />

        <p aria-live="polite" className={'text-red-700 '}>
          {state.errors?.name.map((error: string) => error)}
        </p>

        <SubmitButton/>
      </div>
    </form>
  )
}
