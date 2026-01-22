package com.company.cpms_backend.notification.repository;

import com.company.cpms_backend.notification.model.NotificationModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<NotificationModel, Long> {
    List<NotificationModel> findByUserIdOrderByCreatedAtDesc(Long userId);
}

