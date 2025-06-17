// Shipping calculation utilities

const SHIPPING_CARRIERS = {
  FEDEX: "FedEx",
  UPS: "UPS",
  DHL: "DHL",
  USPS: "USPS",
}

const calculateShippingOptions = async (input) => {
  const { fromZipCode, toZipCode, weight, dimensions } = input

  // Calculate distance (simplified - in real app, use actual distance calculation)
  const distance = calculateDistance(fromZipCode, toZipCode)

  // Calculate volume
  const volume = dimensions.length * dimensions.width * dimensions.height

  const options = [
    {
      id: "fedex-standard",
      name: "FedEx Ground",
      carrier: "FEDEX",
      cost: calculateCost(distance, weight, volume, 1.2),
      estimatedDays: Math.ceil(distance / 500) + 2,
      description: "Standard ground shipping",
    },
    {
      id: "fedex-express",
      name: "FedEx Express",
      carrier: "FEDEX",
      cost: calculateCost(distance, weight, volume, 2.5),
      estimatedDays: 2,
      description: "Express 2-day shipping",
    },
    {
      id: "ups-ground",
      name: "UPS Ground",
      carrier: "UPS",
      cost: calculateCost(distance, weight, volume, 1.1),
      estimatedDays: Math.ceil(distance / 500) + 3,
      description: "UPS ground shipping",
    },
    {
      id: "ups-express",
      name: "UPS Next Day",
      carrier: "UPS",
      cost: calculateCost(distance, weight, volume, 4.0),
      estimatedDays: 1,
      description: "Next day delivery",
    },
    {
      id: "usps-priority",
      name: "USPS Priority",
      carrier: "USPS",
      cost: calculateCost(distance, weight, volume, 0.9),
      estimatedDays: Math.ceil(distance / 400) + 2,
      description: "USPS Priority Mail",
    },
  ]

  return options
}

const calculateDistance = (fromZip, toZip) => {
  // Simplified distance calculation
  // In real app, use actual geolocation API
  const zipDiff = Math.abs(Number.parseInt(fromZip) - Number.parseInt(toZip))
  return Math.min(zipDiff * 10, 3000) // Max 3000 miles
}

const calculateCost = (distance, weight, volume, multiplier) => {
  const baseCost = 5.99
  const distanceCost = distance * 0.001
  const weightCost = weight * 0.5
  const volumeCost = volume * 0.0001

  return Number.parseFloat(((baseCost + distanceCost + weightCost + volumeCost) * multiplier).toFixed(2))
}

const generateTrackingNumber = (carrier) => {
  const prefix =
    {
      FEDEX: "FX",
      UPS: "1Z",
      DHL: "DH",
      USPS: "US",
    }[carrier] || "XX"

  const timestamp = Date.now().toString().slice(-8)
  const random = Math.random().toString(36).substr(2, 6).toUpperCase()

  return `${prefix}${timestamp}${random}`
}

const getTrackingInfo = async (trackingNumber) => {
  // Simulate tracking information
  // In real app, integrate with actual carrier APIs

  const statuses = ["PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED"]
  const locations = ["Origin Facility", "Sorting Facility", "Local Facility", "Destination"]

  const trackingInfo = []
  const currentStatus = Math.floor(Math.random() * statuses.length)

  for (let i = 0; i <= currentStatus; i++) {
    trackingInfo.push({
      trackingNumber,
      status: statuses[i],
      location: locations[i],
      timestamp: new Date(Date.now() - (currentStatus - i) * 24 * 60 * 60 * 1000).toISOString(),
      description: getStatusDescription(statuses[i], locations[i]),
    })
  }

  return trackingInfo.reverse() // Most recent first
}

const getStatusDescription = (status, location) => {
  const descriptions = {
    PICKED_UP: `Package picked up at ${location}`,
    IN_TRANSIT: `Package in transit at ${location}`,
    OUT_FOR_DELIVERY: `Package out for delivery from ${location}`,
    DELIVERED: `Package delivered at ${location}`,
  }

  return descriptions[status] || `Package status: ${status}`
}

module.exports = {
  calculateShippingOptions,
  generateTrackingNumber,
  getTrackingInfo,
}
