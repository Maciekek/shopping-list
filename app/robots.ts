import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXTAUTH_URL || 'https://shopylist.pl';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/terms', '/privacy'],
      disallow: ['/lists/', '/sharedList/', '/api/']
    },
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
