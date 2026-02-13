package com.company.cpms_backend.user.dto;

import com.company.cpms_backend.enums.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserStatusUpdateDTO {
    @NotNull
    private UserStatus status;
}
