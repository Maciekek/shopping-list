'use client';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/atoms/Dropdown-menu';

import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/atoms/Dialog';
import { Input } from '@/components/atoms/Input';
import { useFormState } from 'react-dom';
import {
  deleteList,
  revokeAccessToList,
  shareList
} from '@/app/lists/actions/list';
import { useToast } from '@/hooks/use-toast';
import { SubmitFormButton } from '@/components/molecules/SubmitFormButton';
import { MoreHorizontalIcon } from '@/components/atoms/Icons';
import { Button } from '@/components/atoms/Button';
import { UserList } from '@/models';
import { User } from 'next-auth';
import { isUndefined } from 'lodash';

export default function ListTile({
  list,
  user
}: {
  list: UserList;
  user: User;
}) {
  const ownerEmail =
    list.users.filter((user) => user.userId === list.ownerId)[0]?.user.email ||
    '';

  const sharedWith = list.users.filter((user) => user.userId !== list.ownerId);
  const status = user.id === list.ownerId ? 'owner' : 'shared';

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareFormState, formAction] = useFormState(shareList, {
    email: '',
    listId: list.id
  });
  const shareFormRef = useRef<HTMLFormElement>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (!isUndefined(shareFormState?.success) && !shareFormState?.success) {
      toast({
        title: shareFormState?.error
      });
    }

    if (shareFormState?.success) {
      toast({
        title: 'Shared with friend!'
      });
      shareFormRef.current?.reset();
    }
  }, [toast, shareFormState]);

  const revokeAccess = (userId: string) => {
    revokeAccessToList(userId, list.id);
  };

  return (
    <div>
      <div className="p-2 pr-4 bg-white rounded-lg border shadow-md">
        <div className="flex justify-between items-center min-h-[60px] ">
          <Link prefetch={true} href={`/lists/${list.id}`} className={'flex-1 pl-4 pt-4'}>
            <h5 className="text-xl font-bold leading-none text-gray-900">
              {list.name}
            </h5>
            <div
              className={
                'leading-6 pb-1 text-sm text-gray-500 dark:text-gray-400'
              }
            >
              {status === 'shared'
                ? `Owner: ${ownerEmail}`
                : 'You are the owner of this list'}
            </div>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <a className="text-gray-400 hover:text-gray-500" href="#">
                <MoreHorizontalIcon className="w-5 h-5" />
              </a>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => deleteList(list.id)}>
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
                <div className="bg-white p-26">
                  <div className="mb-4">
                    <div className=" items-center">
                      <form ref={shareFormRef} action={formAction}>
                        <div className="space-y-2 gap-2">
                          <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="email"
                          >
                            Email
                          </label>
                          <div className={'flex justify-between flex-1 gap-2'}>
                            <Input
                              aria-invalid="false"
                              name="email"
                              required={true}
                              defaultValue={''}
                            />

                            <Input
                              aria-invalid="false"
                              className={'hidden'}
                              name="listId"
                              readOnly={true}
                              value={list.id}
                              required={true}
                            />

                            <SubmitFormButton />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  {list.ownerId !== user.id && (
                    <div className={'pt-4'}>
                      <h3 className="text-sm font-semibold mb-2">
                        Owner of the list:
                      </h3>
                      <div className="flex flex-col items-c2enter j2ustify-between bg-gray-100 p-2 rounded">
                        {ownerEmail}
                      </div>
                    </div>
                  )}
                  <div className="pt-4">
                    {sharedWith.length > 0 && (
                      <>
                        <h3 className="text-sm font-semibold mb-2">
                          Shared with:
                        </h3>
                        <div className="flex flex-col items-c2enter j2ustify-between bg-gray-100 p-2 rounded">
                          {sharedWith.map((sharedWithUser) => {
                            return (
                              <div
                                className={'px-2 py-2 flex justify-between'}
                                key={sharedWithUser.userId}
                              >
                                <div className="flex items-center">
                                  <span>
                                    {sharedWithUser.user.email}{' '}
                                    <span className={'text-gray-500 '}>
                                      {sharedWithUser.user.id === user.id
                                        ? `(Me)`
                                        : null}
                                    </span>
                                  </span>
                                </div>

                                {/*{status === 'owner' && (*/}
                                <Button
                                  className="text-gray-500"
                                  variant="ghost"
                                  onClick={() => {
                                    revokeAccess(sharedWithUser.userId);
                                  }}
                                >
                                  ✕
                                </Button>
                                {/*)}*/}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
