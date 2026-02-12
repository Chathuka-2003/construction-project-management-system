package com.company.cpms_backend.vehicle.repository;

import com.company.cpms_backend.enums.VehicleStatus;
import com.company.cpms_backend.vehicle.model.VehicleModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VehicleRepository extends JpaRepository<VehicleModel, Long> {
    Optional<VehicleModel> findByRegNumberIgnoreCase(String regNumber);
    long countByActiveTrue();
    long countByStatus(VehicleStatus status);
}
