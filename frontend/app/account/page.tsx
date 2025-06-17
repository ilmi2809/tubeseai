"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, User, Package, CreditCard, Truck, LogOut, Settings, UserCircle } from "lucide-react"

// Mock user data that would come from User Service
const MOCK_USER = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/placeholder.svg?height=100&width=100",
  address: {
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
    country: "USA",
  },
}

const MOCK_ORDERS = [
  {
    id: "ORD-1001",
    date: "2023-05-15",
    total: 249.98,
    status: "Delivered",
    items: 2,
  },
  {
    id: "ORD-1002",
    date: "2023-06-22",
    total: 89.99,
    status: "Processing",
    items: 1,
  },
  {
    id: "ORD-1003",
    date: "2023-07-10",
    total: 179.97,
    status: "Shipped",
    items: 3,
  },
]

export default function AccountPage() {
  const [user] = useState(MOCK_USER)
  const [orders] = useState(MOCK_ORDERS)
  const [activeTab, setActiveTab] = useState("profile")
  const [cartCount] = useState(3)

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
            <Link href="/account" className="text-gray-900 font-medium">
              <User className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="h-20 w-20 rounded-full overflow-hidden mb-4">
                  <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-full w-full object-cover" />
                </div>
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                    activeTab === "profile" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <UserCircle className="h-5 w-5 mr-3" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                    activeTab === "orders" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Package className="h-5 w-5 mr-3" />
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab("payments")}
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                    activeTab === "payments" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <CreditCard className="h-5 w-5 mr-3" />
                  Payment Methods
                </button>
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                    activeTab === "shipping" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Truck className="h-5 w-5 mr-3" />
                  Shipping Addresses
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                    activeTab === "settings" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </button>
                <button className="w-full flex items-center px-4 py-2 text-sm rounded-md text-red-600 hover:bg-red-50">
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={user.name}
                        readOnly
                        className="w-full px-3 py-2 border rounded-md bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full px-3 py-2 border rounded-md bg-gray-50"
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mt-8 mb-4">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        value={user.address.street}
                        readOnly
                        className="w-full px-3 py-2 border rounded-md bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={user.address.city}
                        readOnly
                        className="w-full px-3 py-2 border rounded-md bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={user.address.state}
                        readOnly
                        className="w-full px-3 py-2 border rounded-md bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        value={user.address.zipCode}
                        readOnly
                        className="w-full px-3 py-2 border rounded-md bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        value={user.address.country}
                        readOnly
                        className="w-full px-3 py-2 border rounded-md bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Order History</h2>
                  {orders.length === 0 ? (
                    <p className="text-gray-600">You haven't placed any orders yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Items
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {orders.map((order) => (
                            <tr key={order.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {order.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${order.total.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    order.status === "Delivered"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "Shipped"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900">View</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "payments" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
                  <p className="text-gray-600 mb-4">Manage your payment methods here.</p>

                  <div className="border rounded-md p-4 mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-md mr-4">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-gray-500">Expires 12/2025</p>
                      </div>
                    </div>
                    <div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Default</span>
                    </div>
                  </div>

                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
                    Add Payment Method
                  </button>
                </div>
              )}

              {activeTab === "shipping" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Shipping Addresses</h2>
                  <p className="text-gray-600 mb-4">Manage your shipping addresses here.</p>

                  <div className="border rounded-md p-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <p className="font-medium">Home Address</p>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Default</span>
                    </div>
                    <p className="text-gray-600">{user.address.street}</p>
                    <p className="text-gray-600">
                      {user.address.city}, {user.address.state} {user.address.zipCode}
                    </p>
                    <p className="text-gray-600">{user.address.country}</p>
                    <div className="mt-3 flex gap-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800">Edit</button>
                      <button className="text-sm text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </div>

                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
                    Add New Address
                  </button>
                </div>
              )}

              {activeTab === "settings" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Account Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Password</h3>
                      <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
                        Change Password
                      </button>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="email-notifications"
                            className="h-4 w-4 text-blue-600 rounded"
                            defaultChecked
                          />
                          <label htmlFor="email-notifications" className="ml-2 text-gray-700">
                            Email notifications
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="order-updates"
                            className="h-4 w-4 text-blue-600 rounded"
                            defaultChecked
                          />
                          <label htmlFor="order-updates" className="ml-2 text-gray-700">
                            Order status updates
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="promotions" className="h-4 w-4 text-blue-600 rounded" />
                          <label htmlFor="promotions" className="ml-2 text-gray-700">
                            Promotional emails
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Account Actions</h3>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
