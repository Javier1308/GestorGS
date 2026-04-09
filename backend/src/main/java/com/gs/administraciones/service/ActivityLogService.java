package com.gs.administraciones.service;

import com.gs.administraciones.model.dto.response.ActivityLogDTO;
import com.gs.administraciones.model.entity.ActivityLog;
import com.gs.administraciones.model.entity.User;
import com.gs.administraciones.repository.ActivityLogRepository;
import com.gs.administraciones.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;

    @Transactional
    public void log(String entityType, Long entityId, Long userId, String action, String oldValue, String newValue) {
        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;

        ActivityLog log = ActivityLog.builder()
                .entityType(entityType)
                .entityId(entityId)
                .user(user)
                .action(action)
                .oldValue(oldValue)
                .newValue(newValue)
                .build();

        activityLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<ActivityLogDTO> getRecentActivity(int limit) {
        return activityLogRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, limit))
                .stream()
                .map(ActivityLogDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ActivityLogDTO> getActivityForEntity(String entityType, Long entityId) {
        return activityLogRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc(entityType, entityId)
                .stream()
                .map(ActivityLogDTO::from)
                .toList();
    }
}
