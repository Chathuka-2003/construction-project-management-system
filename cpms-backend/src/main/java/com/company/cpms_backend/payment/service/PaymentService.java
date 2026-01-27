package com.company.cpms_backend.payment.service;

import com.company.cpms_backend.common.exception.ForbiddenException;
import com.company.cpms_backend.enums.PaymentStatus;
import com.company.cpms_backend.enums.Role;
import com.company.cpms_backend.payment.dto.PaymentCreateDTO;
import com.company.cpms_backend.payment.dto.PaymentResponseDTO;
import com.company.cpms_backend.payment.model.PaymentModel;
import com.company.cpms_backend.payment.repository.PaymentRepository;
import com.company.cpms_backend.project.model.ProjectModel;
import com.company.cpms_backend.project.repository.ProjectRepository;
import com.company.cpms_backend.user.model.UserModel;
import com.company.cpms_backend.user.repository.UserRepository;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public PaymentResponseDTO createInvoice(String companyEmail, PaymentCreateDTO dto) {

        UserModel actor = userRepository.findByEmail(companyEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        switch (actor.getRole()) {
            case SUPERADMIN, ADMIN, MANAGER, ENGINEER, OTHER_STAFF -> {}
            default -> throw new AccessDeniedException("Not allowed");
        }

        if (dto.projectId == null) throw new ValidationException("projectId required");
        if (dto.amount == null || dto.amount <= 0) throw new ValidationException("amount must be > 0");

        ProjectModel project = projectRepository.findById(dto.projectId)
                .orElseThrow(() -> new ValidationException("Project not found: " + dto.projectId));

        if (project.getCustomer() == null) {
            throw new ValidationException("This project has no customer assigned");
        }

        String invoiceNo = (dto.invoiceNo != null && !dto.invoiceNo.isBlank())
                ? dto.invoiceNo.trim()
                : generateInvoiceNo();
