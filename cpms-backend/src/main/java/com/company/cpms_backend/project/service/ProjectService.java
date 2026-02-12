package com.company.cpms_backend.project.service;

import com.company.cpms_backend.project.dto.ProjectCreateDTO;
import com.company.cpms_backend.project.dto.ProjectResponseDTO;
import com.company.cpms_backend.project.dto.ProjectUpdateDTO;
import com.company.cpms_backend.project.model.ProjectModel;
import com.company.cpms_backend.project.repository.ProjectRepository;
import com.company.cpms_backend.project.util.ProjectStatusMapper;
import com.company.cpms_backend.user.model.UserModel;
import com.company.cpms_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<ProjectResponseDTO> getAll() {
        return projectRepository.findAll().stream().map(this::toDTO).toList();
    }

    public List<ProjectResponseDTO> getByCustomer(Long customerId) {
        return projectRepository.findByCustomer_Id(customerId).stream().map(this::toDTO).toList();
    }

    public List<ProjectResponseDTO> getByManager(Long managerId) {
        return projectRepository.findByManager_Id(managerId).stream().map(this::toDTO).toList();
    }

    public ProjectResponseDTO get(Long id) {
        ProjectModel p = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found: " + id));
        return toDTO(p);
    }

    public ProjectResponseDTO create(ProjectCreateDTO dto) {
        ProjectModel p = new ProjectModel();

        p.setTitle(dto.getName());
        p.setDescription(dto.getDescription());
        p.setLocation(dto.getLocation());

        // ✅ safe parse (still throws good msg if invalid)
        p.setStartDate(parseDateRequired(dto.getStartDate()));

        // ✅ robust mapper
        p.setStatus(ProjectStatusMapper.fromLabel(dto.getStatus()));

        UserModel manager = userRepository.findById(dto.getManagerId())
                .orElseThrow(() -> new RuntimeException("Manager not found: " + dto.getManagerId()));
        p.setManager(manager);

        UserModel customer = resolveCustomer(dto.getCustomerId(), dto.getCustomer());
        p.setCustomer(customer);

        return toDTO(projectRepository.save(p));
    }

    public ProjectResponseDTO update(Long id, ProjectUpdateDTO dto) {
        ProjectModel p = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found: " + id));

        if (dto.getName() != null) p.setTitle(dto.getName());
        if (dto.getDescription() != null) p.setDescription(dto.getDescription());
        if (dto.getLocation() != null) p.setLocation(dto.getLocation());

        // ✅ ignore blank date instead of crashing
        if (dto.getStartDate() != null) {
            String s = dto.getStartDate().trim();
            if (!s.isEmpty()) p.setStartDate(parseDateRequired(s));
        }

        if (dto.getStatus() != null) {
            String s = dto.getStatus().trim();
            if (!s.isEmpty()) p.setStatus(ProjectStatusMapper.fromLabel(s));
        }

        if (dto.getManagerId() != null) {
            UserModel manager = userRepository.findById(dto.getManagerId())
                    .orElseThrow(() -> new RuntimeException("Manager not found: " + dto.getManagerId()));
            p.setManager(manager);
        }

        if (dto.getCustomerId() != null || dto.getCustomer() != null) {
            UserModel customer = resolveCustomer(dto.getCustomerId(), dto.getCustomer());
            p.setCustomer(customer);
        }

        return toDTO(projectRepository.save(p));
    }

    public void delete(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Project not found: " + id);
        }
        projectRepository.deleteById(id);
    }

    // ================= HELPERS =================

    private LocalDate parseDateRequired(String dateStr) {
        try {
            return LocalDate.parse(dateStr.trim()); // YYYY-MM-DD
        } catch (DateTimeParseException e) {
            throw new RuntimeException("Invalid startDate format. Use YYYY-MM-DD");
        }
    }

    private ProjectResponseDTO toDTO(ProjectModel p) {
        String customerName = p.getCustomer() != null ? p.getCustomer().getName() : null;

        return ProjectResponseDTO.builder()
                .id(p.getId())
                .name(p.getTitle())
                .customer(customerName)
                .location(p.getLocation())
                .description(p.getDescription())
                .startDate(p.getStartDate() != null ? p.getStartDate().toString() : null)
                .status(ProjectStatusMapper.toLabel(p.getStatus()))
                .customerId(p.getCustomer() != null ? p.getCustomer().getId() : null)
                .managerId(p.getManager() != null ? p.getManager().getId() : null)
                .build();
    }

    private UserModel resolveCustomer(Long customerId, String customerText) {
        if (customerId != null) {
            return userRepository.findById(customerId)
                    .orElseThrow(() -> new RuntimeException("Customer not found: " + customerId));
        }

        if (customerText == null || customerText.trim().isEmpty()) return null;

        String x = customerText.trim();

        return userRepository.findFirstByEmailIgnoreCase(x)
                .or(() -> userRepository.findFirstByNameIgnoreCase(x))
                .orElseThrow(() -> new RuntimeException("Customer not found by name/email: " + x));
    }
}
