package com.company.cpms_backend.task.service;

import com.company.cpms_backend.common.exception.ResourceNotFoundException;
import com.company.cpms_backend.common.mapper.MiniUserMapper;
import com.company.cpms_backend.project.model.ProjectModel;
import com.company.cpms_backend.project.repository.ProjectRepository;
import com.company.cpms_backend.task.dto.TaskCreateDTO;
import com.company.cpms_backend.task.dto.TaskResponseDTO;
import com.company.cpms_backend.task.dto.TaskUpdateDTO;
import com.company.cpms_backend.task.model.TaskModel;
import com.company.cpms_backend.task.repository.TaskRepository;
import com.company.cpms_backend.user.model.UserModel;
import com.company.cpms_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskResponseDTO create(TaskCreateDTO dto) {
        ProjectModel project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + dto.getProjectId()));

        UserModel assignedTo = null;
        if (dto.getAssignedToId() != null) {
            assignedTo = userRepository.findById(dto.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found: " + dto.getAssignedToId()));
        }

        TaskModel t = new TaskModel();
        t.setTitle(dto.getTitle().trim());
        t.setProgress(dto.getProgress());
        t.setProject(project);
        t.setAssignedTo(assignedTo);

        return toResponse(taskRepository.save(t));
    }

    public TaskResponseDTO update(Long id, TaskUpdateDTO dto) {
        TaskModel t = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));

        ProjectModel project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + dto.getProjectId()));

        UserModel assignedTo = null;
        if (dto.getAssignedToId() != null) {
            assignedTo = userRepository.findById(dto.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found: " + dto.getAssignedToId()));
        }

        t.setTitle(dto.getTitle().trim());
        t.setProgress(dto.getProgress());
        t.setProject(project);
        t.setAssignedTo(assignedTo);

        return toResponse(taskRepository.save(t));
    }

    @Transactional(readOnly = true)
    public TaskResponseDTO get(Long id) {
        TaskModel t = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
        return toResponse(t);
    }

    @Transactional(readOnly = true)
    public List<TaskResponseDTO> getAll() {
        return taskRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<TaskResponseDTO> getByProject(Long projectId) {
        return taskRepository.findByProject_Id(projectId).stream().map(this::toResponse).toList();
    }

    public void delete(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found: " + id);
        }
        taskRepository.deleteById(id);
    }

    private TaskResponseDTO toResponse(TaskModel t) {
        return TaskResponseDTO.builder()
                .id(t.getId())
                .title(t.getTitle())
                .progress(t.getProgress())
                .projectId(t.getProject() != null ? t.getProject().getId() : null)
                .projectTitle(t.getProject() != null ? t.getProject().getTitle() : null)
                .assignedTo(MiniUserMapper.toMini(t.getAssignedTo()))
                .build();
    }
}
