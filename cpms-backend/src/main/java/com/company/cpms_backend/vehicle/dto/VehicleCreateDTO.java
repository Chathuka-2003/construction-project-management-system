package com.company.cpms_backend.vehicle.dto;

import com.company.cpms_backend.enums.VehicleCondition;
import com.company.cpms_backend.enums.VehicleStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VehicleCreateDTO {

    @NotBlank
    private String regNumber;

    @NotBlank
    private String type;

    private String fuel;
    private String capacity;
    private String machine;

    private VehicleCondition condition; // optional
    private VehicleStatus status;       // optional

    private Boolean active;
}
