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
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  };
}
