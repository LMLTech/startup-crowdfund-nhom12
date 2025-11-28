package com.starfund.controller;

import com.starfund.dto.ApiResponse;
import com.starfund.repository.InvestmentRepository;
import com.starfund.repository.ProjectRepository;
import com.starfund.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminStatisticsController {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final InvestmentRepository investmentRepository;

    @GetMapping("/admin-dashboard")
    public ResponseEntity<?> getAdminStats() {

        long totalUsers = userRepository.count();
        long totalProjects = projectRepository.count();

       
        long totalInvestments = investmentRepository.sumAmount(); 

        long totalTransactions = investmentRepository.count();

        var monthlyStats = List.of(
            Map.of("month", "T8", "revenue", 85000000L),
            Map.of("month", "T9", "revenue", 120000000L),
            Map.of("month", "T10", "revenue", 180000000L),
            Map.of("month", "T11", "revenue", 250000000L)
        );

        var categoryData = List.of(
            Map.of("name", "Công nghệ", "value", 5),
            Map.of("name", "Y tế", "value", 3),
            Map.of("name", "Nông nghiệp", "value", 2),
            Map.of("name", "Khác", "value", 4)
        );

        var data = Map.of(
            "totalUsers", totalUsers,
            "totalProjects", totalProjects,
            "totalInvestments", totalInvestments,
            "totalTransactions", totalTransactions,
            "monthlyStats", monthlyStats,
            "projectCategories", categoryData
        );

        return ResponseEntity.ok(ApiResponse.success(data, "Lấy thống kê admin thành công"));
    }
}