'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Mail, CheckCircle } from 'lucide-react'

export default function ConfirmEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(5)
  const email = searchParams.get('email')

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/login')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Check your email
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              We've sent a confirmation link to:
            </p>
            <p className="text-lg font-medium text-gray-900 bg-gray-100 px-4 py-2 rounded-lg">
              {email || 'your email address'}
            </p>
            <p className="text-gray-600">
              Please click the link in the email to verify your account and complete your registration.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-blue-800 font-medium mb-1">What's next?</p>
              <ul className="text-blue-700 space-y-1">
                <li>1. Check your email inbox (and spam folder)</li>
                <li>2. Click the confirmation link</li>
                <li>3. Return to sign in to your account</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500">
            Redirecting to login in {countdown} seconds...
          </p>
          <Link href="/login">
            <Button className="w-full">
              Go to Login Now
            </Button>
          </Link>
          <Link href="/" className="text-sm text-pink-600 hover:text-pink-500">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}