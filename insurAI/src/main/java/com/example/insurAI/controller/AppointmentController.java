package com.example.insurAI.controller;

import com.example.insurAI.dto.AppointmentRequest;
import com.example.insurAI.entity.Appointment;
import com.example.insurAI.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByAgent(@PathVariable Long agentId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByAgent(agentId);
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/{appointmentId}/status")
    public ResponseEntity<String> updateAppointmentStatus(
            @PathVariable Long appointmentId, 
            @RequestParam String status) {
        appointmentService.updateAppointmentStatus(appointmentId, status);
        return ResponseEntity.ok("Appointment status updated successfully");
    }

    @PostMapping
    public ResponseEntity<String> createAppointment(@RequestBody AppointmentRequest request) {
        appointmentService.createAppointment(request);
        return ResponseEntity.ok("Appointment created successfully");
    }

    @GetMapping("/available-slots")
    public ResponseEntity<List<String>> getAvailableSlots(@RequestParam Long agentId) {
        List<String> slots = appointmentService.getAvailableSlots(agentId);
        return ResponseEntity.ok(slots);
    }
}