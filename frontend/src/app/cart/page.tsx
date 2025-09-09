'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCart, updateCartItem, removeFromCart, getCartTotal, clearCart } from '@/lib/cart'
import { CartItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Minus, Plus, X, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [totals, setTotals] = useState({ subtotal: 0, shipping: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const updateCart = () => {
      const currentCart = getCart()
      setCart(currentCart)
      setTotals(getCartTotal())
      setLoading(false)
    }

    updateCart()
    window.addEventListener('cartUpdated', updateCart)
    return () => window.removeEventListener('cartUpdated', updateCart)
  }, [])

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      const item = cart.find(item => item.productId === productId)
      if (item) {
        removeFromCart(productId, item.variation1, item.variation2)
      }
    } else {
      updateCartItem(productId, { qty: newQty })
    }
  }

  const handleRemoveItem = (productId: string, variation1?: string, variation2?: string) => {
    removeFromCart(productId, variation1, variation2)
  }

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart()
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link href="/store">
            <Button size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <Button variant="outline" onClick={handleClearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.productId}-${item.variation1}-${item.variation2}`}
              className="bg-white border rounded-lg p-6"
            >
              <div className="flex items-start space-x-4">
                {item.imageUrl && (
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  {(item.variation1 || item.variation2) && (
                    <p className="text-sm text-gray-500 mb-2">
                      {[item.variation1, item.variation2].filter(Boolean).join(' • ')}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold">
                        {item.discountPrice ? (
                          <>
                            <span className="text-pink-600">{item.discountPrice.toFixed(2)} DT</span>
                            <span className="text-gray-400 line-through ml-2 text-sm">
                              {item.price.toFixed(2)} DT
                            </span>
                          </>
                        ) : (
                          <span>{item.price.toFixed(2)} DT</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.qty - 1)}
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 font-medium">{item.qty}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.qty + 1)}
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.productId, item.variation1, item.variation2)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{totals.subtotal.toFixed(2)} DT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">
                  {totals.shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `${totals.shipping.toFixed(2)} DT`
                  )}
                </span>
              </div>
              {totals.shipping === 0 && totals.subtotal < 100 && (
                <p className="text-xs text-gray-500">
                  Add {(100 - totals.subtotal).toFixed(2)} DT more for free shipping
                </p>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{totals.total.toFixed(2)} DT</span>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <Link href="/checkout">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/store">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}