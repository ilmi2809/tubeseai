const mysql = require("mysql2/promise")

let connection

const connectDB = async () => {
  const maxRetries = 10
  const retryDelay = 5000 // 5 seconds

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Database connection attempt ${attempt}/${maxRetries}`)

      connection = await mysql.createConnection({
        host: process.env.DB_HOST || "order-db",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "password",
        database: process.env.DB_NAME || "order_db",
        port: process.env.DB_PORT || 3306,
        connectTimeout: 60000,
        acquireTimeout: 60000,
        timeout: 60000,
      })

      console.log("✅ Connected to MySQL database")
      await createTables()
      return
    } catch (error) {
      console.error(`❌ Database connection attempt ${attempt} failed:`, error.message)

      if (attempt === maxRetries) {
        console.error("❌ All database connection attempts failed")
        throw error
      }

      console.log(`⏳ Waiting ${retryDelay / 1000} seconds before retry...`)
      await new Promise((resolve) => setTimeout(resolve, retryDelay))
    }
  }
}

const createTables = async () => {
  try {
    // Create orders table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        totalAmount DECIMAL(10,2) NOT NULL,
        status ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
        paymentStatus ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
        street VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        zipCode VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Create order_items table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id VARCHAR(36) PRIMARY KEY,
        orderId VARCHAR(36) NOT NULL,
        productId VARCHAR(36) NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
      )
    `)

    console.log("✅ Order tables created/verified")
  } catch (error) {
    console.error("❌ Error creating tables:", error)
    throw error
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
