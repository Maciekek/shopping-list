import Link from 'next/link';

export const SimpleTile = ({
  text,
  href = ''
}: {
  text: string;
  href: string;
}) => {
  return (
    <Link href={href}>
      <div className={'rounded-xl border bg-card text-card-foreground shadow'}>
        <div
          className={'p-6 flex flex-row items-center justify-between space-y-0'}
        >
          <h3 className={'tracking-tight text-sm font-medium'}>{text}</h3>
        </div>
      </div>
    </Link>
  );
};
