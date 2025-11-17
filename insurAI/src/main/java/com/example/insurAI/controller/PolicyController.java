package com.example.insurAI.controller;

import com.example.insurAI.dto.PolicyRequest;
import com.example.insurAI.dto.PolicyApplicationRequest;
import com.example.insurAI.entity.*;
import com.example.insurAI.service.PolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/policies")
@CrossOrigin(origins = "*")
public class PolicyController {

    @Autowired
    private PolicyService policyService;

    @PostMapping("/create")
    public ResponseEntity<?> createPolicy(@RequestBody PolicyRequest request, @RequestParam Long agentId) {
        try {
            Policy policy = policyService.createPolicy(request, agentId);
            return ResponseEntity.ok(policy);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/active")
    public ResponseEntity<List<Policy>> getActivePolicies() {
        List<Policy> policies = policyService.getActivePolicies();
        return ResponseEntity.ok(policies);
    }

    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<Policy>> getAgentPolicies(@PathVariable Long agentId) {
        List<Policy> policies = policyService.getAgentPolicies(agentId);
        return ResponseEntity.ok(policies);
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyForPolicy(
            @RequestParam Long policyId,
            @RequestParam String additionalDetails,
            @RequestParam(required = false) org.springframework.web.multipart.MultipartFile documents,
            @RequestParam Long userId) {
        try {
            PolicyApplicationRequest request = new PolicyApplicationRequest();
            request.setPolicyId(policyId);
            request.setAdditionalDetails(additionalDetails);
            
            if (documents != null && !documents.isEmpty()) {
                System.out.println("File received: " + documents.getOriginalFilename() + ", size: " + documents.getSize());
                String fileName = System.currentTimeMillis() + "_" + documents.getOriginalFilename();
                String uploadPath = System.getProperty("user.dir") + java.io.File.separator + "uploads";
                System.out.println("Upload path: " + uploadPath);
                java.io.File uploadDir = new java.io.File(uploadPath);
                if (!uploadDir.exists()) {
                    System.out.println("Creating upload directory: " + uploadDir.mkdirs());
                }
                java.io.File file = new java.io.File(uploadDir, fileName);
                System.out.println("Saving file to: " + file.getAbsolutePath());
                documents.transferTo(file);
                System.out.println("File saved successfully: " + file.exists());
                request.setDocuments(fileName);
            } else {
                System.out.println("No document received or document is empty");
            }
            
            PolicyApplication application = policyService.applyForPolicy(request, userId);
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            System.err.println("Policy application error: " + e.getClass().getSimpleName() + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/documents/{fileName}")
    public ResponseEntity<org.springframework.core.io.Resource> downloadDocument(@PathVariable String fileName) {
        try {
            String uploadPath = System.getProperty("user.dir") + java.io.File.separator + "uploads";
            java.io.File file = new java.io.File(uploadPath, fileName);
            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }
            
            org.springframework.core.io.Resource resource = new org.springframework.core.io.FileSystemResource(file);
            String contentType = "application/octet-stream";
            
            return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    


    @GetMapping("/applications/user/{userId}")
    public ResponseEntity<List<PolicyApplication>> getUserApplications(@PathVariable Long userId) {
        List<PolicyApplication> applications = policyService.getUserApplications(userId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/applications/agent/{agentId}")
    public ResponseEntity<List<PolicyApplication>> getAgentApplications(@PathVariable Long agentId) {
        List<PolicyApplication> applications = policyService.getAgentApplications(agentId);
        return ResponseEntity.ok(applications);
    }

    @PutMapping("/applications/{applicationId}/process")
    public ResponseEntity<PolicyApplication> processApplication(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status,
            @RequestParam(required = false) String reason,
            @RequestParam Long processedBy) {
        PolicyApplication application = policyService.processApplication(applicationId, status, reason, processedBy);
        return ResponseEntity.ok(application);
    }
    
    // Admin endpoints for policy management
    @GetMapping("/pending")
    public ResponseEntity<List<Policy>> getPendingPolicies() {
        List<Policy> policies = policyService.getPendingPolicies();
        return ResponseEntity.ok(policies);
    }
    
    @PutMapping("/{policyId}/approve")
    public ResponseEntity<Policy> approvePolicy(
            @PathVariable Long policyId,
            @RequestParam Long adminId) {
        try {
            Policy policy = policyService.approvePolicy(policyId, adminId);
            return ResponseEntity.ok(policy);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{policyId}/reject")
    public ResponseEntity<Policy> rejectPolicy(
            @PathVariable Long policyId,
            @RequestParam Long adminId,
            @RequestParam(required = false) String reason) {
        try {
            Policy policy = policyService.rejectPolicy(policyId, adminId, reason);
            return ResponseEntity.ok(policy);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Policy>> getAllPolicies() {
        List<Policy> policies = policyService.getAllPolicies();
        return ResponseEntity.ok(policies);
    }
}