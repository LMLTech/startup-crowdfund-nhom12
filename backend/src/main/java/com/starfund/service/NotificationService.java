package com.starfund.service;

import com.starfund.model.Notification;
import com.starfund.model.User;
import com.starfund.repository.NotificationRepository;
import com.starfund.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    // 1. Lấy danh sách thông báo của tôi
    public List<Notification> getMyNotifications() {
        User user = getCurrentUser();
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    // 2. Đánh dấu tất cả là đã đọc
    @Transactional
    public void markAllAsRead() {
        User user = getCurrentUser();
        notificationRepository.markAllAsReadByUser(user);
    }

    // 3. Đếm số thông báo chưa đọc (để hiện số đỏ trên cái chuông)
    public Long countUnread() {
        User user = getCurrentUser();
        return notificationRepository.countUnreadByUser(user);
    }

    // 4. Hàm nội bộ để tạo thông báo (Dùng cho các Service khác gọi)
    public void createNotification(User user, Notification.NotificationType type, String title, String message, String link) {
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .message(message)
                .link(link)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }
}