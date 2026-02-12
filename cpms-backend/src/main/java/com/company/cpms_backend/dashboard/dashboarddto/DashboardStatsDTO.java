package com.company.cpms_backend.dashboard.dashboarddto;

import com.company.cpms_backend.task.dto.TaskResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private int activeProjects;
    private int pendingTasks;

    private List<TaskResponseDTO> todaysTasks;
}