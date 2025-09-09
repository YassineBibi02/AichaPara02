'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { UniversalForm, FormField } from '@/components/ui/organisms/UniversalForm'
import { Button } from '@/components/ui/atoms/Button'
import { ArrowLeft } from 'lucide-react'
import { Product, Category } from '@/lib/types'

export default function ProductViewPage() {
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProduct()
    fetchCategories()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      // Mock data - replace with actual API call
      const mockProduct: Product = {
        id: params.id as string,
        name: 'Luminance Brightening Cream',
        slug: 'luminance-brightening-cream',
        description: 'A brightening day cream formulated with niacinamide and hyaluronic acid to even out skin tone and boost natural glow.',
        price: 104.99,
        discount_price: 45.50,
        is_discount: true,
        is_feature: true,
        is_active: true,
        is_draft: false,
        category_id: 'cat1',
        image_url: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg',
        stock: 25,
        is_stock: true,
        variation1: '50ml',
        variation2: 'Day Cream',
        rating: 4.5,
        review_count: 12,
        created_at: new Date().toISOString()
      }
      setProduct(mockProduct)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      // Mock data - replace with actual API call
      const mockCategories: Category[] = [
        { id: 'cat1', name: 'Skincare', slug: 'skincare', is_active: true, created_at: new Date().toISOString() },
        { id: 'cat2', name: 'Makeup', slug: 'makeup', is_active: true, created_at: new Date().toISOString() },
        { id: 'cat3', name: 'Fragrance', slug: 'fragrance', is_active: true, created_at: new Date().toISOString() },
      ]
      setCategories(mockCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSave = async (data: Record<string, any>, changes: Record<string, any>) => {
    setSaving(true)
    try {
      // Mock API call - replace with actual implementation
      console.log('Saving product:', data, changes)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProduct(prev => prev ? { ...prev, ...data } : null)
      setMode('view')
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !product) {
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
      key: 'name',
      label: 'Product Name',
      type: 'text',
      value: product.name,
      required: true,
      validation: (value) => value.length < 3 ? 'Name must be at least 3 characters' : null
    },
    {
      key: 'slug',
      label: 'Slug',
      type: 'text',
      value: product.slug,
      required: true
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      value: product.description
    },
    {
      key: 'price',
      label: 'Price (DT)',
      type: 'number',
      value: product.price,
      required: true
    },
    {
      key: 'discount_price',
      label: 'Discount Price (DT)',
      type: 'number',
      value: product.discount_price
    },
    {
      key: 'category_id',
      label: 'Category',
      type: 'select',
      value: product.category_id,
      options: categories.map(cat => ({ value: cat.id, label: cat.name }))
    },
    {
      key: 'image_url',
      label: 'Product Image',
      type: 'image',
      value: product.image_url
    },
    {
      key: 'stock',
      label: 'Stock Quantity',
      type: 'number',
      value: product.stock,
      required: true
    },
    {
      key: 'variation1',
      label: 'Variation 1',
      type: 'text',
      value: product.variation1
    },
    {
      key: 'variation2',
      label: 'Variation 2',
      type: 'text',
      value: product.variation2
    },
    {
      key: 'is_discount',
      label: 'On Discount',
      type: 'checkbox',
      value: product.is_discount
    },
    {
      key: 'is_feature',
      label: 'Featured Product',
      type: 'checkbox',
      value: product.is_feature
    },
    {
      key: 'is_active',
      label: 'Active',
      type: 'checkbox',
      value: product.is_active
    },
    {
      key: 'is_draft',
      label: 'Draft',
      type: 'checkbox',
      value: product.is_draft
    },
    {
      key: 'created_at',
      label: 'Created At',
      type: 'readonly',
      value: new Date(product.created_at).toLocaleDateString()
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
          Back to Products
        </Button>
      </div>

      <UniversalForm
        title={`Product: ${product.name}`}
        fields={fields}
        mode={mode}
        loading={saving}
        onModeChange={setMode}
        onSave={handleSave}
        showImagePreview={true}
      />
    </div>
  )
}