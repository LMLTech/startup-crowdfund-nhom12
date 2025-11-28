package com.starfund.dto;
import lombok.Data;

@Data
public class UpdateStatusRequest {
    private String status; // "active", "inactive", "banned"

    public Object getStatus() {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}