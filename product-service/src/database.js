const mysql = require("mysql2/promise")

let connection

const connectDB = async () => {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "product_db",
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
    // Create products table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        imageUrl VARCHAR(500),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_price (price),
        INDEX idx_stock (stock)
      )
    `)

    console.log("✅ Product tables created/verified")
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
