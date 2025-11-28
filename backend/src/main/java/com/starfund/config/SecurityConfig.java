package com.starfund.config;

import com.starfund.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired; // Thêm import này
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
// @RequiredArgsConstructor  <-- BỎ DÒNG NÀY ĐI
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // THÊM ĐOẠN NÀY (Constructor viết tay)
    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }
    // ------------------------------------

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration configuration = new CorsConfiguration();
                // Đã mở rộng CORS chuẩn
                configuration.setAllowedOrigins(List.of(
                    "http://localhost:3000", 
                    "http://localhost:5173",
                    "http://127.0.0.1:3000",
                    "http://127.0.0.1:5173"
                ));
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("*"));
                configuration.setAllowCredentials(true);
                return configuration;
            }))
            .authorizeHttpRequests(auth -> auth
    // Public endpoints
    .requestMatchers("/api/auth/**", "/api/investments/vnpay-callback", "/uploads/**").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/projects/**").permitAll()
    .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**", "/webjars/**").permitAll()

    // ADMIN ONLY - MỞ 2 DÒNG NÀY LÀ ADMIN SỐNG NGAY!!!
    .requestMatchers("/api/admin/**").hasRole("ADMIN")
    .requestMatchers("/api/stats/admin-dashboard").hasRole("ADMIN")

    // Các endpoint còn lại cần login
    .anyRequest().authenticated()
)
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}