import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aichapara.tn'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/account/', '/orders/', '/checkout/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}