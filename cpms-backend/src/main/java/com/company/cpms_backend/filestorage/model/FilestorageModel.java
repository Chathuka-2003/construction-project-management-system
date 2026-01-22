package com.company.cpms_backend.filestorage.model;


import com.company.cpms_backend.project.model.ProjectModel;
import com.company.cpms_backend.user.model.UserModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Entity
@Table(name = "file_storage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FilestorageModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;
    @Column(nullable = false)
    private String fileType;
    @Column(nullable = false)
    private String filePath;

    @Column(nullable = false)
    private String fileUrl;


    private LocalDateTime uploadedAt;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private ProjectModel project;

    @ManyToOne
    @JoinColumn(name = "uploaded_by")
    private UserModel uploadedBy;
}
