'use server';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { deleteList } from '@/app/api/list';
import DropdownAction from '@/components/ui/forms/DropdownAction';

export default async function SimpleTile({
  text,
  href = '',
  id
}: {
  text: string;
  href: string;
  id: number;
}) {

  return (
    <div>
      <div className="p-2 pr-4 w-72 bg-white rounded-lg border shadow-md">
        <div className="flex justify-between items-center ">
          <Link href={href} className={'flex-1 p-4'}>
            <h5 className="text-xl font-bold leading-none text-gray-900">
              {text}
            </h5>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <a className="text-gray-400 hover:text-gray-500" href="#">
                <MoreHorizontalIcon className="w-5 h-5" />
              </a>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownAction id={id}/>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}


function MoreHorizontalIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  )
}
