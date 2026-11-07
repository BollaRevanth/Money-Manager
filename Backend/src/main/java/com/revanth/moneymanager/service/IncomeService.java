package com.revanth.moneymanager.service;

import com.revanth.moneymanager.dto.IncomeDTO;
import com.revanth.moneymanager.entity.CategoryEntity;
import com.revanth.moneymanager.entity.IncomeEntity;
import com.revanth.moneymanager.entity.ProfileEntity;
import com.revanth.moneymanager.repository.CategoryRepository;
import com.revanth.moneymanager.repository.IncomeRepository;
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
public class IncomeService {

    private final CategoryRepository categoryRepository;
    private final IncomeRepository incomeRepository;
    private final ProfileService profileService;

    @Transactional
    public IncomeDTO addIncome(IncomeDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = resolveCategory(dto.getCategoryId(), profile.getId());
        return toDTO(incomeRepository.save(toEntity(dto, profile, category)));
    }

    @Transactional
    public IncomeDTO updateIncome(Long incomeId, IncomeDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        IncomeEntity existing = findOwned(incomeId, profile.getId());
        CategoryEntity category = resolveCategory(dto.getCategoryId(), profile.getId());
        existing.setName(dto.getName());
        existing.setIcon(dto.getIcon());
        existing.setAmount(dto.getAmount());
        existing.setDate(dto.getDate());
        existing.setCategory(category);
        return toDTO(incomeRepository.save(existing));
    }

    @Transactional
    public void deleteIncome(Long incomeId) {
        Long profileId = profileService.getCurrentProfile().getId();
        incomeRepository.delete(findOwned(incomeId, profileId));
    }

    @Transactional(readOnly = true)
    public List<IncomeDTO> getAllIncomesForCurrentUser() {
        Long profileId = profileService.getCurrentProfile().getId();
        return incomeRepository.findByProfileIdOrderByDateDesc(profileId)
                .stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<IncomeDTO> getCurrentMonthIncomesForCurrentUser() {
        Long profileId = profileService.getCurrentProfile().getId();
        LocalDate today = DateUtil.today();
        return incomeRepository
                .findByProfileIdAndDateBetweenOrderByDateDesc(profileId,
                        today.withDayOfMonth(1), today.withDayOfMonth(today.lengthOfMonth()))
                .stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public BigDecimal getCurrentMonthTotalForProfile(Long profileId) {
        LocalDate today = DateUtil.today();
        BigDecimal total = incomeRepository.findTotalByProfileIdAndDateBetween(
                profileId, today.withDayOfMonth(1), today.withDayOfMonth(today.lengthOfMonth()));
        return total != null ? total : BigDecimal.ZERO;
    }

    @Transactional(readOnly = true)
    public List<IncomeDTO> getLatest5ForProfile(Long profileId) {
        return incomeRepository.findTop5ByProfileIdOrderByDateDesc(profileId)
                .stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalForProfile(Long profileId) {
        BigDecimal total = incomeRepository.findTotalIncomeByProfileId(profileId);
        return total != null ? total : BigDecimal.ZERO;
    }

    @Transactional(readOnly = true)
    public List<IncomeDTO> filterIncomes(LocalDate startDate, LocalDate endDate, String keyword, Sort sort) {
        Long profileId = profileService.getCurrentProfile().getId();
        return incomeRepository
                .findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(profileId, startDate, endDate, keyword, sort)
                .stream().map(this::toDTO).toList();
    }

    private IncomeEntity findOwned(Long incomeId, Long profileId) {
        return incomeRepository.findByIdAndProfileId(incomeId, profileId)
                .orElseThrow(() -> new NoSuchElementException("Income not found"));
    }

    private CategoryEntity resolveCategory(Long categoryId, Long profileId) {
        CategoryEntity category = categoryRepository.findByIdAndProfileId(categoryId, profileId)
                .orElseThrow(() -> new NoSuchElementException("Category not found or not accessible"));
        if (!"income".equalsIgnoreCase(category.getType())) {
            throw new IllegalArgumentException("Income must use an income category");
        }
        return category;
    }

    private IncomeEntity toEntity(IncomeDTO dto, ProfileEntity profile, CategoryEntity category) {
        return IncomeEntity.builder()
                .name(dto.getName())
                .icon(dto.getIcon())
                .amount(dto.getAmount())
                .date(dto.getDate())
                .profile(profile)
                .category(category)
                .build();
    }

    private IncomeDTO toDTO(IncomeEntity e) {
        return IncomeDTO.builder()
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