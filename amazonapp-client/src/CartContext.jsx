import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

function loadCart() {
  try {
    const raw = sessionStorage.getItem('cart')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart)

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (book) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.bookId === book.bookId)
      if (existing) {
        return prev.map((item) =>
          item.bookId === book.bookId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...book, quantity: 1 }]
    })
  }

  const removeFromCart = (bookId) => {
    setCart((prev) => prev.filter((item) => item.bookId !== bookId))
  }

  const updateQuantity = (bookId, quantity) => {
    if (quantity < 1) {
      removeFromCart(bookId)
      return
    }
    setCart((prev) =>
      prev.map((item) =>
        item.bookId === bookId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
