package com.company.cpms_backend.user.dto;

import com.company.cpms_backend.enums.Gender;
import com.company.cpms_backend.enums.Role;
import com.company.cpms_backend.enums.UserStatus;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email is invalid")
    private String email;

    @NotNull(message = "Role is required")
    private Role role;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Contact number must be 10 digits")
    private String contactNumber;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Salary is required")
    @PositiveOrZero(message = "Salary must be 0 or positive")
    private Double salary;

    @NotNull(message = "Status is required")
    private UserStatus status;
}
