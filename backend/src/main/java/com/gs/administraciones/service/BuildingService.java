package com.gs.administraciones.service;

import com.gs.administraciones.exception.ResourceNotFoundException;
import com.gs.administraciones.model.dto.request.CreateBuildingRequest;
import com.gs.administraciones.model.dto.request.UpdateBuildingRequest;
import com.gs.administraciones.model.dto.response.BuildingDTO;
import com.gs.administraciones.model.entity.Building;
import com.gs.administraciones.repository.BuildingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BuildingService {

    private final BuildingRepository buildingRepository;
    private final ActivityLogService activityLogService;

    @Transactional(readOnly = true)
    public List<BuildingDTO> getAllBuildings() {
        return buildingRepository.findAll().stream()
                .map(BuildingDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public BuildingDTO getBuildingById(Long id) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Building", id));
        return BuildingDTO.fromWithUtilities(building);
    }

    @Transactional
    public BuildingDTO createBuilding(CreateBuildingRequest request) {
        Building building = Building.builder()
                .name(request.getName())
                .address(request.getAddress())
                .phone(request.getPhone())
                .email(request.getEmail())
                .build();

        building = buildingRepository.save(building);

        activityLogService.log("BUILDING", building.getId(), null, "CREATED",
                null, "{\"name\":\"" + building.getName() + "\"}");

        return BuildingDTO.from(building);
    }

    @Transactional
    public BuildingDTO updateBuilding(Long id, UpdateBuildingRequest request) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Building", id));

        String oldName = building.getName();

        if (request.getName() != null) {
            building.setName(request.getName());
        }
        if (request.getAddress() != null) {
            building.setAddress(request.getAddress());
        }
        if (request.getPhone() != null) {
            building.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            building.setEmail(request.getEmail());
        }
        if (request.getIsActive() != null) {
            building.setIsActive(request.getIsActive());
        }

        building = buildingRepository.save(building);

        activityLogService.log("BUILDING", building.getId(), null, "UPDATED",
                "{\"name\":\"" + oldName + "\"}", "{\"name\":\"" + building.getName() + "\"}");

        return BuildingDTO.from(building);
    }

    @Transactional
    public void deleteBuilding(Long id) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Building", id));

        building.setIsActive(false);
        buildingRepository.save(building);

        activityLogService.log("BUILDING", id, null, "DEACTIVATED", null, null);
    }
}
