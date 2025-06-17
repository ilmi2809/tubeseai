const {
  createProduct,
  getProductById,
  getAllProducts,
  getProductsByCategory,
  searchProducts,
  getCategories,
  updateProductById,
  updateStock,
  deleteProductById,
} = require("./models/Product")

const resolvers = {
  Query: {
    getProduct: async (_, { id }) => {
      try {
        const product = await getProductById(id)
        return product
      } catch (error) {
        throw new Error(`Failed to get product: ${error.message}`)
      }
    },

    getProducts: async (_, { filter = {}, limit = 50, offset = 0 }) => {
      try {
        // Pastikan limit dan offset adalah number yang valid
        const validLimit = typeof limit === "number" && limit > 0 ? limit : 50
        const validOffset = typeof offset === "number" && offset >= 0 ? offset : 0

        const products = await getAllProducts(filter, validLimit, validOffset)
        return products
      } catch (error) {
        console.error("Error in getProducts resolver:", error)
        throw new Error(`Failed to get products: ${error.message}`)
      }
    },

    getProductsByCategory: async (_, { category }) => {
      try {
        const products = await getProductsByCategory(category)
        return products
      } catch (error) {
        throw new Error(`Failed to get products by category: ${error.message}`)
      }
    },

    searchProducts: async (_, { query }) => {
      try {
        const products = await searchProducts(query)
        return products
      } catch (error) {
        throw new Error(`Failed to search products: ${error.message}`)
      }
    },

    getCategories: async () => {
      try {
        const categories = await getCategories()
        return categories
      } catch (error) {
        throw new Error(`Failed to get categories: ${error.message}`)
      }
    },
  },

  Mutation: {
    createProduct: async (_, { input }) => {
      try {
        const product = await createProduct(input)
        return product
      } catch (error) {
        throw new Error(`Failed to create product: ${error.message}`)
      }
    },

    updateProduct: async (_, { id, input }) => {
      try {
        const product = await updateProductById(id, input)
        return product
      } catch (error) {
        throw new Error(`Failed to update product: ${error.message}`)
      }
    },

    updateStock: async (_, { id, quantity }) => {
      try {
        const product = await updateStock(id, quantity)
        return product
      } catch (error) {
        throw new Error(`Failed to update stock: ${error.message}`)
      }
    },

    deleteProduct: async (_, { id }) => {
      try {
        const deleted = await deleteProductById(id)
        return deleted
      } catch (error) {
        throw new Error(`Failed to delete product: ${error.message}`)
      }
    },
  },
}

module.exports = resolvers
