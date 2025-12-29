package com.company.cpms_backend.appoinment.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentCreateDTO {
    public Long customerId;
    public LocalDateTime appointmentDate;
    public String purpose;
}
