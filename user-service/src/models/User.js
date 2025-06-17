const { getConnection } = require("../database")

const createUser = async (userData) => {
  const connection = getConnection()

  const { name, email, password, phone, address } = userData

  const [result] = await connection.execute(
    `INSERT INTO users (name, email, password, phone, street, city, state, zipCode, country) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      email,
      password,
      phone || null,
      address?.street || null,
      address?.city || null,
      address?.state || null,
      address?.zipCode || null,
      address?.country || null,
    ],
  )

  return getUserById(result.insertId)
}

const getUserById = async (id) => {
  const connection = getConnection()

  const [rows] = await connection.execute("SELECT * FROM users WHERE id = ?", [id])

  if (rows.length === 0) {
    return null
  }

  return formatUser(rows[0])
}

const getUserByEmail = async (email) => {
  const connection = getConnection()

  const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email])

  if (rows.length === 0) {
    return null
  }

  return formatUser(rows[0])
}

const getAllUsers = async () => {
  const connection = getConnection()

  const [rows] = await connection.execute("SELECT * FROM users ORDER BY createdAt DESC")

  return rows.map(formatUser)
}

const updateUserById = async (id, updateData) => {
  const connection = getConnection()

  const { name, email, phone, address } = updateData

  const fields = []
  const values = []

  if (name) {
    fields.push("name = ?")
    values.push(name)
  }
  if (email) {
    fields.push("email = ?")
    values.push(email)
  }
  if (phone) {
    fields.push("phone = ?")
    values.push(phone)
  }
  if (address) {
    if (address.street) {
      fields.push("street = ?")
      values.push(address.street)
    }
    if (address.city) {
      fields.push("city = ?")
      values.push(address.city)
    }
    if (address.state) {
      fields.push("state = ?")
      values.push(address.state)
    }
    if (address.zipCode) {
      fields.push("zipCode = ?")
      values.push(address.zipCode)
    }
    if (address.country) {
      fields.push("country = ?")
      values.push(address.country)
    }
  }

  if (fields.length === 0) {
    throw new Error("No fields to update")
  }

  values.push(id)

  await connection.execute(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values)

  return getUserById(id)
}

const deleteUserById = async (id) => {
  const connection = getConnection()

  const [result] = await connection.execute("DELETE FROM users WHERE id = ?", [id])

  return result.affectedRows > 0
}

const formatUser = (user) => {
  return {
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    password: user.password, // Keep password for internal use
    phone: user.phone,
    address: {
      street: user.street,
      city: user.city,
      state: user.state,
      zipCode: user.zipCode,
      country: user.country,
    },
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getAllUsers,
  updateUserById,
  deleteUserById,
}
