'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { getCart, getCartTotal, clearCart } from '@/lib/cart'
import { CartItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShoppingBag } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])
  const [totals, setTotals] = useState({ subtotal: 0, shipping: 0, total: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    company: '',
    postalCode: '',
    city: '',
    paymentMethod: 'cash_on_delivery',
  })

  useEffect(() => {
    const currentCart = getCart()
    if (currentCart.length === 0) {
      router.push('/cart')
      return
    }
    
    setCart(currentCart)
    setTotals(getCartTotal())
  }, [router])

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
      }))
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const orderData = {
        userId: user?.id,
        isGuest: !user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        company: formData.company,
        postalCode: formData.postalCode,
        city: formData.city,
        cart: cart,
        paymentMethod: formData.paymentMethod,
        subtotal: totals.subtotal,
        shippingFee: totals.shipping,
        total: totals.total,
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user && { Authorization: `Bearer ${user.id}` }),
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const order = await response.json()
      clearCart()
      router.push(`/order-confirmation/${order.id}`)
    } catch (error) {
      setError('Failed to place order. Please try again.')
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products to proceed with checkout.</p>
          <Button onClick={() => router.push('/store')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <Input
                  label="Address Line 1"
                  name="addressLine1"
                  required
                  value={formData.addressLine1}
                  onChange={handleChange}
                />
                <Input
                  label="Address Line 2 (Optional)"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                />
                <Input
                  label="Company (Optional)"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Postal Code"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                  <Input
                    label="City"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={formData.paymentMethod === 'cash_on_delivery'}
                    onChange={handleChange}
                    className="text-pink-600 focus:ring-pink-500"
                  />
                  <span className="ml-2 text-gray-700">Cash on Delivery</span>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Place Order
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.variation1}-${item.variation2}`} className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h3>
                    {(item.variation1 || item.variation2) && (
                      <p className="text-xs text-gray-500">
                        {[item.variation1, item.variation2].filter(Boolean).join(' • ')}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {((item.discountPrice || item.price) * item.qty).toFixed(2)} DT
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 border-t pt-4">
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
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{totals.total.toFixed(2)} DT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}