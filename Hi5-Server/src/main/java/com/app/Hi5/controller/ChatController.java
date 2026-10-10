package com.app.Hi5.controller;

import com.app.Hi5.dto.response.ChatResponse;
import com.app.Hi5.security.UserDetailsImpl;
import com.app.Hi5.service.ChatService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@PreAuthorize("principal.isAccountNonLocked()")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/{userId}")
    public ResponseEntity<String> createChat(
            @PathVariable String userId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        chatService.createChat(userDetails.getUser().getId().toHexString(), userId);
        return ResponseEntity.ok("Chat successfully created, or an existing chat was found.");
    }

    @GetMapping
    public ResponseEntity<List<ChatResponse>> getAllChats(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<ChatResponse> chats =
                chatService.getAllChats(userDetails.getUser().getId().toHexString());
        return ResponseEntity.ok(chats);
    }
}
