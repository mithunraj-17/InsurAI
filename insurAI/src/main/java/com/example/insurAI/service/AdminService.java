package com.example.insurAI.service;

import com.example.insurAI.entity.*;
import com.example.insurAI.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PolicyRepository policyRepository;
    
    @Autowired
    private PolicyApplicationRepository applicationRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // User stats
        stats.put("totalUsers", userRepository.countByRole(Role.CUSTOMER));
        stats.put("totalAgents", userRepository.countByRole(Role.AGENT));
        stats.put("activeUsers", userRepository.countByRoleAndActiveTrue(Role.CUSTOMER));
        
        // Policy stats
        stats.put("activePolicies", policyRepository.countByStatus(PolicyStatus.ACTIVE));
        stats.put("pendingPolicies", policyRepository.countByStatus(PolicyStatus.PENDING_APPROVAL));
        stats.put("totalPolicies", policyRepository.count());
        
        // Application stats
        stats.put("pendingApplications", applicationRepository.countByStatus(ApplicationStatus.PENDING));
        stats.put("totalApplications", applicationRepository.count());
        
        // Appointment stats
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();
        
        long todayAppointments = appointmentRepository.findAll().stream()
            .filter(apt -> apt.getAppointmentDateTime().isAfter(startOfDay) && 
                          apt.getAppointmentDateTime().isBefore(endOfDay))
            .count();
        
        stats.put("appointmentsToday", todayAppointments);
        stats.put("totalAppointments", appointmentRepository.count());
        
        return stats;
    }
    
    // User Management
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public void updateUserStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(active);
        userRepository.save(user);
    }
    
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
    
    // Agent Management
    public List<User> getAllAgents() {
        return userRepository.findByRole(Role.AGENT);
    }
    
    public void approveAgent(Long agentId) {
        User agent = userRepository.findById(agentId)
            .orElseThrow(() -> new RuntimeException("Agent not found"));
        agent.setActive(true);
        userRepository.save(agent);
    }
    
    // Policy Management
    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }
    
    public void updatePolicyStatus(Long policyId, String status) {
        Policy policy = policyRepository.findById(policyId)
            .orElseThrow(() -> new RuntimeException("Policy not found"));
        policy.setStatus(PolicyStatus.valueOf(status.toUpperCase()));
        policyRepository.save(policy);
    }
    
    public List<Policy> getPendingPolicies() {
        return policyRepository.findByStatus(PolicyStatus.PENDING_APPROVAL);
    }
    
    public void approvePolicy(Long policyId, Long adminId) {
        Policy policy = policyRepository.findById(policyId)
            .orElseThrow(() -> new RuntimeException("Policy not found"));
        
        if (policy.getStatus() != PolicyStatus.PENDING_APPROVAL) {
            throw new RuntimeException("Policy is not pending approval");
        }
        
        policy.setStatus(PolicyStatus.ACTIVE);
        policyRepository.save(policy);
    }
    
    public void rejectPolicy(Long policyId, Long adminId, String reason) {
        Policy policy = policyRepository.findById(policyId)
            .orElseThrow(() -> new RuntimeException("Policy not found"));
        
        if (policy.getStatus() != PolicyStatus.PENDING_APPROVAL) {
            throw new RuntimeException("Policy is not pending approval");
        }
        
        policy.setStatus(PolicyStatus.INACTIVE);
        policyRepository.save(policy);
    }
    
    // Application Management
    public List<PolicyApplication> getAllApplications() {
        return applicationRepository.findAll();
    }
    
    public void overrideApplicationDecision(Long applicationId, String status, String reason) {
        PolicyApplication application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        
        application.setStatus(ApplicationStatus.valueOf(status.toUpperCase()));
        application.setRejectionReason(reason);
        application.setProcessedAt(LocalDateTime.now());
        applicationRepository.save(application);
    }
    
    // Appointment Management
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
    
    public void cancelAppointment(Long appointmentId, String reason) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        appointment.setStatus(AppointmentStatus.REJECTED);
        appointment.setUpdatedAt(LocalDateTime.now());
        appointmentRepository.save(appointment);
    }
    
    // Notification Management
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
}