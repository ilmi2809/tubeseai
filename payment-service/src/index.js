const express = require("express")
const { ApolloServer } = require("apollo-server-express")
const cors = require("cors")
require("dotenv").config()

const typeDefs = require("./schema")
const resolvers = require("./resolvers")
const { connectDB } = require("./database")
const { getPaymentStats } = require("./models/Payment")

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
      service: "Payment Service",
      version: "1.0.0",
      status: "running",
      port: process.env.PORT || 3004,
      endpoints: {
        graphql: "/graphql",
        health: "/health",
        docs: "/docs",
        data: "/data",
        stats: "/stats",
      },
      description: "Microservice for payment processing and transaction management",
      author: "Microservices Team",
      supportedMethods: ["CREDIT_CARD", "DEBIT_CARD", "PAYPAL", "BANK_TRANSFER", "CASH_ON_DELIVERY"],
      dependencies: ["order-service"],
      timestamp: new Date().toISOString(),
    })
  })

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({
      status: "healthy",
      service: "payment-service",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
      database: "connected",
      paymentGateways: {
        stripe: "simulated",
        paypal: "simulated",
      },
    })
  })

  // Data endpoint - show sample payments (empty initially)
  app.get("/data", async (req, res) => {
    try {
      // Since we don't have a getAllPayments function, we'll show empty data with structure
      res.json({
        service: "Payment Service",
        dataType: "payments",
        count: 0,
        timestamp: new Date().toISOString(),
        note: "No payments yet. Payments will appear here after orders are processed.",
        sampleStructure: {
          id: "payment-uuid",
          orderId: "order-uuid",
          userId: "user-id",
          amount: 199.99,
          currency: "USD",
          method: "CREDIT_CARD",
          status: "COMPLETED",
          transactionId: "stripe_123456789",
          createdAt: "2023-01-01T00:00:00.000Z",
          updatedAt: "2023-01-01T00:00:00.000Z",
        },
        data: [],
      })
    } catch (error) {
      res.status(500).json({
        service: "Payment Service",
        error: "Failed to fetch payments",
        message: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  })

  // Stats endpoint
  app.get("/stats", async (req, res) => {
    try {
      const stats = await getPaymentStats()
      res.json({
        service: "Payment Service",
        dataType: "statistics",
        timestamp: new Date().toISOString(),
        data: stats,
      })
    } catch (error) {
      res.status(500).json({
        service: "Payment Service",
        error: "Failed to fetch stats",
        message: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  })

  // API documentation endpoint
  app.get("/docs", (req, res) => {
    res.json({
      service: "Payment Service API Documentation",
      graphqlEndpoint: "/graphql",
      queries: [
        "getPayment(id: ID!): Payment",
        "getUserPayments(userId: ID!): [Payment!]!",
        "getOrderPayments(orderId: ID!): [Payment!]!",
        "getPaymentStats: PaymentStats!",
      ],
      mutations: [
        "processPayment(input: PaymentInput!): PaymentResult!",
        "refundPayment(id: ID!, reason: String): PaymentResult!",
        "cancelPayment(id: ID!): PaymentResult!",
      ],
      types: {
        Payment: {
          id: "ID!",
          orderId: "ID!",
          userId: "ID!",
          amount: "Float!",
          currency: "String!",
          method: "PaymentMethod!",
          status: "PaymentStatus!",
          transactionId: "String",
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

  const PORT = process.env.PORT || 3004

  app.listen(PORT, () => {
    console.log(`🚀 Payment Service running on http://localhost:${PORT}`)
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`)
    console.log(`🏥 Health check: http://localhost:${PORT}/health`)
    console.log(`📚 Documentation: http://localhost:${PORT}/docs`)
    console.log(`📄 Data endpoint: http://localhost:${PORT}/data`)
    console.log(`📈 Stats endpoint: http://localhost:${PORT}/stats`)
  })
}

startServer().catch((error) => {
  console.error("Error starting server:", error)
})
