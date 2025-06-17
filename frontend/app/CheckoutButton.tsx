
'use client'

import { useCart } from './CartContext'
import { useRouter } from 'next/navigation'

export default function CheckoutButton() {
  const { cart, clearCart } = useCart()
  const router = useRouter()

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!')
      return
    }

    try {
      const response = await fetch('http://localhost:3003/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart }),
      })

      if (!response.ok) throw new Error('Checkout failed.')

      const result = await response.json()
      alert('Checkout successful! Order ID: ' + result.orderId)
      clearCart()
      router.push('/success') // or a thank you page
    } catch (err) {
      console.error(err)
      alert('Something went wrong during checkout.')
    }
  }

  return (
    <button
      onClick={handleCheckout}
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
    >
      🧾 Proceed to Checkout
    </button>
  )
}
