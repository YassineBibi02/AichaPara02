'use client'

import { useState } from 'react'
import { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { addToCart } from '@/lib/cart'
import { ShoppingCart, Check } from 'lucide-react'

interface AddToCartButtonProps {
  product: Product
  disabled?: boolean
  quantity?: number
}

export function AddToCartButton({ product, disabled = false, quantity = 1 }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = async () => {
    if (disabled) return

    setIsAdding(true)
    
    try {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.is_discount ? product.discount_price : undefined,
        variation1: product.variation1,
        variation2: product.variation2,
        imageUrl: product.image_url,
        qty: quantity,
      })

      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  if (justAdded) {
    return (
      <Button disabled className="w-full" size="lg">
        <Check className="h-5 w-5 mr-2" />
        Added to Cart
      </Button>
    )
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className="w-full"
      size="lg"
      loading={isAdding}
    >
      <ShoppingCart className="h-5 w-5 mr-2" />
      {disabled ? 'Out of Stock' : 'Add to Cart'}
    </Button>
  )
}