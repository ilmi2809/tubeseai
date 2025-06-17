const { gql } = require("apollo-server-express")

const typeDefs = gql`
  type Order {
    id: ID!
    userId: ID!
    user: User
    items: [OrderItem!]!
    totalAmount: Float!
    status: OrderStatus!
    shippingAddress: Address!
    paymentStatus: PaymentStatus!
    createdAt: String!
    updatedAt: String!
  }
  
  type OrderItem {
    id: ID!
    orderId: ID!
    productId: ID!
    product: Product
    quantity: Int!
    price: Float!
    subtotal: Float!
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
  }
  
  type Product {
    id: ID!
    name: String!
    price: Float!
    stock: Int!
  }
  
  type Address {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
  }
  
  enum OrderStatus {
    PENDING
    CONFIRMED
    PROCESSING
    SHIPPED
    DELIVERED
    CANCELLED
  }
  
  enum PaymentStatus {
    PENDING
    PAID
    FAILED
    REFUNDED
  }
  
  input OrderInput {
    userId: ID!
    items: [OrderItemInput!]!
    shippingAddress: AddressInput!
  }
  
  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }
  
  input AddressInput {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
  }
  
  type Query {
    # Get order by ID
    getOrder(id: ID!): Order
    
    # Get orders by user ID
    getUserOrders(userId: ID!): [Order!]!
    
    # Get all orders (admin only)
    getAllOrders(limit: Int, offset: Int): [Order!]!
    
    # Get order statistics
    getOrderStats: OrderStats!
  }
  
  type OrderStats {
    totalOrders: Int!
    pendingOrders: Int!
    completedOrders: Int!
    totalRevenue: Float!
  }
  
  type Mutation {
    # Create new order
    createOrder(input: OrderInput!): Order!
    
    # Update order status
    updateOrderStatus(id: ID!, status: OrderStatus!): Order!
    
    # Update payment status
    updatePaymentStatus(id: ID!, status: PaymentStatus!): Order!
    
    # Cancel order
    cancelOrder(id: ID!): Order!
  }
`

module.exports = typeDefs
