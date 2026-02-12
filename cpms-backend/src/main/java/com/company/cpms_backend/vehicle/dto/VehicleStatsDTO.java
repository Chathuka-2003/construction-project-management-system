package com.company.cpms_backend.vehicle.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VehicleStatsDTO {
    private long total;
    private long active;
    private long assigned;
    private long inMaintenance;
}
