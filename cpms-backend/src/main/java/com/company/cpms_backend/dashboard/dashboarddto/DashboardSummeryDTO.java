package com.company.cpms_backend.dashboard.dashboarddto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummeryDTO {
    private DashboardStatsDTO stats;
    private List<ProjectProgressDTO> myProjects;
    private List<TodayTaskDTO> todaysTasks;
    private WeatherDTO weather;
    private String currentTime;
}
