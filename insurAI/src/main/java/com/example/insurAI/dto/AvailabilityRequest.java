package com.example.insurAI.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.*;

@Getter
@Setter
public class AvailabilityRequest {
    private LocalDateTime availableDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean isAvailable = true;

}