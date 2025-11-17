package com.example.insurAI.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "policy_applications")
public class PolicyApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;
    
    @Column(columnDefinition = "TEXT")
    private String documents;
    
    @Column(columnDefinition = "TEXT")
    private String additionalDetails;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.PENDING;
    
    private String rejectionReason;
    
    private LocalDateTime appliedAt = LocalDateTime.now();
    
    public LocalDateTime getApplicationDate() {
        return appliedAt;
    }
    private LocalDateTime processedAt;
    
    @ManyToOne
    @JoinColumn(name = "processed_by")
    private User processedBy;
}