"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, User, Filter, ChevronDown } from "lucide-react"
import { useRouter } from 'next/navigation';
import { getCartItems, setCartItems } from '../cartStorage'; // sesuaikan path jika perlu

// Mock data that would come from Product Service
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    imageUrl: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    stock: 15,
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    description: "Comfortable office chair with lumbar support",
    price: 249.99,
    imageUrl: "/placeholder.svg?height=300&width=300",
    category: "Furniture",
    stock: 8,
  },
  {
    id: "3",
    name: "Smart Fitness Watch",
    description: "Track your fitness goals with this advanced smartwatch",
    price: 149.99,
    imageUrl: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    stock: 22,
  },
  {
    id: "4",
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and eco-friendly cotton t-shirt",
    price: 29.99,
    imageUrl: "/placeholder.svg?height=300&width=300",
    category: "Clothing",
    stock: 50,
  },
  {
    id: "5",
    name: "Professional Chef Knife",
    description: "High-carbon stainless steel chef knife for professional cooking",
    price: 89.99,
    imageUrl: "/placeholder.svg?height=300&width=300",
    category: "Kitchen",
    stock: 12,
  },
  {
    id: "6",
    name: "Wireless Gaming Mouse",
    description: "Precision gaming mouse with customizable RGB lighting",
    price: 79.99,
    imageUrl: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    stock: 18,
  },
]

// Mock categories that would come from Product Service
const CATEGORIES = ["All", "Electronics", "Furniture", "Clothing", "Kitchen"]

export default function ProductsPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Simulasi API call ke Product Service
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
    // Inisialisasi cart count dari localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
  }, [])

  const filterProducts = (category) => {
    setSelectedCategory(category)
    if (category === "All") {
      setProducts(MOCK_PRODUCTS)
    } else {
      setProducts(MOCK_PRODUCTS.filter((product) => product.category === category))
    }
  }

  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = getCartItems();
      setCartCount(cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0));
    };
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount);
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  function addToCart(product) {
    const cartItems = getCartItems();
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        productId: product.id,
        quantity: 1
      });
    }
    setCartItems(cartItems);
    setCartCount(cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0));
  }

  const router = useRouter();
  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    };
    updateCartCount();
    router.events?.on('routeChangeComplete', updateCartCount);
    return () => {
      router.events?.off('routeChangeComplete', updateCartCount);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            MicroShop
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/products" className="text-gray-900 font-medium">
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
        <h1 className="text-3xl font-bold mb-8">Products</h1>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-gray-500" />
            <span className="text-gray-700">Filter by:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => filterProducts(category)}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="ml-auto">
            <div className="relative inline-block">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-md text-gray-700">
                Sort by <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="bg-gray-300 h-48 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-5 bg-gray-300 rounded w-1/4 mb-4"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <img
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-blue-600 font-bold mb-3">${product.price.toFixed(2)}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${product.stock > 10 ? "text-green-600" : "text-orange-600"}`}>
                      {product.stock} in stock
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
