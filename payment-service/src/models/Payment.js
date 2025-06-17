const { getConnection } = require("../database")
const { v4: uuidv4 } = require("uuid")

const createPayment = async (paymentData) => {
  const connection = getConnection()

  const paymentId = uuidv4()
  const { orderId, userId, amount, currency, method, status } = paymentData

  await connection.execute(
    `INSERT INTO payments (id, orderId, userId, amount, currency, method, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [paymentId, orderId, userId, amount, currency, method, status],
  )

  return getPaymentById(paymentId)
}

const getPaymentById = async (id) => {
  const connection = getConnection()

  const [rows] = await connection.execute("SELECT * FROM payments WHERE id = ?", [id])

  if (rows.length === 0) {
    return null
  }

  return formatPayment(rows[0])
}

const getPaymentsByUserId = async (userId) => {
  const connection = getConnection()

  const [rows] = await connection.execute("SELECT * FROM payments WHERE userId = ? ORDER BY createdAt DESC", [userId])

  return rows.map(formatPayment)
}

const getPaymentsByOrderId = async (orderId) => {
  const connection = getConnection()

  const [rows] = await connection.execute("SELECT * FROM payments WHERE orderId = ? ORDER BY createdAt DESC", [orderId])

  return rows.map(formatPayment)
}

const updatePaymentStatus = async (id, status, transactionId = null, gatewayResponse = null) => {
  const connection = getConnection()

  await connection.execute("UPDATE payments SET status = ?, transactionId = ?, gatewayResponse = ? WHERE id = ?", [
    status,
    transactionId,
    gatewayResponse,
    id,
  ])

  return getPaymentById(id)
}

const getPaymentStats = async () => {
  const connection = getConnection()

  const [totalRows] = await connection.execute("SELECT COUNT(*) as count, SUM(amount) as total FROM payments")
  const [successfulRows] = await connection.execute("SELECT COUNT(*) as count FROM payments WHERE status = 'COMPLETED'")
  const [failedRows] = await connection.execute("SELECT COUNT(*) as count FROM payments WHERE status = 'FAILED'")
  const [pendingRows] = await connection.execute("SELECT COUNT(*) as count FROM payments WHERE status = 'PENDING'")

  return {
    totalPayments: totalRows[0].count,
    totalAmount: totalRows[0].total || 0,
    successfulPayments: successfulRows[0].count,
    failedPayments: failedRows[0].count,
    pendingPayments: pendingRows[0].count,
  }
}

const formatPayment = (payment) => {
  return {
    id: payment.id,
    orderId: payment.orderId,
    userId: payment.userId,
    amount: Number.parseFloat(payment.amount),
    currency: payment.currency,
    method: payment.method,
    status: payment.status,
    transactionId: payment.transactionId,
    gatewayResponse: payment.gatewayResponse,
    createdAt: payment.createdAt.toISOString(),
    updatedAt: payment.updatedAt.toISOString(),
  }
}

module.exports = {
  createPayment,
  getPaymentById,
  getPaymentsByUserId,
  getPaymentsByOrderId,
  updatePaymentStatus,
  getPaymentStats,
}
