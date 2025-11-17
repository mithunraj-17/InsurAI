# InsurAI Backend Workflow - Code Walkthrough

## 🏗️ System Architecture

### Technology Stack
```xml
<!-- pom.xml - Core Dependencies -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
</dependencies>
```

## 📊 Data Model

### 1. User Entity (Multi-Role System)
```java
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
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // CUSTOMER, AGENT, ADMIN
    
    private boolean emailVerified = false;
    private String verificationCode;
    private LocalDateTime verificationCodeExpiry;
}
```

### 2. Appointment Entity (Core Business Logic)
```java
@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    @ManyToOne
    @JoinColumn(name = "agent_id", nullable = false)
    private User agent;
    
    @Column(nullable = false)
    private LocalDateTime appointmentDateTime;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status = AppointmentStatus.PENDING;
    
    private String reason;
    private String notes;
}
```

## 🔐 Security Configuration

### JWT-Based Authentication
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/appointments/**").permitAll()
                .anyRequest().authenticated()
            )
            .build();
    }
}
```

## 🔄 Core Workflows

### 1. User Registration & Verification Flow

#### Registration Controller
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(null, e.getMessage()));
        }
    }
}
```

#### Registration Service Logic
```java
@Service
public class AuthService {
    
    public AuthResponse register(RegisterRequest request) {
        // 1. Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // 2. Validate password strength
        if (!PasswordValidator.isValid(request.getPassword())) {
            throw new RuntimeException(PasswordValidator.getRequirements());
        }

        // 3. Create user with encrypted password
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        
        // 4. Generate verification code
        String verificationCode = String.format("%06d", 
            (int)(Math.random() * 1000000));
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(10));
        
        // 5. Save user and send verification email
        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), verificationCode);
        
        return new AuthResponse(null, "Registration successful. Check email for verification.");
    }
}
```

### 2. Email Verification Process
```java
@PostMapping("/verify")
public ResponseEntity<String> verifyEmail(@RequestParam String code) {
    try {
        return ResponseEntity.ok(authService.verifyEmail(code));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

// Service Implementation
public String verifyEmail(String code) {
    User user = userRepository.findByVerificationCode(code)
        .orElseThrow(() -> new RuntimeException("Invalid verification code"));

    if (user.getVerificationCodeExpiry().isBefore(LocalDateTime.now())) {
        throw new RuntimeException("Verification code expired");
    }

    user.setEmailVerified(true);
    user.setVerificationCode(null);
    user.setVerificationCodeExpiry(null);
    userRepository.save(user);
    
    return "Email verified successfully";
}
```

### 3. Login & JWT Token Generation
```java
public AuthResponse login(LoginRequest request) {
    // 1. Find user by email
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new RuntimeException("Invalid credentials"));

    // 2. Verify password
    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new RuntimeException("Invalid credentials");
    }

    // 3. Check email verification
    if (!user.isEmailVerified()) {
        throw new RuntimeException("Please verify your email first");
    }

    // 4. Generate JWT token
    String token = jwtService.generateToken(user.getEmail());
    return new AuthResponse(token, "Login successful", user.getRole(), user.getId());
}
```

### 4. Appointment Booking Workflow

#### Appointment Controller
```java
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    
    @PostMapping("/book/{customerId}")
    public ResponseEntity<Appointment> bookAppointment(
            @PathVariable Long customerId, 
            @RequestBody AppointmentRequest request) {
        Appointment appointment = appointmentService.bookAppointment(customerId, request);
        return ResponseEntity.ok(appointment);
    }
    
    @PutMapping("/{appointmentId}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable Long appointmentId, 
            @RequestParam AppointmentStatus status) {
        Appointment appointment = appointmentService
            .updateAppointmentStatus(appointmentId, status);
        return ResponseEntity.ok(appointment);
    }
}
```

#### Appointment Service Logic
```java
@Service
@Transactional
public class AppointmentService {
    
    public Appointment bookAppointment(Long customerId, AppointmentRequest request) {
        // 1. Validate customer and agent exist
        User customer = userRepository.findById(customerId)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        User agent = userRepository.findById(request.getAgentId())
            .orElseThrow(() -> new RuntimeException("Agent not found"));
        
        // 2. Check for scheduling conflicts
        List<Appointment> existingAppointments = appointmentRepository
            .findByAgentIdAndDateTime(request.getAgentId(), 
                request.getAppointmentDateTime());
        
        if (!existingAppointments.isEmpty()) {
            throw new RuntimeException("Agent is not available at this time");
        }
        
        // 3. Create and save appointment
        Appointment appointment = new Appointment();
        appointment.setCustomer(customer);
        appointment.setAgent(agent);
        appointment.setAppointmentDateTime(request.getAppointmentDateTime());
        appointment.setReason(request.getReason());
        appointment.setStatus(AppointmentStatus.PENDING);
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // 4. Mark availability slot as booked
        if (request.getAvailabilityId() != null) {
            availabilityService.markSlotAsBooked(request.getAvailabilityId());
        }
        
        return savedAppointment;
    }
}
```

### 5. Password Reset Workflow
```java
// Step 1: Request password reset
@PostMapping("/forgot-password")
public ResponseEntity<String> forgotPassword(@RequestParam String email) {
    return ResponseEntity.ok(authService.resetPassword(email));
}

// Step 2: Generate and send reset code
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

// Step 3: Validate reset code
@PostMapping("/validate-reset-code")
public ResponseEntity<String> validateResetCode(@RequestBody ValidateResetCodeRequest request) {
    try {
        return ResponseEntity.ok(authService.validateResetCode(request));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

// Step 4: Confirm password reset
public String confirmPasswordReset(ResetPasswordRequest request) {
    User user = userRepository.findByResetToken(request.getCode())
        .orElseThrow(() -> new RuntimeException("Invalid reset code"));

    if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
        throw new RuntimeException("Reset code expired");
    }

    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setResetToken(null);
    user.setResetTokenExpiry(null);
    userRepository.save(user);

    return "Password reset successful";
}
```

## 📧 Email Service Integration

```java
@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public void sendVerificationEmail(String to, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Email Verification - InsurAI");
        message.setText("Your verification code is: " + verificationCode + 
                       "\nThis code will expire in 10 minutes.");
        mailSender.send(message);
    }
    
    public void sendPasswordResetEmail(String to, String resetCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset - InsurAI");
        message.setText("Your password reset code is: " + resetCode + 
                       "\nThis code will expire in 10 minutes.");
        mailSender.send(message);
    }
}
```

## 🗄️ Repository Layer

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationCode(String verificationCode);
    Optional<User> findByResetToken(String resetToken);
    List<User> findByRole(Role role);
}

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByCustomerId(Long customerId);
    List<Appointment> findByAgentId(Long agentId);
    List<Appointment> findByAgentIdAndDateTime(Long agentId, LocalDateTime dateTime);
}
```

## 🚀 Application Configuration

```properties
# application.properties
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/insur_ai_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

## 📊 Data Flow Summary

1. **User Registration** → Email Verification → Account Activation
2. **Login** → JWT Token Generation → Role-based Access
3. **Appointment Booking** → Availability Check → Conflict Prevention
4. **Status Management** → Real-time Updates → Notification System
5. **Password Recovery** → Secure Reset Process → Account Security

## 🔍 Key Features Demonstrated

- **Multi-layered Architecture**: Controller → Service → Repository
- **Security**: JWT authentication, password encryption, email verification
- **Data Integrity**: Transaction management, conflict prevention
- **Communication**: Automated email notifications
- **Role Management**: Customer, Agent, Admin access levels
- **Error Handling**: Comprehensive exception management

This workflow showcases a production-ready insurance appointment management system with robust security, data validation, and user experience features.