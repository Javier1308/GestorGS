package com.gs.administraciones.controller;

import com.gs.administraciones.model.dto.response.ActivityLogDTO;
import com.gs.administraciones.model.dto.response.DashboardDTO;
import com.gs.administraciones.model.enums.PaymentStatus;
import com.gs.administraciones.repository.BuildingRepository;
import com.gs.administraciones.repository.UserRepository;
import com.gs.administraciones.repository.UtilityPaymentRepository;
import com.gs.administraciones.repository.WorkOrderRepository;
import com.gs.administraciones.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
public class DashboardController {

    private final UtilityPaymentRepository paymentRepository;
    private final WorkOrderRepository workOrderRepository;
    private final UserRepository userRepository;
    private final BuildingRepository buildingRepository;
    private final ActivityLogService activityLogService;

    @GetMapping
    public ResponseEntity<DashboardDTO> getDashboard() {
        long overduePayments = paymentRepository.countByStatus(PaymentStatus.VENCIDO);
        long openWorkOrders = workOrderRepository.countOpenWorkOrders();
        long activeUsers = userRepository.countByIsActiveTrue();
        long buildings = buildingRepository.countByIsActiveTrue();
        List<ActivityLogDTO> recentActivity = activityLogService.getRecentActivity(10);

        DashboardDTO dashboard = DashboardDTO.builder()
                .overduePaymentsCount(overduePayments)
                .openWorkOrdersCount(openWorkOrders)
                .activeUsersCount(activeUsers)
                .buildingsCount(buildings)
                .recentActivity(recentActivity)
                .build();

        return ResponseEntity.ok(dashboard);
    }
}
