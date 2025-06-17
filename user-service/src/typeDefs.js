const { gql } = require('apollo-server-express');

const typeDefs = gql(/* GraphQL */ `
  type User {
    id: ID!
    name: String!
    email: String!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    phone: String!
    address: String!
    city: String!
    state: String!
    zip: String!
    country: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    registerUser(input: RegisterInput!): AuthPayload!
    register(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): AuthPayload!
  }

  type Query {
    me: User
  }
`);

module.exports = typeDefs;
