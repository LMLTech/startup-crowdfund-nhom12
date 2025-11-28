package com.starfund.dto;

import lombok.Data;

public class AuthRequest {
    
    @Data
    public static class Login {
        private String email;
        private String password;
    }

    @Data
    public static class Register {
        private String email;
        private String password;
        private String name;
        private String phone;
        private String role; // "investor", "startup", 
        private String company;
    }
}