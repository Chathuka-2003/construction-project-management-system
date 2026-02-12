package com.company.cpms_backend.task.repository;

import com.company.cpms_backend.task.model.TaskModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<TaskModel, Long> {
    List<TaskModel> findByProject_Id(Long projectId);
    long countByProject_Id(Long projectId);
}
