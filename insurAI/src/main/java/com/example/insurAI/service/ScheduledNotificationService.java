package com.example.insurAI.service;

import com.example.insurAI.entity.Appointment;
import com.example.insurAI.entity.AppointmentStatus;
import com.example.insurAI.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScheduledNotificationService {
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    // Run every hour to check for upcoming appointments
    @Scheduled(fixedRate = 3600000) // 1 hour = 3600000 milliseconds
    public void sendAppointmentReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime reminderTime = now.plusHours(24); // 24 hours before appointment
        
        // Find appointments that are 24 hours away and confirmed
        List<Appointment> upcomingAppointments = appointmentRepository.findAll().stream()
            .filter(appointment -> 
                appointment.getStatus() == AppointmentStatus.APPROVED &&
                appointment.getAppointmentDateTime().isAfter(now) &&
                appointment.getAppointmentDateTime().isBefore(reminderTime)
            )
            .collect(java.util.stream.Collectors.toList());
        
        for (Appointment appointment : upcomingAppointments) {
            notificationService.sendAppointmentReminderNotification(appointment);
        }
        
        if (!upcomingAppointments.isEmpty()) {
            System.out.println("Sent " + upcomingAppointments.size() + " appointment reminder notifications");
        }
    }
}