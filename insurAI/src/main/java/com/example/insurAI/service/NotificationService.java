package com.example.insurAI.service;

import com.example.insurAI.entity.Appointment;
import com.example.insurAI.entity.Notification;
import com.example.insurAI.entity.User;
import com.example.insurAI.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    public void sendAppointmentBookedNotification(Appointment appointment) {
        User customer = appointment.getCustomer();
        User agent = appointment.getAgent();
        
        String message = String.format(
            "✅ Appointment Booked Successfully!\n\n" +
            "Dear %s,\n\n" +
            "Your appointment has been confirmed with Agent %s.\n\n" +
            "📅 Date & Time: %s\n" +
            "📝 Reason: %s\n" +
            "👨‍💼 Agent: %s (%s)\n\n" +
            "Please be available at the scheduled time.\n\n" +
            "Thank you for choosing InsurAI!",
            customer.getFullName(),
            agent.getFullName(),
            appointment.getAppointmentDateTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
            appointment.getReason(),
            agent.getFullName(),
            agent.getEmail()
        );
        
        // Save notification to database
        Notification notification = new Notification();
        notification.setUser(customer);
        notification.setTitle("Appointment Booked Successfully");
        notification.setMessage(message);
        notification.setType("BOOKING");
        notification.setAppointment(appointment);
        notificationRepository.save(notification);
        
        System.out.println("=== APPOINTMENT BOOKED NOTIFICATION ===");
        System.out.println("To: " + customer.getEmail());
        System.out.println("Message: " + message);
        System.out.println("==========================================");
    }
    
    public void sendAppointmentReminderNotification(Appointment appointment) {
        User customer = appointment.getCustomer();
        User agent = appointment.getAgent();
        
        String message = String.format(
            "⏰ Appointment Reminder\n\n" +
            "Dear %s,\n\n" +
            "This is a reminder for your upcoming appointment:\n\n" +
            "📅 Date & Time: %s\n" +
            "📝 Reason: %s\n" +
            "👨‍💼 Agent: %s (%s)\n\n" +
            "Please ensure you are available at the scheduled time.\n\n" +
            "Thank you!",
            customer.getFullName(),
            appointment.getAppointmentDateTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
            appointment.getReason(),
            agent.getFullName(),
            agent.getEmail()
        );
        
        // Save notification to database
        Notification notification = new Notification();
        notification.setUser(customer);
        notification.setTitle("Appointment Reminder");
        notification.setMessage(message);
        notification.setType("REMINDER");
        notification.setAppointment(appointment);
        notificationRepository.save(notification);
        
        System.out.println("=== APPOINTMENT REMINDER NOTIFICATION ===");
        System.out.println("To: " + customer.getEmail());
        System.out.println("Message: " + message);
        System.out.println("==========================================");
    }
    
    public void sendAppointmentStatusUpdateNotification(Appointment appointment, String oldStatus, String newStatus) {
        User customer = appointment.getCustomer();
        String statusMessage = newStatus.equals("CONFIRMED") ? "confirmed" : "cancelled";
        String emoji = newStatus.equals("CONFIRMED") ? "✅" : "❌";
        
        String message = String.format(
            "%s Appointment %s\n\n" +
            "Dear %s,\n\n" +
            "Your appointment has been %s by the agent.\n\n" +
            "📅 Date & Time: %s\n" +
            "📝 Reason: %s\n" +
            "👨‍💼 Agent: %s\n\n" +
            "%s\n\n" +
            "Thank you!",
            emoji,
            statusMessage.toUpperCase(),
            customer.getFullName(),
            statusMessage,
            appointment.getAppointmentDateTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
            appointment.getReason(),
            appointment.getAgent().getFullName(),
            newStatus.equals("CONFIRMED") ? 
                "Please be available at the scheduled time." : 
                "You may book another appointment if needed."
        );
        
        // Save notification to database
        Notification notification = new Notification();
        notification.setUser(customer);
        notification.setTitle("Appointment " + statusMessage.toUpperCase());
        notification.setMessage(message);
        notification.setType("STATUS_UPDATE");
        notification.setAppointment(appointment);
        notificationRepository.save(notification);
        
        System.out.println("=== APPOINTMENT STATUS UPDATE NOTIFICATION ===");
        System.out.println("To: " + customer.getEmail());
        System.out.println("Message: " + message);
        System.out.println("===============================================");
    }
    
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }
    
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
    
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
    
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }
}