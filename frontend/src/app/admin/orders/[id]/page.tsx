'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { UniversalForm, FormField } from '@/components/ui/organisms/UniversalForm'
import { Button } from '@/components/ui/atoms/Button'
import { ArrowLeft } from 'lucide-react'
import { Order } from '@/lib/types'

export default function OrderViewPage() {
  const router = useRouter()
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  const fetchOrder = async () => {
    try {
      // Mock data - replace with actual API call
      const mockOrder: Order = {
        id: params.id as string,
        user_id: 'user1',
        is_guest: false,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '+216 12 345 678',
        address_line1: '123 Main St',
        address_line2: 'Apt 4B',
        company: 'Tech Corp',
        postal_code: '1000',
        city: 'Tunis',
        cart: [
          {
            productId: '1',
            name: 'Luminance Brightening Cream',
            price: 104.99,
            discountPrice: 45.50,
            qty: 2,
            variation1: '50ml',
            variation2: 'Day Cream',
            imageUrl: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg'
          }
        ],
        payment_method: 'cash_on_delivery',
        status: 'PENDING',
        subtotal: 91.00,
        shipping_fee: 8.00,
        total: 99.00,
        created_at: new Date().toISOString()
      }
      setOrder(mockOrder)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (data: Record<string, any>, changes: Record<string, any>) => {
    setSaving(true)
    try {
      // Mock API call - replace with actual implementation
      console.log('Saving order:', data, changes)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setOrder(prev => prev ? { ...prev, ...data } : null)
      setMode('view')
    } catch (error) {
      console.error('Error saving order:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !order) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const fields: FormField[] = [
    {
      key: 'id',
      label: 'Order ID',
      type: 'readonly',
      value: `#${order.id.slice(-8)}`
    },
    {
      key: 'customer_name',
      label: 'Customer Name',
      type: 'readonly',
      value: `${order.first_name} ${order.last_name}`
    },
    {
      key: 'email',
      label: 'Email',
      type: 'readonly',
      value: order.email
    },
    {
      key: 'phone',
      label: 'Phone',
      type: 'readonly',
      value: order.phone
    },
    {
      key: 'address',
      label: 'Shipping Address',
      type: 'readonly',
      value: `${order.address_line1}${order.address_line2 ? ', ' + order.address_line2 : ''}, ${order.city} ${order.postal_code}`
    },
    {
      key: 'payment_method',
      label: 'Payment Method',
      type: 'readonly',
      value: order.payment_method || 'Cash on Delivery'
    },
    {
      key: 'subtotal',
      label: 'Subtotal',
      type: 'readonly',
      value: `${order.subtotal.toFixed(2)} DT`
    },
    {
      key: 'shipping_fee',
      label: 'Shipping Fee',
      type: 'readonly',
      value: `${order.shipping_fee.toFixed(2)} DT`
    },
    {
      key: 'total',
      label: 'Total',
      type: 'readonly',
      value: `${order.total.toFixed(2)} DT`
    },
    {
      key: 'status',
      label: 'Order Status',
      type: 'select',
      value: order.status,
      options: [
        { value: 'PENDING', label: 'Pending' },
        { value: 'PAID', label: 'Paid' },
        { value: 'FULFILLED', label: 'Fulfilled' },
        { value: 'CANCELED', label: 'Canceled' },
        { value: 'REFUNDED', label: 'Refunded' }
      ],
      required: true,
      confirmationRequired: true
    },
    {
      key: 'created_at',
      label: 'Order Date',
      type: 'readonly',
      value: new Date(order.created_at).toLocaleDateString()
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>

      <UniversalForm
        title={`Order #${order.id.slice(-8)}`}
        fields={fields}
        mode={mode}
        loading={saving}
        onModeChange={setMode}
        onSave={handleSave}
        showImagePreview={false}
      />

      {/* Order Items */}
      <div className="mt-8 bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
        <div className="space-y-4">
          {order.cart.map((item, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              {item.imageUrl && (
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                {(item.variation1 || item.variation2) && (
                  <p className="text-sm text-gray-500">
                    {[item.variation1, item.variation2].filter(Boolean).join(' • ')}
                  </p>
                )}
                <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {item.discountPrice ? (
                    <>
                      <span className="text-pink-600">{item.discountPrice.toFixed(2)} DT</span>
                      <div className="text-sm text-gray-400 line-through">
                        {item.price.toFixed(2)} DT
                      </div>
                    </>
                  ) : (
                    <span>{item.price.toFixed(2)} DT</span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Total: {((item.discountPrice || item.price) * item.qty).toFixed(2)} DT
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}