const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (_, { input }, { pool }) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address
    } = input

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT secret not defined in environment variables.')
    }

    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    if (existing.length > 0) {
      throw new Error('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await pool.query(
      `INSERT INTO users (name, email, password, phone, street, city, state, zipCode, country)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        hashedPassword,
        phone || null,
        address?.street || null,
        address?.city || null,
        address?.state || null,
        address?.zipCode || null,
        address?.country || null
      ]
    )

    const [userRows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    if (userRows.length === 0) {
      throw new Error('User creation failed')
    }

    const user = userRows[0]

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })

    return {
      token,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: {
          street: user.street,
          city: user.city,
          state: user.state,
          zipCode: user.zipCode,
          country: user.country
        },
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      }
    }

  } catch (err) {
    console.error('❌ Register Error:', err)
    throw new Error(err.message || 'Failed to register user')
  }
}

module.exports = {
  Mutation: {
    register
  }
}
