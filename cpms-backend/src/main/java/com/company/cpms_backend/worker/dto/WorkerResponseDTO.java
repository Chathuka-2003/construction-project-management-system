package com.company.cpms_backend.worker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class WorkerResponseDTO {
    private Long id;
    private String name;
    private String skill;
}
