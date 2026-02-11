package com.company.cpms_backend.project.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectUpdateDTO {
    private String name;
    private String description;
    private String location;
    private String startDate;
    private String status;
    private Long customerId;
    private Long managerId;
    private String customer; // fallback search
}
