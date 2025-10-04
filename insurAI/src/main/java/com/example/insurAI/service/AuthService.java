package com.example.insurAI.service;

import com.example.insurAI.dto.AuthResponse;
import com.example.insurAI.dto.LoginRequest;
import com.example.insurAI.dto.RegisterRequest;
import com.example.insurAI.entity.User;
import com.example.insurAI.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtService jwtService;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                      EmailService emailService, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        String verificationCode = String.format("%06d", (int)(Math.random() * 1000000));
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(10));
        
        System.out.println("Generated verification code: " + verificationCode + " for email: " + user.getEmail());
        
        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), verificationCode);
        
        return new AuthResponse(null, "Registration successful. Check console for verification link.");
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Please verify your email first");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, "Login successful");
    }

    public String verifyEmail(String code) {
        System.out.println("Verifying code: " + code);
        
        User user = userRepository.findByVerificationCode(code)
            .orElseThrow(() -> {
                System.out.println("No user found with verification code: " + code);
                return new RuntimeException("Invalid verification code");
            });

        System.out.println("Found user: " + user.getEmail());
        System.out.println("Code expiry: " + user.getVerificationCodeExpiry());
        System.out.println("Current time: " + LocalDateTime.now());
        
        if (user.getVerificationCodeExpiry().isBefore(LocalDateTime.now())) {
            System.out.println("Code expired");
            throw new RuntimeException("Verification code expired");
        }

        user.setEmailVerified(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiry(null);
        userRepository.save(user);
        
        System.out.println("Email verified successfully for: " + user.getEmail());
        return "Email verified successfully";
    }

    public String resetPassword(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Email not found"));

        String resetCode = String.format("%06d", (int)(Math.random() * 1000000));
        user.setResetToken(resetCode);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        emailService.sendPasswordResetEmail(email, resetCode);
        return "Password reset email sent";
    }

    public String confirmPasswordReset(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
            .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return "Password reset successful";
    }
}