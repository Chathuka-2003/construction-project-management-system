package com.company.cpms_backend.notification.service;

import com.company.cpms_backend.notification.model.NotificationModel;
import com.company.cpms_backend.notification.repository.NotificationRepository;
import com.company.cpms_backend.user.model.UserModel;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public void notify(UserModel user, String title, String message) {

        NotificationModel notification = new NotificationModel();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);

        // send realtime notification
        messagingTemplate.convertAndSendToUser(
                user.getEmail(),
                "/queue/notifications",
                notification
        );
    }
}
