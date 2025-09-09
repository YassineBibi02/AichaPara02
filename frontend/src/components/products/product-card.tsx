'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { addToCart } from '@/lib/cart'
import { Star, ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!product.is_stock || product.stock <= 0) return

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.is_discount ? product.discount_price : undefined,
      variation1: product.variation1,
      variation2: product.variation2,
      imageUrl: product.image_url,
    })

    // Show toast notification (you can implement a toast system)
    alert('Product added to cart!')
  }

  const displayPrice = product.is_discount && product.discount_price 
    ? product.discount_price 
    : product.price

  const isOutOfStock = !product.is_stock || product.stock <= 0

  return (
    <div className="group relative bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          
          {/* Discount Badge */}
          {product.is_discount && product.discount_price && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
              {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Variations */}
          {(product.variation1 || product.variation2) && (
            <p className="text-xs text-gray-500 mb-2">
              {[product.variation1, product.variation2].filter(Boolean).join(' • ')}
            </p>
          )}

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                ({product.review_count})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">
                {displayPrice.toFixed(2)} DT
              </span>
              {product.is_discount && product.discount_price && (
                <span className="text-sm text-gray-500 line-through">
                  {product.price.toFixed(2)} DT
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  )
}