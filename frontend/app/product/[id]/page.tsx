"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, User, ArrowLeft, Star, Truck, Shield } from "lucide-react"

// Mock product data that would come from Product Service
const MOCK_PRODUCT = {
  id: "1",
  name: "Premium Wireless Headphones",
  description:
    "Experience crystal-clear audio with our premium wireless headphones. Featuring active noise cancellation, Bluetooth 5.0 connectivity, and up to 30 hours of battery life. The ergonomic design ensures comfort during extended listening sessions, while the premium materials provide durability and style.",
  price: 199.99,
  imageUrl: "/placeholder.svg?height=500&width=500",
  category: "Electronics",
  stock: 15,
  rating: 4.7,
  reviews: 128,
  features: [
    "Active Noise Cancellation",
    "Bluetooth 5.0",
    "30-hour battery life",
    "Quick charge (5 min charge = 3 hours playback)",
    "Premium memory foam ear cushions",
  ],
}

export default function ProductDetailPage({ params }) {
  const { id } = params
  const product = MOCK_PRODUCT // In a real app, we would fetch the product by ID
  const [quantity, setQuantity] = useState(1)
  const [cartCount, setCartCount] = useState(3)

  const addToCart = () => {
    console.log(`Adding ${quantity} of product ${id} to cart`)
    // In a real app, this would make a GraphQL mutation to Order Service
    setCartCount((prev) => prev + quantity)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            MicroShop
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/products" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <Link href="/cart" className="relative text-gray-600 hover:text-gray-900">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
            <Link href="/account" className="text-gray-600 hover:text-gray-900">
              <User className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6">
          <Link href="/products" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="flex justify-center items-center bg-gray-100 rounded-lg p-4">
              <img
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                className="max-h-96 object-contain"
              />
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <p className="text-2xl font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</p>

              <p className="text-gray-700 mb-6">{product.description}</p>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Key Features:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-gray-700">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span
                    className={`block text-sm font-medium mb-1 ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                  <span className="text-gray-600 text-sm">{product.stock} available</span>
                </div>
              </div>

              <button
                onClick={addToCart}
                disabled={product.stock === 0}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                Add to Cart
              </button>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4 mt-16">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">MicroShop</h3>
              <p className="text-gray-400">Built with Node.js, GraphQL, MySQL, and Docker</p>
            </div>
            <div className="flex gap-8">
              <div>
                <h4 className="font-semibold mb-2">Services</h4>
                <ul className="text-gray-400">
                  <li>User Service</li>
                  <li>Product Service</li>
                  <li>Order Service</li>
                  <li>Payment Service</li>
                  <li>Shipping Service</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Technologies</h4>
                <ul className="text-gray-400">
                  <li>Node.js</li>
                  <li>GraphQL</li>
                  <li>MySQL</li>
                  <li>Docker</li>
                  <li>Next.js</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} MicroShop. Academic Project.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
