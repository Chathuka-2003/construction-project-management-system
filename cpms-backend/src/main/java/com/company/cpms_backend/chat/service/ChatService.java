package com.company.cpms_backend.chat.service;

import com.company.cpms_backend.chat.dto.MessageResponseDTO;
import com.company.cpms_backend.chat.dto.MessageSendDTO;
import com.company.cpms_backend.chat.model.ChatModel;
import com.company.cpms_backend.chat.repository.ChatRepository;
import com.company.cpms_backend.common.exception.ForbiddenException;
import com.company.cpms_backend.filestorage.model.FilestorageModel;
import com.company.cpms_backend.filestorage.repository.FilestorageRepository;
import com.company.cpms_backend.notification.service.NotificationService;
import com.company.cpms_backend.project.model.ProjectModel;
import com.company.cpms_backend.project.repository.ProjectRepository;
import com.company.cpms_backend.user.model.UserModel;
import com.company.cpms_backend.user.repository.UserRepository;
import jakarta.validation.ValidationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final FilestorageRepository filestorageRepository;
    private final NotificationService notificationService;

    public ChatService(ChatRepository chatRepository,
                       UserRepository userRepository,
                       ProjectRepository projectRepository,
                       FilestorageRepository filestorageRepository,
                       NotificationService notificationService) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.filestorageRepository = filestorageRepository;
        this.notificationService = notificationService;
    }

    public MessageResponseDTO sendMessage(String email, MessageSendDTO dto) {

        if (dto.getProjectId() == null) {
            throw new ValidationException("Project ID is required");
        }

        boolean hasText = dto.getContent() != null && !dto.getContent().isBlank();
        boolean hasFile = dto.getFileId() != null;

        if (!hasText && !hasFile) {
            throw new ValidationException("Message must have text or a file");
        }

        UserModel sender = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProjectModel project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        switch (sender.getRole()) {
            case CUSTOMER -> {
                if (project.getCustomer() == null || !project.getCustomer().getId().equals(sender.getId())) {
                    throw new ForbiddenException("Customer not allowed to chat in this project");
                }
            }
            case SUPERADMIN, ADMIN, MANAGER, ENGINEER, OTHER_STAFF -> {
                if (project.getCustomer() == null) {
                    throw new ForbiddenException("This project has no customer assigned");
                }
            }
            default -> throw new AccessDeniedException("Role not allowed to chat");
        }

        // ✅ build chat entity
        ChatModel chat = new ChatModel();
        chat.setSender(sender);
        chat.setProject(project);
        chat.setTimestamp(LocalDateTime.now());

        // ✅ save clientMessageId for frontend de-duplication
        chat.setClientMessageId(dto.getClientMessageId());

        if (hasText) {
            chat.setContent(dto.getContent().trim());
        } else {
            chat.setContent(""); // keep non-null if your DB column is NOT NULL
        }

        // ✅ attach file if exists
        if (hasFile) {
            FilestorageModel file = filestorageRepository.findById(dto.getFileId())
                    .orElseThrow(() -> new ValidationException("File not found: " + dto.getFileId()));

            // ✅ safety: file must belong to same project
            if (file.getProject() == null || !file.getProject().getId().equals(project.getId())) {
                throw new ForbiddenException("File does not belong to this project");
            }

            chat.setFile(file);
        }

        ChatModel savedChat = chatRepository.save(chat);

        // ✅ notify customer only if sender is not the customer
        if (project.getCustomer() != null && !project.getCustomer().getId().equals(sender.getId())) {
            String preview = hasText ? dto.getContent().trim() : ("📎 " + savedChat.getFile().getFileName());
            notificationService.notify(
                    project.getCustomer(),
                    "New message in project",
                    sender.getName() + ": " + preview
            );
        }

        return mapToResponseDTO(savedChat);
    }

    public List<MessageResponseDTO> getMessagesByProject(Long projectId) {
        if (projectId == null) {
            throw new ValidationException("Project ID is required");
        }

        return chatRepository.findAllByProject_IdOrderByTimestampAsc(projectId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private MessageResponseDTO mapToResponseDTO(ChatModel chat) {
        return new MessageResponseDTO(
                chat.getId(),
                chat.getProject().getId(),
                chat.getClientMessageId(),
                chat.getSender().getName(),
                chat.getSender().getEmail(),
                chat.getContent(),
                chat.getTimestamp(),
                chat.getFile() != null ? chat.getFile().getId() : null,
                chat.getFile() != null ? chat.getFile().getFileName() : null,
                chat.getFile() != null ? chat.getFile().getFileType() : null,
                chat.getFile() != null ? chat.getFile().getFileUrl() : null
        );
    }
}
