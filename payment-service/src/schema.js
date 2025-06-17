const { gql } = require("apollo-server-express")

const typeDefs = gql`
  type Payment {
    id: ID!
    orderId: ID!
    userId: ID!
    amount: Float!
    currency: String!
    method: PaymentMethod!
    status: PaymentStatus!
    transactionId: String
    gatewayResponse: String
    createdAt: String!
    updatedAt: String!
  }
  
  enum PaymentMethod {
    CREDIT_CARD
    DEBIT_CARD
    PAYPAL
    BANK_TRANSFER
    CASH_ON_DELIVERY
  }
  
  enum PaymentStatus {
    PENDING
    PROCESSING
    COMPLETED
    FAILED
    CANCELLED
    REFUNDED
  }
  
  input PaymentInput {
    orderId: ID!
    userId: ID!
    amount: Float!
    currency: String!
    method: PaymentMethod!
    cardToken: String
    paypalToken: String
  }
  
  type PaymentResult {
    success: Boolean!
    payment: Payment
    message: String!
  }
  
  type Query {
    # Get payment by ID
    getPayment(id: ID!): Payment
    
    # Get payments by user ID
    getUserPayments(userId: ID!): [Payment!]!
    
    # Get payments by order ID
    getOrderPayments(orderId: ID!): [Payment!]!
    
    # Get payment statistics
    getPaymentStats: PaymentStats!
  }
  
  type PaymentStats {
    totalPayments: Int!
    totalAmount: Float!
    successfulPayments: Int!
    failedPayments: Int!
    pendingPayments: Int!
  }
  
  type Mutation {
    # Process payment
    processPayment(input: PaymentInput!): PaymentResult!
    
    # Refund payment
    refundPayment(id: ID!, reason: String): PaymentResult!
    
    # Cancel payment
    cancelPayment(id: ID!): PaymentResult!
  }
`

module.exports = typeDefs
