package com.gs.administraciones.model.dto.response;

import com.gs.administraciones.model.entity.Building;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuildingDTO {
    private Long id;
    private String name;
    private String address;
    private String phone;
    private String email;
    private Boolean isActive;
    private List<UtilityDTO> utilities;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BuildingDTO from(Building building) {
        return BuildingDTO.builder()
                .id(building.getId())
                .name(building.getName())
                .address(building.getAddress())
                .phone(building.getPhone())
                .email(building.getEmail())
                .isActive(building.getIsActive())
                .createdAt(building.getCreatedAt())
                .updatedAt(building.getUpdatedAt())
                .build();
    }

    public static BuildingDTO fromWithUtilities(Building building) {
        BuildingDTO dto = from(building);
        if (building.getUtilities() != null) {
            dto.setUtilities(building.getUtilities().stream()
                    .map(UtilityDTO::from)
                    .toList());
        }
        return dto;
    }
}
