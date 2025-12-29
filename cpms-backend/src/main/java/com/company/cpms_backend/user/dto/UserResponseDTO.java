package com.company.cpms_backend.user.dto;

import com.company.cpms_backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    public Long id;
    public String name;
    public String email;
    public Role role;

}