package com.company.cpms_backend.filestorage.service;

import com.company.cpms_backend.filestorage.model.FilestorageModel;
import com.company.cpms_backend.filestorage.repository.FilestorageRepository;
import com.company.cpms_backend.project.repository.ProjectRepository;
import com.company.cpms_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final FilestorageRepository filestorageRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    private final Path uploadRoot = Paths.get("uploads");

    public List<FilestorageModel> getFilesByProject(Long projectId){
        return filestorageRepository.findAllByProject_IdOrderByUploadedAtAsc(projectId);
    }

    public FilestorageModel uploadChatFile(Long projectId, MultipartFile file, String email) {
        try {
            if (!Files.exists(uploadRoot)) Files.createDirectories(uploadRoot);

            String storedName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = uploadRoot.resolve(storedName);

            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            var user = userRepository.findByEmail(email).orElseThrow();
            var project = projectRepository.findById(projectId).orElseThrow();

            FilestorageModel storage = new FilestorageModel();
            storage.setFileName(file.getOriginalFilename());
            storage.setFileType(file.getContentType());
            storage.setFilePath(path.toString());

            storage.setFileUrl("/uploads/" + storedName);

            storage.setUploadedAt(LocalDateTime.now());
            storage.setUploadedBy(user);
            storage.setProject(project);

            return filestorageRepository.save(storage);

        } catch (Exception e) {
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }
}
