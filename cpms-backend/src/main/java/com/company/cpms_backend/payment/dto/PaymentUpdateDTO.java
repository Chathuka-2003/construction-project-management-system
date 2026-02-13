package com.company.cpms_backend.payment.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class PaymentUpdateDTO {

    public Double amount;      // optional but we’ll validate in service
    public String invoiceNo;   // optional
    public String dueDate;     // optional "YYYY-MM-DD"
}
