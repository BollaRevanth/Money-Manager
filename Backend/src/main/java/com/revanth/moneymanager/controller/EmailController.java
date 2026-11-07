package com.revanth.moneymanager.controller;

import com.revanth.moneymanager.dto.ExpenseDTO;
import com.revanth.moneymanager.dto.IncomeDTO;
import com.revanth.moneymanager.entity.ProfileEntity;
import com.revanth.moneymanager.service.*;
import com.revanth.moneymanager.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/email")
public class EmailController {

    private final EmailService emailService;
    private final ExcelService excelService;
    private final ProfileService profileService;
    private final IncomeService incomeService;
    private final ExpenseService expenseService;
    private final TemplateEngine templateEngine;

    @GetMapping("/income-excel")
    public ResponseEntity<Void> emailIncomeExcel() throws IOException {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeDTO> incomes = incomeService.getCurrentMonthIncomesForCurrentUser();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        excelService.writeIncomesToExcel(baos, incomes);

        BigDecimal total = incomes.stream()
                .map(IncomeDTO::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String body = buildReportBody(profile, "Income", incomes.size(), total, "#166534");
        emailService.sendEmailWithAttachment(profile.getEmail(),
                "Your Income Excel Report", body, baos.toByteArray(), "income.xlsx");
        return ResponseEntity.ok().build();
    }

    @GetMapping("/expense-excel")
    public ResponseEntity<Void> emailExpenseExcel() throws IOException {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<ExpenseDTO> expenses = expenseService.getCurrentMonthExpensesForCurrentUser();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        excelService.writeExpensesToExcel(baos, expenses);

        BigDecimal total = expenses.stream()
                .map(ExpenseDTO::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String body = buildReportBody(profile, "Expense", expenses.size(), total, "#991b1b");
        emailService.sendEmailWithAttachment(profile.getEmail(),
                "Your Expense Excel Report", body, baos.toByteArray(), "expenses.xlsx");
        return ResponseEntity.ok().build();
    }

    private String buildReportBody(ProfileEntity profile, String reportType, int count, BigDecimal total, String accent) {
        Context context = new Context();
        context.setVariable("name", profile.getFullName());
        context.setVariable("reportType", reportType);
        context.setVariable("period", DateUtil.today().format(DateTimeFormatter.ofPattern("MMMM yyyy")));
        context.setVariable("count", count);
        context.setVariable("total", total);
        context.setVariable("accent", accent);
        return templateEngine.process("report-email", context);
    }
}