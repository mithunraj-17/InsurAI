package com.example.insurAI.config;

import com.example.insurAI.entity.AgentAvailability;
import com.example.insurAI.entity.Role;
import com.example.insurAI.entity.User;
import com.example.insurAI.repository.AgentAvailabilityRepository;
import com.example.insurAI.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AgentAvailabilityRepository availabilityRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create test users
            User admin = new User();
            admin.setEmail("admin@test.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Admin User");
            admin.setRole(Role.ADMIN);
            admin.setEmailVerified(true);
            userRepository.save(admin);

            User agent = new User();
            agent.setEmail("agent@test.com");
            agent.setPassword(passwordEncoder.encode("agent123"));
            agent.setFullName("Agent User");
            agent.setRole(Role.AGENT);
            agent.setEmailVerified(true);
            userRepository.save(agent);

            User customer = new User();
            customer.setEmail("customer@test.com");
            customer.setPassword(passwordEncoder.encode("customer123"));
            customer.setFullName("Customer User");
            customer.setRole(Role.CUSTOMER);
            customer.setEmailVerified(true);
            userRepository.save(customer);

            // Create test availability slots for the agent
            LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
            
            for (int i = 0; i < 7; i++) {
                LocalDateTime date = today.plusDays(i);
                
                AgentAvailability morning = new AgentAvailability();
                morning.setAgent(agent);
                morning.setAvailableDate(date);
                morning.setStartTime(LocalTime.of(9, 0));
                morning.setEndTime(LocalTime.of(12, 0));
                morning.setAvailable(true);
                availabilityRepository.save(morning);
                
                AgentAvailability afternoon = new AgentAvailability();
                afternoon.setAgent(agent);
                afternoon.setAvailableDate(date);
                afternoon.setStartTime(LocalTime.of(14, 0));
                afternoon.setEndTime(LocalTime.of(17, 0));
                afternoon.setAvailable(true);
                availabilityRepository.save(afternoon);
            }
        }
    }
}