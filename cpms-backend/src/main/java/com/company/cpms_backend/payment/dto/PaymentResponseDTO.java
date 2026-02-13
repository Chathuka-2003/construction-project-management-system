package com.company.cpms_backend.payment.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class PaymentResponseDTO {
    public Long id;
    public Long projectId;
    public String invoiceNo;
    public Double amount;
    public String status;
    public String dueDate;
    public String paidDate;
    public String createdAt;
}
