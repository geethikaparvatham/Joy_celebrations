import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JOY Celebrations - Premium Private Theatre',
    short_name: 'JOY Celebrations',
    description: 'Vijayawada\'s premium private party theatre for birthdays, anniversaries, and surprise events.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#d4af37',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
