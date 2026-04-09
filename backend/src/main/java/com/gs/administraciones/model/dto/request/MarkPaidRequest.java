package com.gs.administraciones.model.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarkPaidRequest {

    @NotNull(message = "Paid date is required")
    private LocalDate paidDate;

    @Size(max = 100)
    private String receiptNumber;

    @Size(max = 50)
    private String paymentMethod;
}
