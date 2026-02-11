package com.company.cpms_backend.dashboard.dashboarddto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TodayTaskDTO {
    private Long id;
    private String title;
    private String time;
    private String priority;
    private String category;
}