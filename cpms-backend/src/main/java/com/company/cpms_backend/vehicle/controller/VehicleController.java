package com.company.cpms_backend.vehicle.controller;

import com.company.cpms_backend.vehicle.dto.*;
import com.company.cpms_backend.vehicle.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService service;

    @GetMapping
    public List<VehicleResponseDTO> all() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public VehicleResponseDTO one(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public VehicleResponseDTO create(@Valid @RequestBody VehicleCreateDTO dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public VehicleResponseDTO update(@PathVariable Long id, @RequestBody VehicleUpdateDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/stats")
    public VehicleStatsDTO stats() {
        return service.stats();
    }
}
