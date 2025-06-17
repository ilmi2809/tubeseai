const { getConnection } = require("../database")
const { v4: uuidv4 } = require("uuid")

const createOrder = async (orderData) => {
  const connection = getConnection()

  try {
    await connection.beginTransaction()

    const orderId = uuidv4()
    const { userId, items, totalAmount, shippingAddress } = orderData

    // Insert order
    await connection.execute(
      `INSERT INTO orders (id, userId, totalAmount, status, paymentStatus, street, city, state, zipCode, country) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        userId,
        totalAmount,
        "PENDING",
        "PENDING",
        shippingAddress.street,
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.zipCode,
        shippingAddress.country,
      ],
    )

    // Insert order items
    for (const item of items) {
      await connection.execute(
        `INSERT INTO order_items (id, orderId, productId, quantity, price, subtotal) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [uuidv4(), orderId, item.productId, item.quantity, item.price, item.subtotal],
      )
    }

    await connection.commit()
    return getOrderById(orderId)
  } catch (error) {
    await connection.rollback()
    throw error
  }
}

const getOrderById = async (id) => {
  const connection = getConnection()

  const [orderRows] = await connection.execute("SELECT * FROM orders WHERE id = ?", [id])

  if (orderRows.length === 0) {
    return null
  }

  const order = orderRows[0]

  // Get order items
  const [itemRows] = await connection.execute("SELECT * FROM order_items WHERE orderId = ?", [id])

  return formatOrder(order, itemRows)
}

const getOrdersByUserId = async (userId) => {
  const connection = getConnection()

  const [orderRows] = await connection.execute("SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC", [
    userId,
  ])

  const orders = []
  for (const order of orderRows) {
    const [itemRows] = await connection.execute("SELECT * FROM order_items WHERE orderId = ?", [order.id])
    orders.push(formatOrder(order, itemRows))
  }

  return orders
}

const getAllOrders = async (limit = 50, offset = 0) => {
  const connection = getConnection()

  try {
    // Fetch all orders without any parameters that could cause issues
    const [orderRows] = await connection.execute("SELECT * FROM orders ORDER BY createdAt DESC")

    // Apply pagination in JavaScript
    const validLimit = Math.max(1, Math.min(Number(limit) || 50, 1000)) // Between 1 and 1000
    const validOffset = Math.max(0, Number(offset) || 0)
    const paginatedOrders = orderRows.slice(validOffset, validOffset + validLimit)

    const orders = []
    for (const order of paginatedOrders) {
      try {
        const [itemRows] = await connection.execute("SELECT * FROM order_items WHERE orderId = ?", [order.id])
        orders.push(formatOrder(order, itemRows))
      } catch (itemError) {
        console.error(`Error fetching items for order ${order.id}:`, itemError)
        // Include order without items if there's an error
        orders.push(formatOrder(order, []))
      }
    }

    return orders
  } catch (error) {
    console.error("Error in getAllOrders:", error)
    throw new Error(`Database query failed: ${error.message}`)
  }
}

const updateOrderStatus = async (id, status) => {
  const connection = getConnection()

  await connection.execute("UPDATE orders SET status = ? WHERE id = ?", [status, id])

  return getOrderById(id)
}

const updatePaymentStatus = async (id, status) => {
  const connection = getConnection()

  await connection.execute("UPDATE orders SET paymentStatus = ? WHERE id = ?", [status, id])

  return getOrderById(id)
}

const getOrderStats = async () => {
  const connection = getConnection()

  try {
    const [totalRows] = await connection.execute("SELECT COUNT(*) as count FROM orders")
    const [pendingRows] = await connection.execute("SELECT COUNT(*) as count FROM orders WHERE status = 'PENDING'")
    const [completedRows] = await connection.execute("SELECT COUNT(*) as count FROM orders WHERE status = 'DELIVERED'")
    const [revenueRows] = await connection.execute(
      "SELECT SUM(totalAmount) as revenue FROM orders WHERE paymentStatus = 'PAID'",
    )

    return {
      totalOrders: totalRows[0].count,
      pendingOrders: pendingRows[0].count,
      completedOrders: completedRows[0].count,
      totalRevenue: revenueRows[0].revenue || 0,
    }
  } catch (error) {
    console.error("Error in getOrderStats:", error)
    return {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalRevenue: 0,
    }
  }
}

const formatOrder = (order, items) => {
  return {
    id: order.id,
    userId: order.userId,
    totalAmount: Number.parseFloat(order.totalAmount),
    status: order.status,
    paymentStatus: order.paymentStatus,
    shippingAddress: {
      street: order.street,
      city: order.city,
      state: order.state,
      zipCode: order.zipCode,
      country: order.country,
    },
    items: items.map((item) => ({
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: Number.parseFloat(item.price),
      subtotal: Number.parseFloat(item.subtotal),
    })),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }
}

const debugOrders = async () => {
  const connection = getConnection()

  try {
    // Simple queries without any complex parameters
    const [tables] = await connection.execute("SHOW TABLES")
    const [orderCount] = await connection.execute("SELECT COUNT(*) as total FROM orders")
    const [itemCount] = await connection.execute("SELECT COUNT(*) as total FROM order_items")

    // Get table structures
    const [orderStructure] = await connection.execute("DESCRIBE orders")
    const [itemStructure] = await connection.execute("DESCRIBE order_items")

    return {
      tables: tables.map((t) => Object.values(t)[0]),
      counts: {
        orders: orderCount[0].total,
        orderItems: itemCount[0].total,
      },
      structures: {
        orders: orderStructure,
        orderItems: itemStructure,
      },
    }
  } catch (error) {
    console.error("Error in debugOrders:", error)
    throw new Error(`Debug query failed: ${error.message}`)
  }
}

module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUserId,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  getOrderStats,
  debugOrders,
}
  