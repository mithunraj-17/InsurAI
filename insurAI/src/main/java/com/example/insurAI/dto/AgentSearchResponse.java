package com.example.insurAI.dto;

import com.example.insurAI.entity.AgentAvailability;
import java.util.List;

public class AgentSearchResponse {
    private boolean hasAvailableAgents;
    private String message;
    private List<AgentAvailability> availableSlots;

    public AgentSearchResponse(boolean hasAvailableAgents, String message, List<AgentAvailability> availableSlots) {
        this.hasAvailableAgents = hasAvailableAgents;
        this.message = message;
        this.availableSlots = availableSlots;
    }

    public boolean isHasAvailableAgents() { return hasAvailableAgents; }
    public void setHasAvailableAgents(boolean hasAvailableAgents) { this.hasAvailableAgents = hasAvailableAgents; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<AgentAvailability> getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(List<AgentAvailability> availableSlots) { this.availableSlots = availableSlots; }
}