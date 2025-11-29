package com.starfund.service;

import com.starfund.config.VnPayConfig;
import com.starfund.dto.InvestmentRequest;
import com.starfund.model.*;
import com.starfund.repository.*;
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
    
    // Nếu ActivityLogService chưa hoàn thiện, ta sẽ try-catch khi gọi nó để không làm lỗi luồng chính
    private final ActivityLogService activityLogService;

    // Helper: Lấy User hiện tại đang đăng nhập
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng (User not found)"));
    }

    // Helper: Lấy IP của client
    private String getClientIp() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            return VnPayConfig.getIpAddress(attributes.getRequest());
        }
        return "127.0.0.1";
    }

    /**
     * TẠO KHOẢN ĐẦU TƯ MỚI & LINK VNPAY
     */
    @Transactional
    public String createInvestment(InvestmentRequest request) {
        User investor = getCurrentUser();
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dự án"));

        // Rule: Không được tự đầu tư cho chính mình
        if (project.getFounder().getId().equals(investor.getId())) {
            throw new RuntimeException("Bạn không thể tự đầu tư vào dự án của chính mình");
        }

        // 1. Tạo mã giao dịch duy nhất (VD: INV170123456789)
        String txnCode = "INV" + System.currentTimeMillis();

        // 2. Lưu bản ghi Investment (Trạng thái PENDING)
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

        // 3. Lưu bản ghi Transaction (Trạng thái PENDING) - dùng để quản lý dòng tiền chung
        Transaction transaction = Transaction.builder()
                .user(investor)
                .investment(investment)
                .type(Transaction.TransactionType.INVESTMENT)
                .amount(request.getAmount())
                .status(Transaction.TransactionStatus.PENDING)
                .transactionCode(txnCode)
                .paymentMethod("VNPAY")
                .description("Dau tu du an: " + project.getTitle()) // Nên không dấu để an toàn
                .createdAt(LocalDateTime.now())
                .build();
        transactionRepository.save(transaction);

        // 4. Ghi Log hoạt động (Bọc trong try-catch để tránh lỗi nếu Service này chưa xong)
        try {
             activityLogService.log(investor, "CREATE_INVESTMENT", "INVESTMENT", investment.getId(),
                     "IP: " + getClientIp(), "Số tiền: " + request.getAmount() + " VNĐ");
        } catch (Exception e) {
            System.out.println("⚠️ Warning: Không thể ghi log (ActivityLogService có thể chưa hoàn thiện). Bỏ qua.");
        }

        // 5. Lấy Request hiện tại để lấy IP cho VNPay
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest httpRequest = attributes != null ? attributes.getRequest() : null;

        // 6. Tạo link thanh toán VNPay
        try {
            return generateVnpayPaymentUrl(investment, httpRequest);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi mã hóa URL khi tạo link thanh toán: " + e.getMessage());
        }
    }

    /**
     * LOGIC TẠO URL THANH TOÁN VNPAY (Đã Fix chuẩn)
     */
    private String generateVnpayPaymentUrl(Investment investment, HttpServletRequest request) throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TmnCode = VnPayConfig.vnp_TmnCode;
        
        // Số tiền bên VNPay tính bằng hào, nên phải nhân 100 (10.000 VND -> 1000000)
        long amount = (long) investment.getAmount() * 100;
        String vnp_Amount = String.valueOf(amount);
        
        String vnp_TxnRef = investment.getTransactionCode();
        // Nội dung thanh toán: Không dấu, không ký tự đặc biệt để tránh lỗi checksum
        String vnp_OrderInfo = "Thanh toan dau tu " + vnp_TxnRef; 
        
        String vnp_OrderType = "other"; // Hoặc "topup", "billpayment"
        String vnp_Locale = "vn";
        
        // IP Address
        String vnp_IpAddr = request != null ? VnPayConfig.getIpAddress(request) : "127.0.0.1";

        // Tạo Map tham số
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
        
        // Sử dụng Return URL từ file Config (Link Ngrok của bạn)
        vnp_Params.put("vnp_ReturnUrl", VnPayConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        // Thời gian tạo & hết hạn
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cal.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cal.add(Calendar.MINUTE, 15); // Link tồn tại 15 phút
        String vnp_ExpireDate = formatter.format(cal.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // --- BƯỚC QUAN TRỌNG: TẠO CHUỖI HASH & QUERY STRING ---
        
        // 1. Sắp xếp tham số theo A-Z
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // HashData: Dùng giá trị THÔ (Raw Value) để tạo chữ ký
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                
                // Query: Dùng giá trị ĐÃ MÃ HÓA (Encoded Value) để tạo URL
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        
        // 2. Tạo SecureHash từ hashData
        String vnp_SecureHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData.toString());
        
        // 3. Ghép vào URL cuối cùng
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + queryUrl;

        // Debug Log (Xem console nếu lỗi)
        System.out.println("---------- VNPAY URL GENERATED ----------");
        System.out.println("TxnRef: " + vnp_TxnRef);
        System.out.println("Payment URL: " + paymentUrl);
        System.out.println("-----------------------------------------");
        
        return paymentUrl;
    }

    /**
     * XỬ LÝ CALLBACK TỪ VNPAY (Khi thanh toán xong)
     */
    @Transactional
    public void handleVnpayCallback(String txnCode, String responseCode) {
        // "00" là mã thành công của VNPay
        if ("00".equals(responseCode)) {
            Investment investment = investmentRepository.findByTransactionCode(txnCode)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đầu tư với mã: " + txnCode));

            // Nếu đã thành công rồi thì bỏ qua (tránh cộng tiền 2 lần)
            if (investment.getStatus() == Investment.InvestmentStatus.SUCCESS) {
                return;
            }

            // Cập nhật trạng thái Investment
            investment.setStatus(Investment.InvestmentStatus.SUCCESS);
            investment.setCompletedAt(LocalDateTime.now());
            investmentRepository.save(investment);

            // Cập nhật trạng thái Transaction
            Transaction txn = transactionRepository.findByTransactionCode(txnCode)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy transaction tương ứng"));
            txn.setStatus(Transaction.TransactionStatus.SUCCESS);
            txn.setCompletedAt(LocalDateTime.now());
            transactionRepository.save(txn);

            // Cộng tiền vào dự án (Real-time update)
            Project project = investment.getProject();
            project.setCurrentAmount(project.getCurrentAmount() + investment.getAmount());
            project.setInvestorCount(project.getInvestorCount() + 1);
            projectRepository.save(project);

            // Ghi log
            try {
                activityLogService.log(investment.getInvestor(), "INVESTMENT_SUCCESS", "INVESTMENT",
                        investment.getId(), getClientIp(), "Thanh toán thành công: " + investment.getAmount());
            } catch (Exception e) {
                // Bỏ qua lỗi log
            }
        } else {
            // Xử lý thất bại (nếu cần)
            System.out.println("Giao dịch thất bại hoặc bị hủy. Mã lỗi: " + responseCode);
        }
    }

    // Lấy danh sách đầu tư của User
    public List<Investment> getMyInvestments() {
        User user = getCurrentUser();
        return investmentRepository.findByInvestor(user);
    }

    // Lấy danh sách đầu tư của Dự án (dành cho Startup chủ dự án)
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