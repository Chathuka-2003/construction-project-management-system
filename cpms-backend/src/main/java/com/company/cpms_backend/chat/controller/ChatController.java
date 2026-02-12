package com.company.cpms_backend.chat.controller;

import com.company.cpms_backend.chat.dto.MessageResponseDTO;
import com.company.cpms_backend.chat.dto.MessageSendDTO;
import com.company.cpms_backend.chat.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/send")
    public MessageResponseDTO send(
            Principal principal,
            @RequestBody MessageSendDTO dto) {

        return chatService.sendMessage(principal.getName(), dto);
    }


    @GetMapping("/project/{projectId}")
    public List<MessageResponseDTO> getMessages(@PathVariable Long projectId) {
        return chatService.getMessagesByProject(projectId);
    }
}