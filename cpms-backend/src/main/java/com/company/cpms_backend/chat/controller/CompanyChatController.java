package com.company.cpms_backend.chat.controller;

import com.company.cpms_backend.chat.dto.CompanyChatListDTO;
import com.company.cpms_backend.project.model.ProjectModel;
import com.company.cpms_backend.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat/company")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPERADMIN','ADMIN','MANAGER','ENGINEER','OTHER_STAFF')")
public class CompanyChatController {

    private final ProjectRepository projectRepository;

    @GetMapping("/projects")
    public List<CompanyChatListDTO> getCustomerProjects() {

        List<ProjectModel> projects = projectRepository.findAllByCustomerIsNotNull();

        return projects.stream()
                .map(p -> new CompanyChatListDTO(
                        p.getId(),
                        p.getTitle(),
                        p.getCustomer().getId(),
                        p.getCustomer().getName(),
                        p.getCustomer().getEmail()
                ))
                .toList();
    }
}
