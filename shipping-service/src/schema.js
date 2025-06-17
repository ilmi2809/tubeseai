const { gql } = require("apollo-server-express")

const typeDefs = gql`
  type Shipment {
    id: ID!
    orderId: ID!
    userId: ID!
    carrier: String!
    trackingNumber: String!
    status: ShipmentStatus!
    estimatedDelivery: String
    actualDelivery: String
    shippingAddress: Address!
    cost: Float!
    createdAt: String!
    updatedAt: String!
  }
  
  type Address {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
  }
  
  enum ShipmentStatus {
    PENDING
    PICKED_UP
    IN_TRANSIT
    OUT_FOR_DELIVERY
    DELIVERED
    FAILED_DELIVERY
    RETURNED
  }
  
  type ShippingOption {
    id: ID!
    name: String!
    carrier: String!
    cost: Float!
    estimatedDays: Int!
    description: String!
  }
  
  input ShippingCalculationInput {
    fromZipCode: String!
    toZipCode: String!
    weight: Float!
    dimensions: DimensionsInput!
  }
  
  input DimensionsInput {
    length: Float!
    width: Float!
    height: Float!
  }
  
  input ShipmentInput {
    orderId: ID!
    userId: ID!
    carrier: String!
    shippingAddress: AddressInput!
    weight: Float!
    dimensions: DimensionsInput!
  }
  
  input AddressInput {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
  }
  
  type TrackingInfo {
    trackingNumber: String!
    status: ShipmentStatus!
    location: String
    timestamp: String!
    description: String!
  }
  
  type Query {
    # Calculate shipping options
    calculateShipping(input: ShippingCalculationInput!): [ShippingOption!]!
    
    # Get shipment by ID
    getShipment(id: ID!): Shipment
    
    # Track shipment by tracking number
    trackShipment(trackingNumber: String!): [TrackingInfo!]!
    
    # Get shipments by order ID
    getOrderShipments(orderId: ID!): [Shipment!]!
    
    # Get shipments by user ID
    getUserShipments(userId: ID!): [Shipment!]!
    
    # Get shipping statistics
    getShippingStats: ShippingStats!
  }
  
  type ShippingStats {
    totalShipments: Int!
    pendingShipments: Int!
    inTransitShipments: Int!
    deliveredShipments: Int!
    averageDeliveryTime: Float!
  }
  
  type Mutation {
    # Create new shipment
    createShipment(input: ShipmentInput!): Shipment!
    
    # Update shipment status
    updateShipmentStatus(id: ID!, status: ShipmentStatus!, location: String): Shipment!
    
    # Mark as delivered
    markAsDelivered(id: ID!): Shipment!
  }
`

module.exports = typeDefs
