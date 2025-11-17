package com.example.insurAI.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {
    private String code;
    private String password;
    private String confirmPassword;

}