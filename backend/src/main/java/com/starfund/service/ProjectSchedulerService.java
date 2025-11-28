package com.starfund.service;

import com.starfund.model.Project;
import com.starfund.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectSchedulerService {

    private final ProjectRepository projectRepository;

    // Chạy mỗi ngày lúc 00:00 đêm
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void checkProjectDeadlines() {
        System.out.println("---- Bắt đầu quét các dự án hết hạn ----");
        
        // Logic giả định: Project có endDate (bạn cần tính toán endDate dựa trên createdAt + daysLeft)
        // Hoặc đơn giản hơn: Trừ daysLeft đi 1 mỗi ngày
        
        List<Project> activeProjects = projectRepository.findByStatus(Project.ProjectStatus.ACTIVE);
        
        for (Project p : activeProjects) {
            if (p.getDaysLeft() > 0) {
                p.setDaysLeft(p.getDaysLeft() - 1);
            }
            
            // Nếu hết ngày
            if (p.getDaysLeft() <= 0) {
                if (p.getCurrentAmount() >= p.getTargetAmount()) {
                    p.setStatus(Project.ProjectStatus.COMPLETED); // Thành công
                } else {
                    p.setStatus(Project.ProjectStatus.CANCELLED); // Thất bại (hoặc để CANCELLED)
                }
            }
        }
        
        projectRepository.saveAll(activeProjects);
        System.out.println("---- Đã cập nhật trạng thái dự án ----");
    }
}