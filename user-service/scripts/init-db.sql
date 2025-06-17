-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  street VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zipCode VARCHAR(20),
  country VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample users with hashed passwords (password: "password123")
INSERT IGNORE INTO users (name, email, password, phone, street, city, state, zipCode, country) VALUES
('John Doe', 'john.doe@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', '+1234567890', '123 Main St', 'Anytown', 'CA', '12345', 'USA'),
('Jane Smith', 'jane.smith@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', '+1234567891', '456 Oak Ave', 'Springfield', 'NY', '67890', 'USA'),
('Bob Johnson', 'bob.johnson@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', '+1234567892', '789 Pine Rd', 'Riverside', 'TX', '54321', 'USA'),
('Alice Brown', 'alice.brown@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', '+1234567893', '321 Elm St', 'Portland', 'OR', '97201', 'USA'),
('Charlie Wilson', 'charlie.wilson@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', '+1234567894', '654 Maple Ave', 'Seattle', 'WA', '98101', 'USA');
