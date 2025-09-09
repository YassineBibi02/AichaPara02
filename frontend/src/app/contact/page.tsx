import { Metadata } from 'next'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const metadata: Metadata = {
  title: 'Contact Us - Aicha Para',
  description: 'Get in touch with Aicha Para. Find our contact information, store location, and send us a message.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We'd love to hear from you. Get in touch with our team for any questions, 
              concerns, or just to say hello.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-pink-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Address</h3>
                    <p className="text-gray-600">
                      Avenue Habib Bourguiba<br />
                      Tunis 1000, Tunisia
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-pink-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">+216 XX XXX XXX</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-pink-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">contact@aichapara.tn</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-pink-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Business Hours</h3>
                    <div className="text-gray-600">
                      <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                      <p>Saturday: 9:00 AM - 6:00 PM</p>
                      <p>Sunday: 10:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white border rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      name="firstName"
                      required
                      placeholder="Your first name"
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      required
                      placeholder="Your last name"
                    />
                  </div>
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    required
                    placeholder="your.email@example.com"
                  />
                  <Input
                    label="Phone (Optional)"
                    name="phone"
                    type="tel"
                    placeholder="+216 XX XXX XXX"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500">
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="product">Product Question</option>
                      <option value="return">Returns & Exchanges</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      placeholder="Tell us how we can help you..."
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">
              Quick answers to common questions about our products and services
            </p>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Do you offer free shipping?
              </h3>
              <p className="text-gray-600">
                Yes! We offer free shipping on all orders over 100 DT within Tunisia. 
                Orders under 100 DT have a shipping fee of 8 DT.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Are all your products authentic?
              </h3>
              <p className="text-gray-600">
                Absolutely. We source all our products directly from authorized distributors 
                and guarantee 100% authenticity on every item we sell.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                What is your return policy?
              </h3>
              <p className="text-gray-600">
                We accept returns within 14 days of delivery for unopened products in their 
                original packaging. Please contact us to initiate a return.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                How long does delivery take?
              </h3>
              <p className="text-gray-600">
                Standard delivery within Tunisia takes 2-5 business days. We also offer 
                express delivery options for faster shipping.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}