const express = require("express")
const { ApolloServer } = require("apollo-server-express")
const cors = require("cors")
require("dotenv").config()

const typeDefs = require("./schema")
const resolvers = require("./resolvers")
const { connectDB } = require("./database")
const { getShippingStats } = require("./models/Shipment")

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
      service: "Shipping Service",
      version: "1.0.0",
      status: "running",
      port: process.env.PORT || 3005,
      endpoints: {
        graphql: "/graphql",
        health: "/health",
        docs: "/docs",
        data: "/data",
        stats: "/stats",
        carriers: "/carriers",
      },
      description: "Microservice for shipping calculations, tracking, and delivery management",
      author: "Microservices Team",
      supportedCarriers: ["FEDEX", "UPS", "DHL", "USPS"],
      dependencies: ["order-service"],
      timestamp: new Date().toISOString(),
    })
  })

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({
      status: "healthy",
      service: "shipping-service",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
      database: "connected",
      carriers: {
        fedex: "available",
        ups: "available",
        dhl: "available",
        usps: "available",
      },
    })
  })

  // Data endpoint - show sample shipments (empty initially)
  app.get("/data", async (req, res) => {
    try {
      res.json({
        service: "Shipping Service",
        dataType: "shipments",
        count: 0,
        timestamp: new Date().toISOString(),
        note: "No shipments yet. Shipments will appear here after orders are shipped.",
        sampleStructure: {
          id: "shipment-uuid",
          orderId: "order-uuid",
          userId: "user-id",
          carrier: "FEDEX",
          trackingNumber: "FX12345678ABC",
          status: "IN_TRANSIT",
          cost: 15.99,
          estimatedDelivery: "2023-01-05T00:00:00.000Z",
          shippingAddress: {
            street: "123 Main St",
            city: "Anytown",
            state: "CA",
            zipCode: "12345",
            country: "USA",
          },
          createdAt: "2023-01-01T00:00:00.000Z",
          updatedAt: "2023-01-01T00:00:00.000Z",
        },
        data: [],
      })
    } catch (error) {
      res.status(500).json({
        service: "Shipping Service",
        error: "Failed to fetch shipments",
        message: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  })

  // Stats endpoint
  app.get("/stats", async (req, res) => {
    try {
      const stats = await getShippingStats()
      res.json({
        service: "Shipping Service",
        dataType: "statistics",
        timestamp: new Date().toISOString(),
        data: stats,
      })
    } catch (error) {
      res.status(500).json({
        service: "Shipping Service",
        error: "Failed to fetch stats",
        message: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  })

  // Carriers endpoint
  app.get("/carriers", (req, res) => {
    res.json({
      service: "Shipping Service",
      dataType: "carriers",
      timestamp: new Date().toISOString(),
      data: [
        {
          code: "FEDEX",
          name: "FedEx",
          services: ["Ground", "Express", "Overnight"],
          baseRate: 1.2,
          estimatedDays: "2-5",
        },
        {
          code: "UPS",
          name: "UPS",
          services: ["Ground", "Express", "Next Day"],
          baseRate: 1.1,
          estimatedDays: "3-7",
        },
        {
          code: "DHL",
          name: "DHL",
          services: ["Express", "International"],
          baseRate: 1.5,
          estimatedDays: "1-3",
        },
        {
          code: "USPS",
          name: "USPS",
          services: ["Priority", "Express", "Ground"],
          baseRate: 0.9,
          estimatedDays: "2-8",
        },
      ],
    })
  })

  // API documentation endpoint
  app.get("/docs", (req, res) => {
    res.json({
      service: "Shipping Service API Documentation",
      graphqlEndpoint: "/graphql",
      queries: [
        "calculateShipping(input: ShippingCalculationInput!): [ShippingOption!]!",
        "getShipment(id: ID!): Shipment",
        "trackShipment(trackingNumber: String!): [TrackingInfo!]!",
        "getOrderShipments(orderId: ID!): [Shipment!]!",
        "getUserShipments(userId: ID!): [Shipment!]!",
        "getShippingStats: ShippingStats!",
      ],
      mutations: [
        "createShipment(input: ShipmentInput!): Shipment!",
        "updateShipmentStatus(id: ID!, status: ShipmentStatus!, location: String): Shipment!",
        "markAsDelivered(id: ID!): Shipment!",
      ],
      types: {
        Shipment: {
          id: "ID!",
          orderId: "ID!",
          userId: "ID!",
          carrier: "String!",
          trackingNumber: "String!",
          status: "ShipmentStatus!",
          cost: "Float!",
          estimatedDelivery: "String",
          actualDelivery: "String",
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

  const PORT = process.env.PORT || 3005

  app.listen(PORT, () => {
    console.log(`🚀 Shipping Service running on http://localhost:${PORT}`)
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`)
    console.log(`🏥 Health check: http://localhost:${PORT}/health`)
    console.log(`📚 Documentation: http://localhost:${PORT}/docs`)
    console.log(`📄 Data endpoint: http://localhost:${PORT}/data`)
    console.log(`📈 Stats endpoint: http://localhost:${PORT}/stats`)
    console.log(`🚚 Carriers endpoint: http://localhost:${PORT}/carriers`)
  })
}

startServer().catch((error) => {
  console.error("Error starting server:", error)
})
