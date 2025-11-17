package com.example.insurAI.controller;

import com.example.insurAI.dto.AppointmentRequest;
import com.example.insurAI.entity.Appointment;
import com.example.insurAI.entity.Role;
import com.example.insurAI.entity.User;
import com.example.insurAI.repository.UserRepository;
import com.example.insurAI.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "*")
public class CustomerController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AppointmentService appointmentService;
    
    @GetMapping("/agents")
    public ResponseEntity<List<User>> getAgents() {
        List<User> agents = userRepository.findByRole(Role.AGENT);
        return ResponseEntity.ok(agents);
    }
    
    @PostMapping("/appointments/book/{customerId}")
    public ResponseEntity<?> bookAppointment(@PathVariable Long customerId, @RequestBody AppointmentRequest request) {
        try {
            Appointment appointment = appointmentService.bookAppointment(customerId, request);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while booking the appointment");
        }
    }
    
    @GetMapping("/appointments/{customerId}")
    public ResponseEntity<List<Appointment>> getCustomerAppointments(@PathVariable Long customerId) {
        try {
            List<Appointment> appointments = appointmentService.getCustomerAppointments(customerId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}