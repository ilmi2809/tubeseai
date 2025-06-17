
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { getUserFromToken } = require('./auth');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

(async () => {
  // Setup MySQL connection pool
  const db = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'microshop',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Initialize Apollo Server with context injection
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const userId = getUserFromToken(req);
      return { db, userId };
    }
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(port, '0.0.0.0', () => {
    console.log(`User service ready at http://0.0.0.0:${port}/graphql`);
  });
})();
