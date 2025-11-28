package com.starfund.controller;

import com.starfund.dto.ApiResponse;
import com.starfund.dto.UpdateStatusRequest;
import com.starfund.model.User;
import com.starfund.repository.ProjectRepository;
import com.starfund.repository.UserRepository;
import com.starfund.service.ActivityLogService;
import com.starfund.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final TransactionService transactionService;
    private final ActivityLogService activityLogService;
    private final ProjectRepository projectRepository;

    private User getCurrentAdmin() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    // ==================== USER MANAGEMENT ====================
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        User.UserRole userRole = StringUtils.hasText(role) ? User.UserRole.valueOf(role.toUpperCase()) : null;
        User.UserStatus userStatus = StringUtils.hasText(status) ? User.UserStatus.valueOf(status.toUpperCase()) : null;

        Page<User> users = userRepository.findByFilters(userRole, userStatus, search, pageable);
        return ResponseEntity.ok(ApiResponse.success(users, "Lấy danh sách người dùng thành công"));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
        User admin = getCurrentAdmin();
        if (user.getEmail().equals(admin.getEmail())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Bạn không thể tự khóa tài khoản của chính mình"));
        }
        try {
            User.UserStatus newStatus = User.UserStatus.valueOf(request.getStatus().toUpperCase());
            user.setStatus(newStatus);
            userRepository.save(user);
            activityLogService.log(admin, "UPDATE_USER_STATUS", "USER", id, "Unknown IP", "Changed status to " + newStatus);
            return ResponseEntity.ok(ApiResponse.success(null, "Cập nhật trạng thái thành công"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Trạng thái không hợp lệ"));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
        User admin = getCurrentAdmin();
        if (user.getEmail().equals(admin.getEmail())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Bạn không thể tự xóa tài khoản của chính mình"));
        }
        userRepository.deleteById(id);
        activityLogService.log(admin, "DELETE_USER", "USER", id, "Unknown IP", "Deleted user account");
        return ResponseEntity.ok(ApiResponse.success(null, "Đã xóa người dùng vĩnh viễn"));
    }

    // ==================== TRANSACTION ====================
    @GetMapping("/transactions")
    public ResponseEntity<?> getAllTransactions(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long userId) {

        return ResponseEntity.ok(ApiResponse.success(
            transactionService.getTransactions(page, limit, status, type, userId),
            "Lấy danh sách giao dịch thành công"
        ));
    }

    // ==================== PROJECTS (ADMIN) ====================
    @GetMapping("/projects")
    public ResponseEntity<?> getAllProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int limit) {

        Pageable pageable = PageRequest.of(page, limit);
        var projects = projectRepository.findAll(pageable);

        return ResponseEntity.ok(ApiResponse.success(
            projects.getContent(),
            "Lấy danh sách tất cả dự án thành công"
        ));
    }
}