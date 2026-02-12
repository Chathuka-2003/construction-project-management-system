package com.company.cpms_backend.dashboard.service;

import com.company.cpms_backend.dashboard.dashboarddto.*;
import com.company.cpms_backend.enums.ProjectStatus;
import com.company.cpms_backend.project.model.ProjectModel;
import com.company.cpms_backend.project.repository.ProjectRepository;
import com.company.cpms_backend.task.dto.TaskResponseDTO;
import com.company.cpms_backend.task.model.TaskModel;
import com.company.cpms_backend.task.repository.TaskRepository;
import com.company.cpms_backend.task.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    private final TaskService taskService;

    public DashboardSummeryDTO getDashboardSummary(Long userId) {
        DashboardSummeryDTO summary = new DashboardSummeryDTO();
        summary.setStats(new DashboardStatsDTO());

        summary.setStats(getDashboardStats(userId));


        summary.setMyProjects(getUserProjects(userId));


        summary.setTodaysTasks(getTodaysTasks(userId));


        summary.setWeather(getCurrentWeather());


        summary.setCurrentTime(getCurrentDateTime());

        return summary;
    }

    private DashboardStatsDTO getDashboardStats(Long userId) {
        DashboardStatsDTO stats = new DashboardStatsDTO();


        List<ProjectModel> activeProjects = projectRepository.findAll()
                .stream()
                .filter(project -> project.getManager() != null &&
                        project.getManager().getId().equals(userId) &&
                        project.getStatus() != ProjectStatus.FINISHING)
                .collect(Collectors.toList());
        stats.setActiveProjects(activeProjects.size());

        List<TaskModel> pendingTasks = taskRepository.findByAssignedToId(userId)
                .stream()
                .filter(task -> task.getProgress() < 100)
                .collect(Collectors.toList());
        stats.setPendingTasks(pendingTasks.size());



        List<TaskResponseDTO> todaysTasks = new ArrayList<>();
        if (taskService != null) {
            todaysTasks = taskService.getTasksByUserId(userId)
                    .stream()
                    .filter(task -> task.getProgress() < 100) // Only pending tasks
                    .collect(Collectors.toList());
        }
        stats.setTodaysTasks(todaysTasks);

        return stats;
    }

    private List<ProjectProgressDTO> getUserProjects(Long userId) {
        List<ProjectModel> userProjects = projectRepository.findAll()
                .stream()
                .filter(project -> project.getManager() != null &&
                        project.getManager().getId().equals(userId))
                .collect(Collectors.toList());

        return userProjects.stream()
                .map(project -> {
                    ProjectProgressDTO dto = new ProjectProgressDTO();
                    dto.setProjectId(project.getId());
                    dto.setProjectName(project.getTitle());

                    // Set role based on manager status
                    if (project.getManager() != null && project.getManager().getId().equals(userId)) {
                        dto.setRole("Manager");
                    } else {
                        dto.setRole("Team Member");
                    }


                    List<TaskModel> projectTasks = taskRepository.findByProjectId(project.getId());
                    int totalTasks = projectTasks.size();
                    int completedTasks = (int) projectTasks.stream()
                            .filter(task -> task.getProgress() == 100)
                            .count();
                    int progress = totalTasks > 0 ? (completedTasks * 100) / totalTasks : 0;
                    dto.setProgress(progress);


                    if (progress >= 80) {
                        dto.setStatus("On Track");
                    } else if (progress < 50) {
                        dto.setStatus("Delayed");
                    } else {
                        dto.setStatus("In Progress");
                    }


                    if (project.getDueDate() != null) {
                        dto.setDueDate(project.getDueDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));
                    } else {
                        dto.setDueDate("Not Set");
                    }

                    return dto;
                })
                .collect(Collectors.toList());
    }

    private List<TodayTaskDTO> getTodaysTasks(Long userId) {
        List<TaskModel> tasks = taskRepository.findByAssignedToId(userId);

        LocalDate today = LocalDate.now();

        return tasks.stream()
                .filter(task -> task.getProgress() < 100) // Only incomplete tasks
                .limit(4) // Limit to 4 tasks like in the UI
                .map(task -> {
                    TodayTaskDTO dto = new TodayTaskDTO();
                    dto.setId(task.getId());
                    dto.setTitle(task.getTitle());

                    if (task.getDueDateTime() != null) {
                        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mm a");
                        dto.setTime(task.getDueDateTime().format(timeFormatter));
                    } else {
                        dto.setTime("9:00 AM"); // Default
                    }


                    if (task.getPriority() != null) {
                        dto.setPriority(task.getPriority());
                    } else {

                        if (task.getProgress() < 30) {
                            dto.setPriority("High");
                        } else if (task.getProgress() < 70) {
                            dto.setPriority("Medium");
                        } else {
                            dto.setPriority("Low");
                        }
                    }

                    if (task.getCategory() != null) {
                        dto.setCategory(task.getCategory());
                    } else {
                        dto.setCategory("General");
                    }

                    return dto;
                })
                .collect(Collectors.toList());
    }

    private WeatherDTO getCurrentWeather() {

        return new WeatherDTO(27.0, "Partly cloudy", "°C");
    }

    private String getCurrentDateTime() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("h:mm a\nM/d/yyyy");
        return LocalDateTime.now().format(formatter);
    }
}