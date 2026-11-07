package com.revanth.moneymanager.service;

import com.revanth.moneymanager.dto.ExpenseDTO;
import com.revanth.moneymanager.entity.ProfileEntity;
import com.revanth.moneymanager.repository.ProfileRepository;
import com.revanth.moneymanager.util.DateUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final ProfileRepository profileRepository;
    private final EmailService emailService;
    private final ExpenseService expenseService;
    private final TemplateEngine templateEngine;

    @Value("${money.manager.frontend.url}")
    private String frontendUrl;

    @Scheduled(cron = "0 0 22 * * *", zone = "Asia/Kolkata")
    public void sendDailyIncomeExpenseRemainder() {
        log.info("Job started: sendDailyIncomeExpenseRemainder()");
        for (ProfileEntity profile : profileRepository.findByIsActiveTrue()) {
            try {
                Context context = new Context();
                context.setVariable("name", profile.getFullName());
                context.setVariable("frontendUrl", frontendUrl);
                String body = templateEngine.process("reminder-email", context);
                emailService.sendEmail(profile.getEmail(), "Daily reminder: Add your income and expenses.", body);
            } catch (Exception e) {
                log.error("Failed to send reminder to {}", profile.getEmail(), e);
            }
        }
        log.info("Job completed: sendDailyIncomeExpenseRemainder()");
    }

    @Scheduled(cron = "0 0 23 * * *", zone = "Asia/Kolkata")
    public void sendDailyExpenseSummary() {
        log.info("Job started: sendDailyExpenseSummary()");
        LocalDate today = DateUtil.today();
        for (ProfileEntity profile : profileRepository.findByIsActiveTrue()) {
            try {
                List<ExpenseDTO> expenses = expenseService.getExpensesForUserOnDate(profile.getId(), today);
                if (expenses.isEmpty()) continue;

                BigDecimal total = expenses.stream()
                        .map(ExpenseDTO::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                Context context = new Context();
                context.setVariable("name", profile.getFullName());
                context.setVariable("expenses", expenses);
                context.setVariable("total", total);
                String body = templateEngine.process("expense-summary-email", context);
                emailService.sendEmail(profile.getEmail(), "Your daily expense summary", body);
            } catch (Exception e) {
                log.error("Failed to send summary to {}", profile.getEmail(), e);
            }
        }
        log.info("Job completed: sendDailyExpenseSummary()");
    }
}