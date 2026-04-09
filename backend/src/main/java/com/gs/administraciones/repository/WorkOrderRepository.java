package com.gs.administraciones.repository;

import com.gs.administraciones.model.entity.WorkOrder;
import com.gs.administraciones.model.enums.WorkOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {

    List<WorkOrder> findByStatus(WorkOrderStatus status);

    List<WorkOrder> findByBuildingId(Long buildingId);

    List<WorkOrder> findByAssignedToId(Long userId);

    @Query("SELECT wo FROM WorkOrder wo WHERE " +
            "(:buildingId IS NULL OR wo.building.id = :buildingId) AND " +
            "(:status IS NULL OR wo.status = :status) AND " +
            "(:assignedToId IS NULL OR wo.assignedTo.id = :assignedToId) AND " +
            "(:priority IS NULL OR wo.priority = :priority) " +
            "ORDER BY wo.createdAt DESC")
    List<WorkOrder> findWithFilters(
            @Param("buildingId") Long buildingId,
            @Param("status") WorkOrderStatus status,
            @Param("assignedToId") Long assignedToId,
            @Param("priority") com.gs.administraciones.model.enums.Priority priority);

    @Query("SELECT COUNT(wo) FROM WorkOrder wo WHERE wo.status IN ('ABIERTA', 'EN_PROGRESO')")
    long countOpenWorkOrders();
}
