package com.company.cpms_backend.chat.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageSendDTO {

    @NotNull(message = "Project ID is required")
    private Long projectId;

    private String content;

    private String clientMessageId;

    private Long fileId;
}
