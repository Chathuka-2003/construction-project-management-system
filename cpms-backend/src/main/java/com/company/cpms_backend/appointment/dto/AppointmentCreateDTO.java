package com.company.cpms_backend.appointment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AppointmentCreateDTO {

    @NotNull
    private Long customerId;

    @NotNull
    private Long handledById; // staff/admin

    @NotNull
    private LocalDateTime appointmentDate;

    @NotBlank
    private String purpose;
}
