const mysql = require("mysql2/promise")

let connection

const connectDB = async () => {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "user_db",
      port: process.env.DB_PORT || 3306,
    })

    console.log("✅ Connected to MySQL database")

    // Create tables if they don't exist
    await createTables()
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    process.exit(1)
  }
}

const createTables = async () => {
  try {
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        street VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        zipCode VARCHAR(20),
        country VARCHAR(100),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    console.log("✅ Users table created/verified")
  } catch (error) {
    console.error("❌ Error creating tables:", error)
  }
}

const getConnection = () => {
  if (!connection) {
    throw new Error("Database not connected")
  }
  return connection
}

module.exports = {
  connectDB,
  getConnection,
}
