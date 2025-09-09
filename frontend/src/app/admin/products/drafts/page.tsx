'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/ui/organisms/DataTable'
import { Badge } from '@/components/ui/atoms/Badge'
import { Button } from '@/components/ui/atoms/Button'
import { ConfirmDialog } from '@/components/ui/organisms/ConfirmDialog'
import { Eye, Edit, Trash2, CheckCircle } from 'lucide-react'
import { Product } from '@/lib/types'
import { apiClient } from '@/lib/api'

export default function DraftProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; productId: string; productName: string }>({
    isOpen: false,
    productId: '',
    productName: ''
  })
  const [deleting, setDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})

  const columns = [
    { key: 'image', label: 'Image' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'price', label: 'Price', sortable: true, align: 'right' as const },
    { key: 'created_at', label: 'Created', sortable: true },
    { key: 'actions', label: 'Actions', align: 'right' as const },
  ]

  const filters = [
    {
      key: 'search',
      label: 'Search',
      type: 'text' as const,
      placeholder: 'Search draft products...'
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select' as const,
      options: [
        { value: 'skincare', label: 'Skincare' },
        { value: 'makeup', label: 'Makeup' },
        { value: 'fragrance', label: 'Fragrance' },
      ]
    }
  ]

  const bulkActions = [
    {
      key: 'publish',
      label: 'Publish',
      icon: CheckCircle,
      variant: 'default' as const,
      onClick: (selectedIds: string[]) => {
        console.log('Publish products:', selectedIds)
      }
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: Trash2,
      variant: 'destructive' as const,
      onClick: (selectedIds: string[]) => {
        console.log('Delete products:', selectedIds)
      }
    }
  ]

  useEffect(() => {
    fetchDraftProducts()
  }, [])

  const fetchDraftProducts = async () => {
    try {
      const data = await apiClient.get('/products/drafts')
      setProducts(data.data || [])
    } catch (error) {
      console.error('Error fetching draft products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await apiClient.delete(`/products/${deleteDialog.productId}`)
      setProducts(products.filter(p => p.id !== deleteDialog.productId))
      setDeleteDialog({ isOpen: false, productId: '', productName: '' })
    } catch (error) {
      console.error('Error deleting product:', error)
    } finally {
      setDeleting(false)
    }
  }

  const renderRow = (product: Product) => (
    <>
      <td className="px-4 py-4">
        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <div>
          <div className="font-medium">{product.name}</div>
          <div className="text-sm text-text-secondary">{product.slug}</div>
        </div>
      </td>
      <td className="px-4 py-4">
        <Badge variant="outline">Skincare</Badge>
      </td>
      <td className="px-4 py-4 text-right font-medium">
        {product.price.toFixed(2)} DT
      </td>
      <td className="px-4 py-4 text-sm text-gray-500">
        {new Date(product.created_at).toLocaleDateString()}
      </td>
      <td className="px-4 py-4 text-right">
        <div className="flex items-center gap-2 justify-end">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
            onClick={() => router.push(`/admin/products/${product.id}`)}
            onClick={() => router.push(`/admin/products/${product.id}?mode=edit`)}
          <Button variant="outline" size="sm">
            variant="outline" 
          </Button>
            onClick={() => setDeleteDialog({
              isOpen: true,
              productId: product.id,
              productName: product.name
            })}
          <Button variant="default" size="sm">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </>
  )

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Draft Products</h1>
        <p className="text-text-secondary">Manage products that are not yet published</p>
      </div>

      <DataTable
        data={products}
        columns={columns}
        loading={loading}
        currentPage={currentPage}
        totalPages={Math.ceil(products.length / pageSize)}
        pageSize={pageSize}
        totalItems={products.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={(column) => {
          if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
          } else {
            setSortColumn(column)
            setSortDirection('asc')
          }
        }}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={(key, value) => setFilterValues(prev => ({ ...prev, [key]: value }))}
        onFilterClear={() => setFilterValues({})}
        bulkActions={bulkActions}
        renderRow={renderRow}
        emptyMessage="No draft products found"
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, productId: '', productName: '' })}
        onConfirm={handleDelete}
        title="Delete Draft Product"
        message={`Are you sure you want to delete "${deleteDialog.productName}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}