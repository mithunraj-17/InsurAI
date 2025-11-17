package com.example.insurAI.dto;

import com.example.insurAI.entity.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String email;
    private String password;
    private String confirmPassword;
    private String fullName;
    private Role role;
}