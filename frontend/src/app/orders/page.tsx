'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { Order } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Package, Eye } from 'lucide-react'

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/me', {
        headers: {
          Authorization: `Bearer ${user?.id}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data)
    } catch (error) {
      setError('Failed to load orders')
      console.error('Orders fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'PAID':
        return 'bg-blue-100 text-blue-800'
      case 'FULFILLED':
        return 'bg-green-100 text-green-800'
      case 'CANCELED':
        return 'bg-red-100 text-red-800'
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
          <p className="text-gray-600 mb-8">You need to be signed in to view your orders.</p>
          <Button onClick={() => window.location.href = '/login'}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-8">
            When you place your first order, it will appear here.
          </p>
          <Link href="/store">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Order #{order.id.slice(-8)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Shipping Address</p>
                  <p className="text-sm text-gray-600">
                    {order.first_name} {order.last_name}<br />
                    {order.address_line1}<br />
                    {order.city}, {order.postal_code}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment Method</p>
                  <p className="text-sm text-gray-600">
                    {order.payment_method || 'Cash on Delivery'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Order Total</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {order.total.toFixed(2)} DT
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Items ({order.cart.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {order.cart.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-gray-50 rounded px-3 py-1">
                      <span className="text-sm text-gray-700">{item.name}</span>
                      <span className="text-xs text-gray-500">×{item.qty}</span>
                    </div>
                  ))}
                  {order.cart.length > 3 && (
                    <div className="flex items-center px-3 py-1 bg-gray-50 rounded">
                      <span className="text-sm text-gray-500">
                        +{order.cart.length - 3} more
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}