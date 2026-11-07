package com.revanth.moneymanager.controller;

import com.revanth.moneymanager.dto.AuthDTO;
import com.revanth.moneymanager.dto.ProfileDTO;
import com.revanth.moneymanager.dto.ProfileImageUpdateDTO;
import com.revanth.moneymanager.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @Value("${money.manager.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @PostMapping("/register")
    public ResponseEntity<ProfileDTO> registerProfile(@Valid @RequestBody ProfileDTO profileDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(profileService.registerProfile(profileDTO));
    }

    @GetMapping("/activate")
    public RedirectView activateProfile(@RequestParam String token) {
        boolean activated = profileService.activateProfile(token);
        String status = activated ? "success" : "error";
        String message = activated ? "" : "Activation token is invalid or has already been used.";
        String redirectUrl = frontendUrl.replaceAll("/+$", "") + "/verify-email?status=" + status;
        if (!message.isEmpty()) {
            redirectUrl += "&message=" + URLEncoder.encode(message, StandardCharsets.UTF_8);
        }
        RedirectView redirect = new RedirectView(redirectUrl);
        redirect.setStatusCode(HttpStatus.FOUND);
        return redirect;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody AuthDTO authDTO) {
        return ResponseEntity.ok(profileService.authenticateAndGenerateToken(authDTO));
    }

    @PutMapping("/profile/image")
    public ResponseEntity<ProfileDTO> updateProfileImage(@Valid @RequestBody ProfileImageUpdateDTO request) {
        return ResponseEntity.ok(profileService.updateProfileImage(request.getProfileImageUrl()));
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileDTO> getPublicProfile() {
        return ResponseEntity.ok(profileService.getPublicProfile());
    }
}

