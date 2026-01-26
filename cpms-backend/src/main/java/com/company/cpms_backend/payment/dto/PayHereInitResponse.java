package com.company.cpms_backend.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PayHereInitResponse {
    private boolean sandbox;

    private String merchant_id;
    private String return_url;
    private String cancel_url;
    private String notify_url;