package com.company.cpms_backend.vehicle.dto;

import com.company.cpms_backend.enums.VehicleAssignmentStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class VehicleAssignmentUpdateDTO {

    private VehicleAssignmentStatus status; // COMPLETED / CANCELLED
    private LocalDate endDate;              // optional
}
