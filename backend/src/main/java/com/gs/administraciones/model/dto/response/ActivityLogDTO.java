package com.gs.administraciones.model.dto.response;

import com.gs.administraciones.model.entity.ActivityLog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLogDTO {
    private Long id;
    private String entityType;
    private Long entityId;
    private Long userId;
    private String userFullName;
    private String action;
    private String oldValue;
    private String newValue;
    private LocalDateTime createdAt;

    public static ActivityLogDTO from(ActivityLog log) {
        ActivityLogDTOBuilder builder = ActivityLogDTO.builder()
                .id(log.getId())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .action(log.getAction())
                .oldValue(log.getOldValue())
                .newValue(log.getNewValue())
                .createdAt(log.getCreatedAt());

        if (log.getUser() != null) {
            builder.userId(log.getUser().getId());
            builder.userFullName(log.getUser().getFirstName() + " " + log.getUser().getLastName());
        }

        return builder.build();
    }
}
