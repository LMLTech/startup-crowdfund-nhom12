package com.starfund.service;

import com.starfund.model.Transaction;
import com.starfund.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public Page<Transaction> getTransactions(int page, int limit, String status, String type, Long userId) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());

        Transaction.TransactionStatus txnStatus = StringUtils.hasText(status) 
                ? Transaction.TransactionStatus.valueOf(status.toUpperCase()) : null;
        
        Transaction.TransactionType txnType = StringUtils.hasText(type) 
                ? Transaction.TransactionType.valueOf(type.toUpperCase()) : null;

        return transactionRepository.findByFilters(userId, txnType, txnStatus, pageable);
    }
}