package com.gs.administraciones.model.dto.response;

import com.gs.administraciones.model.entity.WorkOrder;
import com.gs.administraciones.model.enums.Priority;
import com.gs.administraciones.model.enums.WorkOrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkOrderDTO {
    private Long id;
    private String code;
    private String title;
    private String description;
    private Long buildingId;
    private String buildingName;
    private WorkOrderStatus status;
    private UserDTO assignedTo;
    private UserDTO createdBy;
    private Priority priority;
    private List<CommentDTO> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;

    public static WorkOrderDTO from(WorkOrder wo) {
        WorkOrderDTOBuilder builder = WorkOrderDTO.builder()
                .id(wo.getId())
                .code(wo.getCode())
                .title(wo.getTitle())
                .description(wo.getDescription())
                .buildingId(wo.getBuilding().getId())
                .buildingName(wo.getBuilding().getName())
                .status(wo.getStatus())
                .createdBy(UserDTO.from(wo.getCreatedBy()))
                .priority(wo.getPriority())
                .createdAt(wo.getCreatedAt())
                .updatedAt(wo.getUpdatedAt())
                .completedAt(wo.getCompletedAt());

        if (wo.getAssignedTo() != null) {
            builder.assignedTo(UserDTO.from(wo.getAssignedTo()));
        }

        if (wo.getComments() != null) {
            builder.comments(wo.getComments().stream()
                    .map(CommentDTO::from)
                    .toList());
        }

        return builder.build();
    }
}
