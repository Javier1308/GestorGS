package com.gs.administraciones.model.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUtilityRequest {

    @Size(max = 100)
    private String name;

    @Size(max = 100)
    private String accountNumber;
}
