package com.company.cpms_backend.user.dto;

import com.company.cpms_backend.enums.Gender;
import com.company.cpms_backend.enums.Role;
import com.company.cpms_backend.enums.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserAdminUpdateDTO {

    private String name;

    @Email(message = "Email is invalid")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Contact number must be 10 digits")
    private String contactNumber;

    private String address;

    private Gender gender;

    private Role role;
    private UserStatus status;

    @PositiveOrZero(message = "Salary must be 0 or positive")
    private Double salary;
}
