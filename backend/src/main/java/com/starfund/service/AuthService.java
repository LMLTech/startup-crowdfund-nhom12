package com.starfund.service;

import com.starfund.dto.AuthRequest;
import com.starfund.model.User;
import com.starfund.repository.UserRepository;
import com.starfund.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final ActivityLogService activityLogService;

    @Transactional(noRollbackFor = Exception.class)
    public Map<String, Object> register(AuthRequest.Register request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại!");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phone(request.getPhone())
                .role(User.UserRole.valueOf(request.getRole().toUpperCase()))
                .company(request.getCompany())
                .status(User.UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        // Ghi log bất đồng bộ – dù lỗi JSON cũng không ảnh hưởng user
        activityLogService.log(
            savedUser,
            "REGISTER",
            "USER",
            savedUser.getId(),
            "Unknown IP",
            "Đăng ký tài khoản mới: " + savedUser.getEmail()
        );

        return generateAuthResponse(savedUser, null);
    }

    @Transactional
    public Map<String, Object> login(AuthRequest.Login request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        activityLogService.log(user, "LOGIN", "USER", user.getId(), "Unknown IP", "Đăng nhập thành công");

        return generateAuthResponse(user, token);
    }

    private Map<String, Object> generateAuthResponse(User user, String token) {
        Map<String, Object> res = new HashMap<>();
        res.put("user", user);
        if (token != null) {
            res.put("token", token);
        }
        return res;
    }
}