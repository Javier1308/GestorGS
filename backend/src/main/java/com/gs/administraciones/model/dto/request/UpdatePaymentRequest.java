package com.gs.administraciones.model.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
public class UpdatePaymentRequest {

    @Pattern(regexp = "\\d{4}-\\d{2}", message = "Month must be in format YYYY-MM")
    private String month;

    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    private LocalDate dueDate;

    @Size(max = 100)
    private String receiptNumber;

    @Size(max = 50)
    private String paymentMethod;

    private String notes;
}
