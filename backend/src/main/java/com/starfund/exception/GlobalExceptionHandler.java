package com.starfund.exception;

import com.starfund.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Bắt lỗi Validation (Ví dụ: Email rỗng, password ngắn)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage()));
        
        return ResponseEntity.badRequest().body(
            new ApiResponse<>(false, "Dữ liệu không hợp lệ", errors)
        );
    }

    // 2. Bắt lỗi Sai mật khẩu / Chưa đăng nhập
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Object>> handleAuthError(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            ApiResponse.error("Email hoặc mật khẩu không chính xác")
        );
    }

    // 3. Bắt các lỗi Runtime (Ví dụ: Không tìm thấy User, Lỗi logic)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.badRequest().body(
            ApiResponse.error(ex.getMessage())
        );
    }

    // 4. Bắt tất cả lỗi còn lại (Lỗi hệ thống 500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGlobalException(Exception ex) {
        ex.printStackTrace(); // In lỗi ra console để debug
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            ApiResponse.error("Đã xảy ra lỗi hệ thống: " + ex.getMessage())
        );
    }
}