package com.company.cpms_backend.payment.controller;

import com.company.cpms_backend.payment.dto.PayHereInitResponse;
import com.company.cpms_backend.payment.dto.PayHereNotifyRequest;
import com.company.cpms_backend.payment.dto.PaymentCreateDTO;
import com.company.cpms_backend.payment.dto.PaymentResponseDTO;
import com.company.cpms_backend.payment.dto.PaymentStatusUpdateDTO;
import com.company.cpms_backend.payment.dto.PaymentUpdateDTO;
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

    // ✅ Customer list own invoices
    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<PaymentResponseDTO> myPayments(Principal principal) {
        return paymentService.getMyPayments(principal.getName());
    }

    // ✅ Init PayHere (customer only, verifies ownership)
    @PostMapping("/{paymentId}/payhere/init")
    @PreAuthorize("hasRole('CUSTOMER')")
    public PayHereInitResponse init(@PathVariable Long paymentId, Principal principal) {
        var user = userRepository.findByEmail(principal.getName()).orElseThrow();

        // ownership check
        paymentService.getCustomerPaymentOrThrow(principal.getName(), paymentId);

        return payHereService.buildInitPayload(paymentId, user.getEmail(), user.getName());
    }

    // ✅ PayHere notify_url (MUST be public URL, not localhost)
    @PostMapping(
            value = "/payhere/notify",
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE
    )
    public String notify(@ModelAttribute PayHereNotifyRequest req) {
        payHereService.handleNotify(req);
        return "OK";
    }

    // ✅ Polling endpoint (customer or company can use)
    @GetMapping("/{paymentId}")
    public PaymentResponseDTO getOne(@PathVariable Long paymentId) {
        return paymentService.getOne(paymentId);
    }

    // ✅ Company: update invoice (amount / invoiceNo / dueDate)
    // NOTE: DO NOT use PaymentCreateDTO here (it requires projectId)
    @PutMapping("/{paymentId}")
    @PreAuthorize("hasAnyRole('SUPERADMIN','ADMIN','MANAGER','ENGINEER','OTHER_STAFF')")
    public PaymentResponseDTO updateInvoice(
            @PathVariable Long paymentId,
            @RequestBody PaymentUpdateDTO dto,
            Principal principal
    ) {
        return paymentService.updateInvoice(principal.getName(), paymentId, dto);
    }

    // ✅ Company: delete invoice
    @DeleteMapping("/{paymentId}")
    @PreAuthorize("hasAnyRole('SUPERADMIN','ADMIN','MANAGER','ENGINEER','OTHER_STAFF')")
    public void deleteInvoice(@PathVariable Long paymentId, Principal principal) {
        paymentService.deleteInvoice(principal.getName(), paymentId);
    }

    @PatchMapping("/{paymentId}/status")
    @PreAuthorize("hasAnyRole('SUPERADMIN','ADMIN','MANAGER','ENGINEER','OTHER_STAFF')")
    public PaymentResponseDTO updateStatus(
            @PathVariable Long paymentId,
            @Valid @RequestBody PaymentStatusUpdateDTO dto,
            Principal principal
    ) {
        return paymentService.updateStatus(principal.getName(), paymentId, dto.getStatus());
    }
}
