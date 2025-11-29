package com.starfund.service;

import com.starfund.dto.InvestmentRequest;
import com.starfund.model.*;
import com.starfund.repository.*;
import com.starfund.config.VnPayConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class InvestmentService {

    private final InvestmentRepository investmentRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final ActivityLogService activityLogService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public String createInvestment(InvestmentRequest request) {
        User investor = getCurrentUser();
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (project.getFounder().getId().equals(investor.getId())) {
            throw new RuntimeException("Không thể tự đầu tư vào dự án của chính mình");
        }

        String txnCode = "INV" + System.currentTimeMillis();

        Investment investment = Investment.builder()
                .investor(investor)
                .project(project)
                .amount(request.getAmount())
                .message(request.getMessage())
                .status(Investment.InvestmentStatus.PENDING)
                .paymentMethod(Investment.PaymentMethod.VNPAY)
                .transactionCode(txnCode)
                .createdAt(LocalDateTime.now())
                .build();

        investmentRepository.save(investment);

        Transaction transaction = Transaction.builder()
                .user(investor)
                .investment(investment)
                .type(Transaction.TransactionType.INVESTMENT)
                .amount(request.getAmount())
                .status(Transaction.TransactionStatus.PENDING)
                .transactionCode(txnCode)
                .paymentMethod("VNPAY")
                .description("Đầu tư vào dự án: " + project.getTitle())
                .createdAt(LocalDateTime.now())
                .build();
        transactionRepository.save(transaction);

        activityLogService.log(investor, "CREATE_INVESTMENT", "INVESTMENT", investment.getId(),
                "IP: " + getClientIp(), "Số tiền: " + request.getAmount() + " VNĐ");

        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest httpRequest = attributes != null ? attributes.getRequest() : null;

        try {
            return generateVnpayPaymentUrl(investment, httpRequest);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo link thanh toán VNPay: " + e.getMessage());
        }
    }

    // ĐÃ SỬA HOÀN HẢO: DÙNG UTF-8 CHO TẤT CẢ, ĐẶC BIỆT LÀ vnp_OrderInfo CÓ DẤU
   // Thay thế method generateVnpayPaymentUrl

private String generateVnpayPaymentUrl(Investment investment, HttpServletRequest request) throws UnsupportedEncodingException {
    String vnp_Version = "2.1.0";
    String vnp_Command = "pay";
    String vnp_TmnCode = VnPayConfig.vnp_TmnCode;
    String vnp_Amount = String.valueOf(investment.getAmount() * 100);
    String vnp_TxnRef = investment.getTransactionCode();
    
    // CRITICAL FIX: Không dấu, không ký tự đặc biệt
    String vnp_OrderInfo = "Thanh toan dau tu - " + vnp_TxnRef;
    
    String vnp_OrderType = "250000";
    String vnp_Locale = "vn";
    String vnp_IpAddr = request != null ? VnPayConfig.getIpAddress(request) : "127.0.0.1";

    Map<String, String> vnp_Params = new HashMap<>();
    vnp_Params.put("vnp_Version", vnp_Version);
    vnp_Params.put("vnp_Command", vnp_Command);
    vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
    vnp_Params.put("vnp_Amount", vnp_Amount);
    vnp_Params.put("vnp_CurrCode", "VND");
    vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
    vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
    vnp_Params.put("vnp_OrderType", vnp_OrderType);
    vnp_Params.put("vnp_Locale", vnp_Locale);
    vnp_Params.put("vnp_ReturnUrl", VnPayConfig.vnp_ReturnUrl);
    vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

    Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
    SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
    String vnp_CreateDate = formatter.format(cal.getTime());
    vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

    cal.add(Calendar.MINUTE, 15);
    String vnp_ExpireDate = formatter.format(cal.getTime());
    vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

    // Sắp xếp key theo thứ tự A-Z
    List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
    Collections.sort(fieldNames);

    // CRITICAL FIX: Hash data dùng RAW VALUE, Query string dùng URL ENCODED
    StringBuilder hashData = new StringBuilder();
    StringBuilder query = new StringBuilder();

    for (int i = 0; i < fieldNames.size(); i++) {
        String fieldName = fieldNames.get(i);
        String fieldValue = vnp_Params.get(fieldName);
        
        if (fieldValue != null && !fieldValue.isEmpty()) {
            // HashData: RAW VALUE (không encode)
            hashData.append(fieldName).append('=').append(fieldValue);
            
            // Query: URL ENCODED
            String encodedValue = URLEncoder.encode(fieldValue, StandardCharsets.UTF_8);
            query.append(fieldName).append('=').append(encodedValue);

            if (i < fieldNames.size() - 1) {
                hashData.append('&');
                query.append('&');
            }
        }
    }

    // QUAN TRỌNG: Hash từ RAW DATA
    String vnp_SecureHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData.toString());
    query.append("&vnp_SecureHash=").append(vnp_SecureHash);

    String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + query.toString();
    
    // DEBUG LOG
    System.out.println("=== VNPAY DEBUG ===");
    System.out.println("HashData: " + hashData.toString());
    System.out.println("SecureHash: " + vnp_SecureHash);
    System.out.println("Payment URL: " + paymentUrl);
    System.out.println("===================");
    
    return paymentUrl;
}

    private String getClientIp() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            return VnPayConfig.getIpAddress(request);
        }
        return "Unknown";
    }

    @Transactional
    public void handleVnpayCallback(String txnCode, String responseCode) {
        if ("00".equals(responseCode)) {
            Investment investment = investmentRepository.findByTransactionCode(txnCode)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy giao dịch"));

            if (investment.getStatus() == Investment.InvestmentStatus.SUCCESS) {
                return;
            }

            investment.setStatus(Investment.InvestmentStatus.SUCCESS);
            investment.setCompletedAt(LocalDateTime.now());
            investmentRepository.save(investment);

            Transaction txn = transactionRepository.findByTransactionCode(txnCode)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy transaction"));
            txn.setStatus(Transaction.TransactionStatus.SUCCESS);
            txn.setCompletedAt(LocalDateTime.now());
            transactionRepository.save(txn);

            Project project = investment.getProject();
            project.setCurrentAmount(project.getCurrentAmount() + investment.getAmount());
            project.setInvestorCount(project.getInvestorCount() + 1);
            projectRepository.save(project);

            activityLogService.log(investment.getInvestor(), "INVESTMENT_SUCCESS", "INVESTMENT",
                    investment.getId(), getClientIp(), "Thành công: " + investment.getAmount() + " VNĐ");
        }
    }

    public List<Investment> getMyInvestments() {
        User user = getCurrentUser();
        return investmentRepository.findByInvestor(user);
    }

    public List<Investment> getProjectInvestments(Long projectId) {
        User founder = getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getFounder().getId().equals(founder.getId())) {
            throw new RuntimeException("Bạn không có quyền xem danh sách đầu tư của dự án này");
        }

        return investmentRepository.findByProject(project);
    }
}