const {
  createShipment,
  getShipmentById,
  getShipmentsByOrderId,
  getShipmentsByUserId,
  updateShipmentStatus,
  getShippingStats,
} = require("./models/Shipment")
const { calculateShippingOptions, generateTrackingNumber, getTrackingInfo } = require("./utils/shippingUtils")
const { orderService } = require("./utils/serviceClient")

const resolvers = {
  Query: {
    calculateShipping: async (_, { input }) => {
      try {
        const options = await calculateShippingOptions(input)
        return options
      } catch (error) {
        throw new Error(`Failed to calculate shipping: ${error.message}`)
      }
    },

    getShipment: async (_, { id }) => {
      try {
        const shipment = await getShipmentById(id)
        return shipment
      } catch (error) {
        throw new Error(`Failed to get shipment: ${error.message}`)
      }
    },

    trackShipment: async (_, { trackingNumber }) => {
      try {
        const trackingInfo = await getTrackingInfo(trackingNumber)
        return trackingInfo
      } catch (error) {
        throw new Error(`Failed to track shipment: ${error.message}`)
      }
    },

    getOrderShipments: async (_, { orderId }) => {
      try {
        const shipments = await getShipmentsByOrderId(orderId)
        return shipments
      } catch (error) {
        throw new Error(`Failed to get order shipments: ${error.message}`)
      }
    },

    getUserShipments: async (_, { userId }) => {
      try {
        const shipments = await getShipmentsByUserId(userId)
        return shipments
      } catch (error) {
        throw new Error(`Failed to get user shipments: ${error.message}`)
      }
    },

    getShippingStats: async () => {
      try {
        const stats = await getShippingStats()
        return stats
      } catch (error) {
        throw new Error(`Failed to get shipping stats: ${error.message}`)
      }
    },
  },

  Mutation: {
    createShipment: async (_, { input }) => {
      try {
        // Validate order exists
        const orderData = await orderService.query(
          `
          query GetOrder($id: ID!) {
            getOrder(id: $id) {
              id
              userId
              status
              totalAmount
            }
          }
        `,
          { id: input.orderId },
        )

        if (!orderData.getOrder) {
          throw new Error("Order not found")
        }

        const order = orderData.getOrder
        if (order.status !== "CONFIRMED" && order.status !== "PROCESSING") {
          throw new Error("Order must be confirmed before shipping")
        }

        // Calculate shipping cost
        const shippingOptions = await calculateShippingOptions({
          fromZipCode: "12345", // Warehouse zip code
          toZipCode: input.shippingAddress.zipCode,
          weight: input.weight,
          dimensions: input.dimensions,
        })

        const selectedOption = shippingOptions.find((option) => option.carrier === input.carrier)
        if (!selectedOption) {
          throw new Error("Invalid shipping carrier")
        }

        // Generate tracking number
        const trackingNumber = generateTrackingNumber(input.carrier)

        // Create shipment
        const shipmentData = {
          ...input,
          trackingNumber,
          cost: selectedOption.cost,
          estimatedDelivery: new Date(Date.now() + selectedOption.estimatedDays * 24 * 60 * 60 * 1000).toISOString(),
        }

        const shipment = await createShipment(shipmentData)

        // Update order status to shipped
        await orderService.query(
          `
          mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
            updateOrderStatus(id: $id, status: $status) {
              id
              status
            }
          }
        `,
          { id: input.orderId, status: "SHIPPED" },
        )

        return shipment
      } catch (error) {
        throw new Error(`Failed to create shipment: ${error.message}`)
      }
    },

    updateShipmentStatus: async (_, { id, status, location }) => {
      try {
        const shipment = await updateShipmentStatus(id, status, location)

        // If delivered, update order status
        if (status === "DELIVERED") {
          await orderService.query(
            `
            mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
              updateOrderStatus(id: $id, status: $status) {
                id
                status
              }
            }
          `,
            { id: shipment.orderId, status: "DELIVERED" },
          )
        }

        return shipment
      } catch (error) {
        throw new Error(`Failed to update shipment status: ${error.message}`)
      }
    },

    markAsDelivered: async (_, { id }) => {
      try {
        const shipment = await updateShipmentStatus(id, "DELIVERED", null, new Date().toISOString())

        // Update order status to delivered
        await orderService.query(
          `
          mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
            updateOrderStatus(id: $id, status: $status) {
              id
              status
            }
          }
        `,
          { id: shipment.orderId, status: "DELIVERED" },
        )

        return shipment
      } catch (error) {
        throw new Error(`Failed to mark as delivered: ${error.message}`)
      }
    },
  },
}

module.exports = resolvers
