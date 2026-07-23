'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type QuoteItem = {
  productId: string
  productName: string
  category: string
  subcategory: string
  brand?: string
  image: string
  selectedSize?: string
  quantity: number
}

interface QuoteContextType {
  items: QuoteItem[]
  addItem: (item: QuoteItem) => void
  removeItem: (productId: string, selectedSize?: string) => void
  updateQuantity: (productId: string, selectedSize: string | undefined, quantity: number) => void
  clearQuote: () => void
  totalCount: number
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
  openDrawer: () => void
  closeDrawer: () => void
  getFormattedQuoteText: () => string
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined)

const STORAGE_KEY = 'super_tech_quote_basket_v1'

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load quote basket', e)
    }
    setIsInitialized(true)
  }, [])

  // Save to localStorage when items change
  useEffect(() => {
    if (!isInitialized) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.error('Failed to save quote basket', e)
    }
  }, [items, isInitialized])

  function addItem(newItem: QuoteItem) {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === newItem.productId && i.selectedSize === newItem.selectedSize
      )
      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex].quantity += newItem.quantity
        return updated
      }
      return [...prev, newItem]
    })
    setIsDrawerOpen(true)
  }

  function removeItem(productId: string, selectedSize?: string) {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.selectedSize === selectedSize))
    )
  }

  function updateQuantity(productId: string, selectedSize: string | undefined, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId, selectedSize)
      return
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.productId === productId && i.selectedSize === selectedSize) {
          return { ...i, quantity }
        }
        return i
      })
    )
  }

  function clearQuote() {
    setItems([])
  }

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)

  function openDrawer() {
    setIsDrawerOpen(true)
  }

  function closeDrawer() {
    setIsDrawerOpen(false)
  }

  function getFormattedQuoteText(): string {
    if (items.length === 0) return ''
    let text = `Hello Super Tech Kuwait Team,\n\nI would like to request a bulk quote for the following materials:\n\n`
    items.forEach((item, index) => {
      text += `${index + 1}. ${item.productName}`
      if (item.selectedSize) {
        text += ` (Size/Spec: ${item.selectedSize})`
      }
      if (item.brand) {
        text += ` - ${item.brand}`
      }
      text += `\n`
    })
    text += `\nPlease confirm availability, delivery timeline, and bulk pricing. Thank you!`
    return text
  }

  return (
    <QuoteContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearQuote,
        totalCount,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawer,
        closeDrawer,
        getFormattedQuoteText,
      }}
    >
      {children}
    </QuoteContext.Provider>
  )
}

export function useQuote() {
  const context = useContext(QuoteContext)
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider')
  }
  return context
}
