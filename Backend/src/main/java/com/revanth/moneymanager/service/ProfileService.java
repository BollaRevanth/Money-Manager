package com.revanth.moneymanager.service;

import com.revanth.moneymanager.dto.AuthDTO;
import com.revanth.moneymanager.dto.ProfileDTO;
import com.revanth.moneymanager.entity.ProfileEntity;
import com.revanth.moneymanager.repository.ProfileRepository;
import com.revanth.moneymanager.util.DateUtil;
import com.revanth.moneymanager.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private static final String INVALID_CREDENTIALS = "Invalid email or password";
    private static final Duration RESET_TOKEN_VALIDITY = Duration.ofMinutes(30);
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final TemplateEngine templateEngine;

    @Value("${app.activation.url}")
    private String activationURL;

    @Value("${money.manager.frontend.url}")
    private String frontendUrl;

    @Transactional
    public ProfileDTO registerProfile(ProfileDTO dto) {
        String email = normalizeEmail(dto.getEmail());
        if (profileRepository.existsByEmail(email)) {
            throw new IllegalStateException("An account with this email already exists");
        }
        // Never copy id/createdAt from the client: save() with an existing id would overwrite that account.
        ProfileEntity profile = ProfileEntity.builder()
                .fullName(dto.getFullName().trim())
                .email(email)
                .password(passwordEncoder.encode(dto.getPassword()))
                .profileImageUrl(dto.getProfileImageUrl())
                .activationToken(UUID.randomUUID().toString())
                .build();
        profile = profileRepository.save(profile);
        sendActivationEmail(profile);   // if this fails, the save above is rolled back
        return toDTO(profile);
    }

    private void sendActivationEmail(ProfileEntity profile) {
        String link = activationURL.replaceAll("/+$", "") + "/activate?token=" + profile.getActivationToken();
        Context context = new Context();
        context.setVariable("name", profile.getFullName());
        context.setVariable("activationLink", link);
        String body = templateEngine.process("activation-email", context);
        try {
            emailService.sendEmail(profile.getEmail(), "Activate your Money Manager account", body);
        } catch (RuntimeException e) {
            log.error("Failed to send activation email to {}", profile.getEmail(), e);
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Could not send the activation email. Please try again later.");
        }
    }

    @Transactional
    public boolean activateProfile(String activationToken) {
        return profileRepository.findByActivationToken(activationToken)
                .map(profile -> {
                    profile.setIsActive(true);
                    return true;
                })
                .orElse(false);
    }

    @Transactional
    public void requestPasswordReset(String rawEmail) {
        String email = normalizeEmail(rawEmail);
        profileRepository.findByEmail(email).ifPresent(profile -> {
            String token = generateToken();
            profile.setPasswordResetToken(hash(token));
            profile.setPasswordResetExpiry(LocalDateTime.now(DateUtil.APP_ZONE).plus(RESET_TOKEN_VALIDITY));
            sendResetEmail(profile, token);
        });
    }

    private void sendResetEmail(ProfileEntity profile, String token) {
        String link = frontendUrl.replaceAll("/+$", "") + "/reset-password?token=" + token;
        Context context = new Context();
        context.setVariable("name", profile.getFullName());
        context.setVariable("resetLink", link);
        context.setVariable("minutes", RESET_TOKEN_VALIDITY.toMinutes());
        String body = templateEngine.process("password-reset-email", context);
        try {
            emailService.sendEmail(profile.getEmail(), "Reset your Money Manager password", body);
        } catch (RuntimeException e) {
            // Logged, not thrown: an error here would reveal that the account exists.
            log.error("Failed to send password reset email to {}", profile.getEmail(), e);
        }
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        LocalDateTime now = LocalDateTime.now(DateUtil.APP_ZONE);
        ProfileEntity profile = profileRepository.findByPasswordResetToken(hash(token))
                .filter(p -> p.getPasswordResetExpiry() != null && p.getPasswordResetExpiry().isAfter(now))
                .orElseThrow(() -> new IllegalArgumentException(
                        "This reset link is invalid or has expired. Please request a new one."));
        profile.setPassword(passwordEncoder.encode(newPassword));
        profile.setPasswordResetToken(null);      // single use
        profile.setPasswordResetExpiry(null);
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }

    public Map<String, Object> authenticateAndGenerateToken(AuthDTO authDTO) {
        String email = normalizeEmail(authDTO.getEmail());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, authDTO.getPassword()));
        } catch (AuthenticationException e) {
            throw new IllegalArgumentException(INVALID_CREDENTIALS);
        }
        ProfileEntity profile = profileRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(INVALID_CREDENTIALS));
        if (!Boolean.TRUE.equals(profile.getIsActive())) {
            throw new DisabledException("Account is not active. Please activate your account first");
        }
        return Map.of("token", jwtUtil.generateToken(profile.getEmail()), "user", toDTO(profile));
    }

    public ProfileEntity getCurrentProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("User is not authenticated");
        }
        String email = authentication.getName();
        return profileRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Profile Not Found with Email : " + email));
    }

    public ProfileDTO getPublicProfile() {
        return toDTO(getCurrentProfile());
    }

    private ProfileDTO toDTO(ProfileEntity entity) {
        return ProfileDTO.builder()
                .id(entity.getId())
                .fullName(entity.getFullName())
                .email(entity.getEmail())
                .profileImageUrl(entity.getProfileImageUrl())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}