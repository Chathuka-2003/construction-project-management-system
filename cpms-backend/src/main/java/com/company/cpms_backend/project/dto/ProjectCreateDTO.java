package com.company.cpms_backend.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectCreateDTO {

    @NotBlank
    private String name;

    private String description;

    @NotBlank
    private String location;

    @NotBlank
    private String startDate; // "YYYY-MM-DD"

    @NotBlank
    private String status; // "Planning", "Design", ...

    // optional: better if you send IDs
    private Long customerId;

    @NotNull
    private Long managerId;

    // optional: if UI sends customer name instead of ID
    private String customer; // customer name/email
}
