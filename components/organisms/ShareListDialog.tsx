'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { Check, Copy, Globe, Link2, Mail, Share2, Trash2, X } from 'lucide-react';
import { useFormState } from 'react-dom';
import { useLocale, useTranslations } from 'next-intl';
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
import { Badge } from '@/components/atoms/Badge';
import { Switch } from '@/components/atoms/Switch';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/atoms/Select';
import { SubmitFormButton } from '@/components/molecules/SubmitFormButton';
import { QrCode } from '@/components/atoms/QrCode';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ListWithUsersAndShare } from '@/models';
import {
  changePublicListRole,
  createInviteLink,
  makeListProtected,
  makeListPublic,
  revokeAccessToList,
  revokeInvite,
  shareList
} from '@/actions/lists';

type Mode = 'email' | 'link' | 'public';

/**
 * Sharing controls for one list in three modes: by e-mail (members and
 * pending invites), by invite link (QR, share sheet) and a public link.
 * Non-owners only see the members and can leave the list.
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
  const t = useTranslations('ListTile');
  const tErrors = useTranslations('Errors');
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const isOwner = user.id === list.ownerId;
  const owner = list.users.find((u) => u.userId === list.ownerId)?.user;
  const members = list.users.filter((u) => u.userId !== list.ownerId);
  const emailInvites = list.invites.filter((i) => i.email);
  const linkInvites = list.invites.filter((i) => !i.email);

  const [mode, setMode] = useState<Mode>('link');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  // System share sheet exists on phones; on desktop it would only duplicate Copy.
  const [canShare, setCanShare] = useState(false);
  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  const [shareFormState, formAction] = useFormState(shareList, {
    email: '',
    listId: list.id
  });
  const shareFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isUndefined(shareFormState?.success) && !shareFormState?.success) {
      toast({ title: tErrors(shareFormState.error) });
    }
    if (shareFormState?.success) {
      toast({
        title: shareFormState.invited ? t('invitedToast') : t('sharedToast')
      });
      shareFormRef.current?.reset();
    }
  }, [toast, shareFormState, t, tErrors]);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const publicUrl = list.share ? `${origin}/sharedList/${list.share.token}` : '';
  const inviteUrl = (token: string) => `${origin}/i/${token}`;
  const locale = useLocale();
  const shortDate = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      toast({ title: t('copyFailed'), variant: 'destructive' });
    }
  };

  const shareUrl = async (url: string) => {
    try {
      await navigator.share({
        title: list.name,
        text: t('inviteShareText', { listName: list.name }),
        url
      });
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        toast({ title: t('copyFailed'), variant: 'destructive' });
      }
    }
  };

  const run = (action: () => Promise<unknown>) => {
    startTransition(async () => {
      const res = (await action()) as { hasError?: boolean; message?: string } | undefined;
      if (res?.hasError && res.message) {
        toast({ title: tErrors(res.message as any) });
      }
    });
  };

  if (!open) return null;

  const modes: { key: Mode; label: string; icon: typeof Mail }[] = [
    { key: 'link', label: t('tabLink'), icon: Link2 },
    { key: 'email', label: t('tabEmail'), icon: Mail },
    { key: 'public', label: t('tabPublic'), icon: Globe }
  ];

  const CopyButton = ({ text, id }: { text: string; id: string }) => (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="flex-none"
      onClick={() => copyText(text, id)}
      aria-label={t('copyUrl')}
      title={t('copyUrl')}
    >
      {copiedKey === id ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );

  const RemoveButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-7 w-7 text-gray-400 hover:text-red-600"
      disabled={isPending}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <X className="h-4 w-4" />
    </Button>
  );

  const membersSection = (
    <section className="space-y-2">
      <Label>{t('membersTitle')}</Label>
      <ul className="divide-y rounded-lg border bg-white text-sm">
        <li className="flex items-center justify-between gap-2 px-3 py-2">
          <span className="min-w-0 truncate">
            {owner?.email}
            {isOwner && <span className="text-gray-400"> · {t('you')}</span>}
          </span>
          <Badge variant="secondary">{t('ownerBadge')}</Badge>
        </li>
        {members.map((m) => (
          <li key={m.userId} className="flex items-center justify-between gap-2 px-3 py-2">
            <span className="min-w-0 truncate">
              {m.user.email}
              {m.userId === user.id && <span className="text-gray-400"> · {t('you')}</span>}
            </span>
            <div className="flex flex-none items-center gap-1">
              <Badge variant="outline">{t('editor')}</Badge>
              {(isOwner || m.userId === user.id) && (
                <RemoveButton
                  label={m.userId === user.id ? t('rejectShare') : t('removeMember')}
                  onClick={() => run(() => revokeAccessToList(m.userId, list.id))}
                />
              )}
            </div>
          </li>
        ))}
        {emailInvites.map((invite) => (
          <li key={invite.id} className="flex items-center justify-between gap-2 px-3 py-2">
            <span className="min-w-0 truncate text-gray-600">{invite.email}</span>
            <div className="flex flex-none items-center gap-1">
              <Badge variant="outline" className="text-gray-500" title={t('pendingInvitesHint')}>
                {t('invitedBadge')}
              </Badge>
              {isOwner && (
                <RemoveButton
                  label={t('revokeInviteLink')}
                  onClick={() => run(() => revokeInvite(invite.id, list.id))}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
      {emailInvites.length > 0 && (
        <p className="text-xs text-gray-500">{t('pendingInvitesHint')}</p>
      )}
    </section>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{t('shareListTitle')}</DialogTitle>
        </DialogHeader>

        {!isOwner ? (
          membersSection
        ) : (
          <div className="space-y-4">
            <div role="tablist" className="grid grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1">
              {modes.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  role="tab"
                  type="button"
                  aria-selected={mode === key}
                  onClick={() => setMode(key)}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors',
                    mode === key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>

            {mode === 'email' && (
              <div className="space-y-4">
                <form ref={shareFormRef} action={formAction} className="space-y-2">
                  <Label htmlFor="share-email">{t('email')}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="share-email"
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder={t('emailPlaceholder')}
                    />
                    <input type="hidden" name="listId" value={list.id} />
                    <SubmitFormButton />
                  </div>
                  <p className="text-xs text-gray-500">{t('emailHint')}</p>
                </form>
                {membersSection}
              </div>
            )}

            {mode === 'link' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{t('inviteLinkHint')}</p>

                {linkInvites.length === 0 ? (
                  <Button
                    type="button"
                    className="w-full"
                    disabled={isPending}
                    onClick={() => run(() => createInviteLink(list.id))}
                  >
                    <Link2 className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t('createInviteLink')}
                  </Button>
                ) : (
                  <>
                    {linkInvites.map((invite) => {
                      const url = inviteUrl(invite.token);
                      return (
                        <div key={invite.id} className="rounded-lg border bg-white p-3">
                          <div className="flex items-start gap-3">
                            <QrCode
                              value={url}
                              size={112}
                              className="flex-none rounded border bg-white p-1"
                            />
                            <div className="flex min-w-0 flex-1 flex-col self-stretch gap-2">
                              <div className="flex gap-2">
                                <Input
                                  readOnly
                                  value={url}
                                  className="text-xs"
                                  onFocus={(e) => e.currentTarget.select()}
                                />
                                <CopyButton text={url} id={invite.id} />
                              </div>
                              <div className="mt-auto flex items-end justify-between gap-2">
                                <p className="text-xs text-gray-500">
                                  {t('inviteExpires', {
                                    date: shortDate.format(new Date(invite.expiresAt))
                                  })}
                                  <br />
                                  {t('inviteUses', { count: invite.uses })}
                                </p>
                                <div className="flex flex-none gap-1">
                                  {canShare && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => shareUrl(url)}
                                      aria-label={t('shareInvite')}
                                      title={t('shareInvite')}
                                    >
                                      <Share2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-red-600"
                                    disabled={isPending}
                                    aria-label={t('revokeInviteLink')}
                                    title={t('revokeInviteLink')}
                                    onClick={() => run(() => revokeInvite(invite.id, list.id))}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => run(() => createInviteLink(list.id))}
                    >
                      <Link2 className="mr-2 h-4 w-4" aria-hidden="true" />
                      {t('anotherInviteLink')}
                    </Button>
                  </>
                )}
              </div>
            )}

            {mode === 'public' && (
              <div className="space-y-4">
                <Label
                  htmlFor="public-list"
                  className="flex w-full items-center justify-between gap-4 rounded-lg border bg-white p-3"
                >
                  <div>
                    <div>{t('publicList')}</div>
                    <div className="text-sm font-light leading-6 text-gray-600">
                      {t('publicListHint')}
                    </div>
                  </div>
                  <Switch
                    id="public-list"
                    disabled={isPending}
                    checked={!!list.share?.token}
                    onCheckedChange={() =>
                      run(() =>
                        list.share?.token ? makeListProtected(list.id) : makeListPublic(list.id)
                      )
                    }
                  />
                </Label>

                {list.share?.token && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="share-role">{t('role')}</Label>
                      <Select
                        value={list.share.type.toUpperCase()}
                        onValueChange={(role: 'READ' | 'WRITE') =>
                          run(() => changePublicListRole({ listId: list.id, accessType: role }))
                        }
                      >
                        <SelectTrigger id="share-role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="READ">{t('viewer')}</SelectItem>
                            <SelectItem value="WRITE">{t('editor')}</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        {list.share.type === 'WRITE' ? t('publicWriteHint') : t('publicReadHint')}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="share-link-url">{t('shareUrl')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="share-link-url"
                          readOnly
                          value={publicUrl}
                          className="text-xs"
                          onFocus={(e) => e.currentTarget.select()}
                        />
                        <CopyButton text={publicUrl} id="public" />
                        {canShare && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="flex-none"
                            onClick={() => shareUrl(publicUrl)}
                            aria-label={t('shareInvite')}
                            title={t('shareInvite')}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
