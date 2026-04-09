package com.gs.administraciones.service;

import com.gs.administraciones.exception.ResourceNotFoundException;
import com.gs.administraciones.model.dto.request.CreateCommentRequest;
import com.gs.administraciones.model.dto.request.CreateWorkOrderRequest;
import com.gs.administraciones.model.dto.request.UpdateStatusRequest;
import com.gs.administraciones.model.dto.request.UpdateWorkOrderRequest;
import com.gs.administraciones.model.dto.response.CommentDTO;
import com.gs.administraciones.model.dto.response.WorkOrderDTO;
import com.gs.administraciones.model.entity.*;
import com.gs.administraciones.model.enums.Priority;
import com.gs.administraciones.model.enums.WorkOrderStatus;
import com.gs.administraciones.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final WorkOrderCommentRepository commentRepository;
    private final BuildingRepository buildingRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<WorkOrderDTO> getWorkOrders(Long buildingId, WorkOrderStatus status,
                                             Long assignedToId, Priority priority) {
        return workOrderRepository.findWithFilters(buildingId, status, assignedToId, priority)
                .stream()
                .map(WorkOrderDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public WorkOrderDTO getWorkOrderById(Long id) {
        WorkOrder workOrder = workOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WorkOrder", id));
        return WorkOrderDTO.from(workOrder);
    }

    @Transactional
    public WorkOrderDTO createWorkOrder(CreateWorkOrderRequest request, Long createdByUserId) {
        Building building = buildingRepository.findById(request.getBuildingId())
                .orElseThrow(() -> new ResourceNotFoundException("Building", request.getBuildingId()));

        User createdBy = userRepository.findById(createdByUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", createdByUserId));

        WorkOrder workOrder = WorkOrder.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .building(building)
                .createdBy(createdBy)
                .priority(request.getPriority() != null ? request.getPriority() : Priority.MEDIA)
                .build();

        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", request.getAssignedToId()));
            workOrder.setAssignedTo(assignedTo);
        }

        workOrder = workOrderRepository.save(workOrder);

        WorkOrderDTO dto = WorkOrderDTO.from(workOrder);

        activityLogService.log("WORK_ORDER", workOrder.getId(), createdByUserId, "CREATED",
                null, "{\"title\":\"" + workOrder.getTitle() + "\",\"code\":\"" + workOrder.getCode() + "\"}");

        notificationService.sendNotificationToAllAdmins(
                "New Work Order: " + workOrder.getCode(),
                workOrder.getTitle() + " - " + building.getName());

        if (workOrder.getAssignedTo() != null) {
            notificationService.sendNotification(
                    workOrder.getAssignedTo().getId(),
                    "Work Order Assigned: " + workOrder.getCode(),
                    "You have been assigned to: " + workOrder.getTitle());
        }

        messagingTemplate.convertAndSend("/topic/workorders", dto);

        return dto;
    }

    @Transactional
    public WorkOrderDTO updateWorkOrder(Long id, UpdateWorkOrderRequest request) {
        WorkOrder workOrder = workOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WorkOrder", id));

        String oldStatus = workOrder.getStatus().name();

        if (request.getTitle() != null) {
            workOrder.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            workOrder.setDescription(request.getDescription());
        }
        if (request.getBuildingId() != null) {
            Building building = buildingRepository.findById(request.getBuildingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Building", request.getBuildingId()));
            workOrder.setBuilding(building);
        }
        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", request.getAssignedToId()));
            workOrder.setAssignedTo(assignedTo);
        }
        if (request.getStatus() != null) {
            workOrder.setStatus(request.getStatus());
            if (request.getStatus() == WorkOrderStatus.COMPLETADA || request.getStatus() == WorkOrderStatus.CERRADA) {
                workOrder.setCompletedAt(LocalDateTime.now());
            }
        }
        if (request.getPriority() != null) {
            workOrder.setPriority(request.getPriority());
        }

        workOrder = workOrderRepository.save(workOrder);

        WorkOrderDTO dto = WorkOrderDTO.from(workOrder);

        activityLogService.log("WORK_ORDER", workOrder.getId(), null, "UPDATED",
                "{\"status\":\"" + oldStatus + "\"}", "{\"status\":\"" + workOrder.getStatus() + "\"}");

        messagingTemplate.convertAndSend("/topic/workorders", dto);

        return dto;
    }

    @Transactional
    public WorkOrderDTO updateStatus(Long id, UpdateStatusRequest request) {
        WorkOrder workOrder = workOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WorkOrder", id));

        String oldStatus = workOrder.getStatus().name();
        workOrder.setStatus(request.getStatus());

        if (request.getStatus() == WorkOrderStatus.COMPLETADA || request.getStatus() == WorkOrderStatus.CERRADA) {
            workOrder.setCompletedAt(LocalDateTime.now());
        }

        workOrder = workOrderRepository.save(workOrder);

        WorkOrderDTO dto = WorkOrderDTO.from(workOrder);

        activityLogService.log("WORK_ORDER", workOrder.getId(), null, "STATUS_CHANGED",
                "{\"status\":\"" + oldStatus + "\"}", "{\"status\":\"" + workOrder.getStatus() + "\"}");

        if (workOrder.getAssignedTo() != null) {
            notificationService.sendNotification(
                    workOrder.getAssignedTo().getId(),
                    "Work Order Status Changed: " + workOrder.getCode(),
                    "Status changed from " + oldStatus + " to " + workOrder.getStatus());
        }

        messagingTemplate.convertAndSend("/topic/workorders", dto);

        return dto;
    }

    @Transactional
    public CommentDTO addComment(Long workOrderId, CreateCommentRequest request, Long userId) {
        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("WorkOrder", workOrderId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        WorkOrderComment comment = WorkOrderComment.builder()
                .workOrder(workOrder)
                .user(user)
                .content(request.getContent())
                .build();

        comment = commentRepository.save(comment);

        activityLogService.log("WORK_ORDER", workOrderId, userId, "COMMENT_ADDED",
                null, "{\"comment\":\"" + request.getContent().substring(0, Math.min(100, request.getContent().length())) + "\"}");

        // Notify assigned user if commenter is different
        if (workOrder.getAssignedTo() != null && !workOrder.getAssignedTo().getId().equals(userId)) {
            notificationService.sendNotification(
                    workOrder.getAssignedTo().getId(),
                    "New Comment on " + workOrder.getCode(),
                    user.getFirstName() + " " + user.getLastName() + ": " +
                            request.getContent().substring(0, Math.min(100, request.getContent().length())));
        }

        // Notify creator if different from commenter and assigned
        if (!workOrder.getCreatedBy().getId().equals(userId) &&
                (workOrder.getAssignedTo() == null || !workOrder.getCreatedBy().getId().equals(workOrder.getAssignedTo().getId()))) {
            notificationService.sendNotification(
                    workOrder.getCreatedBy().getId(),
                    "New Comment on " + workOrder.getCode(),
                    user.getFirstName() + " " + user.getLastName() + ": " +
                            request.getContent().substring(0, Math.min(100, request.getContent().length())));
        }

        return CommentDTO.from(comment);
    }

    @Transactional(readOnly = true)
    public List<CommentDTO> getComments(Long workOrderId) {
        if (!workOrderRepository.existsById(workOrderId)) {
            throw new ResourceNotFoundException("WorkOrder", workOrderId);
        }
        return commentRepository.findByWorkOrderIdOrderByCreatedAtAsc(workOrderId)
                .stream()
                .map(CommentDTO::from)
                .toList();
    }

    @Transactional
    public void deleteWorkOrder(Long id) {
        WorkOrder workOrder = workOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WorkOrder", id));

        workOrderRepository.delete(workOrder);

        activityLogService.log("WORK_ORDER", id, null, "DELETED", null, null);
    }
}
