package com.example.insurAI.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;


@Getter
@Setter
@Entity
@Table(name = "policies")
public class Policy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String policyName;
    
    @Column(nullable = false)
    private BigDecimal premium;
    
    @Column(nullable = false)
    private String policyType;
    
    @Column(columnDefinition = "TEXT")
    private String coverage;
    
    @Column(columnDefinition = "TEXT")
    private String benefits;
    
    @Column(columnDefinition = "TEXT")
    private String terms;
    
    @Column(columnDefinition = "TEXT")
    private String conditions;
    
    @ManyToOne
    @JoinColumn(name = "agent_id", nullable = false)
    private User agent;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PolicyStatus status = PolicyStatus.PENDING_APPROVAL;
    

}