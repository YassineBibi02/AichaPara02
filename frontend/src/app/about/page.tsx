import { Metadata } from 'next'
import Image from 'next/image'
import { Heart, Award, Truck, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - Aicha Para',
  description: 'Learn about Aicha Para, your trusted destination for premium beauty and cosmetics products in Tunisia.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">About Aicha Para</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your trusted destination for premium beauty and cosmetics products in Tunisia. 
              We believe that everyone deserves to feel beautiful and confident.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded with a passion for beauty and self-expression, Aicha Para has been serving 
                  the Tunisian market with carefully curated cosmetics and beauty products since our inception.
                </p>
                <p>
                  We understand that beauty is personal, and our mission is to provide you with 
                  high-quality products that enhance your natural beauty and boost your confidence.
                </p>
                <p>
                  From skincare essentials to makeup must-haves, we source our products from trusted 
                  brands and ensure that every item meets our strict quality standards.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700">Beauty with Heart</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do at Aicha Para
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality First</h3>
              <p className="text-gray-600">
                We carefully select only the highest quality products from trusted brands.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Care</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We're here to help you find the perfect products.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Authenticity</h3>
              <p className="text-gray-600">
                All our products are 100% authentic and sourced directly from authorized distributors.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable delivery across Tunisia, with free shipping on orders over 100 DT.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            To make premium beauty and cosmetics accessible to everyone in Tunisia, 
            while providing exceptional customer service and building lasting relationships 
            with our community. We believe that beauty is not just about looking good, 
            but feeling confident and expressing your unique self.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-pink-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Discover Your Beauty?</h2>
          <p className="text-xl text-pink-100 mb-8">
            Explore our curated collection of premium beauty products
          </p>
          <a
            href="/store"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-pink-600 bg-white hover:bg-gray-50 transition-colors"
          >
            Shop Now
          </a>
        </div>
      </section>
    </div>
  )
}