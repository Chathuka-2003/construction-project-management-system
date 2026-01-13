package com.company.cpms_backend.allocation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AllocationCreateDTO {
    public Long projectId;
    public Long workerId;
    public Long vehicleId;
    public LocalDate startDate;
    public LocalDate endDate;
}
