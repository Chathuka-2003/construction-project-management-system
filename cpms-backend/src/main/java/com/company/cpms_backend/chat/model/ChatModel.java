package com.company.cpms_backend.chat.model;


import com.company.cpms_backend.filestorage.model.FilestorageModel;
import com.company.cpms_backend.project.model.ProjectModel;
import com.company.cpms_backend.user.model.UserModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sender_id")
    private UserModel sender;

    @ManyToOne(optional = false)
    @JoinColumn(name = "project_id")
    private ProjectModel project;

    private LocalDateTime timestamp;

    private boolean seen = false;

    @Column(length = 64)
    private String clientMessageId;

    @ManyToOne
    @JoinColumn(name = "file_id")
    private FilestorageModel file;
}

