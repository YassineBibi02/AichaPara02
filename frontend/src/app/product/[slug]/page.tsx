import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Product, Review } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ProductReviews } from '@/components/products/product-reviews'
import { AddToCartButton } from '@/components/products/add-to-cart-button'
import { Star, Truck, Shield, RotateCcw } from 'lucide-react'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name, slug)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .eq('is_draft', false)
    .single()

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  const price = product.is_discount && product.discount_price 
    ? product.discount_price 
    : product.price

  return {
    title: `${product.name} - Cosmo`,
    description: product.description || `Buy ${product.name} at the best price. Premium cosmetics and beauty products.`,
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name} at the best price`,
      images: product.image_url ? [product.image_url] : [],
      type: 'product',
    },
    other: {
      'product:price:amount': price.toString(),
      'product:price:currency': 'TND',
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch product with category
  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name, slug)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .eq('is_draft', false)
    .single()

  if (!product) {
    notFound()
  }

  // Fetch reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      *,
      user:profiles(first_name, last_name)
    `)
    .eq('product_id', product.id)
    .order('created_at', { ascending: false })

  // Fetch related products
  const { data: relatedProducts } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name, slug)
    `)
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .eq('is_active', true)
    .eq('is_draft', false)
    .limit(4)

  const displayPrice = product.is_discount && product.discount_price 
    ? product.discount_price 
    : product.price

  const isOutOfStock = !product.is_stock || product.stock <= 0

  // JSON-LD structured data
  const jsonLd = {
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
      price: displayPrice,
      priceCurrency: 'TND',
      availability: isOutOfStock 
        ? 'https://schema.org/OutOfStock' 
        : 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Cosmo'
      }
    },
    aggregateRating: product.review_count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.review_count
    } : undefined
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-gray-700">Home</a>
          <span>/</span>
          <a href="/store" className="hover:text-gray-700">Shop</a>
          {product.category && (
            <>
              <span>/</span>
              <a href={`/store?category=${product.category.slug}`} className="hover:text-gray-700">
                {product.category.name}
              </a>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
              
              {/* Discount Badge */}
              {product.is_discount && product.discount_price && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded">
                  {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating.toFixed(1)} ({product.review_count} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {displayPrice.toFixed(2)} DT
                </span>
                {product.is_discount && product.discount_price && (
                  <span className="text-xl text-gray-500 line-through">
                    {product.price.toFixed(2)} DT
                  </span>
                )}
              </div>
            </div>

            {/* Variations */}
            {(product.variation1 || product.variation2) && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">Specifications</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variation1 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                      {product.variation1}
                    </span>
                  )}
                  {product.variation2 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                      {product.variation2}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} available)`}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Add to Cart */}
            <div className="space-y-4">
              <AddToCartButton product={product as Product} disabled={isOutOfStock} />
              
              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Truck className="h-6 w-6 text-pink-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Free shipping over 100 DT</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 text-pink-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Authentic products</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 text-pink-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Easy returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews 
          productId={product.id} 
          reviews={reviews as Review[] || []} 
        />

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="group">
                  <a href={`/product/${relatedProduct.slug}`}>
                    <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                      {relatedProduct.image_url ? (
                        <Image
                          src={relatedProduct.image_url}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{relatedProduct.name}</h3>
                    <p className="text-pink-600 font-semibold">
                      {(relatedProduct.is_discount && relatedProduct.discount_price 
                        ? relatedProduct.discount_price 
                        : relatedProduct.price
                      ).toFixed(2)} DT
                    </p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}