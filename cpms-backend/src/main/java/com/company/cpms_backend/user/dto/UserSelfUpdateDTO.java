package com.company.cpms_backend.user.dto;

import com.company.cpms_backend.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSelfUpdateDTO {

    private String name;

    @Email(message = "Email is invalid")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Contact number must be 10 digits")
    private String contactNumber;

    private String address;

    private Gender gender;
}