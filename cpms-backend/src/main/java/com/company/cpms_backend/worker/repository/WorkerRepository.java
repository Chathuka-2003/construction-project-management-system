package com.company.cpms_backend.worker.repository;

import com.company.cpms_backend.worker.model.WorkerModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkerRepository extends JpaRepository<WorkerModel, Long> {
}
