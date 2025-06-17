# Makefile for Microservices Project

.PHONY: help build up down logs clean install test dev health

# Default target
help:
	@echo "Available commands:"
	@echo "  make build     - Build all Docker images"
	@echo "  make up        - Start all services"
	@echo "  make down      - Stop all services"
	@echo "  make logs      - View logs from all services"
	@echo "  make clean     - Remove all containers and volumes"
	@echo "  make install   - Install dependencies for all services"
	@echo "  make test      - Run tests for all services"
	@echo "  make dev       - Start services in development mode"
	@echo "  make health    - Check service health"

# Build all Docker images
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Clean up everything
clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

# Install dependencies for all services
install:
	@echo "Installing dependencies for all services..."
	cd user-service && npm install
	cd product-service && npm install
	cd order-service && npm install
	cd payment-service && npm install
	cd shipping-service && npm install
	cd frontend && npm install

# Run tests
test:
	@echo "Running tests for all services..."
	cd user-service && npm test
	cd product-service && npm test
	cd order-service && npm test
	cd payment-service && npm test
	cd shipping-service && npm test

# Development mode (with hot reload)
dev:
	docker-compose -f docker-compose.yml up --build

# Check service health
health:
	@echo "Checking service health..."
	@curl -f http://localhost:3001/graphql -H "Content-Type: application/json" -d '{"query":"query{__typename}"}' && echo " ✅ User Service: UP" || echo " ❌ User Service: DOWN"
	@curl -f http://localhost:3002/graphql -H "Content-Type: application/json" -d '{"query":"query{__typename}"}' && echo " ✅ Product Service: UP" || echo " ❌ Product Service: DOWN"
	@curl -f http://localhost:3003/graphql -H "Content-Type: application/json" -d '{"query":"query{__typename}"}' && echo " ✅ Order Service: UP" || echo " ❌ Order Service: DOWN"
	@curl -f http://localhost:3004/graphql -H "Content-Type: application/json" -d '{"query":"query{__typename}"}' && echo " ✅ Payment Service: UP" || echo " ❌ Payment Service: DOWN"
	@curl -f http://localhost:3005/graphql -H "Content-Type: application/json" -d '{"query":"query{__typename}"}' && echo " ✅ Shipping Service: UP" || echo " ❌ Shipping Service: DOWN"
	@curl -f http://localhost:3000 && echo " ✅ Frontend: UP" || echo " ❌ Frontend: DOWN"

# Restart specific service
restart-user:
	docker-compose restart user-service

restart-product:
	docker-compose restart product-service

restart-order:
	docker-compose restart order-service

restart-payment:
	docker-compose restart payment-service

restart-shipping:
	docker-compose restart shipping-service

restart-frontend:
	docker-compose restart frontend

# View logs for specific service
logs-user:
	docker-compose logs -f user-service

logs-product:
	docker-compose logs -f product-service

logs-order:
	docker-compose logs -f order-service

logs-payment:
	docker-compose logs -f payment-service

logs-shipping:
	docker-compose logs -f shipping-service

logs-frontend:
	docker-compose logs -f frontend

# Database operations
db-reset:
	docker-compose down -v
	docker-compose up -d user-db product-db order-db payment-db shipping-db
	sleep 10
	docker-compose up -d

# Backup databases
db-backup:
	@echo "Creating database backups..."
	docker exec microservices-user-db-1 mysqldump -u root -ppassword user_db > backup_user_db.sql
	docker exec microservices-product-db-1 mysqldump -u root -ppassword product_db > backup_product_db.sql
	docker exec microservices-order-db-1 mysqldump -u root -ppassword order_db > backup_order_db.sql
	docker exec microservices-payment-db-1 mysqldump -u root -ppassword payment_db > backup_payment_db.sql
	docker exec microservices-shipping-db-1 mysqldump -u root -ppassword shipping_db > backup_shipping_db.sql
	@echo "Backups created successfully!"
