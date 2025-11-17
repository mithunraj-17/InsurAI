-- Update the role column to accommodate ADMIN value
ALTER TABLE users MODIFY COLUMN role ENUM('CUSTOMER', 'AGENT', 'ADMIN') NOT NULL;