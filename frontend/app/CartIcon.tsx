'use client'

import { useCart } from './CartContext'

export default function CartIcon() {
  const { count } = useCart()

  return (
    <div className="relative">
      🛒
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
  )
}
