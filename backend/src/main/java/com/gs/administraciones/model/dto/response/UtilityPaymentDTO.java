package com.gs.administraciones.model.dto.response;

import com.gs.administraciones.model.entity.UtilityPayment;
import com.gs.administraciones.model.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UtilityPaymentDTO {
    private Long id;
    private Long utilityId;
    private String utilityName;
    private Long buildingId;
    private String buildingName;
    private String month;
    private BigDecimal amount;
    private LocalDate dueDate;
    private LocalDate paidDate;
    private PaymentStatus status;
    private String receiptNumber;
    private String paymentMethod;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UtilityPaymentDTO from(UtilityPayment payment) {
        return UtilityPaymentDTO.builder()
                .id(payment.getId())
                .utilityId(payment.getUtility().getId())
                .utilityName(payment.getUtility().getName())
                .buildingId(payment.getUtility().getBuilding().getId())
                .buildingName(payment.getUtility().getBuilding().getName())
                .month(payment.getMonth())
                .amount(payment.getAmount())
                .dueDate(payment.getDueDate())
                .paidDate(payment.getPaidDate())
                .status(payment.getStatus())
                .receiptNumber(payment.getReceiptNumber())
                .paymentMethod(payment.getPaymentMethod())
                .notes(payment.getNotes())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
