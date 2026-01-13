package com.company.cpms_backend.allocation.model;

import com.company.cpms_backend.project.model.ProjectModel;
import com.company.cpms_backend.vehicle.model.VehicleModel;
import com.company.cpms_backend.worker.model.WorkerModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "allocations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AllocationModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private ProjectModel project;

    @ManyToOne
    private WorkerModel worker;

    @ManyToOne
    private VehicleModel vehicle;

    private LocalDate startDate;
    private LocalDate endDate;
}
