package com.example.insurAI.dto;

import com.example.insurAI.entity.Role;
import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String message;
    private Role role;
    private Long userId;
    private String fullName;
    private String email;
    
    public AuthResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }
    
    public AuthResponse(String token, String message, Role role, Long userId) {
        this.token = token;
        this.message = message;
        this.role = role;
        this.userId = userId;
    }
    
    public AuthResponse(String token, String message, Role role, Long userId, String fullName, String email) {
        this.token = token;
        this.message = message;
        this.role = role;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
    }
}