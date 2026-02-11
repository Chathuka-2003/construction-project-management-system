package com.company.cpms_backend.project.controller;

import com.company.cpms_backend.project.dto.ProjectCreateDTO;
import com.company.cpms_backend.project.dto.ProjectResponseDTO;
import com.company.cpms_backend.project.dto.ProjectUpdateDTO;
import com.company.cpms_backend.project.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public List<ProjectResponseDTO> getAll() {
        return projectService.getAll();
    }

    @GetMapping("/customer/{customerId}")
    public List<ProjectResponseDTO> getByCustomer(@PathVariable Long customerId) {
        return projectService.getByCustomer(customerId);
    }

    @GetMapping("/manager/{managerId}")
    public List<ProjectResponseDTO> getByManager(@PathVariable Long managerId) {
        return projectService.getByManager(managerId);
    }

    @GetMapping("/{id}")
    public ProjectResponseDTO get(@PathVariable Long id) {
        return projectService.get(id);
    }

    @PostMapping
    public ProjectResponseDTO create(@Valid @RequestBody ProjectCreateDTO dto) {
        return projectService.create(dto);
    }

    // ✅ remove @Valid here (update fields optional)
    @PutMapping("/{id}")
    public ProjectResponseDTO update(@PathVariable Long id, @RequestBody ProjectUpdateDTO dto) {
        return projectService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        projectService.delete(id);
    }
}
