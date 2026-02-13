package com.company.cpms_backend.worker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkerCreateDTO {
    @NotBlank
    private String name;

    @NotBlank
    private String skill;
}
