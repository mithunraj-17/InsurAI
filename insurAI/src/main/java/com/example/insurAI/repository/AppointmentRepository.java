package com.example.insurAI.repository;

import com.example.insurAI.entity.Appointment;
import com.example.insurAI.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByCustomer(User customer);
    List<Appointment> findByAgent(User agent);
    List<Appointment> findByCustomerId(Long customerId);
    List<Appointment> findByAgentId(Long agentId);
    
    @Query("SELECT a FROM Appointment a WHERE a.agent.id = :agentId AND a.appointmentDateTime = :dateTime")
    List<Appointment> findByAgentIdAndDateTime(@Param("agentId") Long agentId, @Param("dateTime") LocalDateTime dateTime);
}