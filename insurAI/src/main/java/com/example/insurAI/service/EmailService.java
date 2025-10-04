package com.example.insurAI.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String email, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Email Verification Code - InsurAI");
            message.setText("Your verification code is: " + code + "\n\nThis code will expire in 10 minutes.");
            message.setFrom("mithunraj.m2005@gmail.com");
            mailSender.send(message);
            System.out.println("Verification code sent to: " + email);
        } catch (Exception e) {
            System.out.println("Failed to send email: " + e.getMessage());
            System.out.println("Verification code: " + code);
        }
    }

    public void sendPasswordResetEmail(String email, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Password Reset Code - InsurAI");
            message.setText("Your password reset code is: " + code + "\n\nThis code will expire in 10 minutes.");
            message.setFrom("mithunraj.m2005@gmail.com");
            mailSender.send(message);
            System.out.println("Password reset code sent to: " + email);
        } catch (Exception e) {
            System.out.println("Failed to send email: " + e.getMessage());
            System.out.println("Reset code: " + code);
        }
    }
}