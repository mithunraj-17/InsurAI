package com.example.insurAI.repository;

import com.example.insurAI.entity.InsurancePlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InsurancePlanRepository extends JpaRepository<InsurancePlan, Long> {
    List<InsurancePlan> findByIsActiveTrue();
    List<InsurancePlan> findByPlanType(String planType);
}