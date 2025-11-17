package com.example.insurAI.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PolicyApplicationRequest {
    private Long policyId;
    private String documents;
    private String additionalDetails;
}