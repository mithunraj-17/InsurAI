package com.example.insurAI.repository;

import com.example.insurAI.entity.Policy;
import com.example.insurAI.entity.PolicyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {
    List<Policy> findByStatus(PolicyStatus status);
    List<Policy> findByAgentId(Long agentId);
    List<Policy> findByStatusAndPolicyType(PolicyStatus status, String policyType);
    List<Policy> findByStatusAndPremiumBetween(PolicyStatus status, BigDecimal minPremium, BigDecimal maxPremium);
    long countByStatus(PolicyStatus status);
}