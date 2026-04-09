package com.gs.administraciones.controller;

import com.gs.administraciones.model.dto.request.CreatePaymentRequest;
import com.gs.administraciones.model.dto.request.MarkPaidRequest;
import com.gs.administraciones.model.dto.request.UpdatePaymentRequest;
import com.gs.administraciones.model.dto.response.UtilityPaymentDTO;
import com.gs.administraciones.model.enums.PaymentStatus;
import com.gs.administraciones.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'OWNER')")
    public ResponseEntity<List<UtilityPaymentDTO>> getPayments(
            @RequestParam(required = false) Long buildingId,
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(required = false) String monthFrom,
            @RequestParam(required = false) String monthTo) {
        return ResponseEntity.ok(paymentService.getPayments(buildingId, status, monthFrom, monthTo));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'OWNER')")
    public ResponseEntity<UtilityPaymentDTO> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<UtilityPaymentDTO> createPayment(@Valid @RequestBody CreatePaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.createPayment(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<UtilityPaymentDTO> updatePayment(@PathVariable Long id,
                                                            @Valid @RequestBody UpdatePaymentRequest request) {
        return ResponseEntity.ok(paymentService.updatePayment(id, request));
    }

    @PatchMapping("/{id}/mark-paid")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<UtilityPaymentDTO> markAsPaid(@PathVariable Long id,
                                                         @Valid @RequestBody MarkPaidRequest request) {
        return ResponseEntity.ok(paymentService.markAsPaid(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}
