package com.example.insurAI.repository;

import com.example.insurAI.entity.Role;
import com.example.insurAI.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationCode(String verificationCode);
    Optional<User> findByResetToken(String token);
    List<User> findByRole(Role role);
    long countByRole(Role role);
    long countByRoleAndActiveTrue(Role role);
}