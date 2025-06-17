const mysql = require("mysql2/promise")

let connection

const connectDB = async () => {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "shipping_db",
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
    // Create shipments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS shipments (
        id VARCHAR(36) PRIMARY KEY,
        orderId VARCHAR(36) NOT NULL,
        userId VARCHAR(36) NOT NULL,
        carrier VARCHAR(50) NOT NULL,
        trackingNumber VARCHAR(100) UNIQUE NOT NULL,
        status ENUM('PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED_DELIVERY', 'RETURNED') DEFAULT 'PENDING',
        cost DECIMAL(10,2) NOT NULL,
        estimatedDelivery DATETIME,
        actualDelivery DATETIME,
        location VARCHAR(255),
        street VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        zipCode VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_order_id (orderId),
        INDEX idx_user_id (userId),
        INDEX idx_tracking (trackingNumber),
        INDEX idx_status (status)
      )
    `)

    console.log("✅ Shipping tables created/verified")
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
