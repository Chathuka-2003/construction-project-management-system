package com.company.cpms_backend.appointment.dto;

import com.company.cpms_backend.enums.AppointmentStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class AppointmentResponseDTO {

    private Long id;

    private Long customerId;
    private String customerName;

    private Long handledById;
    private String handledByName;

    private LocalDateTime appointmentDate;
    private String purpose;

    private AppointmentStatus status;
    private LocalDateTime createdAt;
}
