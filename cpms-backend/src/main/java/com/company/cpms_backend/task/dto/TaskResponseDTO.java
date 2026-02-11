package com.company.cpms_backend.task.dto;

import com.company.cpms_backend.common.dto.UserMiniDTO;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TaskResponseDTO {
    private Long id;
    private String title;
    private int progress;

    private Long projectId;
    private String projectTitle;

    private UserMiniDTO assignedTo;
}
