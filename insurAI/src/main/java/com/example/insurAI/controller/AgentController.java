package com.example.insurAI.controller;

import com.example.insurAI.dto.AvailabilityRequest;
import com.example.insurAI.entity.AgentAvailability;
import com.example.insurAI.entity.Appointment;
import com.example.insurAI.entity.AppointmentStatus;
import com.example.insurAI.service.AppointmentService;
import com.example.insurAI.service.AvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agent")
@CrossOrigin(origins = "*")
public class AgentController {
    
    @Autowired
    private AppointmentService appointmentService;
    
    @Autowired
    private AvailabilityService availabilityService;
    
    @GetMapping("/appointments/{agentId}")
    public ResponseEntity<List<Appointment>> getAgentAppointments(@PathVariable Long agentId) {
        try {
            List<Appointment> appointments = appointmentService.getAgentAppointments(agentId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/appointments/{appointmentId}/status")
    public ResponseEntity<String> updateAppointmentStatus(@PathVariable Long appointmentId, @RequestParam String status) {
        try {
            appointmentService.updateAppointmentStatus(appointmentId, status);
            return ResponseEntity.ok("Appointment status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating appointment status: " + e.getMessage());
        }
    }
    
    @PostMapping("/availability/{agentId}")
    public ResponseEntity<AgentAvailability> setAvailability(@PathVariable Long agentId, @RequestBody AvailabilityRequest request) {
        try {
            AgentAvailability availability = availabilityService.setAvailability(agentId, request);
            return ResponseEntity.ok(availability);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/availability/{agentId}")
    public ResponseEntity<List<AgentAvailability>> getAgentAvailability(@PathVariable Long agentId) {
        List<AgentAvailability> availability = availabilityService.getAgentAvailability(agentId);
        return ResponseEntity.ok(availability);
    }
    
    @PutMapping("/availability/{availabilityId}")
    public ResponseEntity<AgentAvailability> updateAvailability(@PathVariable Long availabilityId, @RequestBody AvailabilityRequest request) {
        AgentAvailability availability = availabilityService.updateAvailability(availabilityId, request);
        return ResponseEntity.ok(availability);
    }
    
    @DeleteMapping("/availability/{availabilityId}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable Long availabilityId) {
        availabilityService.deleteAvailability(availabilityId);
        return ResponseEntity.ok().build();
    }
}