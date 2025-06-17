const express = require("express")
const { ApolloServer } = require("apollo-server-express")
const cors = require("cors")
require("dotenv").config()

const typeDefs = require("./schema")
const resolvers = require("./resolvers")
const { connectDB } = require("./database")

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
      service: "Order Service",
      version: "1.0.0",
      status: "running",
      port: process.env.PORT || 3003,
      endpoints: {
        graphql: "/graphql",
        health: "/health",
        docs: "/docs",
        data: "/data",
        stats: "/stats",
        debug: "/debug",
      },
      description: "Microservice for order processing and management",
      author: "Microservices Team",
      dependencies: ["user-service", "product-service"],
      timestamp: new Date().toISOString(),
    })
  })

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({
      status: "healthy",
      service: "order-service",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
      database: "connected",
      dependencies: {
        userService: process.env.USER_SERVICE_URL,
        productService: process.env.PRODUCT_SERVICE_URL,
      },
    })
  })

  // Debug endpoint
  app.get("/debug", async (req, res) => {
    try {
      const { debugOrders } = require("./models/Order")
      const debugInfo = await debugOrders()

      res.json({
        service: "Order Service Debug",
        timestamp: new Date().toISOString(),
        database: debugInfo,
        environment: {
          nodeVersion: process.version,
          dbHost: process.env.DB_HOST,
          dbName: process.env.DB_NAME,
        },
      })
    } catch (error) {
      console.error("Debug endpoint error:", error)
      res.status(500).json({
        service: "Order Service Debug",
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  })

  // Data endpoint - show all orders
  app.get("/data", async (req, res) => {
    try {
      const { getAllOrders } = require("./models/Order")
      const orders = await getAllOrders(50, 0)

      res.json({
        service: "Order Service",
        dataType: "orders",
        count: orders.length,
        timestamp: new Date().toISOString(),
        data: orders,
      })
    } catch (error) {
      console.error("Data endpoint error:", error)
      res.status(500).json({
        service: "Order Service",
        error: "Failed to fetch orders",
        message: error.message,
        timestamp: new Date().toISOString(),
        debug: {
          errorType: error.constructor.name,
          stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
      })
    }
  })

  // Stats endpoint
  app.get("/stats", async (req, res) => {
    try {
      const { getOrderStats } = require("./models/Order")
      const stats = await getOrderStats()

      res.json({
        service: "Order Service",
        dataType: "statistics",
        timestamp: new Date().toISOString(),
        data: stats,
      })
    } catch (error) {
      console.error("Stats endpoint error:", error)
      res.status(500).json({
        service: "Order Service",
        error: "Failed to fetch stats",
        message: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  })

  // API documentation endpoint
  app.get("/docs", (req, res) => {
    res.json({
      service: "Order Service API Documentation",
      graphqlEndpoint: "/graphql",
      queries: [
        "getOrder(id: ID!): Order",
        "getUserOrders(userId: ID!): [Order!]!",
        "getAllOrders(limit: Int, offset: Int): [Order!]!",
        "getOrderStats: OrderStats!",
      ],
      mutations: [
        "createOrder(input: OrderInput!): Order!",
        "updateOrderStatus(id: ID!, status: OrderStatus!): Order!",
        "updatePaymentStatus(id: ID!, status: PaymentStatus!): Order!",
        "cancelOrder(id: ID!): Order!",
      ],
      types: {
        Order: {
          id: "ID!",
          userId: "ID!",
          items: "[OrderItem!]!",
          totalAmount: "Float!",
          status: "OrderStatus!",
          paymentStatus: "PaymentStatus!",
          shippingAddress: "Address!",
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

  const PORT = process.env.PORT || 3003

  app.listen(PORT, () => {
    console.log(`🚀 Order Service running on http://localhost:${PORT}`)
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`)
    console.log(`🏥 Health check: http://localhost:${PORT}/health`)
    console.log(`📚 Documentation: http://localhost:${PORT}/docs`)
    console.log(`📄 Data endpoint: http://localhost:${PORT}/data`)
    console.log(`📈 Stats endpoint: http://localhost:${PORT}/stats`)
    console.log(`🔧 Debug endpoint: http://localhost:${PORT}/debug`)
  })
}

startServer().catch((error) => {
  console.error("Error starting server:", error)
})
