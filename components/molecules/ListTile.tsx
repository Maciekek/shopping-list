'use client';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/atoms/Dropdown-menu';

import { useEffect, useRef, useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/atoms/Dialog';
import { Input } from '@/components/atoms/Input';
import { useFormState } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { SubmitFormButton } from '@/components/molecules/SubmitFormButton';
import { MoreHorizontalIcon } from '@/components/atoms/Icons';
import { Button } from '@/components/atoms/Button';
import { UserList } from '@/models';
import { User } from 'next-auth';
import { isUndefined } from 'lodash';
import { Separator } from '@/components/atoms/Separator';

import { Switch } from '@/components/atoms/Switch';
import { Label } from '@/components/atoms/Label';
import {
  deleteList,
  revokeAccessToList,
  shareList,
  makeListPublic,
  makeListProtected,
  changePublicListRole
} from '@/actions/lists';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/atoms/Select';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/atoms/Skeleton';

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
  const [isPending, startTransition] = useTransition();

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
      <div className="p-2 pr-4 bg-white rounded-lg border">
        <div className="flex justify-between items-center min-h-[60px] ">
          <Link
            prefetch={true}
            href={`/lists/${list.id}`}
            className={'flex-1 pl-4 pt-4'}
          >
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
              {status === 'owner' && (
                <DropdownMenuItem onClick={() => deleteList(list.id)}>
                  Delete
                </DropdownMenuItem>
              )}

              {status === 'shared' && (
                <DropdownMenuItem onClick={() => revokeAccess(user.id)}>
                  Reject share
                </DropdownMenuItem>
              )}
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
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Share with friend</DialogTitle>
            </DialogHeader>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div>
                <div>
                  <div className="bg-white p-26">
                    <div>
                      <div className=" items-center">
                        <form ref={shareFormRef} action={formAction}>
                          <div className="space-y-2 gap-2 my-3">
                            <Label htmlFor="email">Email</Label>
                            <div
                              className={'flex justify-between flex-1 gap-2'}
                            >
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

                    <div>
                      {sharedWith.length > 0 && (
                        <>
                          <div className={'space-y-2 gap-2 my-3'}>
                            <Label>Shared with:</Label>
                          </div>
                          <div className="flex flex-col bg-gray-100 p-2 rounded">
                            {sharedWith.map((sharedWithUser: any) => {
                              return (
                                <div
                                  className={'px-2 py-2 flex justify-between'}
                                  key={sharedWithUser.userId}
                                >
                                  <div className="flex  w-full bg-gray-100 p-2 rounded">
                                    <div
                                      className={'flex items-center'}
                                      style={{
                                        flex: '1 1 100%',
                                        minWidth: '0px'
                                      }}
                                    >
                                      <div className={'truncate'}>
                                        {sharedWithUser.user.email}
                                      </div>
                                    </div>

                                    <div
                                      className={
                                        'flex items-center font-light w-[100px]'
                                      }
                                    >
                                      <Select
                                        value={'WRITE'}
                                        disabled={true}
                                        // onValueChange={(role: 'READ' | 'WRITE') => {
                                        //   changePublicListRole(list.id, role);
                                        // }}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a fruit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            {/*<SelectItem value="READ">Viewer</SelectItem>*/}
                                            <SelectItem value="WRITE">
                                              Editor
                                            </SelectItem>
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
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
                                  </div>
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

              {status === 'owner' && (
                <>
                  <Separator />

                  <div className="flex items-center space-x-2">
                    <Label
                      htmlFor="public-list"
                      className={'flex justify-between w-full'}
                    >
                      <div>
                        <div>Public list</div>
                        <div className={'font-light leading-6'}>
                          Your list can be available for anyone with the link
                        </div>
                      </div>

                      <Switch
                        disabled={isPending}
                        checked={!!list.share?.token}
                        onCheckedChange={() => {
                          startTransition(() => {
                            if (list.share?.token) {
                              makeListProtected(list.id);
                            } else {
                              makeListPublic(list.id, 'READ');
                            }
                          });
                        }}
                        id="public-list"
                      />
                    </Label>
                  </div>

                  <div>
                    {isPending && (
                      <>
                        <Skeleton className=" mt-4 h-8 w-[50px]" />
                        <Skeleton className=" mt-2 h-8 w-[250px]" />
                        <Skeleton className=" mt-8 h-8 w-[50px]" />
                        <Skeleton className=" mt-2 h-8 w-[250px]" />
                      </>
                    )}
                  </div>

                  {list.share?.token && !isPending && (
                    <div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.05 }}
                      >
                        <div className="space-y-2 gap-2 my-3">
                          <Label htmlFor={'share-link-url'}>Role</Label>
                          <div>
                            {isPending && (
                              <Skeleton className=" mt-4 h-8 w-[250px]" />
                            )}
                          </div>

                          <Select
                            value={list.share.type.toUpperCase()}
                            onValueChange={(role: 'READ' | 'WRITE') => {
                              changePublicListRole(list.id, role);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="READ">Viewer</SelectItem>
                                <SelectItem value="WRITE">Editor</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2 gap-2 my-3">
                          <Label htmlFor={'share-link-url'}>Share URL</Label>
                          <div>
                            {isPending && (
                              <Skeleton className=" mt-4 h-8 w-[250px]" />
                            )}
                          </div>

                          <Input
                            aria-invalid="false"
                            readOnly={true}
                            value={`${window.location.href}sharedList/${list.share.token}`}
                            required={true}
                            id={'share-link-url'}
                          />
                          {/*<Button className="ml-auto w-8 h-8" size="icon">*/}
                          {/*  <span className="sr-only">Settings</span>*/}
                          {/*</Button>*/}
                        </div>
                      </motion.div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
