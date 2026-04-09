package com.gs.administraciones.service;

import com.gs.administraciones.exception.BusinessException;
import com.gs.administraciones.model.dto.request.ChangePasswordRequest;
import com.gs.administraciones.model.dto.request.LoginRequest;
import com.gs.administraciones.model.dto.request.RefreshTokenRequest;
import com.gs.administraciones.model.dto.response.AuthResponse;
import com.gs.administraciones.model.dto.response.UserDTO;
import com.gs.administraciones.model.entity.User;
import com.gs.administraciones.repository.UserRepository;
import com.gs.administraciones.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.rate-limit.max-attempts:5}")
    private int maxAttempts;

    @Value("${app.rate-limit.block-duration-minutes:15}")
    private int blockDurationMinutes;

    private final Map<String, LoginAttempt> loginAttempts = new ConcurrentHashMap<>();

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        checkRateLimit(request.getEmail());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            recordFailedAttempt(request.getEmail());
            throw e;
        }

        resetAttempts(request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!user.getIsActive()) {
            throw new BusinessException("Account is disabled");
        }

        return generateAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse refresh(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BusinessException("Invalid or expired refresh token");
        }

        String tokenType = jwtTokenProvider.getTokenType(refreshToken);
        if (!"refresh".equals(tokenType)) {
            throw new BusinessException("Invalid token type");
        }

        String email = jwtTokenProvider.getEmailFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("User not found"));

        if (!user.getIsActive()) {
            throw new BusinessException("Account is disabled");
        }

        return generateAuthResponse(user);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BusinessException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private AuthResponse generateAuthResponse(User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId(), user.getEmail());

        return AuthResponse.of(
                accessToken,
                refreshToken,
                jwtTokenProvider.getAccessTokenExpiration() / 1000,
                UserDTO.from(user)
        );
    }

    private void checkRateLimit(String email) {
        LoginAttempt attempt = loginAttempts.get(email);
        if (attempt != null && attempt.isBlocked(blockDurationMinutes)) {
            throw new BusinessException("Account temporarily locked. Try again in " + blockDurationMinutes + " minutes.");
        }
        if (attempt != null && !attempt.isBlocked(blockDurationMinutes)) {
            if (attempt.getCount() >= maxAttempts) {
                loginAttempts.remove(email);
            }
        }
    }

    private void recordFailedAttempt(String email) {
        loginAttempts.compute(email, (key, attempt) -> {
            if (attempt == null || !attempt.isRelevant(blockDurationMinutes)) {
                return new LoginAttempt(1, LocalDateTime.now());
            }
            return new LoginAttempt(attempt.getCount() + 1, attempt.getFirstAttempt());
        });
    }

    private void resetAttempts(String email) {
        loginAttempts.remove(email);
    }

    private record LoginAttempt(int count, LocalDateTime firstAttempt) {
        public int getCount() {
            return count;
        }

        public LocalDateTime getFirstAttempt() {
            return firstAttempt;
        }

        public boolean isBlocked(int blockDurationMinutes) {
            return count >= 5 && firstAttempt.plusMinutes(blockDurationMinutes).isAfter(LocalDateTime.now());
        }

        public boolean isRelevant(int blockDurationMinutes) {
            return firstAttempt.plusMinutes(blockDurationMinutes).isAfter(LocalDateTime.now());
        }
    }
}
