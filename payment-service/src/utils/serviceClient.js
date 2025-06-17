const axios = require("axios")

class ServiceClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  async query(query, variables = {}) {
    try {
      const response = await this.client.post("", {
        query,
        variables,
      })

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message)
      }

      return response.data.data
    } catch (error) {
      console.error("Service call failed:", error.message)
      throw error
    }
  }
}

const orderService = new ServiceClient(process.env.ORDER_SERVICE_URL)

module.exports = {
  ServiceClient,
  orderService,
}
