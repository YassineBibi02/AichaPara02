import { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  canonical?: string
  image?: string
  type?: 'website' | 'product' | 'article'
  price?: number
  currency?: string
}

export function generateSEO({
  title,
  description,
  canonical,
  image,
  type = 'website',
  price,
  currency = 'TND'
}: SEOProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cosmo.com'
  const fullTitle = title.includes('Cosmo') ? title : `${title} - Cosmo`
  
  const metadata: Metadata = {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      type,
      siteName: 'Cosmo',
      images: image ? [{ url: image, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: canonical || baseUrl,
    },
  }

  if (type === 'product' && price) {
    metadata.other = {
      'product:price:amount': price.toString(),
      'product:price:currency': currency,
    }
  }

  return metadata
}

export function generateProductJsonLd(product: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cosmo.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image_url,
    brand: {
      '@type': 'Brand',
      name: 'Cosmo'
    },
    offers: {
      '@type': 'Offer',
      price: product.is_discount && product.discount_price ? product.discount_price : product.price,
      priceCurrency: 'TND',
      availability: (!product.is_stock || product.stock <= 0) 
        ? 'https://schema.org/OutOfStock' 
        : 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Cosmo',
        url: baseUrl
      }
    },
    aggregateRating: product.review_count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.review_count
    } : undefined
  }
}