'use client'
import { Button } from '@/components/atoms/Button';
import { signIn } from 'next-auth/react';

export const LoginButton = () => {
  return (
    <Button className='w-full' onClick={() => signIn('google')}>Sign in with Google Account</Button>
  )
}
