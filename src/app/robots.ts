import { MetadataRoute } from 'next'

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/student/'],
    },
    sitemap: 'https://mpitisre.edu.in/sitemap.xml',
  }
}
