-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS isi_products;
USE isi_products;

-- Criação da tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(300),
  stock INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL,
  is_out_of_stock BOOLEAN NOT NULL DEFAULT FALSE
);

-- Criação da tabela de cupons
CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  type VARCHAR(7) NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  one_shot BOOLEAN NOT NULL,
  max_uses INT DEFAULT NULL, 
  uses_count INT NOT NULL DEFAULT 0,
  valid_from DATETIME NOT NULL,
  valid_until DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL,
  deleted_at DATETIME DEFAULT NULL
);

-- Criação da tabela de aplicação de cupons
CREATE TABLE IF NOT EXISTS product_coupon_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  coupon_id INT NOT NULL,
  product_id INT NOT NULL,
  applied_at DATETIME DEFAULT NULL,
  removed_at DATETIME DEFAULT NULL,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);


