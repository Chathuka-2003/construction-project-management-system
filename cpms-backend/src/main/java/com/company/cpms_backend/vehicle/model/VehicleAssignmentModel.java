package com.company.cpms_backend.vehicle.model;

import com.company.cpms_backend.enums.VehicleAssignmentStatus;
import com.company.cpms_backend.project.model.ProjectModel;
import com.company.cpms_backend.worker.model.WorkerModel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleAssignmentModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Vehicle
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private VehicleModel vehicle;

    // Project (site)
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectModel project;

    // Worker (operator)
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private WorkerModel worker;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate; // optional

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleAssignmentStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = VehicleAssignmentStatus.ASSIGNED;
    }
}
