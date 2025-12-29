package com.company.cpms_backend.user.dto;

import com.company.cpms_backend.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserDTO {

        @NotBlank
        public String name;
        @Email
        @NotBlank
        public String email;
        @NotBlank
        @Size(min = 6)
        public String password;
        @NonNull
        public Role role;
    ;

}
