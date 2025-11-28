package com.starfund.service;

import com.starfund.model.ActivityLog;
import com.starfund.model.User;
import com.starfund.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    /**
     * Ghi log bất đồng bộ, KHÔNG làm hỏng transaction chính
     * Chỉ dùng các field có sẵn trong entity: metadata là JSON
     */
    @Async
    public void log(User user, String action, String entityType, Long entityId, String ipAddress, String description) {
        try {
            ActivityLog log = ActivityLog.builder()
                    .user(user)
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .ipAddress(ipAddress != null ? ipAddress : "Unknown IP")
                    .userAgent("Web")
                    // QUAN TRỌNG: metadata phải là chuỗi JSON hợp lệ!
                    .metadata("{\"description\":\"" + 
                             (description != null ? description.replace("\"", "\\\"") : "No description") + 
                             "\",\"action\":\"" + action + "\"}")
                    .build();

            activityLogRepository.save(log);
        } catch (Exception e) {
            System.err.println("Lỗi ghi ActivityLog (không ảnh hưởng đăng ký): " + e.getMessage());
            e.printStackTrace();
        }
    }
}