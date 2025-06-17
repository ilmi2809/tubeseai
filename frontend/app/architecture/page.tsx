"use client"

import Link from "next/link"
import { ShoppingCart, User, ArrowLeft } from "lucide-react"

export default function ArchitecturePage() {
  const cartCount = 3

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
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Microservices Architecture</h1>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-6">System Overview</h2>

          <p className="text-gray-700 mb-6">
            This e-commerce platform is built using a microservices architecture with 5 independent services, each
            responsible for a specific domain of the business logic. All services communicate through GraphQL APIs and
            are containerized using Docker.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Technology Stack</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                  <strong>Node.js</strong> - Runtime environment
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                  <strong>GraphQL</strong> - API query language
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
                  <strong>MySQL</strong> - Database per service
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                  <strong>Docker</strong> - Containerization
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-gray-800 rounded-full mr-3"></span>
                  <strong>Next.js</strong> - Frontend framework
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Architecture Principles</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                  Database per service
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                  API-first design
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
                  Independent deployments
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                  Service autonomy
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-gray-800 rounded-full mr-3"></span>
                  Containerized services
                </li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-6">Service Architecture</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <ServiceCard
              title="User Service"
              port="3001"
              database="user_db"
              responsibilities={["User registration & authentication", "Profile management", "User preferences"]}
              endpoints={[
                "getUser(id: ID!)",
                "createUser(input: UserInput!)",
                "updateUser(id: ID!, input: UserInput!)",
              ]}
            />

            <ServiceCard
              title="Product Service"
              port="3002"
              database="product_db"
              responsibilities={["Product catalog management", "Inventory tracking", "Category management"]}
              endpoints={[
                "getProducts(filter: ProductFilter)",
                "getProduct(id: ID!)",
                "createProduct(input: ProductInput!)",
              ]}
            />

            <ServiceCard
              title="Order Service"
              port="3003"
              database="order_db"
              responsibilities={["Order processing", "Cart management", "Order history"]}
              endpoints={["createOrder(input: OrderInput!)", "getOrder(id: ID!)", "getUserOrders(userId: ID!)"]}
            />

            <ServiceCard
              title="Payment Service"
              port="3004"
              database="payment_db"
              responsibilities={["Payment processing", "Transaction history", "Payment methods"]}
              endpoints={[
                "processPayment(input: PaymentInput!)",
                "getPayment(id: ID!)",
                "getPaymentHistory(userId: ID!)",
              ]}
            />

            <ServiceCard
              title="Shipping Service"
              port="3005"
              database="shipping_db"
              responsibilities={["Shipping calculations", "Tracking management", "Delivery status"]}
              endpoints={[
                "calculateShipping(input: ShippingInput!)",
                "createShipment(input: ShipmentInput!)",
                "trackShipment(id: ID!)",
              ]}
            />
          </div>

          <h3 className="text-xl font-semibold mb-4">Service Communication</h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-4">
              Services communicate with each other through HTTP GraphQL requests. Here are some examples:
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <strong>Order Service</strong> → <strong>Product Service</strong>: Validate product availability and
                pricing
              </li>
              <li>
                <strong>Order Service</strong> → <strong>User Service</strong>: Verify user information
              </li>
              <li>
                <strong>Payment Service</strong> → <strong>Order Service</strong>: Update order status after payment
              </li>
              <li>
                <strong>Shipping Service</strong> → <strong>Order Service</strong>: Get order details for shipping
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mb-4 mt-8">Docker Setup</h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-4">
              Each service runs in its own Docker container with a dedicated MySQL database. The entire system can be
              started with a single command:
            </p>
            <code className="bg-gray-800 text-green-400 px-4 py-2 rounded block">docker-compose up -d</code>
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

function ServiceCard({ title, port, database, responsibilities, endpoints }) {
  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <div className="text-sm text-gray-600 mb-4">
        <p>Port: {port}</p>
        <p>Database: {database}</p>
      </div>

      <div className="mb-4">
        <h5 className="font-medium mb-2">Responsibilities:</h5>
        <ul className="text-sm space-y-1">
          {responsibilities.map((resp, index) => (
            <li key={index} className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              {resp}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h5 className="font-medium mb-2">Key Endpoints:</h5>
        <ul className="text-xs space-y-1 font-mono">
          {endpoints.map((endpoint, index) => (
            <li key={index} className="bg-gray-100 p-1 rounded">
              {endpoint}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
