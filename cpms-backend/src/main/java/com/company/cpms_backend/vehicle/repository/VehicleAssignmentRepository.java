package com.company.cpms_backend.vehicle.repository;

import com.company.cpms_backend.vehicle.model.VehicleAssignmentModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleAssignmentRepository extends JpaRepository<VehicleAssignmentModel, Long> {

    // active assignment for a vehicle (ASSIGNED)
    Optional<VehicleAssignmentModel> findFirstByVehicle_IdAndStatusOrderByIdDesc(Long vehicleId, com.company.cpms_backend.enums.VehicleAssignmentStatus status);

    List<VehicleAssignmentModel> findByProject_Id(Long projectId);
    List<VehicleAssignmentModel> findByWorker_Id(Long workerId);
}
