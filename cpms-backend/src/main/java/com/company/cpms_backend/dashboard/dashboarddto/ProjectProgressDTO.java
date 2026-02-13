package com.company.cpms_backend.dashboard.dashboarddto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectProgressDTO {
    private Long projectId;
    private String projectName;
    private String role;
    private int progress;
    private String status;
    private String dueDate;
}
