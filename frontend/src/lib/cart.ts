import { CartItem } from './types'

const CART_KEY = 'cosmo_cart_v1'

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  
  try {
    const cart = localStorage.getItem(CART_KEY)
    return cart ? JSON.parse(cart) : []
  } catch {
    return []
  }
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }))
  } catch (error) {
    console.error('Failed to save cart:', error)
  }
}

export function addToCart(item: Omit<CartItem, 'qty'> & { qty?: number }): void {
  const cart = getCart()
  const existingItemIndex = cart.findIndex(
    cartItem => 
      cartItem.productId === item.productId &&
      cartItem.variation1 === item.variation1 &&
      cartItem.variation2 === item.variation2
  )

  if (existingItemIndex > -1) {
    cart[existingItemIndex].qty += item.qty || 1
  } else {
    cart.push({ ...item, qty: item.qty || 1 })
  }

  saveCart(cart)
}

export function updateCartItem(productId: string, updates: Partial<CartItem>): void {
  const cart = getCart()
  const itemIndex = cart.findIndex(item => item.productId === productId)
  
  if (itemIndex > -1) {
    cart[itemIndex] = { ...cart[itemIndex], ...updates }
    saveCart(cart)
  }
}

export function removeFromCart(productId: string, variation1?: string, variation2?: string): void {
  const cart = getCart()
  const filteredCart = cart.filter(
    item => !(
      item.productId === productId &&
      item.variation1 === variation1 &&
      item.variation2 === variation2
    )
  )
  saveCart(filteredCart)
}

export function clearCart(): void {
  saveCart([])
}

export function getCartTotal(): { subtotal: number; shipping: number; total: number } {
  const cart = getCart()
  const subtotal = cart.reduce((sum, item) => {
    const price = item.discountPrice || item.price
    return sum + (price * item.qty)
  }, 0)
  
  const shipping = subtotal < 100 ? 8 : 0
  const total = subtotal + shipping
  
  return { subtotal, shipping, total }
}

export function getCartItemCount(): number {
  const cart = getCart()
  return cart.reduce((count, item) => count + item.qty, 0)
}