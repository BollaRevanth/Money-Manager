package com.revanth.moneymanager.controller;

import com.revanth.moneymanager.dto.AuthDTO;
import com.revanth.moneymanager.dto.ForgotPasswordDTO;
import com.revanth.moneymanager.dto.ProfileDTO;
import com.revanth.moneymanager.dto.ResetPasswordDTO;
import com.revanth.moneymanager.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping("/register")
    public ResponseEntity<ProfileDTO> registerProfile(@Valid @RequestBody ProfileDTO profileDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(profileService.registerProfile(profileDTO));
    }

    @GetMapping("/activate")
    public ResponseEntity<String> activateProfile(@RequestParam String token) {
        if (profileService.activateProfile(token)) {
            return ResponseEntity.ok("Profile has been activated successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Activation Token Not Found");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody AuthDTO authDTO) {
        return ResponseEntity.ok(profileService.authenticateAndGenerateToken(authDTO));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordDTO dto) {
        profileService.requestPasswordReset(dto.getEmail());
        String message = "If an account exists for that email, a reset link has been sent.";
        return ResponseEntity.ok(Map.of("message", message));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordDTO dto) {
        profileService.resetPassword(dto.getToken(), dto.getPassword());
        return ResponseEntity.ok(Map.of("message", "Password updated. You can now log in."));
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileDTO> getPublicProfile() {
        return ResponseEntity.ok(profileService.getPublicProfile());
    }
}