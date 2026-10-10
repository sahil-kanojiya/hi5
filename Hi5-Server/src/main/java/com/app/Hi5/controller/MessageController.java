package com.app.Hi5.controller;

import com.app.Hi5.dto.payload.MessagePayload;
import com.app.Hi5.dto.response.MessageResponse;
import com.app.Hi5.exceptions.EntityNotFoundException;
import com.app.Hi5.exceptions.UnauthorizedAccessException;
import com.app.Hi5.model.Chat;
import com.app.Hi5.model.Message;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.ChatRepository;
import com.app.Hi5.repository.MessageRepository;
import com.app.Hi5.repository.UserRepository;
import com.app.Hi5.security.UserDetailsImpl;
import com.app.Hi5.service.MessageService;
import com.app.Hi5.utility.FileStorage;
import com.app.Hi5.utility.enums.FileType;
import java.io.IOException;
import java.util.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Controller
@RequestMapping("/api/message")
@RequiredArgsConstructor
public class MessageController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageService messageService;
    private final UserRepository userRepository;
    private final FileStorage fileStorage;
    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;

    @MessageMapping("/message")
    public void processMessage(@Payload MessagePayload messagePayload) {
        Message savedMsg =
                messageService.save(
                        messagePayload.getChatId(),
                        messagePayload.getImageUrl(),
                        messagePayload.getVideoUrl(),
                        messagePayload.getMessage(),
                        messagePayload.getSenderUserId(),
                        messagePayload.getReceiverUserId());
        Optional<User> optionalUser =
                userRepository.findById(new ObjectId(messagePayload.getSenderUserId()));
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Map<String, Object> chatMessageData =
                    new HashMap<>(
                            Map.of(
                                    "id",
                                    savedMsg.getId().toHexString(),
                                    "chatId",
                                    savedMsg.getChatId(),
                                    "message",
                                    savedMsg.getMessage(),
                                    "createdAt",
                                    savedMsg.getCreatedAt(),
                                    "senderUserId",
                                    messagePayload.getSenderUserId(),
                                    "senderUsername",
                                    user.getUsername(),
                                    "senderFullname",
                                    user.getFullname(),
                                    "senderProfileImageUrl",
                                    user.getProfileImageUrl()));
            Optional.ofNullable(savedMsg.getImageUrl())
                    .ifPresent(url -> chatMessageData.put("imageUrl", url));
            Optional.ofNullable(savedMsg.getVideoUrl())
                    .ifPresent(url -> chatMessageData.put("videoUrl", url));
            simpMessagingTemplate.convertAndSend(
                    "/chat/" + messagePayload.getReceiverUserId(), chatMessageData);
        }

        Map<String, Object> messageData =
                new HashMap<>(
                        Map.of(
                                "id",
                                savedMsg.getId().toHexString(),
                                "chatId",
                                savedMsg.getChatId(),
                                "message",
                                savedMsg.getMessage(),
                                "createdAt",
                                savedMsg.getCreatedAt(),
                                "senderUserId",
                                messagePayload.getSenderUserId()));
        Optional.ofNullable(savedMsg.getImageUrl())
                .ifPresent(url -> messageData.put("imageUrl", url));
        Optional.ofNullable(savedMsg.getVideoUrl())
                .ifPresent(url -> messageData.put("videoUrl", url));
        simpMessagingTemplate.convertAndSend(
                "/message/" + messagePayload.getReceiverUserId() + messagePayload.getSenderUserId(),
                messageData);
    }

    @ResponseBody
    @GetMapping("/{chatId}")
    @PreAuthorize("principal.isAccountNonLocked()")
    public ResponseEntity<List<MessageResponse>> findChatMessages(
            @PathVariable String chatId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Chat chat =
                chatRepository
                        .findById(new ObjectId(chatId))
                        .orElseThrow(() -> new EntityNotFoundException("Chat not found."));
        if (!chat.getChatUserIds().contains(userDetails.getUser().getId().toHexString())) {
            throw new UnauthorizedAccessException("You are not authorized to get all messages.");
        }
        List<MessageResponse> filteredMessages =
                messageService.getMessagesByChatId(chatId).stream()
                        .map(
                                message -> {
                                    if (message.getSenderUserId()
                                            .equals(userDetails.getUser().getId().toHexString())) {
                                        return message.getIsDeletedBySender()
                                                ? null
                                                : MessageResponse.builder()
                                                        .id(message.getId().toHexString())
                                                        .chatId(message.getChatId())
                                                        .imageUrl(message.getImageUrl())
                                                        .videoUrl(message.getVideoUrl())
                                                        .message(message.getMessage())
                                                        .createdAt(message.getCreatedAt())
                                                        .senderUserId(message.getSenderUserId())
                                                        .build();
                                    } else if (message.getReceiverUserId()
                                            .equals(userDetails.getUser().getId().toHexString())) {
                                        return message.getIsDeletedByReceiver()
                                                ? null
                                                : MessageResponse.builder()
                                                        .id(message.getId().toHexString())
                                                        .chatId(message.getChatId())
                                                        .imageUrl(message.getImageUrl())
                                                        .videoUrl(message.getVideoUrl())
                                                        .message(message.getMessage())
                                                        .createdAt(message.getCreatedAt())
                                                        .senderUserId(message.getSenderUserId())
                                                        .build();
                                    }
                                    return null;
                                })
                        .filter(Objects::nonNull)
                        .toList();
        return new ResponseEntity<>(filteredMessages, HttpStatus.OK);
    }

    @ResponseBody
    @DeleteMapping("/{chatId}")
    @PreAuthorize("principal.isAccountNonLocked()")
    public ResponseEntity<String> deleteAllMessages(
            @PathVariable String chatId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Chat chat =
                chatRepository
                        .findById(new ObjectId(chatId))
                        .orElseThrow(() -> new EntityNotFoundException("Chat not found."));
        if (!chat.getChatUserIds().contains(userDetails.getUser().getId().toHexString())) {
            throw new UnauthorizedAccessException("You are not authorized to delete all messages.");
        }
        List<Message> messageList =
                messageService.getMessagesByChatId(chatId).stream()
                        .map(
                                message -> {
                                    if (message.getSenderUserId()
                                            .equals(userDetails.getUser().getId().toHexString())) {
                                        message.setIsDeletedBySender(true);
                                    }
                                    if (message.getReceiverUserId()
                                            .equals(userDetails.getUser().getId().toHexString())) {
                                        message.setIsDeletedByReceiver(true);
                                    }
                                    return message;
                                })
                        .toList();
        messageRepository.saveAll(messageList);
        return new ResponseEntity<>("All Messages Deleted.", HttpStatus.OK);
    }

    @ResponseBody
    @PostMapping("/upload/media")
    @PreAuthorize("principal.isAccountNonLocked()")
    public ResponseEntity<String> uploadMedia(
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "video", required = false) MultipartFile videoFile) {
        String imageUrl = null;
        String videoUrl = null;
        try {
            if (imageFile != null && !imageFile.isEmpty()) {
                imageUrl = fileStorage.saveFile(imageFile, FileType.CHAT_IMAGE);
            }
            if (videoFile != null && !videoFile.isEmpty()) {
                videoUrl = fileStorage.saveFile(videoFile, FileType.CHAT_VIDEO);
            }
        } catch (IOException e) {
            log.error("Error while saving files for post: {}", e.getMessage(), e);
            return new ResponseEntity<>(
                    "Failed to save the media: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        if (imageUrl != null) {
            return new ResponseEntity<>(imageUrl, HttpStatus.OK);
        }
        if (videoUrl != null) {
            return new ResponseEntity<>(videoUrl, HttpStatus.OK);
        }
        return new ResponseEntity<>("Failed to save the media.", HttpStatus.BAD_REQUEST);
    }
}
