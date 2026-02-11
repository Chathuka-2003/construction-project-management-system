package com.company.cpms_backend.vehicle.service;

import com.company.cpms_backend.enums.VehicleAssignmentStatus;
import com.company.cpms_backend.enums.VehicleStatus;
import com.company.cpms_backend.project.model.ProjectModel;
import com.company.cpms_backend.project.repository.ProjectRepository;
import com.company.cpms_backend.vehicle.dto.VehicleAssignmentCreateDTO;
import com.company.cpms_backend.vehicle.dto.VehicleAssignmentResponseDTO;
import com.company.cpms_backend.vehicle.dto.VehicleAssignmentUpdateDTO;
import com.company.cpms_backend.vehicle.model.VehicleAssignmentModel;
import com.company.cpms_backend.vehicle.model.VehicleModel;
import com.company.cpms_backend.vehicle.repository.VehicleAssignmentRepository;
import com.company.cpms_backend.vehicle.repository.VehicleRepository;
import com.company.cpms_backend.worker.model.WorkerModel;
import com.company.cpms_backend.worker.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleAssignmentService {

    private final VehicleAssignmentRepository assignmentRepo;
    private final VehicleRepository vehicleRepo;
    private final ProjectRepository projectRepo;
    private final WorkerRepository workerRepo;

    public List<VehicleAssignmentResponseDTO> getAll() {
        return assignmentRepo.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public VehicleAssignmentResponseDTO getById(Long id) {
        return toDTO(findAssignment(id));
    }

    @Transactional
    public VehicleAssignmentResponseDTO create(VehicleAssignmentCreateDTO dto) {

        VehicleModel vehicle = vehicleRepo.findById(dto.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found: " + dto.getVehicleId()));

        if (!vehicle.isActive()) {
            throw new RuntimeException("Vehicle is not active");
        }

        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new RuntimeException("Vehicle is not AVAILABLE. Current status: " + vehicle.getStatus());
        }

        // prevent double assignment (extra safety)
        assignmentRepo.findFirstByVehicle_IdAndStatusOrderByIdDesc(vehicle.getId(), VehicleAssignmentStatus.ASSIGNED)
                .ifPresent(a -> {
                    throw new RuntimeException("This vehicle already has an active assignment (ASSIGNED).");
                });

        ProjectModel project = projectRepo.findById(dto.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found: " + dto.getProjectId()));

        WorkerModel worker = workerRepo.findById(dto.getWorkerId())
                .orElseThrow(() -> new RuntimeException("Worker not found: " + dto.getWorkerId()));

        VehicleAssignmentModel assignment = VehicleAssignmentModel.builder()
                .vehicle(vehicle)
                .project(project)
                .worker(worker)
                .startDate(dto.getStartDate())
                .status(VehicleAssignmentStatus.ASSIGNED)
                .build();

        VehicleAssignmentModel saved = assignmentRepo.save(assignment);

        // ✅ update vehicle status
        vehicle.setStatus(VehicleStatus.ASSIGNED);
        vehicleRepo.save(vehicle);

        return toDTO(saved);
    }

    @Transactional
    public VehicleAssignmentResponseDTO update(Long id, VehicleAssignmentUpdateDTO dto) {
        VehicleAssignmentModel assignment = findAssignment(id);

        if (dto.getStatus() != null) {
            assignment.setStatus(dto.getStatus());
        }

        if (dto.getEndDate() != null) {
            assignment.setEndDate(dto.getEndDate());
        }

        // if completed/cancelled -> free vehicle
        if (assignment.getStatus() == VehicleAssignmentStatus.COMPLETED
                || assignment.getStatus() == VehicleAssignmentStatus.CANCELLED) {

            VehicleModel vehicle = assignment.getVehicle();

            // set end date if not set
            if (assignment.getEndDate() == null) {
                assignment.setEndDate(LocalDate.now());
            }

            vehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicleRepo.save(vehicle);
        }

        VehicleAssignmentModel saved = assignmentRepo.save(assignment);
        return toDTO(saved);
    }

    @Transactional
    public void delete(Long id) {
        VehicleAssignmentModel assignment = findAssignment(id);

        // free vehicle if it was active
        if (assignment.getStatus() == VehicleAssignmentStatus.ASSIGNED) {
            VehicleModel vehicle = assignment.getVehicle();
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicleRepo.save(vehicle);
        }

        assignmentRepo.delete(assignment);
    }

    // ---------------- helpers ----------------

    private VehicleAssignmentModel findAssignment(Long id) {
        return assignmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found: " + id));
    }

    private VehicleAssignmentResponseDTO toDTO(VehicleAssignmentModel a) {
        // because LAZY relations, access inside service (ok)
        VehicleModel v = a.getVehicle();
        ProjectModel p = a.getProject();
        WorkerModel w = a.getWorker();

        return VehicleAssignmentResponseDTO.builder()
                .id(a.getId())

                .vehicleId(v.getId())
                .vehicleRegNumber(v.getRegNumber())

                .projectId(p.getId())
                .projectTitle(p.getTitle())
                .projectLocation(p.getLocation())

                .workerId(w.getId())
                .workerName(w.getName())

                .startDate(a.getStartDate())
                .endDate(a.getEndDate())

                .status(a.getStatus())
                .createdAt(a.getCreatedAt())
                .build();
    }
}

