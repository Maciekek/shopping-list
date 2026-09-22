import { useTranslations } from 'next-intl';
import {
  Users,
  CheckSquare,
  Sparkles,
  Link as LinkIcon,
  type LucideIcon
} from 'lucide-react';
import { LoginButton } from '@/components/atoms/LoginButton';
import { InstallAppButton } from '@/components/atoms/InstallAppButton';

function Feature({
  icon: Icon,
  title,
  text
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-gray-600">{text}</p>
    </div>
  );
}

function ListPreview({ title, items }: { title: string; items: string[] }) {
  const rows = items.map((name, i) => ({ name, done: i < 2 }));

  return (
    <div
      aria-hidden="true"
      className="mx-auto w-full max-w-sm rounded-2xl border bg-white p-4 shadow-xl shadow-slate-200"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold">{title}</span>
        <span className="flex -space-x-2">
          {['bg-amber-400', 'bg-emerald-400', 'bg-sky-400'].map((c) => (
            <span key={c} className={`h-6 w-6 rounded-full ring-2 ring-white ${c}`} />
          ))}
        </span>
      </div>
      <ul className="space-y-2">
        {rows.map((r) => (
          <li
            key={r.name}
            className="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm"
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded border ${
                r.done ? 'border-slate-900 bg-slate-900 text-white' : 'border-gray-300'
              }`}
            >
              {r.done && <CheckSquare className="h-3 w-3" strokeWidth={3} />}
            </span>
            <span className={r.done ? 'text-gray-400 line-through' : 'text-gray-800'}>
              {r.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const NotInLoggedHero = () => {
  const t = useTranslations('Landing');

  const features = [
    { icon: Users, title: t('feature1Title'), text: t('feature1Text') },
    { icon: CheckSquare, title: t('feature2Title'), text: t('feature2Text') },
    { icon: Sparkles, title: t('feature3Title'), text: t('feature3Text') },
    { icon: LinkIcon, title: t('feature4Title'), text: t('feature4Text') }
  ];

  return (
    <main className="w-full px-4 sm:px-6">
      <section className="grid items-center gap-10 py-12 md:py-20 lg:grid-cols-2">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t('tagline')}</h1>
          <p className="max-w-xl text-lg leading-8 text-gray-600">{t('lead')}</p>
          <div className="max-w-xs space-y-2">
            <LoginButton />
            <InstallAppButton className="w-full" />
          </div>
        </div>
        <ListPreview
          title={t('previewTitle')}
          items={t('previewItems').split(', ')}
        />
      </section>

      <section className="py-10">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">{t('featuresHeading')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Feature key={f.title} {...f} />
          ))}
        </div>
      </section>

      <section className="py-10">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">{t('howHeading')}</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {[t('step1'), t('step2'), t('step3')].map((step, i) => (
            <li key={step} className="flex gap-4 rounded-xl border bg-white p-5">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {i + 1}
              </span>
              <p className="text-sm leading-6 text-gray-700">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="my-10 rounded-2xl bg-slate-900 px-6 py-10 text-center text-white">
        <h2 className="text-2xl font-bold tracking-tight">{t('ctaHeading')}</h2>
        <p className="mt-2 text-slate-300">{t('ctaText')}</p>
        <div className="mx-auto mt-6 max-w-xs [&_button]:bg-white [&_button]:text-slate-900 [&_button:hover]:bg-slate-100">
          <LoginButton />
        </div>
      </section>
    </main>
  );
};
