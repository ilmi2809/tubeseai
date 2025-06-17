const {
  createPayment,
  getPaymentById,
  getPaymentsByUserId,
  getPaymentsByOrderId,
  updatePaymentStatus,
  getPaymentStats,
} = require("./models/Payment")
const { orderService } = require("./utils/serviceClient")
const { processStripePayment, processPayPalPayment } = require("./utils/paymentGateway")

const resolvers = {
  Query: {
    getPayment: async (_, { id }) => {
      try {
        const payment = await getPaymentById(id)
        return payment
      } catch (error) {
        throw new Error(`Failed to get payment: ${error.message}`)
      }
    },

    getUserPayments: async (_, { userId }) => {
      try {
        const payments = await getPaymentsByUserId(userId)
        return payments
      } catch (error) {
        throw new Error(`Failed to get user payments: ${error.message}`)
      }
    },

    getOrderPayments: async (_, { orderId }) => {
      try {
        const payments = await getPaymentsByOrderId(orderId)
        return payments
      } catch (error) {
        throw new Error(`Failed to get order payments: ${error.message}`)
      }
    },

    getPaymentStats: async () => {
      try {
        const stats = await getPaymentStats()
        return stats
      } catch (error) {
        throw new Error(`Failed to get payment stats: ${error.message}`)
      }
    },
  },

  Mutation: {
    processPayment: async (_, { input }) => {
      try {
        // Validate order exists
        const orderData = await orderService.query(
          `
          query GetOrder($id: ID!) {
            getOrder(id: $id) {
              id
              userId
              totalAmount
              status
            }
          }
        `,
          { id: input.orderId },
        )

        if (!orderData.getOrder) {
          return {
            success: false,
            payment: null,
            message: "Order not found",
          }
        }

        const order = orderData.getOrder
        if (order.totalAmount !== input.amount) {
          return {
            success: false,
            payment: null,
            message: "Payment amount does not match order total",
          }
        }

        // Create payment record
        const payment = await createPayment({
          ...input,
          status: "PROCESSING",
        })

        let gatewayResult
        try {
          // Process payment through gateway
          switch (input.method) {
            case "CREDIT_CARD":
            case "DEBIT_CARD":
              gatewayResult = await processStripePayment({
                amount: input.amount,
                currency: input.currency,
                token: input.cardToken,
              })
              break
            case "PAYPAL":
              gatewayResult = await processPayPalPayment({
                amount: input.amount,
                currency: input.currency,
                token: input.paypalToken,
              })
              break
            case "CASH_ON_DELIVERY":
              gatewayResult = {
                success: true,
                transactionId: `COD_${Date.now()}`,
                message: "Cash on delivery payment accepted",
              }
              break
            default:
              throw new Error("Unsupported payment method")
          }

          // Update payment status based on gateway result
          const updatedPayment = await updatePaymentStatus(
            payment.id,
            gatewayResult.success ? "COMPLETED" : "FAILED",
            gatewayResult.transactionId,
            gatewayResult.message,
          )

          // Update order payment status
          if (gatewayResult.success) {
            await orderService.query(
              `
              mutation UpdatePaymentStatus($id: ID!, $status: PaymentStatus!) {
                updatePaymentStatus(id: $id, status: $status) {
                  id
                  paymentStatus
                }
              }
            `,
              { id: input.orderId, status: "PAID" },
            )
          }

          return {
            success: gatewayResult.success,
            payment: updatedPayment,
            message: gatewayResult.message,
          }
        } catch (gatewayError) {
          // Update payment as failed
          const failedPayment = await updatePaymentStatus(payment.id, "FAILED", null, gatewayError.message)

          return {
            success: false,
            payment: failedPayment,
            message: `Payment processing failed: ${gatewayError.message}`,
          }
        }
      } catch (error) {
        throw new Error(`Failed to process payment: ${error.message}`)
      }
    },

    refundPayment: async (_, { id, reason }) => {
      try {
        const payment = await getPaymentById(id)
        if (!payment) {
          return {
            success: false,
            payment: null,
            message: "Payment not found",
          }
        }

        if (payment.status !== "COMPLETED") {
          return {
            success: false,
            payment: null,
            message: "Only completed payments can be refunded",
          }
        }

        // Process refund through gateway
        // This is a simplified implementation
        const refundedPayment = await updatePaymentStatus(
          id,
          "REFUNDED",
          payment.transactionId,
          reason || "Refund processed",
        )

        // Update order payment status
        await orderService.query(
          `
          mutation UpdatePaymentStatus($id: ID!, $status: PaymentStatus!) {
            updatePaymentStatus(id: $id, status: $status) {
              id
              paymentStatus
            }
          }
        `,
          { id: payment.orderId, status: "REFUNDED" },
        )

        return {
          success: true,
          payment: refundedPayment,
          message: "Payment refunded successfully",
        }
      } catch (error) {
        throw new Error(`Failed to refund payment: ${error.message}`)
      }
    },

    cancelPayment: async (_, { id }) => {
      try {
        const payment = await getPaymentById(id)
        if (!payment) {
          return {
            success: false,
            payment: null,
            message: "Payment not found",
          }
        }

        if (payment.status !== "PENDING" && payment.status !== "PROCESSING") {
          return {
            success: false,
            payment: null,
            message: "Only pending or processing payments can be cancelled",
          }
        }

        const cancelledPayment = await updatePaymentStatus(
          id,
          "CANCELLED",
          payment.transactionId,
          "Payment cancelled by user",
        )

        return {
          success: true,
          payment: cancelledPayment,
          message: "Payment cancelled successfully",
        }
      } catch (error) {
        throw new Error(`Failed to cancel payment: ${error.message}`)
      }
    },
  },
}

module.exports = resolvers
