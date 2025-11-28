package com.starfund.controller;

import com.starfund.dto.ApiResponse;
import com.starfund.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<?> getMyNotifications() {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getMyNotifications(), "Thành công"));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> countUnread() {
        return ResponseEntity.ok(ApiResponse.success(Map.of("count", notificationService.countUnread()), "Thành công"));
    }

    @PutMapping("/mark-read")
    public ResponseEntity<?> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok(ApiResponse.success(null, "Đã đánh dấu đã đọc"));
    }
}