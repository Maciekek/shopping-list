import { ShoppingBagIcon } from '@/components/atoms/Icons';
import { Button } from '@/components/atoms/Button';
import Link from 'next/link';

export const NoListsHero = () => {
  return (
    <div className="flex items-center justify-center w-full h-[300px]">
      <div className="flex flex-col items-center gap-2 text-center">
        <ShoppingBagIcon className="h-10 w-10" />
        <div className="space-y-2">
          <h3 className="text-lg font-bold tracking-tighter">
            No shopping list created
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You can start adding items to your list once you create one.
          </p>
        </div>

        <Link href={'/lists/create'} prefetch={true}>
          {' '}
          <Button className="mt-4">Create your first list! </Button>
        </Link>
      </div>
    </div>
  );
};
