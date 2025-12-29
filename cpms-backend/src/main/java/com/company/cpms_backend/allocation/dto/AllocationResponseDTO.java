package com.company.cpms_backend.allocation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AllocationResponseDTO {
    public String projectTitle;
    public String workerName;
    public String vehicleRegNumber;
}