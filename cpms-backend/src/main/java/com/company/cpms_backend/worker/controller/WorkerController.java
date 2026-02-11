package com.company.cpms_backend.worker.controller;

import com.company.cpms_backend.worker.dto.WorkerCreateDTO;
import com.company.cpms_backend.worker.dto.WorkerResponseDTO;
import com.company.cpms_backend.worker.service.WorkerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WorkerController {

    private final WorkerService workerService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPERADMIN','ADMIN','MANAGER')")
    public ResponseEntity<WorkerResponseDTO> create(@Valid @RequestBody WorkerCreateDTO dto) {
        return ResponseEntity.ok(workerService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<WorkerResponseDTO>> getAll() {
        return ResponseEntity.ok(workerService.getAll());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPERADMIN','ADMIN','MANAGER')")
    public ResponseEntity<WorkerResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody WorkerCreateDTO dto) {
        return ResponseEntity.ok(workerService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPERADMIN','ADMIN','MANAGER')")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        workerService.delete(id);
        return ResponseEntity.ok("Worker deleted");
    }
}
