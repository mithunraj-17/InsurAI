package com.example.insurAI.service;

import com.example.insurAI.dto.PolicyRequest;
import com.example.insurAI.dto.PolicyApplicationRequest;
import com.example.insurAI.entity.*;
import com.example.insurAI.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PolicyService {
    
    @Autowired
    private PolicyRepository policyRepository;
    
    @Autowired
    private PolicyApplicationRepository applicationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Policy createPolicy(PolicyRequest request, Long agentId) {
        User agent = userRepository.findById(agentId)
            .orElseThrow(() -> new RuntimeException("Agent not found"));
        
        Policy policy = new Policy();
        policy.setPolicyName(request.getPolicyName());
        policy.setPremium(request.getPremium());
        policy.setPolicyType(request.getPolicyType());
        policy.setCoverage(request.getCoverage());
        policy.setBenefits(request.getBenefits());
        policy.setTerms(request.getTerms());
        policy.setConditions(request.getConditions());
        policy.setAgent(agent);
        
        return policyRepository.save(policy);
    }
    
    public List<Policy> getActivePolicies() {
        return policyRepository.findByStatus(PolicyStatus.ACTIVE);
    }
    
    public List<Policy> getAgentPolicies(Long agentId) {
        return policyRepository.findByAgentId(agentId);
    }
    
    public PolicyApplication applyForPolicy(PolicyApplicationRequest request, Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Policy policy = policyRepository.findById(request.getPolicyId())
            .orElseThrow(() -> new RuntimeException("Policy not found"));
        
        PolicyApplication application = new PolicyApplication();
        application.setUser(user);
        application.setPolicy(policy);
        application.setDocuments(request.getDocuments());
        application.setAdditionalDetails(request.getAdditionalDetails());
        
        return applicationRepository.save(application);
    }
    
    public List<PolicyApplication> getUserApplications(Long userId) {
        return applicationRepository.findByUserId(userId);
    }
    
    public List<PolicyApplication> getAgentApplications(Long agentId) {
        return applicationRepository.findByPolicyAgentId(agentId);
    }
    
    public PolicyApplication processApplication(Long applicationId, ApplicationStatus status, String reason, Long processedBy) {
        PolicyApplication application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        
        application.setStatus(status);
        application.setProcessedAt(LocalDateTime.now());
        application.setProcessedBy(userRepository.findById(processedBy).orElse(null));
        
        if (status == ApplicationStatus.REJECTED) {
            application.setRejectionReason(reason);
        }
        
        return applicationRepository.save(application);
    }
    
    // Admin methods for policy approval
    public List<Policy> getPendingPolicies() {
        return policyRepository.findByStatus(PolicyStatus.PENDING_APPROVAL);
    }
    
    public Policy approvePolicy(Long policyId, Long adminId) {
        Policy policy = policyRepository.findById(policyId)
            .orElseThrow(() -> new RuntimeException("Policy not found"));
        
        if (policy.getStatus() != PolicyStatus.PENDING_APPROVAL) {
            throw new RuntimeException("Policy is not pending approval");
        }
        
        policy.setStatus(PolicyStatus.ACTIVE);
        return policyRepository.save(policy);
    }
    
    public Policy rejectPolicy(Long policyId, Long adminId, String reason) {
        Policy policy = policyRepository.findById(policyId)
            .orElseThrow(() -> new RuntimeException("Policy not found"));
        
        if (policy.getStatus() != PolicyStatus.PENDING_APPROVAL) {
            throw new RuntimeException("Policy is not pending approval");
        }
        
        policy.setStatus(PolicyStatus.INACTIVE);
        return policyRepository.save(policy);
    }
    
    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }
}