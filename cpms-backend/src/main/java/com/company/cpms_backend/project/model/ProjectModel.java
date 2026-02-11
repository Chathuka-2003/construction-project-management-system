package com.company.cpms_backend.project.model;

import com.company.cpms_backend.enums.ProjectStatus;
import com.company.cpms_backend.user.model.UserModel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // DB field
    private String title;

    private String description;

    // ✅ added for frontend
    private String location;

    // ✅ added for frontend sorting & display
    private LocalDate startDate;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private UserModel customer;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private UserModel manager;
}
