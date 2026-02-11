package com.company.cpms_backend.vehicle.dto;

import com.company.cpms_backend.enums.VehicleAssignmentStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class VehicleAssignmentResponseDTO {

    private Long id;

    private Long vehicleId;
    private String vehicleRegNumber;

    private Long projectId;
    private String projectTitle;
    private String projectLocation;

    private Long workerId;
    private String workerName;

    private LocalDate startDate;
    private LocalDate endDate;

    private VehicleAssignmentStatus status;

    private LocalDateTime createdAt;
}

