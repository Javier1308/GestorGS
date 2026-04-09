package com.gs.administraciones.service;

import com.gs.administraciones.exception.BusinessException;
import com.gs.administraciones.exception.ResourceNotFoundException;
import com.gs.administraciones.model.dto.request.CreateUserRequest;
import com.gs.administraciones.model.dto.request.UpdateUserRequest;
import com.gs.administraciones.model.dto.response.UserDTO;
import com.gs.administraciones.model.entity.User;
import com.gs.administraciones.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityLogService activityLogService;

    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        return UserDTO.from(user);
    }

    @Transactional
    public UserDTO createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already in use: " + request.getEmail());
        }

        long activeUsers = userRepository.countByIsActiveTrue();
        if (activeUsers >= 10) {
            throw new BusinessException("Maximum number of active users (10) reached");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(request.getRole())
                .build();

        user = userRepository.save(user);

        activityLogService.log("USER", user.getId(), null, "CREATED",
                null, "{\"email\":\"" + user.getEmail() + "\",\"role\":\"" + user.getRole() + "\"}");

        return UserDTO.from(user);
    }

    @Transactional
    public UserDTO updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));

        String oldValue = "{\"email\":\"" + user.getEmail() + "\",\"role\":\"" + user.getRole() + "\"}";

        if (request.getEmail() != null) {
            if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
                throw new BusinessException("Email already in use: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }

        user = userRepository.save(user);

        String newValue = "{\"email\":\"" + user.getEmail() + "\",\"role\":\"" + user.getRole() + "\"}";
        activityLogService.log("USER", user.getId(), null, "UPDATED", oldValue, newValue);

        return UserDTO.from(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));

        user.setIsActive(false);
        userRepository.save(user);

        activityLogService.log("USER", id, null, "DEACTIVATED", null, null);
    }
}
