package com.company.cpms_backend.vehicle.dto;

import com.company.cpms_backend.enums.VehicleCondition;
import com.company.cpms_backend.enums.VehicleStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class VehicleResponseDTO {
    private Long id;
    private String regNumber;
    private String type;
    private String fuel;
    private String capacity;
    private String machine;
    private VehicleCondition condition;
    private VehicleStatus status;
    private boolean active;
    private LocalDateTime createdAt;
}
