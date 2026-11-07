package com.revanth.moneymanager.service;

import com.revanth.moneymanager.dto.CategoryDTO;
import com.revanth.moneymanager.entity.CategoryEntity;
import com.revanth.moneymanager.entity.ProfileEntity;
import com.revanth.moneymanager.repository.CategoryRepository;
import com.revanth.moneymanager.repository.ExpenseRepository;
import com.revanth.moneymanager.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProfileService profileService;
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

    @Transactional
    public CategoryDTO saveCategory(CategoryDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        String name = dto.getName().trim();
        String type = normalizeType(dto.getType());
        if (categoryRepository.existsByNameIgnoreCaseAndProfileId(name, profile.getId())) {
            throw new IllegalStateException("Category with name " + name + " already exists");
        }
        CategoryEntity saved = categoryRepository.save(CategoryEntity.builder()
                .name(name)
                .icon(dto.getIcon())
                .type(type)
                .profile(profile)
                .build());
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<CategoryDTO> getCategoriesForCurrentUser() {
        Long profileId = profileService.getCurrentProfile().getId();
        return categoryRepository.findByProfileId(profileId).stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryDTO> getCategoriesByTypeForCurrentUser(String type) {
        Long profileId = profileService.getCurrentProfile().getId();
        return categoryRepository.findByTypeAndProfileId(normalizeType(type), profileId)
                .stream().map(this::toDTO).toList();
    }

    @Transactional
    public CategoryDTO updateCategory(Long categoryId, CategoryDTO dto) {
        Long profileId = profileService.getCurrentProfile().getId();
        CategoryEntity category = findOwned(categoryId, profileId);
        String name = dto.getName().trim();
        String newType = normalizeType(dto.getType());

        if (categoryRepository.existsByNameIgnoreCaseAndProfileIdAndIdNot(name, profileId, categoryId)) {
            throw new IllegalStateException("Category with name " + name + " already exists");
        }
        if (!newType.equals(category.getType()) && isInUse(categoryId)) {
            throw new IllegalStateException("Cannot change the type of a category that has transactions.");
        }
        category.setName(name);
        category.setIcon(dto.getIcon());
        category.setType(newType);
        return toDTO(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long categoryId) {
        Long profileId = profileService.getCurrentProfile().getId();
        CategoryEntity category = findOwned(categoryId, profileId);
        if (isInUse(categoryId)) {
            throw new IllegalStateException("This category has transactions. Delete or move them first.");
        }
        categoryRepository.delete(category);
    }

    private CategoryEntity findOwned(Long categoryId, Long profileId) {
        return categoryRepository.findByIdAndProfileId(categoryId, profileId)
                .orElseThrow(() -> new NoSuchElementException("Category not found or not accessible"));
    }

    private boolean isInUse(Long categoryId) {
        return expenseRepository.existsByCategoryId(categoryId) || incomeRepository.existsByCategoryId(categoryId);
    }

    private String normalizeType(String type) {
        if (type == null || type.isBlank()) {
            throw new IllegalArgumentException("Category type is required");
        }
        String normalized = type.trim().toLowerCase(Locale.ROOT);
        if (normalized.endsWith("s")) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }
        if (!normalized.equals("expense") && !normalized.equals("income")) {
            throw new IllegalArgumentException("Category type must be income or expense");
        }
        return normalized;
    }

    private CategoryDTO toDTO(CategoryEntity c) {
        return CategoryDTO.builder()
                .id(c.getId())
                .profileId(c.getProfile() != null ? c.getProfile().getId() : null)
                .name(c.getName())
                .icon(c.getIcon())
                .type(c.getType())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}