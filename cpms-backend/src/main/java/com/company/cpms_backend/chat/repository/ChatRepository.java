package com.company.cpms_backend.chat.repository;

import com.company.cpms_backend.chat.model.ChatModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<ChatModel, Long> {

    List<ChatModel> findAllByProject_IdOrderByTimestampAsc(Long projectId);
}
