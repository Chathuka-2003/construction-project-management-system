package com.company.cpms_backend.vehicle.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VehicleResponseDTO {
    public Long id;
    public String type;
    public String regNumber;
}