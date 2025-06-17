const mysql = require("mysql2/promise")

let connection

const connectDB = async () => {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "payment_db",
      port: process.env.DB_PORT || 3306,
    })

    console.log("✅ Connected to MySQL database")
    await createTables()
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    process.exit(1)
  }
}

const createTables = async () => {
  try {
    // Create payments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(36) PRIMARY KEY,
        orderId VARCHAR(36) NOT NULL,
        userId VARCHAR(36) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        method ENUM('CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER', 'CASH_ON_DELIVERY') NOT NULL,
        status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED') DEFAULT 'PENDING',
        transactionId VARCHAR(255),
        gatewayResponse TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_order_id (orderId),
        INDEX idx_user_id (userId),
        INDEX idx_status (status)
      )
    `)

    console.log("✅ Payment tables created/verified")
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
