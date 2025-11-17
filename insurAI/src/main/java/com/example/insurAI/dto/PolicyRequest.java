package com.example.insurAI.dto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class PolicyRequest {
    private String policyName;
    private BigDecimal premium;
    private String policyType;
    private String coverage;
    private String benefits;
    private String terms;
    private String conditions;
}