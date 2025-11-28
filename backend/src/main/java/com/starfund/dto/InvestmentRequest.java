package com.starfund.dto;

import lombok.Data;

@Data
public class InvestmentRequest {
    private Long projectId;
    private Long amount;
    private String paymentMethod;
    private String message;
}