package com.gs.administraciones.model.dto.response;

import com.gs.administraciones.model.entity.WorkOrderComment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDTO {
    private Long id;
    private Long workOrderId;
    private Long userId;
    private String userFullName;
    private String content;
    private LocalDateTime createdAt;

    public static CommentDTO from(WorkOrderComment comment) {
        return CommentDTO.builder()
                .id(comment.getId())
                .workOrderId(comment.getWorkOrder().getId())
                .userId(comment.getUser().getId())
                .userFullName(comment.getUser().getFirstName() + " " + comment.getUser().getLastName())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
