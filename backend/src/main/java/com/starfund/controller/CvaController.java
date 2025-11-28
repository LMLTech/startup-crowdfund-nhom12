package com.starfund.controller;

import com.starfund.dto.ApiResponse;
import com.starfund.dto.CvaReviewRequest;
import com.starfund.model.ProjectReview;
import com.starfund.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cva/projects")
@RequiredArgsConstructor
public class CvaController {

    private final ProjectService projectService;

    @GetMapping("/pending")
    // FIX: Dùng hasAuthority thay vì hasRole (vì role trong DB là "CVA" không có prefix ROLE_)
    @PreAuthorize("hasAuthority('CVA') or hasAuthority('ADMIN')")
    public ResponseEntity<?> getPending() {
        return ResponseEntity.ok(ApiResponse.success(projectService.getPendingProjects(), "Thành công"));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('CVA') or hasAuthority('ADMIN')")
    public ResponseEntity<?> approve(@PathVariable Long id, @RequestBody CvaReviewRequest request) {
        projectService.reviewProject(id, request.getFeedback(), ProjectReview.ReviewAction.APPROVED);
        return ResponseEntity.ok(ApiResponse.success(null, "Dự án đã được duyệt"));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('CVA') or hasAuthority('ADMIN')")
    public ResponseEntity<?> reject(@PathVariable Long id, @RequestBody CvaReviewRequest request) {
        projectService.reviewProject(id, request.getFeedback(), ProjectReview.ReviewAction.REJECTED);
        return ResponseEntity.ok(ApiResponse.success(null, "Dự án đã bị từ chối"));
    }
}