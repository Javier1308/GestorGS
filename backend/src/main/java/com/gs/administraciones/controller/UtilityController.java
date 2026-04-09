package com.gs.administraciones.controller;

import com.gs.administraciones.model.dto.request.CreateUtilityRequest;
import com.gs.administraciones.model.dto.request.UpdateUtilityRequest;
import com.gs.administraciones.model.dto.response.UtilityDTO;
import com.gs.administraciones.service.UtilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/buildings/{buildingId}/utilities")
@RequiredArgsConstructor
public class UtilityController {

    private final UtilityService utilityService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'TECHNICIAN', 'OWNER')")
    public ResponseEntity<List<UtilityDTO>> getUtilities(@PathVariable Long buildingId) {
        return ResponseEntity.ok(utilityService.getUtilitiesByBuilding(buildingId));
    }

    @GetMapping("/{utilityId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'TECHNICIAN', 'OWNER')")
    public ResponseEntity<UtilityDTO> getUtility(@PathVariable Long buildingId,
                                                  @PathVariable Long utilityId) {
        return ResponseEntity.ok(utilityService.getUtilityById(buildingId, utilityId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<UtilityDTO> createUtility(@PathVariable Long buildingId,
                                                     @Valid @RequestBody CreateUtilityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(utilityService.createUtility(buildingId, request));
    }

    @PutMapping("/{utilityId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<UtilityDTO> updateUtility(@PathVariable Long buildingId,
                                                     @PathVariable Long utilityId,
                                                     @Valid @RequestBody UpdateUtilityRequest request) {
        return ResponseEntity.ok(utilityService.updateUtility(buildingId, utilityId, request));
    }

    @DeleteMapping("/{utilityId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUtility(@PathVariable Long buildingId,
                                               @PathVariable Long utilityId) {
        utilityService.deleteUtility(buildingId, utilityId);
        return ResponseEntity.noContent().build();
    }
}
