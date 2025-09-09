'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Category, ProductFilters } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface StoreFiltersProps {
  categories: Category[]
  currentFilters: ProductFilters
}

export function StoreFilters({ categories, currentFilters }: StoreFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [localFilters, setLocalFilters] = useState({
    search: currentFilters.search || '',
    category: currentFilters.category || '',
    minPrice: currentFilters.minPrice?.toString() || '',
    maxPrice: currentFilters.maxPrice?.toString() || '',
    inStock: currentFilters.inStock || false,
    onSale: currentFilters.onSale || false,
    sortBy: currentFilters.sortBy || 'newest',
  })

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)
    
    // Clear page when applying new filters
    params.delete('page')
    
    // Apply filters
    if (localFilters.search) {
      params.set('search', localFilters.search)
    } else {
      params.delete('search')
    }
    
    if (localFilters.category) {
      params.set('category', localFilters.category)
    } else {
      params.delete('category')
    }
    
    if (localFilters.minPrice) {
      params.set('minPrice', localFilters.minPrice)
    } else {
      params.delete('minPrice')
    }
    
    if (localFilters.maxPrice) {
      params.set('maxPrice', localFilters.maxPrice)
    } else {
      params.delete('maxPrice')
    }
    
    if (localFilters.inStock) {
      params.set('inStock', 'true')
    } else {
      params.delete('inStock')
    }
    
    if (localFilters.onSale) {
      params.set('onSale', 'true')
    } else {
      params.delete('onSale')
    }
    
    if (localFilters.sortBy !== 'newest') {
      params.set('sortBy', localFilters.sortBy)
    } else {
      params.delete('sortBy')
    }
    
    router.push(`/store?${params.toString()}`)
  }

  const clearFilters = () => {
    setLocalFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      onSale: false,
      sortBy: 'newest',
    })
    router.push('/store')
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <Input
          type="text"
          placeholder="Search products..."
          value={localFilters.search}
          onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={localFilters.category}
          onChange={(e) => setLocalFilters({ ...localFilters, category: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range (DT)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={localFilters.minPrice}
            onChange={(e) => setLocalFilters({ ...localFilters, minPrice: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={localFilters.maxPrice}
            onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: e.target.value })}
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={localFilters.inStock}
            onChange={(e) => setLocalFilters({ ...localFilters, inStock: e.target.checked })}
            className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
          />
          <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={localFilters.onSale}
            onChange={(e) => setLocalFilters({ ...localFilters, onSale: e.target.checked })}
            className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
          />
          <span className="ml-2 text-sm text-gray-700">On Sale</span>
        </label>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={localFilters.sortBy}
          onChange={(e) => setLocalFilters({ ...localFilters, sortBy: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
        <Button onClick={clearFilters} variant="outline" className="w-full">
          Clear All
        </Button>
      </div>
    </div>
  )
}