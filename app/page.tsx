import React from 'react'
import Link from "next/link"
import { ShoppingCart, User, Package, CreditCard, Truck } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">MicroShop</h1>
          <div className="flex items-center gap-4">
            <Link href="/products" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <Link href="/cart" className="relative text-gray-600 hover:text-gray-900">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Link>
            <Link href="/account" className="text-gray-600 hover:text-gray-900">
              <User className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Microservices E-Commerce Demo</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A complete e-commerce platform built with microservices architecture using Node.js, GraphQL, MySQL, and
            Docker.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/products"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/architecture"
              className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors"
            >
              View Architecture
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Microservices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <ServiceCard
              title="User Service"
              description="Manages user accounts, authentication, and profiles"
              icon={<User className="h-10 w-10 text-blue-500" />}
              endpoint="/api/users"
            />
            <ServiceCard
              title="Product Service"
              description="Handles product catalog, inventory, and categories"
              icon={<Package className="h-10 w-10 text-green-500" />}
              endpoint="/api/products"
            />
            <ServiceCard
              title="Order Service"
              description="Processes customer orders and manages order status"
              icon={<ShoppingCart className="h-10 w-10 text-purple-500" />}
              endpoint="/api/orders"
            />
            <ServiceCard
              title="Payment Service"
              description="Handles payment processing and transaction history"
              icon={<CreditCard className="h-10 w-10 text-red-500" />}
              endpoint="/api/payments"
            />
            <ServiceCard
              title="Shipping Service"
              description="Manages shipping options, tracking, and delivery status"
              icon={<Truck className="h-10 w-10 text-orange-500" />}
              endpoint="/api/shipping"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
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
    </main>
  )
}

function ServiceCard({ title, description, icon, endpoint }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-4">{description}</p>
      <p className="text-sm text-gray-500 text-center">
        GraphQL Endpoint: <code className="bg-gray-200 px-2 py-1 rounded">{endpoint}</code>
      </p>
    </div>
  )
}
