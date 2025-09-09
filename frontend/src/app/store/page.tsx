import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ProductFilters, Product, Category } from '@/lib/types'
import { ProductCard } from '@/components/products/product-card'
import { StoreFilters } from '@/components/store/store-filters'
import { StorePagination } from '@/components/store/store-pagination'

interface StorePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function StorePage({ searchParams }: StorePageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // Parse search parameters
  const filters: ProductFilters = {
    search: typeof params.search === 'string' ? params.search : undefined,
    category: typeof params.category === 'string' ? params.category : undefined,
    minPrice: typeof params.minPrice === 'string' ? parseFloat(params.minPrice) : undefined,
    maxPrice: typeof params.maxPrice === 'string' ? parseFloat(params.maxPrice) : undefined,
    inStock: params.inStock === 'true',
    onSale: params.onSale === 'true',
    sortBy: typeof params.sortBy === 'string' ? params.sortBy as any : 'newest',
    page: typeof params.page === 'string' ? parseInt(params.page) : 1,
    limit: 12,
  }

  // Fetch categories for filters
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name')

  // Build query
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(name, slug)
    `, { count: 'exact' })
    .eq('is_active', true)
    .eq('is_draft', false)

  // Apply filters
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters.category) {
    const category = categories?.find(c => c.slug === filters.category)
    if (category) {
      query = query.eq('category_id', category.id)
    }
  }

  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice)
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice)
  }

  if (filters.inStock) {
    query = query.eq('is_stock', true).gt('stock', 0)
  }

  if (filters.onSale) {
    query = query.eq('is_discount', true)
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'rating':
      query = query.order('rating', { ascending: false })
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
      break
  }

  // Apply pagination
  const from = ((filters.page || 1) - 1) * (filters.limit || 12)
  const to = from + (filters.limit || 12) - 1
  query = query.range(from, to)

  const { data: products, count } = await query

  const totalPages = Math.ceil((count || 0) / (filters.limit || 12))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop</h1>
        <p className="text-gray-600">
          {count ? `Showing ${products?.length || 0} of ${count} products` : 'Loading...'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Suspense fallback={<div>Loading filters...</div>}>
            <StoreFilters 
              categories={categories as Category[] || []} 
              currentFilters={filters}
            />
          </Suspense>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {products && products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product as Product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <StorePagination
                  currentPage={filters.page || 1}
                  totalPages={totalPages}
                  filters={filters}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No products found</p>
              <p className="text-gray-400">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}