package com.company.cpms_backend.task.controller;

import com.company.cpms_backend.task.dto.TaskCreateDTO;
import com.company.cpms_backend.task.dto.TaskResponseDTO;
import com.company.cpms_backend.task.dto.TaskUpdateDTO;
import com.company.cpms_backend.task.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public List<TaskResponseDTO> getAll() {
        return taskService.getAll();
    }

    // Frontend: tasks for a project
    @GetMapping("/project/{projectId}")
    public List<TaskResponseDTO> getByProject(@PathVariable Long projectId) {
        return taskService.getByProject(projectId);
    }

    @GetMapping("/{id}")
    public TaskResponseDTO get(@PathVariable Long id) {
        return taskService.get(id);
    }

    @PostMapping
    public TaskResponseDTO create(@Valid @RequestBody TaskCreateDTO dto) {
        return taskService.create(dto);
    }

    @PutMapping("/{id}")
    public TaskResponseDTO update(@PathVariable Long id, @Valid @RequestBody TaskUpdateDTO dto) {
        return taskService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        taskService.delete(id);
    }
}
