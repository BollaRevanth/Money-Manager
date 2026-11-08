package com.revanth.moneymanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResetPasswordDTO {
    @NotBlank
    private String token;

    @NotBlank
    @Size(min = 8, max = 72)
    private String password;
}