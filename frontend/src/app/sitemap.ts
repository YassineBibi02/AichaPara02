import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  
  // Get all active products
  const { data: products } = await supabase
    .from('products')
    .select('slug, created_at')
    .eq('is_active', true)
    .eq('is_draft', false)

  // Get all active categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, created_at')
    .eq('is_active', true)

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cosmo.com'

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  const productPages = products?.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(product.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  const categoryPages = categories?.map((category) => ({
    url: `${baseUrl}/store?category=${category.slug}`,
    lastModified: new Date(category.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || []

  return [...staticPages, ...productPages, ...categoryPages]
}