package com.company.cpms_backend.vehicle.dto;

import com.company.cpms_backend.enums.VehicleCondition;
import com.company.cpms_backend.enums.VehicleStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VehicleUpdateDTO {
    private String regNumber;
    private String type;
    private String fuel;
    private String capacity;
    private String machine;
    private VehicleCondition condition;
    private VehicleStatus status;
    private Boolean active;
}
