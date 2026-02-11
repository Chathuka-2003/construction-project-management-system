package com.company.cpms_backend.vehicle.service;

import com.company.cpms_backend.vehicle.dto.*;
import com.company.cpms_backend.enums.VehicleStatus;
import com.company.cpms_backend.vehicle.model.VehicleModel;
import com.company.cpms_backend.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VehicleService {

    private final VehicleRepository repo;

    public List<VehicleResponseDTO> getAll() {
        return repo.findAll().stream().map(this::toDTO).toList();
    }

    public VehicleResponseDTO getById(Long id) {
        VehicleModel v = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found: " + id));
        return toDTO(v);
    }

    public VehicleResponseDTO create(VehicleCreateDTO dto) {
        repo.findByRegNumberIgnoreCase(dto.getRegNumber())
                .ifPresent(x -> { throw new RuntimeException("Vehicle already exists: " + dto.getRegNumber()); });

        VehicleModel v = VehicleModel.builder()
                .regNumber(dto.getRegNumber().trim())
                .type(dto.getType().trim())
                .fuel(dto.getFuel())
                .capacity(dto.getCapacity())
                .machine(dto.getMachine())
                .condition(dto.getCondition() == null ? com.company.cpms_backend.enums.VehicleCondition.GOOD : dto.getCondition())
                .status(dto.getStatus() == null ? com.company.cpms_backend.enums.VehicleStatus.AVAILABLE : dto.getStatus())
                .active(dto.getActive() == null ? true : dto.getActive())
                .build();

        return toDTO(repo.save(v));
    }


    public VehicleResponseDTO update(Long id, VehicleUpdateDTO dto) {
        VehicleModel v = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found: " + id));

        if (dto.getRegNumber() != null && !dto.getRegNumber().trim().isEmpty()) {
            String newReg = dto.getRegNumber().trim();
            repo.findByRegNumberIgnoreCase(newReg).ifPresent(existing -> {
                if (!existing.getId().equals(id)) throw new RuntimeException("Reg number already used: " + newReg);
            });
            v.setRegNumber(newReg);
        }

        if (dto.getType() != null) v.setType(dto.getType());
        if (dto.getFuel() != null) v.setFuel(dto.getFuel());
        if (dto.getCapacity() != null) v.setCapacity(dto.getCapacity());
        if (dto.getMachine() != null) v.setMachine(dto.getMachine());
        if (dto.getCondition() != null) v.setCondition(dto.getCondition());
        if (dto.getStatus() != null) v.setStatus(dto.getStatus());
        if (dto.getActive() != null) v.setActive(dto.getActive());

        return toDTO(repo.save(v));
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) throw new RuntimeException("Vehicle not found: " + id);
        repo.deleteById(id);
    }

    public VehicleStatsDTO stats() {
        return VehicleStatsDTO.builder()
                .total(repo.count())
                .active(repo.countByActiveTrue())
                .assigned(repo.countByStatus(VehicleStatus.ASSIGNED))
                .inMaintenance(repo.countByStatus(VehicleStatus.IN_MAINTENANCE))
                .build();
    }

    private VehicleResponseDTO toDTO(VehicleModel v) {
        return VehicleResponseDTO.builder()
                .id(v.getId())
                .regNumber(v.getRegNumber())
                .type(v.getType())
                .fuel(v.getFuel())
                .capacity(v.getCapacity())
                .machine(v.getMachine())
                .condition(v.getCondition())
                .status(v.getStatus())
                .active(v.isActive())
                .createdAt(v.getCreatedAt())
                .build();
    }
}
