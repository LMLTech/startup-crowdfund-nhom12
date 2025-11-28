package com.starfund.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils; 
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public FileStorageService() {
        try { Files.createDirectories(this.fileStorageLocation); } 
        catch (Exception ex) { throw new RuntimeException("Could not create upload dir", ex); }
    }

    public String storeFile(MultipartFile file) {
        // 1. Lấy tên file gốc và làm sạch (bỏ path traversal ..)
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        
        // 2. Thay thế khoảng trắng và ký tự lạ bằng dấu gạch dưới
        // Ví dụ: "Screenshot 2025.png" -> "Screenshot_2025.png"
        String safeFileName = originalFileName.replaceAll("\\s+", "_").replaceAll("[^a-zA-Z0-9._-]", "");

        // 3. Tạo tên file duy nhất
        String fileName = UUID.randomUUID() + "_" + safeFileName;

        try {
            Files.copy(file.getInputStream(), this.fileStorageLocation.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + fileName; 
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName, ex);
        }
    }
}