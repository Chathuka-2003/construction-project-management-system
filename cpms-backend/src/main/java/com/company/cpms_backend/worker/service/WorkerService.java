package com.company.cpms_backend.worker.service;

import com.company.cpms_backend.worker.dto.WorkerCreateDTO;
import com.company.cpms_backend.worker.dto.WorkerResponseDTO;
import com.company.cpms_backend.worker.model.WorkerModel;
import com.company.cpms_backend.worker.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository repo;

    public WorkerResponseDTO create(WorkerCreateDTO dto) {
        WorkerModel w = new WorkerModel();
        w.setName(dto.getName());
        w.setSkill(dto.getSkill());
        WorkerModel saved = repo.save(w);
        return new WorkerResponseDTO(saved.getId(), saved.getName(), saved.getSkill());
    }

    public List<WorkerResponseDTO> getAll() {
        return repo.findAll().stream()
                .map(w -> new WorkerResponseDTO(w.getId(), w.getName(), w.getSkill()))
                .toList();
    }

    public WorkerResponseDTO update(Long id, WorkerCreateDTO dto) {
        WorkerModel w = repo.findById(id).orElseThrow(() -> new RuntimeException("Worker not found"));
        w.setName(dto.getName());
        w.setSkill(dto.getSkill());
        WorkerModel saved = repo.save(w);
        return new WorkerResponseDTO(saved.getId(), saved.getName(), saved.getSkill());
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) throw new RuntimeException("Worker not found");
        repo.deleteById(id);
    }
}
