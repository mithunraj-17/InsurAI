package com.example.insurAI.service;

import com.example.insurAI.dto.AvailabilityRequest;
import com.example.insurAI.entity.AgentAvailability;
import com.example.insurAI.entity.User;
import com.example.insurAI.repository.AgentAvailabilityRepository;
import com.example.insurAI.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class AvailabilityService {
    
    @Autowired
    private AgentAvailabilityRepository availabilityRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public AgentAvailability setAvailability(Long agentId, AvailabilityRequest request) {
        User agent = userRepository.findById(agentId)
            .orElseThrow(() -> new RuntimeException("Agent not found"));
        
        AgentAvailability availability = new AgentAvailability();
        availability.setAgent(agent);
        availability.setAvailableDate(request.getAvailableDate());
        availability.setStartTime(request.getStartTime());
        availability.setEndTime(request.getEndTime());
        availability.setAvailable(request.isAvailable());
        
        return availabilityRepository.save(availability);
    }
    
    public List<AgentAvailability> getAgentAvailability(Long agentId) {
        User agent = userRepository.findById(agentId)
            .orElseThrow(() -> new RuntimeException("Agent not found"));
        return availabilityRepository.findByAgentAndIsAvailableTrue(agent);
    }
    
    public List<AgentAvailability> getAvailableSlots(LocalDateTime startDate, LocalDateTime endDate) {
        List<AgentAvailability> allSlots = availabilityRepository.findByIsAvailableTrue();
        System.out.println("Total available slots in DB: " + allSlots.size());
        List<AgentAvailability> filteredSlots = availabilityRepository.findAllAvailableSlotsByDateRange(startDate, endDate);
        System.out.println("Filtered slots: " + filteredSlots.size());
        return filteredSlots;
    }
    
    public List<AgentAvailability> searchAgentsByDateTime(LocalDateTime searchDate, LocalTime searchTime) {
        System.out.println("Searching for date: " + searchDate + ", time: " + searchTime);
        List<AgentAvailability> results = availabilityRepository.findAvailableAgentsByDateTime(searchDate, searchTime);
        
        // Filter out expired slots
        LocalDateTime now = LocalDateTime.now();
        results = results.stream()
            .filter(slot -> {
                LocalDateTime slotDateTime = LocalDateTime.of(slot.getAvailableDate().toLocalDate(), slot.getStartTime());
                return slotDateTime.isAfter(now);
            })
            .collect(java.util.stream.Collectors.toList());
        
        System.out.println("Found " + results.size() + " available slots after filtering expired ones");
        return results;
    }
    
    public void markSlotAsBooked(Long availabilityId) {
        AgentAvailability availability = availabilityRepository.findById(availabilityId)
            .orElseThrow(() -> new RuntimeException("Availability slot not found"));
        availability.setAvailable(false);
        availability.setUpdatedAt(LocalDateTime.now());
        availabilityRepository.save(availability);
    }
    
    public AgentAvailability updateAvailability(Long availabilityId, AvailabilityRequest request) {
        AgentAvailability availability = availabilityRepository.findById(availabilityId)
            .orElseThrow(() -> new RuntimeException("Availability not found"));
        
        availability.setAvailableDate(request.getAvailableDate());
        availability.setStartTime(request.getStartTime());
        availability.setEndTime(request.getEndTime());
        availability.setAvailable(request.isAvailable());
        availability.setUpdatedAt(LocalDateTime.now());
        
        return availabilityRepository.save(availability);
    }
    
    public void deleteAvailability(Long availabilityId) {
        availabilityRepository.deleteById(availabilityId);
    }
    
    public List<AgentAvailability> getAllAvailableSlots() {
        List<AgentAvailability> slots = availabilityRepository.findByIsAvailableTrue();
        
        // Filter out expired slots
        LocalDateTime now = LocalDateTime.now();
        return slots.stream()
            .filter(slot -> {
                LocalDateTime slotDateTime = LocalDateTime.of(slot.getAvailableDate().toLocalDate(), slot.getStartTime());
                return slotDateTime.isAfter(now);
            })
            .collect(java.util.stream.Collectors.toList());
    }
}