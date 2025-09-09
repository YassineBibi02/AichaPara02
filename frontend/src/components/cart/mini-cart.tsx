'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCart, removeFromCart, getCartTotal } from '@/lib/cart'
import { CartItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { X, Minus, Plus } from 'lucide-react'

interface MiniCartProps {
  onClose: () => void
}

export function MiniCart({ onClose }: MiniCartProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [totals, setTotals] = useState({ subtotal: 0, shipping: 0, total: 0 })

  useEffect(() => {
    const updateCart = () => {
      const currentCart = getCart()
      setCart(currentCart)
      setTotals(getCartTotal())
    }

    updateCart()
    window.addEventListener('cartUpdated', updateCart)
    return () => window.removeEventListener('cartUpdated', updateCart)
  }, [])

  const handleRemoveItem = (productId: string, variation1?: string, variation2?: string) => {
    removeFromCart(productId, variation1, variation2)
  }

  if (cart.length === 0) {
    return (
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border p-6 z-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Shopping Cart</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link href="/store" onClick={onClose}>
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Shopping Cart</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {cart.map((item) => (
          <div key={`${item.productId}-${item.variation1}-${item.variation2}`} className="p-4 border-b">
            <div className="flex items-start space-x-3">
              {item.imageUrl && (
                <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </h4>
                {(item.variation1 || item.variation2) && (
                  <p className="text-xs text-gray-500">
                    {[item.variation1, item.variation2].filter(Boolean).join(' • ')}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium">
                      {item.discountPrice ? (
                        <>
                          <span className="text-pink-600">{item.discountPrice.toFixed(2)} DT</span>
                          <span className="text-gray-400 line-through ml-1 text-xs">
                            {item.price.toFixed(2)} DT
                          </span>
                        </>
                      ) : (
                        <span>{item.price.toFixed(2)} DT</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">Qty: {item.qty}</span>
                    <button
                      onClick={() => handleRemoveItem(item.productId, item.variation1, item.variation2)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{totals.subtotal.toFixed(2)} DT</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{totals.shipping === 0 ? 'Free' : `${totals.shipping.toFixed(2)} DT`}</span>
          </div>
          <div className="flex justify-between font-semibold text-base border-t pt-2">
            <span>Total:</span>
            <span>{totals.total.toFixed(2)} DT</span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Link href="/cart" onClick={onClose}>
            <Button variant="outline" className="w-full">
              View Cart
            </Button>
          </Link>
          <Link href="/checkout" onClick={onClose}>
            <Button className="w-full">
              Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}