import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shopylist',
    short_name: 'Shopylist',
    description: 'Shared shopping lists',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#454545',
    id: '/',
    scope: '/',
    lang: 'pl',
    categories: ['shopping', 'productivity'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }
    ]
  };
}
