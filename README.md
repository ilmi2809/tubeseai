# Sistem Microservices E-Commerce

Sistem e-commerce berbasis microservices yang dibangun dengan Node.js, GraphQL, MySQL, dan Docker.

## 🏗️ Arsitektur

Sistem ini terdiri dari 5 microservices independen:

1. **User Service** (Port 3001) - Manajemen pengguna dan autentikasi
2. **Product Service** (Port 3002) - Katalog produk dan inventory
3. **Order Service** (Port 3003) - Pemrosesan pesanan
4. **Payment Service** (Port 3004) - Pemrosesan pembayaran
5. **Shipping Service** (Port 3005) - Manajemen pengiriman

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (untuk development)
- Git

### Installation

1. Clone repository:
\`\`\`bash
git clone <repository-url>
cd microservices-project
\`\`\`

2. Start semua services:
\`\`\`bash
make up
# atau
docker-compose up -d
\`\`\`

3. Akses aplikasi:
- Frontend: http://localhost:3000
- User Service GraphQL: http://localhost:3001/graphql
- Product Service GraphQL: http://localhost:3002/graphql
- Order Service GraphQL: http://localhost:3003/graphql
- Payment Service GraphQL: http://localhost:3004/graphql
- Shipping Service GraphQL: http://localhost:3005/graphql
- phpMyAdmin: http://localhost:8080

## 📁 Struktur Project

\`\`\`
microservices-project/
├── docker-compose.yml          # Orchestrasi semua services
├── Makefile                    # Command shortcuts
├── README.md                   # Dokumentasi
├── frontend/                   # Next.js frontend
├── user-service/              # User microservice
├── product-service/           # Product microservice
├── order-service/             # Order microservice
├── payment-service/           # Payment microservice
└── shipping-service/          # Shipping microservice
\`\`\`

## 🔧 Development

### Menjalankan service individual:
\`\`\`bash
cd user-service
npm install
npm run dev
\`\`\`

### Melihat logs:
\`\`\`bash
make logs
# atau
docker-compose logs -f [service-name]
\`\`\`

### Menghentikan services:
\`\`\`bash
make down
# atau
docker-compose down
\`\`\`

## 📊 Database

Setiap service memiliki database MySQL terpisah:
- user_db (Port 3306)
- product_db (Port 3307)
- order_db (Port 3308)
- payment_db (Port 3309)
- shipping_db (Port 3310)

## 🔗 Inter-Service Communication

Services berkomunikasi melalui HTTP GraphQL requests. Contoh:

\`\`\`javascript
// Order Service memanggil Product Service
const productData = await productService.query(`
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      name
      price
      stock
    }
  }
`, { id: productId });
\`\`\`

## 🧪 Testing

\`\`\`bash
make test
# atau test individual service
cd user-service && npm test
\`\`\`

## 📝 API Documentation

### User Service Endpoints:
- `getUser(id: ID!)` - Get user by ID
- `register(input: UserInput!)` - Register new user
- `login(email: String!, password: String!)` - Login user

### Product Service Endpoints:
- `getProducts(filter: ProductFilter)` - Get products with filtering
- `getProduct(id: ID!)` - Get product by ID
- `createProduct(input: ProductInput!)` - Create new product

### Order Service Endpoints:
- `createOrder(input: OrderInput!)` - Create new order
- `getOrder(id: ID!)` - Get order by ID
- `getUserOrders(userId: ID!)` - Get user's orders

### Payment Service Endpoints:
- `processPayment(input: PaymentInput!)` - Process payment
- `getPayment(id: ID!)` - Get payment by ID

### Shipping Service Endpoints:
- `calculateShipping(input: ShippingInput!)` - Calculate shipping cost
- `createShipment(input: ShipmentInput!)` - Create shipment
- `trackShipment(id: ID!)` - Track shipment

## 🛠️ Troubleshooting

### Service tidak bisa connect ke database:
\`\`\`bash
# Restart database containers
docker-compose restart user-db product-db order-db payment-db shipping-db
\`\`\`

### Port sudah digunakan:
\`\`\`bash
# Check port usage
lsof -i :3001
# Kill process if needed
kill -9 <PID>
\`\`\`

### Reset semua data:
\`\`\`bash
make clean
make up
\`\`\`

## 👥 Team Assignment

1. **Member 1**: User Service
2. **Member 2**: Product Service  
3. **Member 3**: Order Service
4. **Member 4**: Payment Service
5. **Member 5**: Shipping Service

## 📚 Learning Resources

- [GraphQL Documentation](https://graphql.org/learn/)
- [Docker Compose Guide](https://docs.docker.com/compose/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is for educational purposes.
\`\`\`
