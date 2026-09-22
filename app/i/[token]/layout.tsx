import type { Metadata } from 'next';

// Invite links are secret; keep them out of search engines.
export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

export default function InviteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
