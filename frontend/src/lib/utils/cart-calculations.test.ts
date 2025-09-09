import { describe, it, expect } from 'vitest'
import { getCartTotal } from '../cart'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Cart Calculations', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
  })

  it('should calculate correct subtotal for regular prices', () => {
    const mockCart = [
      { productId: '1', name: 'Product 1', price: 50, qty: 2 },
      { productId: '2', name: 'Product 2', price: 30, qty: 1 },
    ]
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCart))
    
    const totals = getCartTotal()
    expect(totals.subtotal).toBe(130) // (50 * 2) + (30 * 1)
  })

  it('should use discount price when available', () => {
    const mockCart = [
      { productId: '1', name: 'Product 1', price: 100, discountPrice: 80, qty: 1 },
      { productId: '2', name: 'Product 2', price: 50, qty: 1 },
    ]
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCart))
    
    const totals = getCartTotal()
    expect(totals.subtotal).toBe(130) // 80 + 50
  })

  it('should apply free shipping for orders over 100 DT', () => {
    const mockCart = [
      { productId: '1', name: 'Product 1', price: 120, qty: 1 },
    ]
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCart))
    
    const totals = getCartTotal()
    expect(totals.subtotal).toBe(120)
    expect(totals.shipping).toBe(0)
    expect(totals.total).toBe(120)
  })

  it('should apply 8 DT shipping for orders under 100 DT', () => {
    const mockCart = [
      { productId: '1', name: 'Product 1', price: 80, qty: 1 },
    ]
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCart))
    
    const totals = getCartTotal()
    expect(totals.subtotal).toBe(80)
    expect(totals.shipping).toBe(8)
    expect(totals.total).toBe(88)
  })

  it('should handle empty cart', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([]))
    
    const totals = getCartTotal()
    expect(totals.subtotal).toBe(0)
    expect(totals.shipping).toBe(8) // Still charges shipping for empty cart
    expect(totals.total).toBe(8)
  })
})