package com.company.cpms_backend.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class MessageResponseDTO {
    private Long messageId;
    private Long projectId;
    private String clientMessageId;
    private String senderName;
    private String senderEmail;
    private String content;
    private LocalDateTime timestamp;
    private Long fileId;
    private String fileName;
    private String fileType;
    private String fileUrl;
}