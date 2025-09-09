'use client'

import Link from 'next/link'
import { ProductFilters } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface StorePaginationProps {
  currentPage: number
  totalPages: number
  filters: ProductFilters
}

export function StorePagination({ currentPage, totalPages, filters }: StorePaginationProps) {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    
    if (filters.search) params.set('search', filters.search)
    if (filters.category) params.set('category', filters.category)
    if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString())
    if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString())
    if (filters.inStock) params.set('inStock', 'true')
    if (filters.onSale) params.set('onSale', 'true')
    if (filters.sortBy && filters.sortBy !== 'newest') params.set('sortBy', filters.sortBy)
    if (page > 1) params.set('page', page.toString())
    
    return `/store?${params.toString()}`
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous Button */}
      {currentPage > 1 && (
        <Link href={buildUrl(currentPage - 1)}>
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
        </Link>
      )}

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <Link href={buildUrl(page as number)}>
                <Button
                  variant={currentPage === page ? 'primary' : 'outline'}
                  size="sm"
                  className="min-w-[40px]"
                >
                  {page}
                </Button>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Next Button */}
      {currentPage < totalPages && (
        <Link href={buildUrl(currentPage + 1)}>
          <Button variant="outline" size="sm">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  )
}