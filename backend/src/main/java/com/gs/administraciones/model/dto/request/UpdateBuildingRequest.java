package com.gs.administraciones.model.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateBuildingRequest {

    @Size(max = 150)
    private String name;

    @Size(max = 300)
    private String address;

    @Size(max = 50)
    private String phone;

    @Email(message = "Invalid email format")
    @Size(max = 150)
    private String email;

    private Boolean isActive;
}
