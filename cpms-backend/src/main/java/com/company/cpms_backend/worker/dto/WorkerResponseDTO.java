package com.company.cpms_backend.worker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorkerResponseDTO {
    public Long id;
    public String name;
    public String skill;
}