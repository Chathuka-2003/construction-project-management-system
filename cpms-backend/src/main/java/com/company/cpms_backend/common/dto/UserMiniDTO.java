package com.company.cpms_backend.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserMiniDTO {
    private Long id;
    private String name;
    private String email;
    private String role; // optional (string)
}
