package com.example.insurAI.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "insurance_plans")
public class InsurancePlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String planName;
    
    @Column(nullable = false)
    private String planType; // HEALTH, VEHICLE, LIFE, etc.
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal premiumAmount;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal coverageAmount;
    
    @Column(nullable = false)
    private Integer validityPeriodMonths;
    
    @Column(columnDefinition = "TEXT")
    private String benefits;
    
    @Column(nullable = false)
    private boolean isActive = true;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}