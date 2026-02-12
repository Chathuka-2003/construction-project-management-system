package com.company.cpms_backend.project.repository;

import com.company.cpms_backend.project.model.ProjectModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectModel, Long> {

    Optional<ProjectModel> findByCustomerId(Long customerId);

    List<ProjectModel> findAllByCustomerIsNotNull();
}
