package com.gs.administraciones.model.dto.response;

import com.gs.administraciones.model.entity.Utility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UtilityDTO {
    private Long id;
    private Long buildingId;
    private String buildingName;
    private String name;
    private String accountNumber;
    private LocalDateTime createdAt;

    public static UtilityDTO from(Utility utility) {
        return UtilityDTO.builder()
                .id(utility.getId())
                .buildingId(utility.getBuilding().getId())
                .buildingName(utility.getBuilding().getName())
                .name(utility.getName())
                .accountNumber(utility.getAccountNumber())
                .createdAt(utility.getCreatedAt())
                .build();
    }
}
