const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const mysql = require('mysql2/promise')
const cors = require('cors') // ✅ tambahkan
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
require('dotenv').config()

async function startServer() {
  const app = express()

  const pool = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  // ✅ Atur CORS sebelum applyMiddleware
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }))

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ pool }),
  })

  await server.start()
  server.applyMiddleware({ app, cors: false }) // ✅ DISABLE cors Apollo internal

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  })
}

startServer()
