package com.revanth.moneymanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryDTO {

    private Long id;
    private Long profileId;

    @NotBlank
    @Size(max = 100)
    private String name;

    private String icon;

    @NotBlank
    private String type;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}