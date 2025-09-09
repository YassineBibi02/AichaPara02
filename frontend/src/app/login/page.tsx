'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  })

  const redirectTo = searchParams.get('redirectTo') || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signIn(formData.email, formData.password)
    
    if (error) {
      setError(error)
      setLoading(false)
    } else {
      router.push(redirectTo)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/register" className="font-medium text-pink-600 hover:text-pink-500">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            <Input
              label="Phone number (optional)"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-pink-600 hover:text-pink-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}