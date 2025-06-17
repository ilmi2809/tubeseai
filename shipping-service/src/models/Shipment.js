const { getConnection } = require("../database")
const { v4: uuidv4 } = require("uuid")

const createShipment = async (shipmentData) => {
  const connection = getConnection()

  const shipmentId = uuidv4()
  const { orderId, userId, carrier, trackingNumber, cost, estimatedDelivery, shippingAddress } = shipmentData

  await connection.execute(
    `INSERT INTO shipments (id, orderId, userId, carrier, trackingNumber, cost, estimatedDelivery, street, city, state, zipCode, country) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      shipmentId,
      orderId,
      userId,
      carrier,
      trackingNumber,
      cost,
      estimatedDelivery,
      shippingAddress.street,
      shippingAddress.city,
      shippingAddress.state,
      shippingAddress.zipCode,
      shippingAddress.country,
    ],
  )

  return getShipmentById(shipmentId)
}

const getShipmentById = async (id) => {
  const connection = getConnection()

  const [rows] = await connection.execute("SELECT * FROM shipments WHERE id = ?", [id])

  if (rows.length === 0) {
    return null
  }

  return formatShipment(rows[0])
}

const getShipmentsByOrderId = async (orderId) => {
  const connection = getConnection()

  const [rows] = await connection.execute("SELECT * FROM shipments WHERE orderId = ? ORDER BY createdAt DESC", [
    orderId,
  ])

  return rows.map(formatShipment)
}

const getShipmentsByUserId = async (userId) => {
  const connection = getConnection()

  const [rows] = await connection.execute("SELECT * FROM shipments WHERE userId = ? ORDER BY createdAt DESC", [userId])

  return rows.map(formatShipment)
}

const updateShipmentStatus = async (id, status, location = null, actualDelivery = null) => {
  const connection = getConnection()

  let query = "UPDATE shipments SET status = ?"
  const params = [status]

  if (location) {
    query += ", location = ?"
    params.push(location)
  }

  if (actualDelivery) {
    query += ", actualDelivery = ?"
    params.push(actualDelivery)
  }

  query += " WHERE id = ?"
  params.push(id)

  await connection.execute(query, params)

  return getShipmentById(id)
}

const getShippingStats = async () => {
  const connection = getConnection()

  const [totalRows] = await connection.execute("SELECT COUNT(*) as count FROM shipments")
  const [pendingRows] = await connection.execute("SELECT COUNT(*) as count FROM shipments WHERE status = 'PENDING'")
  const [inTransitRows] = await connection.execute(
    "SELECT COUNT(*) as count FROM shipments WHERE status = 'IN_TRANSIT'",
  )
  const [deliveredRows] = await connection.execute("SELECT COUNT(*) as count FROM shipments WHERE status = 'DELIVERED'")

  // Calculate average delivery time
  const [avgDeliveryRows] = await connection.execute(`
    SELECT AVG(DATEDIFF(actualDelivery, createdAt)) as avgDays 
    FROM shipments 
    WHERE status = 'DELIVERED' AND actualDelivery IS NOT NULL
  `)

  return {
    totalShipments: totalRows[0].count,
    pendingShipments: pendingRows[0].count,
    inTransitShipments: inTransitRows[0].count,
    deliveredShipments: deliveredRows[0].count,
    averageDeliveryTime: avgDeliveryRows[0].avgDays || 0,
  }
}

const formatShipment = (shipment) => {
  return {
    id: shipment.id,
    orderId: shipment.orderId,
    userId: shipment.userId,
    carrier: shipment.carrier,
    trackingNumber: shipment.trackingNumber,
    status: shipment.status,
    estimatedDelivery: shipment.estimatedDelivery?.toISOString(),
    actualDelivery: shipment.actualDelivery?.toISOString(),
    cost: Number.parseFloat(shipment.cost),
    shippingAddress: {
      street: shipment.street,
      city: shipment.city,
      state: shipment.state,
      zipCode: shipment.zipCode,
      country: shipment.country,
    },
    createdAt: shipment.createdAt.toISOString(),
    updatedAt: shipment.updatedAt.toISOString(),
  }
}

module.exports = {
  createShipment,
  getShipmentById,
  getShipmentsByOrderId,
  getShipmentsByUserId,
  updateShipmentStatus,
  getShippingStats,
}
