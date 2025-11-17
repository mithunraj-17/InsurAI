-- Run this SQL script in your MySQL database to fix the role column issue
USE insur_ai_db;

-- Update the role column to support ADMIN
ALTER TABLE users MODIFY COLUMN role ENUM('CUSTOMER', 'AGENT', 'ADMIN') NOT NULL;

-- Verify the change
DESCRIBE users;