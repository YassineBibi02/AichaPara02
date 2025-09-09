export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  role: 'client' | 'admin' | 'superadmin'
}

export interface Category {
  id: string
  name: string
  slug: string
  is_active: boolean
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  discount_price?: number
  is_discount: boolean
  is_feature: boolean
  is_active: boolean
  is_draft: boolean
  category_id?: string
  category?: Category
  image_url?: string
  stock: number
  is_stock: boolean
  variation1?: string
  variation2?: string
  rating: number
  review_count: number
  created_at: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment?: string
  created_at: string
  user?: {
    first_name?: string
    last_name?: string
  }
}

export interface CartItem {
  productId: string
  name: string
  price: number
  discountPrice?: number
  qty: number
  variation1?: string
  variation2?: string
  imageUrl?: string
}

export interface Order {
  id: string
  user_id?: string
  is_guest: boolean
  first_name: string
  last_name: string
  email: string
  phone: string
  address_line1: string
  address_line2?: string
  company?: string
  postal_code: string
  city: string
  cart: CartItem[]
  payment_method?: string
  status: 'PENDING' | 'PAID' | 'FULFILLED' | 'CANCELED' | 'REFUNDED'
  subtotal: number
  shipping_fee: number
  total: number
  created_at: string
}

export interface ProductFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  onSale?: boolean
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'rating'
  page?: number
  limit?: number
}