package com.company.cpms_backend.task.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskCreateDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @Min(value = 0, message = "Progress must be 0-100")
    @Max(value = 100, message = "Progress must be 0-100")
    private int progress = 0;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    private Long assignedToId; // can be null initially
}
