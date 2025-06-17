const { getConnection } = require("../database")

const createProduct = async (productData) => {
  const connection = getConnection()

  const { name, description, price, category, stock, imageUrl } = productData

  const [result] = await connection.execute(
    `INSERT INTO products (name, description, price, category, stock, imageUrl) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, price, category, stock, imageUrl || null],
  )

  return getProductById(result.insertId)
}

const getProductById = async (id) => {
  const connection = getConnection()

  const [rows] = await connection.execute("SELECT * FROM products WHERE id = ?", [id])

  if (rows.length === 0) {
    return null
  }

  return formatProduct(rows[0])
}

const getAllProducts = async (filter = {}, limit = 50, offset = 0) => {
  const connection = getConnection()

  let query = "SELECT * FROM products WHERE 1=1"
  const params = []

  if (filter.category) {
    query += " AND category = ?"
    params.push(filter.category)
  }

  if (filter.minPrice !== undefined) {
    query += " AND price >= ?"
    params.push(filter.minPrice)
  }

  if (filter.maxPrice !== undefined) {
    query += " AND price <= ?"
    params.push(filter.maxPrice)
  }

  if (filter.inStock) {
    query += " AND stock > 0"
  }

  query += " ORDER BY createdAt DESC"

  try {
    console.log("Executing query without LIMIT:", query)
    console.log("With params:", params)

    const [rows] = await connection.execute(query, params)

    // Apply limit and offset in JavaScript instead of SQL
    const startIndex = offset || 0
    const endIndex = startIndex + (limit || 50)
    const limitedRows = rows.slice(startIndex, endIndex)

    return limitedRows.map(formatProduct)
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error(`Database query failed: ${error.message}`)
  }
}

const getProductsByCategory = async (category) => {
  const connection = getConnection()

  const [rows] = await connection.execute("SELECT * FROM products WHERE category = ? ORDER BY name", [category])

  return rows.map(formatProduct)
}

const searchProducts = async (searchQuery) => {
  const connection = getConnection()

  const [rows] = await connection.execute(
    "SELECT * FROM products WHERE name LIKE ? OR description LIKE ? ORDER BY name",
    [`%${searchQuery}%`, `%${searchQuery}%`],
  )

  return rows.map(formatProduct)
}

const getCategories = async () => {
  const connection = getConnection()

  const [rows] = await connection.execute("SELECT DISTINCT category FROM products ORDER BY category")

  return rows.map((row) => row.category)
}

const updateProductById = async (id, updateData) => {
  const connection = getConnection()

  const fields = []
  const values = []

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      fields.push(`${key} = ?`)
      values.push(updateData[key])
    }
  })

  if (fields.length === 0) {
    throw new Error("No fields to update")
  }

  values.push(id)

  await connection.execute(`UPDATE products SET ${fields.join(", ")} WHERE id = ?`, values)

  return getProductById(id)
}

const updateStock = async (id, quantity) => {
  const connection = getConnection()

  await connection.execute("UPDATE products SET stock = ? WHERE id = ?", [quantity, id])

  return getProductById(id)
}

const deleteProductById = async (id) => {
  const connection = getConnection()

  const [result] = await connection.execute("DELETE FROM products WHERE id = ?", [id])

  return result.affectedRows > 0
}

const formatProduct = (product) => {
  return {
    id: product.id.toString(),
    name: product.name,
    description: product.description,
    price: Number.parseFloat(product.price),
    category: product.category,
    stock: product.stock,
    imageUrl: product.imageUrl,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }
}

module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
  getProductsByCategory,
  searchProducts,
  getCategories,
  updateProductById,
  updateStock,
  deleteProductById,
}
