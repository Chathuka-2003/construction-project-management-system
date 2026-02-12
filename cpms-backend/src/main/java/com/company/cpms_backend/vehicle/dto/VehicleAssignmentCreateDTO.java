package com.company.cpms_backend.vehicle.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class VehicleAssignmentCreateDTO {

    @NotNull
    private Long vehicleId;

    @NotNull
    private Long projectId;

    @NotNull
    private Long workerId;

    @NotNull
    private LocalDate startDate;
}

