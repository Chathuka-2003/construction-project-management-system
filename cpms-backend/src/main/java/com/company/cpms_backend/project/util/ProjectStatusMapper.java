package com.company.cpms_backend.project.util;

import com.company.cpms_backend.enums.ProjectStatus;

public class ProjectStatusMapper {

    private ProjectStatusMapper() {}

    public static ProjectStatus fromLabel(String label) {
        if (label == null || label.trim().isEmpty()) return ProjectStatus.PLANNING;

        String v = label.trim()
                .replace("-", "_")
                .replace(" ", "_")
                .toUpperCase();

        try {
            return ProjectStatus.valueOf(v);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid project status: " + label);
        }
    }

    public static String toLabel(ProjectStatus status) {
        if (status == null) return "Planning";

        return switch (status) {
            case PLANNING -> "Planning";
            case DESIGN -> "Design";
            case CONSTRUCTION -> "Construction";
            case FINISHING -> "Finishing";
            case HANDOVER -> "Handover";
            case ON_HOLD -> "On Hold";
        };
    }
}
