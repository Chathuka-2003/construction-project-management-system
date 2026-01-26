package com.company.cpms_backend.payment.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class PaymentCreateDTO {
    @NotNull
    public Long projectId;

    @NotNull
    public Double amount;