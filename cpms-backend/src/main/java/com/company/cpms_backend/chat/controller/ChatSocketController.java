package com.company.cpms_backend.chat.controller;

import com.company.cpms_backend.chat.dto.MessageResponseDTO;
import com.company.cpms_backend.chat.dto.MessageSendDTO;
import com.company.cpms_backend.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.handler.annotation.Header;

@Controller
@RequiredArgsConstructor
public class ChatSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload MessageSendDTO dto,
                            @Header("simpSessionAttributes") Object sessionAttrs) {

        @SuppressWarnings("unchecked")
        var sessionAttributes = (java.util.Map<String, Object>) sessionAttrs;

        var auth = (org.springframework.security.core.Authentication) sessionAttributes.get("user");

        if (auth == null) {
            throw new RuntimeException("WebSocket authentication missing");
        }

        String email = auth.getName();

        MessageResponseDTO response = chatService.sendMessage(email, dto);

        messagingTemplate.convertAndSend(
                "/topic/project/" + dto.getProjectId(),
                response
        );
    }
}