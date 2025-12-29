package com.company.cpms_backend.appoinment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponseDTO {
    public Long id;
    public String customerName;
    public String handledByName;
    public LocalDateTime appointmentDate;
    public String purpose;
    public String status;
}