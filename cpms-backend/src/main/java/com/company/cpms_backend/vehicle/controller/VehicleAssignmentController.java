package com.company.cpms_backend.vehicle.controller;

import com.company.cpms_backend.vehicle.dto.VehicleAssignmentCreateDTO;
import com.company.cpms_backend.vehicle.dto.VehicleAssignmentResponseDTO;
import com.company.cpms_backend.vehicle.dto.VehicleAssignmentUpdateDTO;
import com.company.cpms_backend.vehicle.service.VehicleAssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicle-assignments")
@RequiredArgsConstructor
public class VehicleAssignmentController {

    private final VehicleAssignmentService service;

    @GetMapping
    public List<VehicleAssignmentResponseDTO> all() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public VehicleAssignmentResponseDTO one(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public VehicleAssignmentResponseDTO create(@Valid @RequestBody VehicleAssignmentCreateDTO dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public VehicleAssignmentResponseDTO update(@PathVariable Long id, @RequestBody VehicleAssignmentUpdateDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
