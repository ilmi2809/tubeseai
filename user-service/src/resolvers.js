const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

registerUser: async (_, { input }, { pool }) => {
  const {
    name, email, password, phone, address, city, state, zip, country
  } = input

  // Cek jika email sudah ada
  const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
  if (existing.length > 0) {
    throw new Error('Email already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  await pool.query(
    `INSERT INTO users (name, email, password, phone, address, city, state, zip, country)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, email, hashedPassword, phone, address, city, state, zip, country]
  )

  const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
  const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })

  return {
    token,
    user: {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
    },
  }
}