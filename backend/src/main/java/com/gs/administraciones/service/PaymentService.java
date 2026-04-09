package com.gs.administraciones.service;

import com.gs.administraciones.exception.BusinessException;
import com.gs.administraciones.exception.ResourceNotFoundException;
import com.gs.administraciones.model.dto.request.CreatePaymentRequest;
import com.gs.administraciones.model.dto.request.MarkPaidRequest;
import com.gs.administraciones.model.dto.request.UpdatePaymentRequest;
import com.gs.administraciones.model.dto.response.UtilityPaymentDTO;
import com.gs.administraciones.model.entity.Utility;
import com.gs.administraciones.model.entity.UtilityPayment;
import com.gs.administraciones.model.enums.PaymentStatus;
import com.gs.administraciones.repository.UtilityPaymentRepository;
import com.gs.administraciones.repository.UtilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final UtilityPaymentRepository paymentRepository;
    private final UtilityRepository utilityRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<UtilityPaymentDTO> getPayments(Long buildingId, PaymentStatus status,
                                                String monthFrom, String monthTo) {
        return paymentRepository.findWithFilters(buildingId, status, monthFrom, monthTo)
                .stream()
                .map(UtilityPaymentDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public UtilityPaymentDTO getPaymentById(Long id) {
        UtilityPayment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", id));
        return UtilityPaymentDTO.from(payment);
    }

    @Transactional
    public UtilityPaymentDTO createPayment(CreatePaymentRequest request) {
        Utility utility = utilityRepository.findById(request.getUtilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Utility", request.getUtilityId()));

        UtilityPayment payment = UtilityPayment.builder()
                .utility(utility)
                .month(request.getMonth())
                .amount(request.getAmount())
                .dueDate(request.getDueDate())
                .receiptNumber(request.getReceiptNumber())
                .paymentMethod(request.getPaymentMethod())
                .notes(request.getNotes())
                .build();

        payment = paymentRepository.save(payment);

        UtilityPaymentDTO dto = UtilityPaymentDTO.from(payment);

        activityLogService.log("PAYMENT", payment.getId(), null, "CREATED",
                null, "{\"utility\":\"" + utility.getName() + "\",\"amount\":" + payment.getAmount() +
                        ",\"month\":\"" + payment.getMonth() + "\"}");

        notificationService.sendNotificationToAllAdmins(
                "New Payment Created",
                "Payment of " + payment.getAmount() + " for " + utility.getName() +
                        " (" + utility.getBuilding().getName() + ") - " + payment.getMonth());

        messagingTemplate.convertAndSend("/topic/payments", dto);

        return dto;
    }

    @Transactional
    public UtilityPaymentDTO updatePayment(Long id, UpdatePaymentRequest request) {
        UtilityPayment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", id));

        String oldStatus = payment.getStatus().name();

        if (request.getMonth() != null) {
            payment.setMonth(request.getMonth());
        }
        if (request.getAmount() != null) {
            payment.setAmount(request.getAmount());
        }
        if (request.getDueDate() != null) {
            payment.setDueDate(request.getDueDate());
        }
        if (request.getReceiptNumber() != null) {
            payment.setReceiptNumber(request.getReceiptNumber());
        }
        if (request.getPaymentMethod() != null) {
            payment.setPaymentMethod(request.getPaymentMethod());
        }
        if (request.getNotes() != null) {
            payment.setNotes(request.getNotes());
        }

        payment = paymentRepository.save(payment);

        UtilityPaymentDTO dto = UtilityPaymentDTO.from(payment);

        activityLogService.log("PAYMENT", payment.getId(), null, "UPDATED",
                "{\"status\":\"" + oldStatus + "\"}", "{\"status\":\"" + payment.getStatus() + "\"}");

        messagingTemplate.convertAndSend("/topic/payments", dto);

        return dto;
    }

    @Transactional
    public UtilityPaymentDTO markAsPaid(Long id, MarkPaidRequest request) {
        UtilityPayment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", id));

        if (payment.getStatus() == PaymentStatus.PAGADO) {
            throw new BusinessException("Payment is already marked as paid");
        }

        String oldStatus = payment.getStatus().name();

        payment.setStatus(PaymentStatus.PAGADO);
        payment.setPaidDate(request.getPaidDate());
        if (request.getReceiptNumber() != null) {
            payment.setReceiptNumber(request.getReceiptNumber());
        }
        if (request.getPaymentMethod() != null) {
            payment.setPaymentMethod(request.getPaymentMethod());
        }

        payment = paymentRepository.save(payment);

        UtilityPaymentDTO dto = UtilityPaymentDTO.from(payment);

        activityLogService.log("PAYMENT", payment.getId(), null, "MARKED_PAID",
                "{\"status\":\"" + oldStatus + "\"}", "{\"status\":\"PAGADO\"}");

        notificationService.sendNotificationToAllAdmins(
                "Payment Marked as Paid",
                "Payment #" + payment.getId() + " for " + payment.getUtility().getName() +
                        " has been marked as paid");

        messagingTemplate.convertAndSend("/topic/payments", dto);

        return dto;
    }

    @Transactional
    public void deletePayment(Long id) {
        UtilityPayment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", id));

        paymentRepository.delete(payment);

        activityLogService.log("PAYMENT", id, null, "DELETED", null, null);
    }
}
