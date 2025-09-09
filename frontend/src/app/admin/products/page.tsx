'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/ui/organisms/DataTable'
import { Badge } from '@/components/ui/atoms/Badge'
import { Button } from '@/components/ui/atoms/Button'
import { ConfirmDialog } from '@/components/ui/organisms/ConfirmDialog'
import { Eye, Edit, Trash2, Plus } from 'lucide-react'
import { Product } from '@/lib/types'
import Link from 'next/link'
export default function AdminProductsPage() {
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
    { key: 'stock', label: 'Stock', sortable: true, align: 'center' as const },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', align: 'right' as const },
  ]
  const filters = [
    {
      key: 'search',
      label: 'Search',
      type: 'text' as const,
      placeholder: 'Search products...'
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
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'out_of_stock', label: 'Out of Stock' },
      ]
    }
  ]
  const bulkActions = [
    {
      key: 'activate',
      label: 'Activate',
      icon: Eye,
      variant: 'outline' as const,
      onClick: (selectedIds: string[]) => {
        console.log('Activate products:', selectedIds)
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
    fetchProducts()
  }, [])
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/products/${deleteDialog.productId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setProducts(products.filter(p => p.id !== deleteDialog.productId))
        setDeleteDialog({ isOpen: false, productId: '', productName: '' })
      }
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
          <div className="text-sm text-gray-500">{product.slug}</div>
        </div>
      </td>
      <td className="px-4 py-4">
        <Badge variant="outline">Skincare</Badge>
      </td>
      <td className="px-4 py-4 text-right">
        <div>
          {product.is_discount && product.discount_price ? (
            <>
              <div className="font-medium text-pink-600">{product.discount_price.toFixed(2)} DT</div>
              <div className="text-sm text-gray-400 line-through">{product.price.toFixed(2)} DT</div>
            </>
          ) : (
            <div className="font-medium">{product.price.toFixed(2)} DT</div>
          )}
        </div>
      </td>
      <td className="px-4 py-4 text-center">
        <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
          {product.stock}
        </Badge>
      </td>
      <td className="px-4 py-4">
        <Badge variant={product.is_active ? 'default' : 'secondary'}>
          {product.is_active ? 'Active' : 'Inactive'}
        </Badge>
      </td>
      <td className="px-4 py-4 text-right">
        <div className="flex items-center gap-2 justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/admin/products/${product.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </>
  )
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Products</h1>
          <p className="text-text-secondary">Manage your product catalog</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products/import">
            <Button variant="outline">Import Products</Button>
          </Link>
          <Link href="/admin/products/drafts">
            <Button variant="outline">Draft Products</Button>
          </Link>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
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
        emptyMessage="No products found"
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, productId: '', productName: '' })}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteDialog.productName}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}