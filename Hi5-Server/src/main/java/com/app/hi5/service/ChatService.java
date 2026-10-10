package com.app.hi5.service;

import com.app.hi5.dto.response.ChatResponse;
import com.app.hi5.exceptions.EntityNotFoundException;
import com.app.hi5.exceptions.ValidationException;
import com.app.hi5.model.Chat;
import com.app.hi5.model.User;
import com.app.hi5.model.UserActivity;
import com.app.hi5.model.enums.ActivityStatus;
import com.app.hi5.repository.ChatRepository;
import com.app.hi5.repository.UserActivityRepository;
import com.app.hi5.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final UserActivityRepository userActivityRepository;

    public void createChat(String userId, String otherUserId) {
        if (!ObjectId.isValid(otherUserId)) {
            throw new ValidationException("Invalid userId");
        }
        if (userId.equals(otherUserId)) {
            throw new ValidationException("Other user id is same as user id");
        }
        if (!userRepository.existsById(new ObjectId(otherUserId))) {
            throw new EntityNotFoundException("User not found");
        }
        Optional<Chat> chat = chatRepository.findByChatUserIdsContaining(userId, otherUserId);
        if (chat.isEmpty()) {
            chatRepository.save(Chat.builder().chatUserIds(List.of(userId, otherUserId)).build());
        }
    }

    public List<ChatResponse> getAllChats(String userId) {
        List<Chat> chats = chatRepository.findByChatUserIdsContaining(userId);
        return chats.stream()
                .map(
                        (chat -> {
                            List<String> chatUserIds = chat.getChatUserIds();
                            if (chatUserIds.getFirst().equals(userId)) {
                                chatUserIds.removeFirst();
                            }
                            String receiverId = chatUserIds.getFirst();
                            User user =
                                    userRepository
                                            .findById(new ObjectId(receiverId))
                                            .orElseThrow(
                                                    () ->
                                                            new EntityNotFoundException(
                                                                    "User not found"));
                            UserActivity userActivity =
                                    userActivityRepository
                                            .findByUserId(user.getId().toHexString())
                                            .orElse(null);
                            ActivityStatus receiverStatus =
                                    userActivity != null
                                            ? userActivity.getActivityStatus()
                                            : ActivityStatus.OFFLINE;
                            return ChatResponse.builder()
                                    .chatId(chat.getId().toString())
                                    .receiverId(user.getId().toHexString())
                                    .receiverFullname(user.getFullname())
                                    .receiverUsername(user.getUsername())
                                    .receiverProfileImageUrl(user.getProfileImageUrl())
                                    .receiverStatus(receiverStatus)
                                    .build();
                        }))
                .collect(Collectors.toList());
    }
}
