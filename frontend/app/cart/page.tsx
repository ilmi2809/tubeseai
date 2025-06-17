
'use client'

import { useCart } from '../CartContext'
import CheckoutButton from '../CheckoutButton'

export default function CartPage() {
  const { cart } = useCart()

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="font-medium">{item.name}</h2>
                  <p>${item.price.toFixed(2)} × {item.quantity}</p>
                </div>
                <div className="font-bold text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <CheckoutButton />
          </div>
        </div>
      )}
    </div>
  )
}
