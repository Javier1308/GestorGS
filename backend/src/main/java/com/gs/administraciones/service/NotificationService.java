package com.gs.administraciones.service;

import com.gs.administraciones.model.dto.response.NotificationDTO;
import com.gs.administraciones.model.entity.InAppNotification;
import com.gs.administraciones.model.entity.User;
import com.gs.administraciones.exception.ResourceNotFoundException;
import com.gs.administraciones.repository.InAppNotificationRepository;
import com.gs.administraciones.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final InAppNotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void sendNotification(Long userId, String title, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        InAppNotification notification = InAppNotification.builder()
                .user(user)
                .title(title)
                .message(message)
                .build();

        notification = notificationRepository.save(notification);

        NotificationDTO dto = NotificationDTO.from(notification);
        messagingTemplate.convertAndSend("/user/" + userId + "/queue/notifications", dto);
    }

    @Transactional
    public void sendNotificationToAllAdmins(String title, String message) {
        userRepository.findAll().stream()
                .filter(u -> u.getIsActive() && u.getRole().name().equals("ADMIN"))
                .forEach(admin -> sendNotification(admin.getId(), title, message));
    }

    @Transactional(readOnly = true)
    public List<NotificationDTO> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<NotificationDTO> getUnreadNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationDTO::from)
                .toList();
    }

    @Transactional
    public NotificationDTO markAsRead(Long notificationId, Long userId) {
        InAppNotification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notification", notificationId);
        }

        notification.setIsRead(true);
        return NotificationDTO.from(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<InAppNotification> unread = notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }
}
