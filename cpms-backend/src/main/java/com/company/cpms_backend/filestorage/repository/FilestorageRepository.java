package com.company.cpms_backend.filestorage.repository;

import com.company.cpms_backend.filestorage.model.FilestorageModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface FilestorageRepository extends JpaRepository<FilestorageModel, Long> {
    List<FilestorageModel> findAllByProject_IdOrderByUploadedAtAsc(Long projectId);
}

