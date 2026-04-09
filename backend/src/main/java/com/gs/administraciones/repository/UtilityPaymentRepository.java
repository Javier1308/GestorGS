package com.gs.administraciones.repository;

import com.gs.administraciones.model.entity.UtilityPayment;
import com.gs.administraciones.model.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UtilityPaymentRepository extends JpaRepository<UtilityPayment, Long> {

    List<UtilityPayment> findByStatus(PaymentStatus status);

    List<UtilityPayment> findByUtilityBuildingId(Long buildingId);

    @Query("SELECT p FROM UtilityPayment p WHERE " +
            "(:buildingId IS NULL OR p.utility.building.id = :buildingId) AND " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(:monthFrom IS NULL OR p.month >= :monthFrom) AND " +
            "(:monthTo IS NULL OR p.month <= :monthTo) " +
            "ORDER BY p.dueDate DESC")
    List<UtilityPayment> findWithFilters(
            @Param("buildingId") Long buildingId,
            @Param("status") PaymentStatus status,
            @Param("monthFrom") String monthFrom,
            @Param("monthTo") String monthTo);

    long countByStatus(PaymentStatus status);
}
