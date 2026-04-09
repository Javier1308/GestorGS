package com.gs.administraciones.controller;

import com.gs.administraciones.model.dto.request.ChangePasswordRequest;
import com.gs.administraciones.model.dto.request.LoginRequest;
import com.gs.administraciones.model.dto.request.RefreshTokenRequest;
import com.gs.administraciones.model.dto.response.AuthResponse;
import com.gs.administraciones.repository.UserRepository;
import com.gs.administraciones.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refresh(request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(@AuthenticationPrincipal UserDetails userDetails,
                                                @Valid @RequestBody ChangePasswordRequest request) {
        Long userId = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow()
                .getId();
        authService.changePassword(userId, request);
        return ResponseEntity.ok().build();
    }
}
