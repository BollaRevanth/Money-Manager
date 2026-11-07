package com.revanth.moneymanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProfileImageUpdateDTO {

    @NotBlank
    @Size(max = 2048)
    @Pattern(regexp = "^https://res\\.cloudinary\\.com/ecip7fs9/image/upload/.+$",
            message = "Profile image must be a Cloudinary image URL")
    private String profileImageUrl;
}
