'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/ui/organisms/DataTable'
import { Badge } from '@/components/ui/atoms/Badge'
import { Button } from '@/components/ui/atoms/Button'
import { ConfirmDialog } from '@/components/ui/organisms/ConfirmDialog'
import { Eye, Edit, Shield, Ban } from 'lucide-react'
import { User } from '@/lib/types'

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; userId: string; userName: string }>({
    isOpen: false,
    userId: '',
    userName: ''
  })
  const [deleting, setDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'created_at', label: 'Joined', sortable: true },
    { key: 'actions', label: 'Actions', align: 'right' as const },
  ]
  const filters = [
    {
      key: 'search',
      label: 'Search',
      type: 'text' as const,
      placeholder: 'Search users...'
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select' as const,
      options: [
        { value: 'client', label: 'Client' },
        { value: 'admin', label: 'Admin' },
        { value: 'superadmin', label: 'Super Admin' },
      ]
    }
  ]
  const bulkActions = [
    {
      key: 'promote',
      label: 'Promote to Admin',
      icon: Shield,
      variant: 'outline' as const,
      onClick: (selectedIds: string[]) => {
        console.log('Promote users:', selectedIds)
      }
    },
    {
      key: 'ban',
      label: 'Ban Users',
      icon: Ban,
      variant: 'destructive' as const,
      onClick: (selectedIds: string[]) => {
        console.log('Ban users:', selectedIds)
      }
    }
  ]
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/profiles')
      const data = await response.json()
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchUsers()
  }, [])
  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/profiles/${deleteDialog.userId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setUsers(users.filter(u => u.id !== deleteDialog.userId))
        setDeleteDialog({ isOpen: false, userId: '', userName: '' })
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    } finally {
      setDeleting(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-purple-100 text-purple-800'
      case 'admin': return 'bg-blue-100 text-blue-800'
      case 'client': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  const renderRow = (user: User) => (
    <>
      <td className="px-4 py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-medium mr-3">
            {user.first_name?.[0] || user.email[0].toUpperCase()}
          </div>
          <div>
            <div className="font-medium">{user.first_name} {user.last_name}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-gray-900">
        {user.email}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500">
        {user.phone || '-'}
      </td>
      <td className="px-4 py-4">
        <Badge className={getRoleColor(user.role)}>
          {user.role}
        </Badge>
      </td>
      <td className="px-4 py-4 text-sm text-gray-500">
        {new Date().toLocaleDateString()}
      </td>
      <td className="px-4 py-4 text-right">
        <div className="flex items-center gap-2 justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/admin/users/${user.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setDeleteDialog({
              isOpen: true,
              userId: user.id,
              userName: `${user.first_name} ${user.last_name}`
            })}
          >
            <Ban className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </>
  )
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Users</h1>
        <p className="text-text-secondary">Manage user accounts and permissions</p>
      </div>
      <DataTable
        data={users}
        columns={columns}
        loading={loading}
        currentPage={currentPage}
        totalPages={Math.ceil(users.length / pageSize)}
        pageSize={pageSize}
        totalItems={users.length}
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
        emptyMessage="No users found"
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, userId: '', userName: '' })}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteDialog.userName}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}