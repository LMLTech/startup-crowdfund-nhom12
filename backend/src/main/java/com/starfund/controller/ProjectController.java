package com.starfund.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.starfund.dto.ApiResponse;
import com.starfund.model.Project;
import com.starfund.model.ProjectMilestone;
import com.starfund.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    private final ObjectMapper objectMapper;

    // 2.1 Get All
    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit,
            @RequestParam(defaultValue = "approved") String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.success(
            projectService.getProjects(status, category, search, page, limit), 
            "Lấy danh sách thành công"));
    }

    // 2.4 Get My Projects
    @GetMapping("/my-projects")
    public ResponseEntity<?> getMyProjects() {
        return ResponseEntity.ok(ApiResponse.success(projectService.getMyProjects(), "Thành công"));
    }
    
    // 2.6 Delete Project
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Đã xóa dự án"));
    }

    // 2.2 Get Detail
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(projectService.getProjectById(id), "Thành công"));
    }

    // 2.3 Create Project
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("fullDescription") String fullDesc,
            @RequestParam("category") String category,
            @RequestParam("targetAmount") Long target,
            @RequestParam("daysLeft") Integer days,
            @RequestParam("image") MultipartFile image,
            @RequestParam("tags") String tagsJson,
            @RequestParam("milestones") String milestonesJson
    ) {
        try {
            List<String> tags = objectMapper.readValue(tagsJson, new TypeReference<List<String>>(){});
            List<ProjectMilestone> milestones = objectMapper.readValue(milestonesJson, new TypeReference<List<ProjectMilestone>>(){});
            Project p = projectService.createProject(title, description, fullDesc, category, target, days, image, tags, milestones);
            return ResponseEntity.status(201).body(ApiResponse.success(p, "Tạo dự án thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Lỗi: " + e.getMessage()));
        }
    }

    // 2.5 Update Project
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("fullDescription") String fullDesc,
            @RequestParam("category") String category,
            @RequestParam(value = "image", required = false) MultipartFile image // Ảnh có thể null nếu ko đổi
    ) {
        try {
            Project p = projectService.updateProject(id, title, description, fullDesc, category, image);
            return ResponseEntity.ok(ApiResponse.success(p, "Cập nhật dự án thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Lỗi: " + e.getMessage()));
        }
    }
}