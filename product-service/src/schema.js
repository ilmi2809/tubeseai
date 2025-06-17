const { gql } = require("apollo-server-express")

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    category: String!
    stock: Int!
    imageUrl: String
    createdAt: String!
    updatedAt: String!
  }
  
  input ProductInput {
    name: String!
    description: String!
    price: Float!
    category: String!
    stock: Int!
    imageUrl: String
  }
  
  input ProductUpdateInput {
    name: String
    description: String
    price: Float
    category: String
    stock: Int
    imageUrl: String
  }
  
  input ProductFilter {
    category: String
    minPrice: Float
    maxPrice: Float
    inStock: Boolean
  }
  
  type Query {
    # Get product by ID
    getProduct(id: ID!): Product
    
    # Get all products with optional filtering
    getProducts(filter: ProductFilter, limit: Int, offset: Int): [Product!]!
    
    # Get products by category
    getProductsByCategory(category: String!): [Product!]!
    
    # Search products by name
    searchProducts(query: String!): [Product!]!
    
    # Get all categories
    getCategories: [String!]!
  }
  
  type Mutation {
    # Create new product
    createProduct(input: ProductInput!): Product!
    
    # Update product
    updateProduct(id: ID!, input: ProductUpdateInput!): Product!
    
    # Delete product
    deleteProduct(id: ID!): Boolean!
    
    # Update stock
    updateStock(id: ID!, quantity: Int!): Product!
  }
`

module.exports = typeDefs
