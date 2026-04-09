package com.gs.administraciones.controller;

import com.gs.administraciones.model.dto.request.CreateCommentRequest;
import com.gs.administraciones.model.dto.request.CreateWorkOrderRequest;
import com.gs.administraciones.model.dto.request.UpdateStatusRequest;
import com.gs.administraciones.model.dto.request.UpdateWorkOrderRequest;
import com.gs.administraciones.model.dto.response.CommentDTO;
import com.gs.administraciones.model.dto.response.WorkOrderDTO;
import com.gs.administraciones.model.enums.Priority;
import com.gs.administraciones.model.enums.WorkOrderStatus;
import com.gs.administraciones.repository.UserRepository;
import com.gs.administraciones.service.WorkOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/work-orders")
@RequiredArgsConstructor
public class WorkOrderController {

    private final WorkOrderService workOrderService;
    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'TECHNICIAN')")
    public ResponseEntity<List<WorkOrderDTO>> getWorkOrders(
            @RequestParam(required = false) Long buildingId,
            @RequestParam(required = false) WorkOrderStatus status,
            @RequestParam(required = false) Long assignedToId,
            @RequestParam(required = false) Priority priority) {
        return ResponseEntity.ok(workOrderService.getWorkOrders(buildingId, status, assignedToId, priority));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'TECHNICIAN')")
    public ResponseEntity<WorkOrderDTO> getWorkOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(workOrderService.getWorkOrderById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<WorkOrderDTO> createWorkOrder(
            @Valid @RequestBody CreateWorkOrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(workOrderService.createWorkOrder(request, userId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<WorkOrderDTO> updateWorkOrder(@PathVariable Long id,
                                                         @Valid @RequestBody UpdateWorkOrderRequest request) {
        return ResponseEntity.ok(workOrderService.updateWorkOrder(id, request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'TECHNICIAN')")
    public ResponseEntity<WorkOrderDTO> updateStatus(@PathVariable Long id,
                                                      @Valid @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(workOrderService.updateStatus(id, request));
    }

    @GetMapping("/{id}/comments")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'TECHNICIAN')")
    public ResponseEntity<List<CommentDTO>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(workOrderService.getComments(id));
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'TECHNICIAN')")
    public ResponseEntity<CommentDTO> addComment(@PathVariable Long id,
                                                  @Valid @RequestBody CreateCommentRequest request,
                                                  @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(workOrderService.addComment(id, request, userId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteWorkOrder(@PathVariable Long id) {
        workOrderService.deleteWorkOrder(id);
        return ResponseEntity.noContent().build();
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow()
                .getId();
    }
}
