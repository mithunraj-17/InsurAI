package com.example.insurAI.dto;

import java.time.LocalDateTime;

import lombok.*;


@Getter
@Setter
public class AppointmentRequest {
    private Long agentId;
    private Long availabilityId;
    private LocalDateTime appointmentDateTime;
    private String reason;
    private String notes;
}