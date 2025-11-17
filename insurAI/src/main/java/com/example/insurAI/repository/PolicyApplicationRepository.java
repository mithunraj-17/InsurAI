package com.example.insurAI.repository;

import com.example.insurAI.entity.PolicyApplication;
import com.example.insurAI.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PolicyApplicationRepository extends JpaRepository<PolicyApplication, Long> {
    List<PolicyApplication> findByUserId(Long userId);
    List<PolicyApplication> findByStatus(ApplicationStatus status);
    List<PolicyApplication> findByPolicyAgentId(Long agentId);
    List<PolicyApplication> findByUserIdAndStatus(Long userId, ApplicationStatus status);
    long countByStatus(ApplicationStatus status);
}