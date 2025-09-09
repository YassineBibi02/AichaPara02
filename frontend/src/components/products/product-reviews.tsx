'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Review } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ProductReviewsProps {
  productId: string
  reviews: Review[]
}

export function ProductReviews({ productId, reviews: initialReviews }: ProductReviewsProps) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState(initialReviews)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  })

  const supabase = createClient()

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating: formData.rating,
          comment: formData.comment,
        })
        .select(`
          *,
          user:profiles(first_name, last_name)
        `)
        .single()

      if (error) throw error

      setReviews([data, ...reviews])
      setFormData({ rating: 5, comment: '' })
      setShowForm(false)
    } catch (error) {
      console.error('Failed to submit review:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border-t pt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Reviews ({reviews.length})
        </h2>
        {user && !showForm && (
          <Button onClick={() => setShowForm(true)}>
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showForm && user && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= formData.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                placeholder="Share your thoughts about this product..."
              />
            </div>
            <div className="flex items-center space-x-3">
              <Button type="submit" loading={loading}>
                Submit Review
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {review.user?.first_name} {review.user?.last_name}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
              {review.comment && (
                <p className="text-gray-700">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}