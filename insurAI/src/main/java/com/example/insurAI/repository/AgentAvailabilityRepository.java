package com.example.insurAI.repository;

import com.example.insurAI.entity.AgentAvailability;
import com.example.insurAI.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AgentAvailabilityRepository extends JpaRepository<AgentAvailability, Long> {
    
    List<AgentAvailability> findByAgentAndIsAvailableTrue(User agent);
    
    @Query("SELECT aa FROM AgentAvailability aa WHERE aa.agent.id = :agentId AND aa.availableDate >= :startDate AND aa.availableDate <= :endDate AND aa.isAvailable = true")
    List<AgentAvailability> findAvailableSlotsByAgentAndDateRange(@Param("agentId") Long agentId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT aa FROM AgentAvailability aa WHERE aa.availableDate >= :startDate AND aa.availableDate <= :endDate AND aa.isAvailable = true")
    List<AgentAvailability> findAllAvailableSlotsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT DISTINCT aa FROM AgentAvailability aa JOIN FETCH aa.agent WHERE DATE(aa.availableDate) = DATE(:searchDate) AND aa.startTime <= :searchTime AND aa.endTime > :searchTime AND aa.isAvailable = true")
    List<AgentAvailability> findAvailableAgentsByDateTime(@Param("searchDate") LocalDateTime searchDate, @Param("searchTime") LocalTime searchTime);
    
    List<AgentAvailability> findByIsAvailableTrue();
}