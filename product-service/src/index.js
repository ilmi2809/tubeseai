const express = require("express")
const { ApolloServer } = require("apollo-server-express")
const cors = require("cors")
require("dotenv").config()

const typeDefs = require("./schema")
const resolvers = require("./resolvers")
const { connectDB, getConnection } = require("./database")
const { getAllProducts, getCategories } = require("./models/Product")

async function startServer() {
  const app = express()

  // Enable CORS
  app.use(cors())
  app.use(express.json())

  // Connect to database
  await connectDB()

  // Root endpoint
  app.get("/", (req, res) => {
    res.json({
      service: "Product Service",
      version: "1.0.0",
      status: "running",
      port: process.env.PORT || 3002,
      endpoints: {
        graphql: "/graphql",
        health: "/health",
        docs: "/docs",
        data: "/data",
        categories: "/categories",
        debug: "/debug",
      },
      description: "Microservice for product catalog, inventory, and categories",
      author: "Microservices Team",
      timestamp: new Date().toISOString(),
    })
  })

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({
      status: "healthy",
      service: "product-service",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
      database: "connected",
    })
  })

  // Debug endpoint
  app.get("/debug", async (req, res) => {
    try {
      const connection = getConnection()

      // Check if table exists
      const [tables] = await connection.execute("SHOW TABLES LIKE 'products'")

      // Get table structure
      const [structure] = await connection.execute("DESCRIBE products")

      // Count total products
      const [count] = await connection.execute("SELECT COUNT(*) as total FROM products")

      // Get sample data (without LIMIT parameter binding)
      const [sample] = await connection.execute("SELECT * FROM products ORDER BY id LIMIT 3")

      res.json({
        service: "Product Service Debug",
        timestamp: new Date().toISOString(),
        database: {
          tableExists: tables.length > 0,
          tableStructure: structure,
          totalProducts: count[0].total,
          sampleData: sample,
        },
      })
    } catch (error) {
      res.status(500).json({
        service: "Product Service Debug",
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  })

  // Data endpoint - show all products
  app.get("/data", async (req, res) => {
    try {
      const products = await getAllProducts({}, 50, 0)
      res.json({
        service: "Product Service",
        dataType: "products",
        count: products.length,
        timestamp: new Date().toISOString(),
        data: products,
      })
    } catch (error) {
      console.error("Error fetching products:", error)
      res.status(500).json({
        service: "Product Service",
        error: "Failed to fetch products",
        message: error.message,
        timestamp: new Date().toISOString(),
        debug: {
          errorType: error.constructor.name,
          stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
      })
    }
  })

  // Categories endpoint
  app.get("/categories", async (req, res) => {
    try {
      const categories = await getCategories()
      res.json({
        service: "Product Service",
        dataType: "categories",
        count: categories.length,
        timestamp: new Date().toISOString(),
        data: categories,
      })
    } catch (error) {
      res.status(500).json({
        service: "Product Service",
        error: "Failed to fetch categories",
        message: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  })

  // API documentation endpoint
  app.get("/docs", (req, res) => {
    res.json({
      service: "Product Service API Documentation",
      graphqlEndpoint: "/graphql",
      queries: [
        "getProduct(id: ID!): Product",
        "getProducts(filter: ProductFilter, limit: Int, offset: Int): [Product!]!",
        "getProductsByCategory(category: String!): [Product!]!",
        "searchProducts(query: String!): [Product!]!",
        "getCategories: [String!]!",
      ],
      mutations: [
        "createProduct(input: ProductInput!): Product!",
        "updateProduct(id: ID!, input: ProductUpdateInput!): Product!",
        "updateStock(id: ID!, quantity: Int!): Product!",
        "deleteProduct(id: ID!): Boolean!",
      ],
      types: {
        Product: {
          id: "ID!",
          name: "String!",
          description: "String!",
          price: "Float!",
          category: "String!",
          stock: "Int!",
          imageUrl: "String",
          createdAt: "String!",
          updatedAt: "String!",
        },
      },
    })
  })

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return {
        user: req.user || null,
      }
    },
  })

  await server.start()
  server.applyMiddleware({ app, path: "/graphql" })

  const PORT = process.env.PORT || 3002

  app.listen(PORT, () => {
    console.log(`🚀 Product Service running on http://localhost:${PORT}`)
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`)
    console.log(`🏥 Health check: http://localhost:${PORT}/health`)
    console.log(`📚 Documentation: http://localhost:${PORT}/docs`)
    console.log(`📄 Data endpoint: http://localhost:${PORT}/data`)
    console.log(`🏷️  Categories endpoint: http://localhost:${PORT}/categories`)
    console.log(`🔧 Debug endpoint: http://localhost:${PORT}/debug`)
  })
}

startServer().catch((error) => {
  console.error("Error starting server:", error)
})
