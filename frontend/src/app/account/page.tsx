'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Package, Settings } from 'lucide-react'

export default function AccountPage() {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { error } = await updateProfile({
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
    })

    if (error) {
      setError(error)
    } else {
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    }

    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
          <p className="text-gray-600 mb-8">You need to be signed in to access your account.</p>
          <Button onClick={() => window.location.href = '/login'}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            <a
              href="#profile"
              className="flex items-center px-3 py-2 text-sm font-medium text-pink-600 bg-pink-50 rounded-lg"
            >
              <User className="h-4 w-4 mr-3" />
              Profile
            </a>
            <a
              href="/orders"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Package className="h-4 w-4 mr-3" />
              Orders
            </a>
            <a
              href="#settings"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <Input
                label="Email"
                value={user.email}
                disabled
                className="bg-gray-50"
              />

              <Input
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />

              <div className="flex items-center space-x-4">
                <Button type="submit" loading={loading}>
                  Update Profile
                </Button>
                <span className="text-sm text-gray-500">
                  Role: {user.role}
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}