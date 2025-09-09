import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-pink-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full" size="lg">
              <Home className="w-5 h-5 mr-2" />
              Go to Homepage
            </Button>
          </Link>
          <Link href="/store">
            <Button variant="outline" className="w-full" size="lg">
              <Search className="w-5 h-5 mr-2" />
              Browse Products
            </Button>
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Need help finding something?</p>
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            <Link href="/contact" className="text-pink-600 hover:text-pink-500">
              Contact Support
            </Link>
            <Link href="/about" className="text-pink-600 hover:text-pink-500">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}