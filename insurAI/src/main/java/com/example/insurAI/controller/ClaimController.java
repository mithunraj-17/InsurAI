package com.example.insurAI.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "*")
public class ClaimController {
    
    @PostMapping("/submit")
    public ResponseEntity<?> submitClaim(@RequestBody Map<String, Object> claimData) {
        try {
            // For now, just return a success response
            Map<String, Object> response = new HashMap<>();
            response.put("id", System.currentTimeMillis());
            response.put("status", "SUBMITTED");
            response.put("message", "Claim submitted successfully");
            response.put("claimNumber", "CLM" + System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error submitting claim: " + e.getMessage());
        }
    }
}