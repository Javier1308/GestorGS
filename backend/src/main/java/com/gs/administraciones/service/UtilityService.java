package com.gs.administraciones.service;

import com.gs.administraciones.exception.ResourceNotFoundException;
import com.gs.administraciones.model.dto.request.CreateUtilityRequest;
import com.gs.administraciones.model.dto.request.UpdateUtilityRequest;
import com.gs.administraciones.model.dto.response.UtilityDTO;
import com.gs.administraciones.model.entity.Building;
import com.gs.administraciones.model.entity.Utility;
import com.gs.administraciones.repository.BuildingRepository;
import com.gs.administraciones.repository.UtilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UtilityService {

    private final UtilityRepository utilityRepository;
    private final BuildingRepository buildingRepository;
    private final ActivityLogService activityLogService;

    @Transactional(readOnly = true)
    public List<UtilityDTO> getUtilitiesByBuilding(Long buildingId) {
        if (!buildingRepository.existsById(buildingId)) {
            throw new ResourceNotFoundException("Building", buildingId);
        }
        return utilityRepository.findByBuildingId(buildingId).stream()
                .map(UtilityDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public UtilityDTO getUtilityById(Long buildingId, Long utilityId) {
        Utility utility = utilityRepository.findById(utilityId)
                .orElseThrow(() -> new ResourceNotFoundException("Utility", utilityId));

        if (!utility.getBuilding().getId().equals(buildingId)) {
            throw new ResourceNotFoundException("Utility " + utilityId + " not found in building " + buildingId);
        }

        return UtilityDTO.from(utility);
    }

    @Transactional
    public UtilityDTO createUtility(Long buildingId, CreateUtilityRequest request) {
        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() -> new ResourceNotFoundException("Building", buildingId));

        Utility utility = Utility.builder()
                .building(building)
                .name(request.getName())
                .accountNumber(request.getAccountNumber())
                .build();

        utility = utilityRepository.save(utility);

        activityLogService.log("UTILITY", utility.getId(), null, "CREATED",
                null, "{\"name\":\"" + utility.getName() + "\",\"building\":\"" + building.getName() + "\"}");

        return UtilityDTO.from(utility);
    }

    @Transactional
    public UtilityDTO updateUtility(Long buildingId, Long utilityId, UpdateUtilityRequest request) {
        Utility utility = utilityRepository.findById(utilityId)
                .orElseThrow(() -> new ResourceNotFoundException("Utility", utilityId));

        if (!utility.getBuilding().getId().equals(buildingId)) {
            throw new ResourceNotFoundException("Utility " + utilityId + " not found in building " + buildingId);
        }

        if (request.getName() != null) {
            utility.setName(request.getName());
        }
        if (request.getAccountNumber() != null) {
            utility.setAccountNumber(request.getAccountNumber());
        }

        utility = utilityRepository.save(utility);

        activityLogService.log("UTILITY", utility.getId(), null, "UPDATED",
                null, "{\"name\":\"" + utility.getName() + "\"}");

        return UtilityDTO.from(utility);
    }

    @Transactional
    public void deleteUtility(Long buildingId, Long utilityId) {
        Utility utility = utilityRepository.findById(utilityId)
                .orElseThrow(() -> new ResourceNotFoundException("Utility", utilityId));

        if (!utility.getBuilding().getId().equals(buildingId)) {
            throw new ResourceNotFoundException("Utility " + utilityId + " not found in building " + buildingId);
        }

        utilityRepository.delete(utility);

        activityLogService.log("UTILITY", utilityId, null, "DELETED", null, null);
    }
}
