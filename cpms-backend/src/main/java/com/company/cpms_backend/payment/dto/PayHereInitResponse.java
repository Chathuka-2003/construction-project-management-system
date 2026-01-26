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

    private String order_id;
    private String items;
    private String amount;
    private String currency;
    private String hash;

    private String first_name;
    private String last_name;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String country;
}