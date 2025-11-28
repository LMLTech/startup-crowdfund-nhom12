package com.starfund;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan; 
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ConfigurationPropertiesScan   
@EnableJpaAuditing
@EnableScheduling
public class StarfundApplication {

    public static void main(String[] args) {
        SpringApplication.run(StarfundApplication.class, args);
        System.out.println("=========================================");
        System.out.println("StarFund Backend is running on port 8080");
        System.out.println("=========================================");
    }
}