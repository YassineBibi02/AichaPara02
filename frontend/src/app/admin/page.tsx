'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  recentOrders: any[]
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && ['admin', 'superadmin'].includes(user.role)) {
      fetchDashboardStats()
    }
  }, [user])

  const fetchDashboardStats = async () => {
    try {
      // This would typically fetch from your API
      // For now, we'll use mock data
      setStats({
        totalProducts: 8,
        totalOrders: 24,
        totalUsers: 156,
        totalRevenue: 12450.75,
        recentOrders: [],
      })
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.first_name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-pink-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toFixed(2)} DT</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent orders to display</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/products"
              className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <Package className="h-5 w-5 text-gray-400 mr-3" />
                <span className="font-medium">Manage Products</span>
              </div>
            </a>
            <a
              href="/admin/orders"
              className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 text-gray-400 mr-3" />
                <span className="font-medium">View Orders</span>
              </div>
            </a>
            <a
              href="/admin/users"
              className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-3" />
                <span className="font-medium">Manage Users</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}