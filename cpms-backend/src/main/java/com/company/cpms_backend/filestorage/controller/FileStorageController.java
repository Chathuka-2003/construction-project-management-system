package com.company.cpms_backend.filestorage.controller;

import com.company.cpms_backend.filestorage.model.FilestorageModel;
import com.company.cpms_backend.filestorage.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileStorageController {

    private final FileStorageService fileStorageService;

    @PostMapping(value="/upload/chat/{projectId}", consumes = "multipart/form-data")
    public FilestorageModel uploadChatFile(@PathVariable Long projectId,
                                           @RequestParam("file") MultipartFile file,
                                           Principal principal) {
        return fileStorageService.uploadChatFile(projectId, file, principal.getName());
    }

    @GetMapping("/project/{projectId}")
    public List<FilestorageModel> getProjectFiles(@PathVariable Long projectId) {
        return fileStorageService.getFilesByProject(projectId);
    }

}