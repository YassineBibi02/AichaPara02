'use client'
import { useState, useEffect } from 'react'
import { DataTable } from '@/components/ui/organisms/DataTable'
import { Badge } from '@/components/ui/atoms/Badge'
import { Button } from '@/components/ui/atoms/Button'
import { Eye, Download, Archive } from 'lucide-react'
import { Order } from '@/lib/types'
import { useRouter } from 'next/navigation'

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
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
    // Mock data for now
    const mockOrders: Order[] = [
      {
        id: '1',
        user_id: 'user1',
        is_guest: false,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '+216 12 345 678',
        address_line1: '123 Main St',
        postal_code: '1000',
        city: 'Tunis',
        cart: [],
        status: 'PENDING',
        subtotal: 150.00,
        shipping_fee: 8.00,
        total: 158.00,
        created_at: new Date().toISOString()
      }
    ]
    
    setTimeout(() => {
      setOrders(mockOrders)
      setLoading(false)
    }, 1000)
  }, [])
  const getStatusColor = (status: string) => {
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
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push(`/admin/orders/${order.id}`)}
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
      </td>
    </>
  )
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage customer orders</p>
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
    </div>
  )
}