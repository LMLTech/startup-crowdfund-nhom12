package com.starfund.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
       
        var uploadPath = Paths.get("uploads").toAbsolutePath().normalize();

        System.out.println("==================================================");
        System.out.println("UPLOADS Duoc map tai:");
        System.out.println(uploadPath);
        System.out.println("Directory exists: " + uploadPath.toFile().exists());
        System.out.println("==================================================");

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath.toUri().toString())
                .setCachePeriod(0);
    }
}