package com.company.cpms_backend.payment.controller;

import com.company.cpms_backend.payment.dto.PayHereInitResponse;
import com.company.cpms_backend.payment.dto.PayHereNotifyRequest;
import com.company.cpms_backend.payment.dto.PaymentCreateDTO;
import com.company.cpms_backend.payment.dto.PaymentResponseDTO;
import com.company.cpms_backend.payment.service.PayHereService;
import com.company.cpms_backend.payment.service.PaymentService;
import com.company.cpms_backend.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final PayHereService payHereService;
    private final UserRepository userRepository;

    // ✅ Company creates invoice
    @PostMapping
    @PreAuthorize("hasAnyRole('SUPERADMIN','ADMIN','MANAGER','ENGINEER','OTHER_STAFF')")
    public PaymentResponseDTO create(@Valid @RequestBody PaymentCreateDTO dto, Principal principal) {
        return paymentService.createInvoice(principal.getName(), dto);
    }


    // ✅ Company: list invoices by project
    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAnyRole('SUPERADMIN','ADMIN','MANAGER','ENGINEER','OTHER_STAFF')")
    public List<PaymentResponseDTO> byProject(@PathVariable Long projectId, Principal principal) {
        return paymentService.getInvoicesByProjectForCompany(principal.getName(), projectId);
    }
}