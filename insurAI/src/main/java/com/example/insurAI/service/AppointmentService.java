package com.example.insurAI.service;

import com.example.insurAI.dto.AppointmentRequest;
import com.example.insurAI.entity.Appointment;
import com.example.insurAI.entity.AppointmentStatus;
import com.example.insurAI.entity.User;
import com.example.insurAI.repository.AppointmentRepository;
import com.example.insurAI.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AvailabilityService availabilityService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Transactional
    public Appointment bookAppointment(Long customerId, AppointmentRequest request) {
        User customer = userRepository.findById(customerId)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        User agent = userRepository.findById(request.getAgentId())
            .orElseThrow(() -> new RuntimeException("Agent not found"));
        
        // Check if agent already has appointment at this time
        List<Appointment> existingAppointments = appointmentRepository
            .findByAgentIdAndDateTime(request.getAgentId(), request.getAppointmentDateTime());
        
        if (!existingAppointments.isEmpty()) {
            throw new RuntimeException("Agent is not available at this time - slot already booked");
        }
        
        Appointment appointment = new Appointment();
        appointment.setCustomer(customer);
        appointment.setAgent(agent);
        appointment.setAppointmentDateTime(request.getAppointmentDateTime());
        appointment.setReason(request.getReason());
        appointment.setNotes(request.getNotes());
        appointment.setStatus(AppointmentStatus.PENDING);
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // Mark the availability slot as booked if availabilityId is provided
        if (request.getAvailabilityId() != null) {
            availabilityService.markSlotAsBooked(request.getAvailabilityId());
        }
        
        // Send booking confirmation notification
        notificationService.sendAppointmentBookedNotification(savedAppointment);
        
        return savedAppointment;
    }
    
    public List<Appointment> getCustomerAppointments(Long customerId) {
        return appointmentRepository.findByCustomerId(customerId);
    }
    
    public List<Appointment> getAgentAppointments(Long agentId) {
        return appointmentRepository.findByAgentId(agentId);
    }
    
    public Appointment updateAppointmentStatus(Long appointmentId, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        appointment.setStatus(status);
        appointment.setUpdatedAt(LocalDateTime.now());
        
        return appointmentRepository.save(appointment);
    }
    
    public List<Appointment> getAppointmentsByAgent(Long agentId) {
        return appointmentRepository.findByAgentId(agentId);
    }
    
    public void updateAppointmentStatus(Long appointmentId, String status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        String oldStatus = appointment.getStatus().toString();
        
        AppointmentStatus appointmentStatus;
        switch (status.toUpperCase()) {
            case "CONFIRMED":
                appointmentStatus = AppointmentStatus.APPROVED;
                break;
            case "CANCELLED":
                appointmentStatus = AppointmentStatus.REJECTED;
                break;
            default:
                appointmentStatus = AppointmentStatus.valueOf(status.toUpperCase());
        }
        
        appointment.setStatus(appointmentStatus);
        appointment.setUpdatedAt(LocalDateTime.now());
        appointmentRepository.save(appointment);
        
        // Send status update notification
        notificationService.sendAppointmentStatusUpdateNotification(appointment, oldStatus, status.toUpperCase());
    }
    
    public void createAppointment(AppointmentRequest request) {
        User agent = userRepository.findById(request.getAgentId())
            .orElseThrow(() -> new RuntimeException("Agent not found"));
        
        Appointment appointment = new Appointment();
        appointment.setAgent(agent);
        appointment.setAppointmentDateTime(request.getAppointmentDateTime());
        appointment.setReason(request.getReason());
        appointment.setNotes(request.getNotes());
        appointment.setStatus(AppointmentStatus.PENDING);
        
        appointmentRepository.save(appointment);
    }
    
    public List<String> getAvailableSlots(Long agentId) {
        return List.of(
            "09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"
        );
    }
}