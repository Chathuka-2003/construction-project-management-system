package com.company.cpms_backend.project.repository;

import com.company.cpms_backend.project.model.ProjectModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<ProjectModel, Long> {
    List<ProjectModel> findByCustomer_Id(Long customerId);
    List<ProjectModel> findByManager_Id(Long managerId);
    List<ProjectModel> findAllByCustomerIsNotNull();
}
