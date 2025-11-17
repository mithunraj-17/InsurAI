package com.example.insurAI.controller;

import com.example.insurAI.dto.AgentSearchResponse;
import com.example.insurAI.entity.AgentAvailability;
import com.example.insurAI.service.AvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AvailabilityController {
    
    @Autowired
    private AvailabilityService availabilityService;
    
    @GetMapping("/slots")
    public ResponseEntity<List<AgentAvailability>> getAvailableSlots(@RequestParam String startDate, @RequestParam String endDate) {
        try {
            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);
            List<AgentAvailability> slots = availabilityService.getAvailableSlots(start, end);
            return ResponseEntity.ok(slots);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<AgentAvailability>> getAllAvailableSlots() {
        List<AgentAvailability> slots = availabilityService.getAllAvailableSlots();
        return ResponseEntity.ok(slots);
    }
    
    @GetMapping("/search")
    public ResponseEntity<AgentSearchResponse> searchAgentsByDateTime(
            @RequestParam String date, 
            @RequestParam String time) {
        try {
            LocalDateTime searchDate = LocalDateTime.parse(date + "T00:00:00");
            LocalTime searchTime = LocalTime.parse(time);
            
            List<AgentAvailability> availableAgents = availabilityService.searchAgentsByDateTime(searchDate, searchTime);
            
            if (availableAgents.isEmpty()) {
                AgentSearchResponse response = new AgentSearchResponse(
                    false, 
                    "No agents available at the requested date and time", 
                    availableAgents
                );
                return ResponseEntity.ok(response);
            }
            
            AgentSearchResponse response = new AgentSearchResponse(
                true, 
                "Found " + availableAgents.size() + " available agent(s)", 
                availableAgents
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            AgentSearchResponse errorResponse = new AgentSearchResponse(
                false, 
                "Invalid date or time format", 
                null
            );
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}