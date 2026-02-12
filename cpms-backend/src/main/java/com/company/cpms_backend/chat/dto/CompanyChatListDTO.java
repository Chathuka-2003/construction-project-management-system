package com.company.cpms_backend.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CompanyChatListDTO {
    private Long projectId;
    private String projectTitle;
    private Long customerId;
    private String customerName;
    private String customerEmail;
}

