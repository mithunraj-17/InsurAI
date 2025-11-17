package com.example.insurAI.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String fullName;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    private boolean emailVerified = false;
    
    private boolean active = true;
    
    private String verificationCode;
    private LocalDateTime verificationCodeExpiry;
    
    private String resetToken;
    
    private LocalDateTime resetTokenExpiry;
    
    private LocalDateTime createdAt = LocalDateTime.now();

}