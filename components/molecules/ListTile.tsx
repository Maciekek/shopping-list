'use client';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/atoms/Dropdown-menu';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/Dialog';
import { Input } from '@/components/atoms/Input';
import { useFormState } from 'react-dom';
import { deleteList, shareList } from '@/app/lists/actions/list';
import { useToast } from '@/hooks/use-toast';
import { SubmitFormButton } from '@/components/molecules/SubmitFormButton';

export default function ListTile({
  text,
  href = '',
  id
}: {
  text: string;
  href: string;
  id: number;
}) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareFormState, formAction] = useFormState(shareList, {
    email: '',
    listId: id
  });

  const { toast } = useToast();

  useEffect(() => {
    if (shareFormState === 'ok') {
      setIsShareModalOpen(false);
      toast({
        title: 'If email is ok then list is shared to that person!'
      });
    }
  }, [toast, shareFormState]);

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
              <DropdownMenuItem onClick={() => deleteList(id)}>
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setIsShareModalOpen(true);
                }}
              >
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isShareModalOpen && (
        <Dialog open={true} onOpenChange={setIsShareModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Share with friend</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <form action={formAction}>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Email
                    </label>

                    <Input aria-invalid="false" name="email" required={true} defaultValue={''} />

                    <Input
                      aria-invalid="false"
                      className={'hidden'}
                      name="listId"
                      value={'32'}
                      required={true}
                    />

                    <DialogFooter>
                      <div className={'mt-4'}>
                        <SubmitFormButton />
                      </div>
                    </DialogFooter>
                  </div>
                </form>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
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
  );
}
