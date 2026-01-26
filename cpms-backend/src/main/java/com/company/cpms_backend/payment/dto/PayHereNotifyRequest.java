package com.company.cpms_backend.payment.dto;

import lombok.Data;

@Data
public class PayHereNotifyRequest {
    
    private String merchant_id;

    private String order_id;

    private String payment_id;

    private String payhere_amount;

    private String payhere_currency;

    private String status_code;

    private String md5sig;
}

