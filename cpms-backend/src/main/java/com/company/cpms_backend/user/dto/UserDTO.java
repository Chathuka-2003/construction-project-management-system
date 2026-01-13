package com.company.cpms_backend.user.dto;

import com.company.cpms_backend.enums.Gender;
import com.company.cpms_backend.enums.Role;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserDTO {
//    @NotBlank
//    public String name;
//
//    @Email
//    @NotBlank
//    public String email;
//
//    @NotBlank
//    @Size(min = 6)
//    public String password;
//
//    @NonNull
//    public Role role;  // ADMIN, MANAGER, ENGINEER, CUSTOMER
//
//    @NotBlank
//    public String contactNumber;
//
//    @NotBlank
//    public String address;
//
//    @NotNull
//    public Gender gender;
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

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
    @Min(value = 0, message = "Salary must be greater than or equal to 0")
    private Double salary;
}
