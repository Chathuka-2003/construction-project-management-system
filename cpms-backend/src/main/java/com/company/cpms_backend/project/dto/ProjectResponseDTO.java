package com.company.cpms_backend.project.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponseDTO {
    public Long id;
    public String title;
    public String description;
    public String status;
    public String customerName;
    public String managerName;
}
