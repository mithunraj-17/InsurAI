package com.example.insurAI.controller;

import com.example.insurAI.entity.AgentAvailability;
import com.example.insurAI.entity.Role;
import com.example.insurAI.entity.User;
import com.example.insurAI.repository.AgentAvailabilityRepository;
import com.example.insurAI.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AgentAvailabilityRepository availabilityRepository;
    
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Application is running successfully!");
    }
    
    @GetMapping("/status")
    public ResponseEntity<String> getStatus() {
        return ResponseEntity.ok("All systems operational");
    }
    
    @PostMapping("/create-test-user")
    public ResponseEntity<String> createTestUser() {
        return ResponseEntity.ok("Test user creation endpoint ready");
    }
    
    @PostMapping("/create-sample-availability")
    public ResponseEntity<String> createSampleAvailability() {
        try {
            // Find or create an agent
            User agent = userRepository.findByRole(Role.AGENT).stream().findFirst().orElse(null);
            if (agent == null) {
                return ResponseEntity.ok("No agents found. Please create an agent first.");
            }
            
            // Create sample availability slots for next 7 days
            LocalDate today = LocalDate.now();
            int slotsCreated = 0;
            
            for (int i = 1; i <= 7; i++) {
                LocalDate date = today.plusDays(i);
                
                // Morning slots
                AgentAvailability morning = new AgentAvailability();
                morning.setAgent(agent);
                morning.setAvailableDate(date.atStartOfDay());
                morning.setStartTime(LocalTime.of(9, 0));
                morning.setEndTime(LocalTime.of(12, 0));
                morning.setAvailable(true);
                availabilityRepository.save(morning);
                slotsCreated++;
                
                // Afternoon slots
                AgentAvailability afternoon = new AgentAvailability();
                afternoon.setAgent(agent);
                afternoon.setAvailableDate(date.atStartOfDay());
                afternoon.setStartTime(LocalTime.of(14, 0));
                afternoon.setEndTime(LocalTime.of(17, 0));
                afternoon.setAvailable(true);
                availabilityRepository.save(afternoon);
                slotsCreated++;
            }
            
            return ResponseEntity.ok("Created " + slotsCreated + " sample availability slots for agent: " + agent.getFullName());
        } catch (Exception e) {
            return ResponseEntity.ok("Error creating sample data: " + e.getMessage());
        }
    }
}