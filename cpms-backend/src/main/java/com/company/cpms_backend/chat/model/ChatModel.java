package com.company.cpms_backend.chat.model;


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

    private String content;

    @ManyToOne
    private UserModel sender;

    @ManyToOne
    private ProjectModel project;

    private LocalDateTime timestamp;

}
