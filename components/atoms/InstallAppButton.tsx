'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/atoms/Button';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

/**
 * "Install app" button. Chrome/Edge/Android fire `beforeinstallprompt` when
 * the site qualifies as a PWA; the button only renders after that event and
 * hides again once installed. Safari has no such event, so iOS users go
 * through Share → Add to Home Screen and never see this.
 */
export function InstallAppButton({ className }: { className?: string }) {
  const t = useTranslations('Landing');
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setPromptEvent(null);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (!promptEvent) return null;

  const install = async () => {
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') setPromptEvent(null);
  };

  return (
    <Button variant="outline" className={className} onClick={install}>
      <Download className="mr-2 h-4 w-4" aria-hidden="true" />
      {t('installApp')}
    </Button>
  );
}
