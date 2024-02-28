import { useFormStatus } from 'react-dom';
import { Button } from '@/components/atoms/Button';

export function SubmitFormButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type={'submit'}>
      {pending ? 'Submitting...' : 'Submit'}
    </Button>
  );
}
