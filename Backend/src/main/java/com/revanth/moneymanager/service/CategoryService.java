package com.revanth.moneymanager.service;

import com.revanth.moneymanager.dto.CategoryDTO;
import com.revanth.moneymanager.entity.CategoryEntity;
import com.revanth.moneymanager.entity.ProfileEntity;
import com.revanth.moneymanager.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProfileService profileService;

    public CategoryDTO saveCategory(CategoryDTO categoryDTO) {
        ProfileEntity profile = profileService.getCurrentProfile();
        String type = normalizeType(categoryDTO.getType());
        if(categoryRepository.existsByNameAndProfileId(categoryDTO.getName(), profile.getId())) {
            throw new RuntimeException("Category with name " + categoryDTO.getName() + " already exists");
        }
        categoryDTO.setType(type);
        CategoryEntity newCategory = toEntity(categoryDTO, profile);
        newCategory = categoryRepository.save(newCategory);
        return toDTO(newCategory);
    }

    public List<CategoryDTO> getCategoriesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<CategoryEntity> categories = categoryRepository.findByProfileId(profile.getId());
        return categories.stream().map(this::toDTO).toList();
    }

    public List<CategoryDTO> getCategoriesByTypeForCurrentUser(String type) {
        ProfileEntity profile = profileService.getCurrentProfile();
        String normalizedType = normalizeType(type);
        List<CategoryEntity> entities = categoryRepository.findByProfileId(profile.getId())
                .stream()
                .filter(category -> normalizedType.equals(normalizeType(category.getType())))
                .toList();
       return entities.stream().map(this::toDTO).toList();
    }

    public CategoryDTO updateCategory(Long categoryId ,CategoryDTO categoryDTO) {
        ProfileEntity profile = profileService.getCurrentProfile();
      CategoryEntity existingCategory =  categoryRepository.findByIdAndProfileId(categoryId, profile.getId())
                .orElseThrow(() -> new RuntimeException("Category not found or not accessible"));
      existingCategory.setName(categoryDTO.getName());
      existingCategory.setIcon(categoryDTO.getIcon());
      existingCategory.setType(normalizeType(categoryDTO.getType()));
      existingCategory = categoryRepository.save(existingCategory);
      return toDTO(existingCategory);
    }

    private String normalizeType(String type) {
        if (type == null || type.isBlank()) {
            throw new IllegalArgumentException("Category type is required");
        }

        String normalizedType = type.trim().toLowerCase(Locale.ROOT);
        if (normalizedType.endsWith("s")) {
            normalizedType = normalizedType.substring(0, normalizedType.length() - 1);
        }
        if (!normalizedType.equals("expense") && !normalizedType.equals("income")) {
            throw new IllegalArgumentException("Category type must be income or expense");
        }
        return normalizedType;
    }

    private CategoryEntity toEntity(CategoryDTO categoryDTO , ProfileEntity profile ) {
        return CategoryEntity.builder()
                .name(categoryDTO.getName())
                .icon(categoryDTO.getIcon())
                .profile(profile)
                .type(categoryDTO.getType())
                .build();
    }
    private CategoryDTO toDTO(CategoryEntity categoryEntity) {
        return CategoryDTO.builder()
                .id(categoryEntity.getId())
                .profileId(categoryEntity.getProfile() != null ? categoryEntity.getProfile().getId() : null)
                .name(categoryEntity.getName())
                .icon(categoryEntity.getIcon())
                .createdAt(categoryEntity.getCreatedAt())
                .updatedAt(categoryEntity.getUpdatedAt())
                .type(categoryEntity.getType())
                .build();
    }
}
