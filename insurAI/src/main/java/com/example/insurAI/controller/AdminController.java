package com.example.insurAI.controller;

import com.example.insurAI.entity.*;
import com.example.insurAI.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    // Dashboard Analytics
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
    
    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @PutMapping("/users/{userId}/status")
    public ResponseEntity<String> updateUserStatus(@PathVariable Long userId, @RequestParam boolean active) {
        adminService.updateUserStatus(userId, active);
        return ResponseEntity.ok("User status updated");
    }
    
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok("User deleted");
    }
    
    // Agent Management
    @GetMapping("/agents")
    public ResponseEntity<List<User>> getAllAgents() {
        List<User> agents = adminService.getAllAgents();
        return ResponseEntity.ok(agents);
    }
    
    @PutMapping("/agents/{agentId}/approve")
    public ResponseEntity<String> approveAgent(@PathVariable Long agentId) {
        adminService.approveAgent(agentId);
        return ResponseEntity.ok("Agent approved");
    }
    
    // Policy Management
    @GetMapping("/policies")
    public ResponseEntity<List<Policy>> getAllPolicies() {
        List<Policy> policies = adminService.getAllPolicies();
        return ResponseEntity.ok(policies);
    }
    
    @PutMapping("/policies/{policyId}/status")
    public ResponseEntity<String> updatePolicyStatus(@PathVariable Long policyId, @RequestParam String status) {
        adminService.updatePolicyStatus(policyId, status);
        return ResponseEntity.ok("Policy status updated");
    }
    
    @GetMapping("/policies/pending")
    public ResponseEntity<List<Policy>> getPendingPolicies() {
        List<Policy> policies = adminService.getPendingPolicies();
        return ResponseEntity.ok(policies);
    }
    
    @PutMapping("/policies/{policyId}/approve")
    public ResponseEntity<String> approvePolicy(
            @PathVariable Long policyId,
            @RequestParam Long adminId) {
        try {
            adminService.approvePolicy(policyId, adminId);
            return ResponseEntity.ok("Policy approved successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/policies/{policyId}/reject")
    public ResponseEntity<String> rejectPolicy(
            @PathVariable Long policyId,
            @RequestParam Long adminId,
            @RequestParam(required = false) String reason) {
        try {
            adminService.rejectPolicy(policyId, adminId, reason);
            return ResponseEntity.ok("Policy rejected successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Application Management
    @GetMapping("/applications")
    public ResponseEntity<List<PolicyApplication>> getAllApplications() {
        List<PolicyApplication> applications = adminService.getAllApplications();
        return ResponseEntity.ok(applications);
    }
    
    @PutMapping("/applications/{applicationId}/override")
    public ResponseEntity<String> overrideApplicationDecision(@PathVariable Long applicationId, @RequestParam String status, @RequestParam String reason) {
        adminService.overrideApplicationDecision(applicationId, status, reason);
        return ResponseEntity.ok("Application decision overridden");
    }
    
    // Appointment Management
    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = adminService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }
    
    @PutMapping("/appointments/{appointmentId}/cancel")
    public ResponseEntity<String> cancelAppointment(@PathVariable Long appointmentId, @RequestParam String reason) {
        adminService.cancelAppointment(appointmentId, reason);
        return ResponseEntity.ok("Appointment cancelled");
    }
    
    // Notification Management
    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getAllNotifications() {
        List<Notification> notifications = adminService.getAllNotifications();
        return ResponseEntity.ok(notifications);
    }
}