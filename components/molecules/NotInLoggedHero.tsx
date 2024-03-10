import { LoginButton } from '@/components/atoms/LoginButton';
import { Separator } from '@/components/atoms/Separator';

export const NotInLoggedHero = () => {
  return (
    <main className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className='grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]'>
          <div className='flex flex-col justify-center space-y-4'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                Shopping List App
              </h1>
              <p
                className='max-w-[500px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400'>
                Discover the ultimate shopping list experience. Our app
                provides you with the tools to organize your shopping needs
                efficiently, ensuring you never miss an item on your list.
              </p>
            </div>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <div className='w-full max-w-sm space-y-4 pt-6'>
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
      <Separator />
    </main>
  )
}
