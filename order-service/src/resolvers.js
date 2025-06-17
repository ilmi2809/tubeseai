const {
  createOrder,
  getOrderById,
  getOrdersByUserId,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  getOrderStats,
} = require("./models/Order")
const { userService, productService } = require("./utils/serviceClient")

const resolvers = {
  Query: {
    getOrder: async (_, { id }) => {
      try {
        const order = await getOrderById(id)
        return order
      } catch (error) {
        throw new Error(`Failed to get order: ${error.message}`)
      }
    },

    getUserOrders: async (_, { userId }) => {
      try {
        const orders = await getOrdersByUserId(userId)
        return orders
      } catch (error) {
        throw new Error(`Failed to get user orders: ${error.message}`)
      }
    },

    getAllOrders: async (_, { limit = 50, offset = 0 }) => {
      try {
        const orders = await getAllOrders(limit, offset)
        return orders
      } catch (error) {
        throw new Error(`Failed to get orders: ${error.message}`)
      }
    },

    getOrderStats: async () => {
      try {
        const stats = await getOrderStats()
        return stats
      } catch (error) {
        throw new Error(`Failed to get order stats: ${error.message}`)
      }
    },
  },

  Mutation: {
    createOrder: async (_, { input }) => {
      try {
        // Validate user exists
        const userData = await userService.query(
          `
          query GetUser($id: ID!) {
            getUser(id: $id) {
              id
              name
              email
            }
          }
        `,
          { id: input.userId },
        )

        if (!userData.getUser) {
          throw new Error("User not found")
        }

        // Validate products and calculate total
        let totalAmount = 0
        const validatedItems = []

        for (const item of input.items) {
          const productData = await productService.query(
            `
            query GetProduct($id: ID!) {
              getProduct(id: $id) {
                id
                name
                price
                stock
              }
            }
          `,
            { id: item.productId },
          )

          if (!productData.getProduct) {
            throw new Error(`Product ${item.productId} not found`)
          }

          const product = productData.getProduct
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for product ${product.name}`)
          }

          const subtotal = product.price * item.quantity
          totalAmount += subtotal

          validatedItems.push({
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
            subtotal,
          })
        }

        // Create order
        const orderData = {
          ...input,
          items: validatedItems,
          totalAmount,
        }

        const order = await createOrder(orderData)

        // Update product stock
        for (const item of validatedItems) {
          const productData = await productService.query(
            `
            mutation UpdateStock($id: ID!, $quantity: Int!) {
              updateStock(id: $id, quantity: $quantity) {
                id
                stock
              }
            }
          `,
            {
              id: item.productId,
              quantity: item.quantity,
            },
          )

          // Fetch the updated product data after the mutation
          const updatedProductData = await productService.query(
            `
            query GetProduct($id: ID!) {
              getProduct(id: $id) {
                id
                name
                price
                stock
              }
            }
          `,
            { id: item.productId },
          )
        }

        return order
      } catch (error) {
        throw new Error(`Failed to create order: ${error.message}`)
      }
    },

    updateOrderStatus: async (_, { id, status }) => {
      try {
        const order = await updateOrderStatus(id, status)
        return order
      } catch (error) {
        throw new Error(`Failed to update order status: ${error.message}`)
      }
    },

    updatePaymentStatus: async (_, { id, status }) => {
      try {
        const order = await updatePaymentStatus(id, status)
        return order
      } catch (error) {
        throw new Error(`Failed to update payment status: ${error.message}`)
      }
    },

    cancelOrder: async (_, { id }) => {
      try {
        const order = await updateOrderStatus(id, "CANCELLED")
        return order
      } catch (error) {
        throw new Error(`Failed to cancel order: ${error.message}`)
      }
    },
  },

  // Field resolvers for fetching related data
  Order: {
    user: async (parent) => {
      try {
        const userData = await userService.query(
          `
          query GetUser($id: ID!) {
            getUser(id: $id) {
              id
              name
              email
            }
          }
        `,
          { id: parent.userId },
        )
        return userData.getUser
      } catch (error) {
        console.error("Failed to fetch user:", error)
        return null
      }
    },
  },

  OrderItem: {
    product: async (parent) => {
      try {
        const productData = await productService.query(
          `
          query GetProduct($id: ID!) {
            getProduct(id: $id) {
              id
              name
              price
              stock
            }
          }
        `,
          { id: parent.productId },
        )
        return productData.getProduct
      } catch (error) {
        console.error("Failed to fetch product:", error)
        return null
      }
    },
  },
}

module.exports = resolvers
