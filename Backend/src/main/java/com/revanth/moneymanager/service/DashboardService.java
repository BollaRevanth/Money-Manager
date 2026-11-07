package com.revanth.moneymanager.service;

import com.revanth.moneymanager.dto.ExpenseDTO;
import com.revanth.moneymanager.dto.IncomeDTO;
import com.revanth.moneymanager.dto.RecentTransactionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final Comparator<RecentTransactionDTO> NEWEST_FIRST = Comparator
            .comparing(RecentTransactionDTO::getDate, Comparator.reverseOrder())
            .thenComparing(RecentTransactionDTO::getCreatedAt,
                    Comparator.nullsLast(Comparator.reverseOrder()));

    private final IncomeService incomeService;
    private final ExpenseService expenseService;
    private final ProfileService profileService;

    public Map<String, Object> getDashboard() {
        Long profileId = profileService.getCurrentProfile().getId();

        List<IncomeDTO> latestIncomes = incomeService.getLatest5ForProfile(profileId);
        List<ExpenseDTO> latestExpenses = expenseService.getLatest5ForProfile(profileId);

        // all-time (used for the balance)
        BigDecimal totalIncome = incomeService.getTotalForProfile(profileId);
        BigDecimal totalExpense = expenseService.getTotalForProfile(profileId);

        // current month (used for the income and expense cards)
        BigDecimal monthIncome = incomeService.getCurrentMonthTotalForProfile(profileId);
        BigDecimal monthExpense = expenseService.getCurrentMonthTotalForProfile(profileId);

        List<RecentTransactionDTO> recent = Stream.concat(
                        latestIncomes.stream().map(i -> RecentTransactionDTO.builder()
                                .id(i.getId()).profileId(profileId).icon(i.getIcon()).name(i.getName())
                                .amount(i.getAmount()).date(i.getDate())
                                .createdAt(i.getCreatedAt()).updatedAt(i.getUpdatedAt())
                                .type("income").build()),
                        latestExpenses.stream().map(e -> RecentTransactionDTO.builder()
                                .id(e.getId()).profileId(profileId).icon(e.getIcon()).name(e.getName())
                                .amount(e.getAmount()).date(e.getDate())
                                .createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt())
                                .type("expense").build()))
                .sorted(NEWEST_FIRST)
                .limit(5)
                .toList();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalBalance", totalIncome.subtract(totalExpense));   // all-time
        result.put("monthIncome", monthIncome);
        result.put("monthExpense", monthExpense);
        result.put("totalIncome", totalIncome);
        result.put("totalExpense", totalExpense);
        result.put("recent5Expenses", latestExpenses);
        result.put("recent5Incomes", latestIncomes);
        result.put("recentTransactions", recent);
        return result;
    }
}