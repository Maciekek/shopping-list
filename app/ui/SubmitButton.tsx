import { Button } from './Button';
import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type={'submit'}>
      {pending ? 'Submitting...' : 'Submit'}
    </Button>
  );
}
