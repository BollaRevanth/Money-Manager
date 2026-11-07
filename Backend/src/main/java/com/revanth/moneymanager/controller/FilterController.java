package com.revanth.moneymanager.controller;

import com.revanth.moneymanager.dto.FilterDTO;
import com.revanth.moneymanager.service.ExpenseService;
import com.revanth.moneymanager.service.IncomeService;
import com.revanth.moneymanager.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/filter")
public class FilterController {

    private static final Set<String> SORTABLE_FIELDS = Set.of("date", "amount", "name", "createdAt");

    private final ExpenseService expenseService;
    private final IncomeService incomeService;

    @PostMapping
    public ResponseEntity<?> filterTransactions(@RequestBody FilterDTO filter) {
        LocalDate startDate = filter.getStartDate() != null ? filter.getStartDate() : LocalDate.of(1970, 1, 1);
        LocalDate endDate = filter.getEndDate() != null ? filter.getEndDate() : DateUtil.today();
        String keyword = filter.getKeyword() != null ? filter.getKeyword().trim() : "";

        String sortField = filter.getSortField() != null ? filter.getSortField() : "date";
        if (!SORTABLE_FIELDS.contains(sortField)) {
            throw new IllegalArgumentException("sortField must be one of " + SORTABLE_FIELDS);
        }
        Sort.Direction direction = "desc".equalsIgnoreCase(filter.getSortOrder())
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortField);

        if ("income".equalsIgnoreCase(filter.getType())) {
            return ResponseEntity.ok(incomeService.filterIncomes(startDate, endDate, keyword, sort));
        }
        if ("expense".equalsIgnoreCase(filter.getType())) {
            return ResponseEntity.ok(expenseService.filterExpenses(startDate, endDate, keyword, sort));
        }
        throw new IllegalArgumentException("Invalid type. Must be 'income' or 'expense'");
    }
}