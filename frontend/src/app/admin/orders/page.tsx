'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/ui/organisms/DataTable'
import { Badge } from '@/components/ui/atoms/Badge'
import { Button } from '@/components/ui/atoms/Button'
import { ConfirmDialog } from '@/components/ui/organisms/ConfirmDialog'
import { Eye, Download, Archive } from 'lucide-react'
import { Order } from '@/lib/types'

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; orderId: string; orderNumber: string }>({
    isOpen: false,
    orderId: '',
    orderNumber: ''
  })
  const [deleting, setDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const columns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'total', label: 'Total', sortable: true, align: 'right' as const },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'created_at', label: 'Date', sortable: true },
    { key: 'actions', label: 'Actions', align: 'right' as const },
  ]
  const filters = [
    {
      key: 'search',
      label: 'Search',
      type: 'text' as const,
      placeholder: 'Search orders...'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'PENDING', label: 'Pending' },
        { value: 'PAID', label: 'Paid' },
        { value: 'FULFILLED', label: 'Fulfilled' },
        { value: 'CANCELED', label: 'Canceled' },
        { value: 'REFUNDED', label: 'Refunded' },
      ]
    }
  ]
  const bulkActions = [
    {
      key: 'export',
      label: 'Export',
      icon: Download,
      variant: 'outline' as const,
      onClick: (selectedIds: string[]) => {
        console.log('Export orders:', selectedIds)
      }
    },
    {
      key: 'archive',
      label: 'Archive',
      icon: Archive,
      variant: 'outline' as const,
      onClick: (selectedIds: string[]) => {
        console.log('Archive orders:', selectedIds)
      }
    }
  ]
  useEffect(() => {
    fetchOrders()
  }, [])
  const getStatusColor = (status: string) => {
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/orders/${deleteDialog.orderId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setOrders(orders.filter(o => o.id !== deleteDialog.orderId))
        setDeleteDialog({ isOpen: false, orderId: '', orderNumber: '' })
      }
    } catch (error) {
      console.error('Error deleting order:', error)
    } finally {
      setDeleting(false)
    }
  }

    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'PAID': return 'bg-blue-100 text-blue-800'
      case 'FULFILLED': return 'bg-green-100 text-green-800'
      case 'CANCELED': return 'bg-red-100 text-red-800'
      case 'REFUNDED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  const renderRow = (order: Order) => (
    <>
      <td className="px-4 py-4 text-sm font-mono">
        #{order.id.slice(-8)}
      </td>
      <td className="px-4 py-4">
        <div>
          <div className="font-medium">{order.first_name} {order.last_name}</div>
          <div className="text-sm text-gray-500">{order.email}</div>
        </div>
      </td>
      <td className="px-4 py-4 text-right font-medium">
        {order.total.toFixed(2)} DT
      </td>
      <td className="px-4 py-4">
        <Badge className={getStatusColor(order.status)}>
          {order.status}
        </Badge>
      </td>
      <td className="px-4 py-4 text-sm text-gray-500">
        {new Date(order.created_at).toLocaleDateString()}
      </td>
      <td className="px-4 py-4 text-right">
        <div className="flex items-center gap-2 justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/admin/orders/${order.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setDeleteDialog({
              isOpen: true,
              orderId: order.id,
              orderNumber: `#${order.id.slice(-8)}`
            })}
          >
            <Archive className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </>
  )
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Orders</h1>
        <p className="text-text-secondary">Manage customer orders</p>
      </div>
      <DataTable
        data={orders}
        columns={columns}
        loading={loading}
        currentPage={currentPage}
        totalPages={Math.ceil(orders.length / pageSize)}
        pageSize={pageSize}
        totalItems={orders.length}
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
        emptyMessage="No orders found"
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, orderId: '', orderNumber: '' })}
        onConfirm={handleDelete}
        title="Archive Order"
        message={`Are you sure you want to archive order "${deleteDialog.orderNumber}"? This action cannot be undone.`}
        confirmText="Archive"
        variant="warning"
        loading={deleting}
      />
    </div>
  )
}