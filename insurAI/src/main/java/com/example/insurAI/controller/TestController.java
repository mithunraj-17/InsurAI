package com.example.insurAI.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {
    
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
}