package com.company.cpms_backend.payment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatusUpdateDTO {
    @NotBlank
    private String status; // "PENDING" | "PAID" | "FAILED"
}
