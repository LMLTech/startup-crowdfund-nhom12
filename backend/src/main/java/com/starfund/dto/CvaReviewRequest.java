package com.starfund.dto;
import lombok.Data;

@Data
public class CvaReviewRequest {
    private String feedback;
    private String status; // "APPROVED" hoặc "REJECTED" 
}