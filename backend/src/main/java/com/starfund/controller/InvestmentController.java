package com.starfund.controller;

import com.starfund.dto.ApiResponse;
import com.starfund.dto.InvestmentRequest;
import com.starfund.service.InvestmentService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/investments")
@RequiredArgsConstructor
public class InvestmentController {

    private final InvestmentService investmentService;

    // 4.1 Create Investment
    @PostMapping
    public ResponseEntity<?> createInvestment(@RequestBody InvestmentRequest request) {
        String paymentUrl = investmentService.createInvestment(request);
        return ResponseEntity.status(201)
                .body(ApiResponse.success(Map.of("paymentUrl", paymentUrl), "Đầu tư đã được tạo, vui lòng thanh toán"));
    }

    // 4.2 VNPay Callback (QUAN TRỌNG)
    @GetMapping("/vnpay-callback")
    public void vnpayCallback(
            @RequestParam("vnp_TxnRef") String txnRef,
            @RequestParam("vnp_ResponseCode") String responseCode,
            HttpServletResponse response
    ) throws IOException {
        try {
            // Cập nhật trạng thái trong DB
            investmentService.handleVnpayCallback(txnRef, responseCode);

            // REDIRECT VỀ FRONTEND
            // Lưu ý: Tôi đổi về 'investment-history' vì trang này đã có sẵn trong App.tsx của bạn
            if ("00".equals(responseCode)) {
                response.sendRedirect("http://localhost:3000/investment-history?status=success&code=" + txnRef);
            } else {
                response.sendRedirect("http://localhost:3000/investment-history?status=failed");
            }
        } catch (Exception e) {
            // Nếu lỗi server, cũng đá về frontend để báo lỗi
            response.sendRedirect("http://localhost:3000/investment-history?status=error");
        }
    }

    // 4.3 Get My Investments
    @GetMapping("/my-investments")
    public ResponseEntity<?> getMyInvestments() {
        return ResponseEntity.ok(ApiResponse.success(investmentService.getMyInvestments(), "Lấy lịch sử đầu tư thành công"));
    }

    // 4.4 Get Project Investments
    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getProjectInvestments(@PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success(investmentService.getProjectInvestments(projectId), "Lấy danh sách nhà đầu tư thành công"));
    }
}