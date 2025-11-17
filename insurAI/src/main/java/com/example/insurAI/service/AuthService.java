package com.example.insurAI.service;

import com.example.insurAI.dto.AuthResponse;
import com.example.insurAI.dto.LoginRequest;
import com.example.insurAI.dto.RegisterRequest;
import com.example.insurAI.dto.ResetPasswordRequest;
import com.example.insurAI.dto.ValidateResetCodeRequest;
import com.example.insurAI.entity.User;
import com.example.insurAI.repository.UserRepository;
import com.example.insurAI.util.PasswordValidator;
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

        if (!PasswordValidator.isValid(request.getPassword())) {
            throw new RuntimeException(PasswordValidator.getRequirements());
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(request.getRole());
        String verificationCode = String.format("%06d", (int)(Math.random() * 1000000));
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(10));
        
        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), verificationCode);
        
        return new AuthResponse(null, "Registration successful. Check console for verification link.");
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        System.out.println("User found: " + user.getEmail() + ", Active: " + user.isActive());
        
        if (!user.isActive()) {
            System.out.println("Login blocked - User is inactive");
            throw new RuntimeException("Your account has been suspended by admin. Please contact administrator.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Please verify your email first");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, "Login successful", user.getRole(), user.getId(), user.getFullName(), user.getEmail());
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

    public String resendVerificationCode(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Email not found"));

        if (user.isEmailVerified()) {
            throw new RuntimeException("Email already verified");
        }

        String verificationCode = String.format("%06d", (int)(Math.random() * 1000000));
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        System.out.println("Resent verification code: " + verificationCode + " for email: " + email);
        
        emailService.sendVerificationEmail(email, verificationCode);
        return "Verification code resent successfully";
    }

    public String resetPassword(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Email not found"));

        String resetCode = String.format("%06d", (int)(Math.random() * 1000000));
        user.setResetToken(resetCode);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        System.out.println("Generated reset code: " + resetCode + " for email: " + email);
        
        emailService.sendPasswordResetEmail(email, resetCode);
        return "Password reset email sent";
    }

    public String validateResetCode(ValidateResetCodeRequest request) {
        System.out.println("Validating reset code: " + request.getCode());
        
        User user = userRepository.findByResetToken(request.getCode())
            .orElseThrow(() -> {
                System.out.println("No user found with reset token: " + request.getCode());
                return new RuntimeException("Invalid reset code");
            });

        System.out.println("Found user: " + user.getEmail());
        System.out.println("Token expiry: " + user.getResetTokenExpiry());
        System.out.println("Current time: " + LocalDateTime.now());
        
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            System.out.println("Reset code expired");
            throw new RuntimeException("Reset code expired");
        }

        System.out.println("Reset code validated successfully");
        return "Reset code is valid";
    }

    public String confirmPasswordReset(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getCode())
            .orElseThrow(() -> new RuntimeException("Invalid reset code"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset code expired");
        }

        if (!PasswordValidator.isValid(request.getPassword())) {
            throw new RuntimeException(PasswordValidator.getRequirements());
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return "Password reset successful";
    }
}