package com.example.insurAI.service;

import com.example.insurAI.entity.Role;
import com.example.insurAI.entity.User;
import com.example.insurAI.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DataInitService implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        createTestUsers();
    }
    
    private void createTestUsers() {
        // Create test customer
        if (userRepository.findByEmail("customer@test.com").isEmpty()) {
            User customer = new User();
            customer.setEmail("customer@test.com");
            customer.setPassword(passwordEncoder.encode("password123"));
            customer.setFullName("Test Customer");
            customer.setRole(Role.CUSTOMER);
            customer.setEmailVerified(true);
            userRepository.save(customer);
            System.out.println("Created test customer: customer@test.com / password123");
        }
        
        // Create test agent
        if (userRepository.findByEmail("agent@test.com").isEmpty()) {
            User agent = new User();
            agent.setEmail("agent@test.com");
            agent.setPassword(passwordEncoder.encode("password123"));
            agent.setFullName("Test Agent");
            agent.setRole(Role.AGENT);
            agent.setEmailVerified(true);
            userRepository.save(agent);
            System.out.println("Created test agent: agent@test.com / password123");
        }
        
        // Create test admin
        if (userRepository.findByEmail("admin@test.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@test.com");
            admin.setPassword(passwordEncoder.encode("password123"));
            admin.setFullName("Test Admin");
            admin.setRole(Role.ADMIN);
            admin.setEmailVerified(true);
            userRepository.save(admin);
            System.out.println("Created test admin: admin@test.com / password123");
        }
    }
}