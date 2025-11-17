package com.example.insurAI.controller;

import com.example.insurAI.entity.Policy;
import com.example.insurAI.service.PolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/insurance")
@CrossOrigin(origins = "*")
public class InsuranceController {
    
    @Autowired
    private PolicyService policyService;
    
    @GetMapping("/plans")
    public ResponseEntity<List<Policy>> getAllPlans() {
        List<Policy> activePolicies = policyService.getActivePolicies();
        return ResponseEntity.ok(activePolicies);
    }
    
    @GetMapping("/plans/{type}")
    public ResponseEntity<List<Policy>> getPlansByType(@PathVariable String type) {
        List<Policy> activePolicies = policyService.getActivePolicies();
        List<Policy> filteredPolicies = activePolicies.stream()
            .filter(policy -> type.toUpperCase().equals(policy.getPolicyType().toUpperCase()))
            .toList();
        return ResponseEntity.ok(filteredPolicies);
    }
    
    @GetMapping("/policies/customer/{customerId}")
    public ResponseEntity<List<Policy>> getCustomerPolicies(@PathVariable Long customerId) {
        // Return empty list for now - implement customer-specific policies later
        return ResponseEntity.ok(List.of());
    }
}