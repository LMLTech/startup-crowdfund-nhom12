package com.starfund.controller;


import com.starfund.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final InvestmentRepository investmentRepository;
    private final TransactionRepository transactionRepository;
    private final ProjectReviewRepository projectReviewRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Investor dashboard — only INVESTOR
    @GetMapping("/investor-dashboard")
    @PreAuthorize("hasRole('INVESTOR')")
    public ResponseEntity<?> getInvestorStats() {
        User user = getCurrentUser();
        Map<String, Object> data = new HashMap<>();

        Long totalInvested = investmentRepository.sumAmountByInvestor(user);
        Long distinctProjects = investmentRepository.countDistinctProjectsByInvestor(user);

        data.put("totalInvested", totalInvested != null ? totalInvested : 0L);
        data.put("totalProjectsInvested", distinctProjects != null ? distinctProjects : 0L);

        return ResponseEntity.ok(ApiResponse.success(data, "Success"));
    }

    // Startup dashboard — only STARTUP
    @GetMapping("/startup-dashboard")
    @PreAuthorize("hasRole('STARTUP')")
    public ResponseEntity<?> getStartupStats() {
        User user = getCurrentUser();
        Map<String, Object> data = new HashMap<>();

        Long totalProjects = projectRepository.countByFounderAndStatus(user, Project.ProjectStatus.APPROVED);
        Long totalRaised = projectRepository.sumRaisedByFounder(user);

        data.put("totalProjects", totalProjects != null ? totalProjects : 0L);
        data.put("totalRaised", totalRaised != null ? totalRaised : 0L);

        return ResponseEntity.ok(ApiResponse.success(data, "Success"));
    }

    // CVA dashboard — only CVA
    @GetMapping("/cva-dashboard")
    @PreAuthorize("hasRole('CVA')")
    public ResponseEntity<?> getCvaStats() {
        Map<String, Object> data = new HashMap<>();
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);

        Long pending = projectRepository.countByStatus(Project.ProjectStatus.PENDING);
        Long approvedThisMonth = projectReviewRepository.countApprovedSince(startOfMonth);
        Long rejectedThisMonth = projectReviewRepository.countRejectedSince(startOfMonth);

        data.put("pendingProjects", pending != null ? pending : 0L);
        data.put("approvedThisMonth", approvedThisMonth != null ? approvedThisMonth : 0L);
        data.put("rejectedThisMonth", rejectedThisMonth != null ? rejectedThisMonth : 0L);

        return ResponseEntity.ok(ApiResponse.success(data, "Success"));
    }

    // Admin dashboard — only ADMIN
    @GetMapping("/admin-dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminStats() {
        Map<String, Object> data = new HashMap<>();

        Long totalUsers = userRepository.count();
        Long totalProjects = projectRepository.count();
        Long totalInvestments = transactionRepository.sumSuccessfulInvestmentAmount();

        data.put("totalUsers", totalUsers != null ? totalUsers : 0L);
        data.put("totalProjects", totalProjects != null ? totalProjects : 0L);
        data.put("totalInvestments", totalInvestments != null ? totalInvestments : 0L);

        return ResponseEntity.ok(ApiResponse.success(data, "Success"));
    }
}