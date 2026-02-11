package com.company.cpms_backend.task.model;

import com.company.cpms_backend.project.model.ProjectModel;
import com.company.cpms_backend.user.model.UserModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private int progress;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private ProjectModel project;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private UserModel assignedTo;

}
