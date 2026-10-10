package com.app.Hi5.controller;

import com.app.Hi5.dto.payload.HeartbeatPayload;
import com.app.Hi5.model.Enum.ActivityStatus;
import com.app.Hi5.model.Enum.Role;
import com.app.Hi5.model.User;
import com.app.Hi5.model.UserActivity;
import com.app.Hi5.repository.ChatRepository;
import com.app.Hi5.repository.UserActivityRepository;
import com.app.Hi5.repository.UserRepository;
import com.app.Hi5.service.UserActivityService;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class HeartbeatController {

    private final Map<String, ScheduledFuture<?>> activeUsers = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(10);
    private final ExecutorService virtualExecutor = Executors.newVirtualThreadPerTaskExecutor();
    private final UserActivityRepository userActivityRepository;
    private final UserActivityService userActivityService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    @MessageMapping("/heartbeat")
    public void handleHeartbeat(@Payload HeartbeatPayload heartbeatPayload) {
        String userId = heartbeatPayload.getUserId();
        if (validUser(userId)) {
            System.out.println("Heartbeat received from: " + userId);
            userActivityService.updateUserActivity(userId, ActivityStatus.ONLINE);
            sendPresenceUpdate(userId);
            if (activeUsers.containsKey(userId)) {
                activeUsers.get(userId).cancel(false);
            }
            ScheduledFuture<?> task =
                    scheduler.schedule(
                            () -> {
                                virtualExecutor.submit(
                                        () -> {
                                            System.out.println(
                                                    "No heartbeat from "
                                                            + userId
                                                            + ", disconnecting...");
                                            activeUsers.remove(userId);
                                            userActivityService.updateUserActivity(
                                                    userId, ActivityStatus.OFFLINE);
                                        });
                            },
                            12,
                            TimeUnit.SECONDS);
            activeUsers.put(userId, task);
        }
    }

    private boolean validUser(String userId) {
        Optional<User> optionalUser = userRepository.findById(new ObjectId(userId));
        if (optionalUser.isEmpty()) {
            return false;
        } else {
            User u = optionalUser.get();
            return u.getRole().equals(Role.USER);
        }
    }

    private void sendPresenceUpdate(String userId) {
        Map<String, ActivityStatus> activityStatusMap =
                chatRepository.findByChatUserIdsContaining(userId).stream()
                        .map(
                                (chat -> {
                                    List<String> chatUserIds = chat.getChatUserIds();
                                    if (chatUserIds.getFirst().equals(userId)) {
                                        chatUserIds.removeFirst();
                                    }
                                    String receiverId = chatUserIds.getFirst();
                                    UserActivity userActivity =
                                            userActivityRepository
                                                    .findByUserId(receiverId)
                                                    .orElse(null);
                                    ActivityStatus receiverStatus =
                                            userActivity != null
                                                    ? userActivity.getActivityStatus()
                                                    : ActivityStatus.OFFLINE;
                                    return Map.entry(receiverId, receiverStatus);
                                }))
                        .collect(
                                Collectors.toMap(
                                        Map.Entry::getKey,
                                        Map.Entry::getValue,
                                        (existing, replacement) -> replacement));
        simpMessagingTemplate.convertAndSend("/presence/" + userId, activityStatusMap);
    }
}
