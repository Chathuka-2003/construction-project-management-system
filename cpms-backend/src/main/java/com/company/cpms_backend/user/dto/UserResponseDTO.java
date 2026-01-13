package com.company.cpms_backend.user.dto;

import com.company.cpms_backend.enums.Gender;
import com.company.cpms_backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private Gender gender;
    private String contactNumber;
    private String address;
    private Double salary;
    private LocalDateTime createdAt;
}