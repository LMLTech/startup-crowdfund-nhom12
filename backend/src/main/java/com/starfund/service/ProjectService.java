package com.starfund.service;

import com.starfund.model.*;
import com.starfund.repository.ProjectRepository;
import com.starfund.repository.UserRepository;
import com.starfund.repository.ProjectReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final ProjectReviewRepository projectReviewRepository;

    // --- HELPER METHODS ---
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng hiện tại"));
    }

    // --- 1. PUBLIC / INVESTOR FEATURES ---

    // Lấy danh sách dự án (Public - Thường dùng cho trang chủ/khám phá)
    public Page<Project> getProjects(String status, String category, String search, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        
        // Mặc định nếu không truyền status thì lấy APPROVED (cho public)
        Project.ProjectStatus projectStatus = StringUtils.hasText(status) 
                ? Project.ProjectStatus.valueOf(status.toUpperCase()) 
                : Project.ProjectStatus.APPROVED;

        return projectRepository.findByFilters(projectStatus, category, search, pageable);
    }

    // Lấy chi tiết dự án
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dự án với ID: " + id));
    }

    // --- 2. STARTUP FEATURES ---

    // Tạo dự án mới (Fix logic set Pending & Upload ảnh)
    @Transactional
    public Project createProject(String title, String description, String fullDesc, String category,
                                 Long target, Integer days, MultipartFile image,
                                 List<String> tagNames, List<ProjectMilestone> milestones) {
        User founder = getCurrentUser();
        
        // Upload ảnh 
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            // Hàm storeFile đã được sửa để loại bỏ dấu cách trong tên file -> An toàn
            imageUrl = fileStorageService.storeFile(image);
        } else {
            // Fallback ảnh mặc định nếu user không up ảnh (tránh lỗi null pointer)
            imageUrl = "https://via.placeholder.com/800x400?text=No+Image";
        }

        Project project = Project.builder()
                .founder(founder)
                .title(title)
                .description(description)
                .fullDescription(fullDesc)
                .category(category)
                .targetAmount(target)
                .currentAmount(0L)
                .investorCount(0)
                .daysLeft(days)
                .imageUrl(imageUrl)
                .status(Project.ProjectStatus.PENDING) // Quan trọng: Set PENDING để CVA thấy
                .build();

        // Xử lý Tags
        if (tagNames != null && !tagNames.isEmpty()) {
            tagNames.forEach(t -> project.addTag(ProjectTag.builder().tagName(t).build()));
        }

        // Xử lý Milestones
        if (milestones != null && !milestones.isEmpty()) {
            milestones.forEach(project::addMilestone);
        }

        return projectRepository.save(project);
    }

    // Lấy danh sách dự án CỦA TÔI (Startup)
    public List<Project> getMyProjects() {
        User founder = getCurrentUser();
        return projectRepository.findByFounder(founder);
    }

    // Cập nhật dự án
    @Transactional
    public Project updateProject(Long id, String title, String description, String fullDesc, 
                                 String category, MultipartFile image) {
        Project project = getProjectById(id);
        User currentUser = getCurrentUser();

        // Check quyền: Chỉ chủ dự án mới được sửa
        if (!project.getFounder().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa dự án này");
        }

        // Check logic: Không cho sửa nếu dự án đã Hoàn thành hoặc bị Hủy (Tùy nghiệp vụ)
        if (project.getStatus() == Project.ProjectStatus.COMPLETED || project.getStatus() == Project.ProjectStatus.CANCELLED) {
            throw new RuntimeException("Không thể chỉnh sửa dự án đã kết thúc");
        }

        project.setTitle(title);
        project.setDescription(description);
        project.setFullDescription(fullDesc);
        project.setCategory(category);

        // Nếu có upload ảnh mới thì thay thế
        if (image != null && !image.isEmpty()) {
            String newImageUrl = fileStorageService.storeFile(image);
            project.setImageUrl(newImageUrl);
        }

        return projectRepository.save(project);
    }

    // Xóa dự án
    @Transactional
    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        User currentUser = getCurrentUser();

        // Check quyền: Chỉ chủ dự án hoặc Admin mới được xóa
        boolean isFounder = project.getFounder().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == User.UserRole.ADMIN;

        if (!isFounder && !isAdmin) {
            throw new RuntimeException("Bạn không có quyền xóa dự án này");
        }

        // Check an toàn: Không xóa nếu đã có người đầu tư tiền
        if (project.getCurrentAmount() > 0) {
            throw new RuntimeException("Không thể xóa dự án đã có nhà đầu tư. Vui lòng liên hệ Admin để hủy.");
        }

        projectRepository.delete(project);
    }

    // --- 3. CVA (COUNCIL VENTURE ADVISOR) FEATURES ---

    // Lấy danh sách dự án chờ duyệt (Pending)
    public List<Project> getPendingProjects() {
        // Đã sửa repository dùng query UPPER(status) = 'PENDING' -> Chắc chắn tìm thấy
        return projectRepository.findByStatus(Project.ProjectStatus.PENDING);
    }

    // Duyệt hoặc Từ chối dự án
    @Transactional
    public void reviewProject(Long projectId, String feedback, ProjectReview.ReviewAction action) {
        User cva = getCurrentUser();
        
        // Check quyền: Phải là CVA hoặc Admin
        if (cva.getRole() != User.UserRole.CVA && cva.getRole() != User.UserRole.ADMIN) {
            throw new RuntimeException("Bạn không có quyền duyệt dự án");
        }

        Project project = getProjectById(projectId);

        // Update trạng thái dự án
        if (action == ProjectReview.ReviewAction.APPROVED) {
            project.setStatus(Project.ProjectStatus.APPROVED);
            project.setApprovedAt(LocalDateTime.now());
        } else if (action == ProjectReview.ReviewAction.REJECTED) {
            project.setStatus(Project.ProjectStatus.REJECTED);
            project.setRejectedAt(LocalDateTime.now());
        }

        projectRepository.save(project);

        // Lưu lịch sử review
        ProjectReview review = ProjectReview.builder()
                .project(project)
                .cvaReviewer(cva)
                .action(action)
                .feedback(feedback)
                .build();
        
        projectReviewRepository.save(review);
    }
}