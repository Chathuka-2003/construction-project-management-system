package com.company.cpms_backend.project.model;


import com.company.cpms_backend.enums.ProjectStatus;
import com.company.cpms_backend.user.model.UserModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private UserModel customer;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private UserModel manager;
}
