const { gql } = require("apollo-server-express")

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    phone: String
    address: Address
    createdAt: String!
    updatedAt: String!
  }
  
  type Address {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
  }
  
  input UserInput {
    name: String!
    email: String!
    password: String!
    phone: String
    address: AddressInput
  }
  
  input AddressInput {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
  }
  
  input UserUpdateInput {
    name: String
    email: String
    phone: String
    address: AddressInput
  }
  
  type AuthPayload {
    token: String!
    user: User!
  }
  
  type Query {
    # Get user by ID
    getUser(id: ID!): User
    
    # Get all users (admin only)
    getUsers: [User!]!
    
    # Get current user (requires authentication)
    me: User
  }
  
  type Mutation {
    # Register new user
    register(input: UserInput!): AuthPayload!
    
    # Login user
    login(email: String!, password: String!): AuthPayload!
    
    # Update user profile
    updateUser(id: ID!, input: UserUpdateInput!): User!
    
    # Delete user
    deleteUser(id: ID!): Boolean!
  }
`

module.exports = typeDefs
