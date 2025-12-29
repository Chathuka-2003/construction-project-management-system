package com.company.cpms_backend.task.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskCreateDTO {
    public String title;
    public Long projectId;
    public Long assignedToId;
}
