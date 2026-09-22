'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { Check, Copy } from 'lucide-react';
import { useFormState } from 'react-dom';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Session } from 'next-auth';
import { isUndefined } from 'lodash';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/atoms/Dialog';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Button } from '@/components/atoms/Button';
import { Switch } from '@/components/atoms/Switch';
import { Separator } from '@/components/atoms/Separator';
import { Skeleton } from '@/components/atoms/Skeleton';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/atoms/Select';
import { SubmitFormButton } from '@/components/molecules/SubmitFormButton';
import { useToast } from '@/hooks/use-toast';
import { ListWithUsersAndShare } from '@/models';
import {
  changePublicListRole,
  makeListProtected,
  makeListPublic,
  revokeAccessToList,
  shareList
} from '@/actions/lists';

/**
 * Sharing controls for one list: invite by e-mail, list of members, public
 * link toggle with role. Used from the list tile menu and from the list page.
 */
export function ShareListDialog({
  list,
  user,
  open,
  onOpenChange
}: {
  list: ListWithUsersAndShare;
  user: Session['user'];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const ownerEmail =
    list.users.filter((u) => u.userId === list.ownerId)[0]?.user.email || '';
  const sharedWith = list.users.filter((u) => u.userId !== list.ownerId);
  const status = user.id === list.ownerId ? 'owner' : 'shared';
  const [isPending, startTransition] = useTransition();

  const [shareFormState, formAction] = useFormState(shareList, {
    email: '',
    listId: list.id
  });
  const shareFormRef = useRef<HTMLFormElement>(null);

  const { toast } = useToast();
  const t = useTranslations('ListTile');
  const [copied, setCopied] = useState(false);

  const shareUrl = list.share
    ? `${window.location.origin}/sharedList/${list.share.token}`
    : '';

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: t('copyFailed'), variant: 'destructive' });
    }
  };
  const tErrors = useTranslations('Errors');

  useEffect(() => {
    if (!isUndefined(shareFormState?.success) && !shareFormState?.success) {
      toast({
        title: tErrors(shareFormState.error)
      });
    }

    if (shareFormState?.success) {
      toast({
        title: t('sharedToast')
      });
      shareFormRef.current?.reset();
    }
  }, [toast, shareFormState, t, tErrors]);

  const revokeAccess = (userId: string) => {
    return revokeAccessToList(userId, list.id);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('shareTitle')}</DialogTitle>
        </DialogHeader>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div>
            <div>
              <div className="bg-white p-26">
                <div>
                  <div className=" items-center">
                    <form ref={shareFormRef} action={formAction}>
                      <div className="space-y-2 gap-2 my-3">
                        <Label htmlFor="email">{t('email')}</Label>
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
                      {t('listOwner')}
                    </h3>
                    <div className="flex flex-col bg-gray-100 p-2 rounded">
                      {ownerEmail}
                    </div>
                  </div>
                )}

                <div>
                  {sharedWith.length > 0 && (
                    <>
                      <div className={'space-y-2 gap-2 my-3'}>
                        <Label>{t('sharedWith')}</Label>
                      </div>
                      <div className="flex flex-col bg-gray-100 p-2 rounded">
                        {sharedWith.map((sharedWithUser) => {
                          return (
                            <div
                              className={'flex justify-between'}
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
                                  >
                                    <SelectTrigger>
                                      <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectItem value="WRITE">
                                          {t('editor')}
                                        </SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>
                                {status === 'owner' && (
                                  <Button
                                    className="text-gray-500"
                                    variant="ghost"
                                    onClick={() => {
                                      revokeAccess(sharedWithUser.userId);
                                    }}
                                  >
                                    ✕
                                  </Button>
                                )}
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
                    <div>{t('publicList')}</div>
                    <div className={'font-light leading-6'}>
                      {t('publicListHint')}
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
                          makeListPublic(list.id);
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
                      <Label htmlFor={'share-role'}>{t('role')}</Label>
                      <div>
                        {isPending && (
                          <Skeleton className=" mt-4 h-8 w-[250px]" />
                        )}
                      </div>

                      <Select
                        value={list.share.type.toUpperCase()}
                        onValueChange={async (role: 'READ' | 'WRITE') => {
                          const res = await changePublicListRole({
                            listId: list.id,
                            accessType: role
                          });
                          if (res && 'hasError' in res && res.hasError) {
                            toast({ title: tErrors(res.message as any) });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="READ">{t('viewer')}</SelectItem>
                            <SelectItem value="WRITE">{t('editor')}</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 gap-2 my-3">
                      <Label htmlFor={'share-link-url'}>{t('shareUrl')}</Label>
                      <div>
                        {isPending && (
                          <Skeleton className=" mt-4 h-8 w-[250px]" />
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Input
                          aria-invalid="false"
                          readOnly={true}
                          value={shareUrl}
                          onFocus={(e) => e.currentTarget.select()}
                          id={'share-link-url'}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="flex-none"
                          onClick={copyShareUrl}
                          aria-label={t('copyUrl')}
                          title={t('copyUrl')}
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
