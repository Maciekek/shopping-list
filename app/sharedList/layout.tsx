import type { Metadata } from 'next';

// Shared lists are reachable only by secret token; keep them out of search engines.
export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

export default function SharedListLayout({ children }: { children: React.ReactNode }) {
  return children;
}
