package com.company.cpms_backend.appointment.dto;

import com.company.cpms_backend.enums.AppointmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentUpdateDTO {

    @NotNull
    private AppointmentStatus status;
}
