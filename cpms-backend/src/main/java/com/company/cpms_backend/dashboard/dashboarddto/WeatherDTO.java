package com.company.cpms_backend.dashboard.dashboarddto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WeatherDTO {
    private double temperature;
    private String condition;
    private String unit = "°C";
}