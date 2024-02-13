'use server';

import { createListQuery } from '@/db/queries';
import { z } from 'zod';
import { auth } from '../../auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const schema = z.object({
  name: z.string().min(3).max(20)
});

export async function createListAction(previousState: any, formData: any) {
  const session = await auth();

  const validatedFields = schema.safeParse({
    name: formData.get('name')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const list = {
    name: formData.get('name') ? formData.get('name')! : '',
    items: []
  };

  await createListQuery(list);
  revalidatePath('/');
  redirect('/');
}
