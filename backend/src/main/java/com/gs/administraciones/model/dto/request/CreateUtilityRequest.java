package com.gs.administraciones.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUtilityRequest {

    @NotBlank(message = "Utility name is required")
    @Size(max = 100)
    private String name;

    @NotBlank(message = "Account number is required")
    @Size(max = 100)
    private String accountNumber;
}
