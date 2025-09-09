Looking at the original file content and the failed diff, I can see that the original file is empty and the diff is trying to add a large block of code. The diff appears to be adding a complete React component with sidebar navigation functionality.

Since the original file is empty, applying this diff would result in the complete code being added to the file:

'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Home, Users, Settings, BarChart3, LogOut } from 'lucide-react'
import { clsx } from 'clsx'
import { useAuth } from '@/lib/auth'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <Link href="/">
            <Button>
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
                <span className="ml-2 text-xl font-bold text-gray-900">Cosmo Admin</span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={clsx(
                        isActive
                          ? 'bg-pink-100 text-pink-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={clsx(
                          isActive ? 'text-pink-500' : 'text-gray-400 group-hover:text-gray-500',
                          'mr-3 flex-shrink-0 h-6 w-6'
                        )}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.first_name?.[0] || user.email[0].toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user.first_name} {user.last_name}</p>
                  <button
                    onClick={signOut}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <LogOut className="h-3 w-3 mr-1" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
              <span className="ml-2 text-xl font-bold text-gray-900">Cosmo Admin</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      isActive
                        ? 'bg-pink-100 text-pink-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    )}
                  >
                    <item.icon
                      className={clsx(
                        isActive ? 'text-pink-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.first_name?.[0] || user.email[0].toUpperCase()}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">{user.first_name} {user.last_name}</p>
                <button
                  onClick={signOut}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  Sign out
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}