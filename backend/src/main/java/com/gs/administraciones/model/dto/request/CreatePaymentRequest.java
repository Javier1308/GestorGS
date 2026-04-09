package com.gs.administraciones.model.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePaymentRequest {

    @NotNull(message = "Utility ID is required")
    private Long utilityId;

    @NotBlank(message = "Month is required (format: YYYY-MM)")
    @Pattern(regexp = "\\d{4}-\\d{2}", message = "Month must be in format YYYY-MM")
    private String month;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    @Size(max = 100)
    private String receiptNumber;

    @Size(max = 50)
    private String paymentMethod;

    private String notes;
}
