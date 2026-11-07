package com.revanth.moneymanager.service;

import com.revanth.moneymanager.dto.ExpenseDTO;
import com.revanth.moneymanager.entity.CategoryEntity;
import com.revanth.moneymanager.entity.ExpenseEntity;
import com.revanth.moneymanager.entity.ProfileEntity;
import com.revanth.moneymanager.repository.CategoryRepository;
import com.revanth.moneymanager.repository.ExpenseRepository;
import com.revanth.moneymanager.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final CategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;
    private final ProfileService profileService;

    @Transactional
    public ExpenseDTO addExpense(ExpenseDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = resolveCategory(dto.getCategoryId(), profile.getId());
        return toDTO(expenseRepository.save(toEntity(dto, profile, category)));
    }

    @Transactional
    public ExpenseDTO updateExpense(Long expenseId, ExpenseDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        ExpenseEntity existing = findOwned(expenseId, profile.getId());
        CategoryEntity category = resolveCategory(dto.getCategoryId(), profile.getId());
        existing.setName(dto.getName());
        existing.setIcon(dto.getIcon());
        existing.setAmount(dto.getAmount());
        existing.setDate(dto.getDate());
        existing.setCategory(category);
        return toDTO(expenseRepository.save(existing));
    }

    @Transactional
    public void deleteExpense(Long expenseId) {
        Long profileId = profileService.getCurrentProfile().getId();
        expenseRepository.delete(findOwned(expenseId, profileId));
    }

    @Transactional(readOnly = true)
    public List<ExpenseDTO> getCurrentMonthExpensesForCurrentUser() {
        Long profileId = profileService.getCurrentProfile().getId();
        LocalDate today = DateUtil.today();
        return expenseRepository
                .findByProfileIdAndDateBetweenOrderByDateDesc(profileId,
                        today.withDayOfMonth(1), today.withDayOfMonth(today.lengthOfMonth()))
                .stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<ExpenseDTO> getLatest5ForProfile(Long profileId) {
        return expenseRepository.findTop5ByProfileIdOrderByDateDesc(profileId)
                .stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalForProfile(Long profileId) {
        BigDecimal total = expenseRepository.findTotalExpenseByProfileId(profileId);
        return total != null ? total : BigDecimal.ZERO;
    }

    @Transactional(readOnly = true)
    public BigDecimal getCurrentMonthTotalForProfile(Long profileId) {
        LocalDate today = DateUtil.today();
        BigDecimal total = expenseRepository.findTotalByProfileIdAndDateBetween(
                profileId, today.withDayOfMonth(1), today.withDayOfMonth(today.lengthOfMonth()));
        return total != null ? total : BigDecimal.ZERO;
    }

    @Transactional(readOnly = true)
    public List<ExpenseDTO> filterExpenses(LocalDate startDate, LocalDate endDate, String keyword, Sort sort) {
        Long profileId = profileService.getCurrentProfile().getId();
        return expenseRepository
                .findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(profileId, startDate, endDate, keyword, sort)
                .stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<ExpenseDTO> getExpensesForUserOnDate(Long profileId, LocalDate date) {
        return expenseRepository.findByProfileIdAndDate(profileId, date)
                .stream().map(this::toDTO).toList();
    }

    private ExpenseEntity findOwned(Long expenseId, Long profileId) {
        return expenseRepository.findByIdAndProfileId(expenseId, profileId)
                .orElseThrow(() -> new NoSuchElementException("Expense not found"));
    }

    private CategoryEntity resolveCategory(Long categoryId, Long profileId) {
        CategoryEntity category = categoryRepository.findByIdAndProfileId(categoryId, profileId)
                .orElseThrow(() -> new NoSuchElementException("Category not found or not accessible"));
        if (!"expense".equalsIgnoreCase(category.getType())) {
            throw new IllegalArgumentException("Expense must use an expense category");
        }
        return category;
    }

    private ExpenseEntity toEntity(ExpenseDTO dto, ProfileEntity profile, CategoryEntity category) {
        return ExpenseEntity.builder()
                .name(dto.getName())
                .icon(dto.getIcon())
                .amount(dto.getAmount())
                .date(dto.getDate())
                .profile(profile)
                .category(category)
                .build();
    }

    private ExpenseDTO toDTO(ExpenseEntity e) {
        return ExpenseDTO.builder()
                .id(e.getId())
                .name(e.getName())
                .icon(e.getIcon())
                .categoryId(e.getCategory() != null ? e.getCategory().getId() : null)
                .categoryName(e.getCategory() != null ? e.getCategory().getName() : "N/A")
                .amount(e.getAmount())
                .date(e.getDate())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }
}