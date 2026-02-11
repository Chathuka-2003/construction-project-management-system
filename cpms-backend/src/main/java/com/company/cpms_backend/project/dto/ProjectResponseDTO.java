package com.company.cpms_backend.project.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectResponseDTO {
    private Long id;

    // ✅ frontend fields
    private String name;
    private String customer;   // customer display name
    private String location;
    private String description;
    private String startDate;  // "YYYY-MM-DD"
    private String status;     // "Planning", ...

    // helpful IDs (optional for UI)
    private Long customerId;
    private Long managerId;
}
