package com.app.Hi5.service;

import com.app.Hi5.dto.enums.FollowStatus;
import com.app.Hi5.dto.payload.NotificationPayload;
import com.app.Hi5.dto.response.NotificationResponse;
import com.app.Hi5.model.*;
import com.app.Hi5.model.Enum.CommentType;
import com.app.Hi5.model.Enum.LikeType;
import com.app.Hi5.model.Enum.NotificationType;
import com.app.Hi5.repository.*;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ReelRepository reelRepository;
    private final CommentRepository commentRepository;
    private final StoryRepository storyRepository;
    private final NotificationRepository notificationRepository;

    @Async
    public void makeNewPostSharedNotificationAndSend(User user, Post newPost) {
        user.getFollowerUserIds()
                .forEach(
                        userId -> {
                            Optional<User> optionalUser =
                                    userRepository.findById(new ObjectId(userId));
                            if (optionalUser.isPresent()) {
                                User u = optionalUser.get();
                                Notification notification = new Notification();
                                notification.setNotificationUserId(userId);
                                notification.setType(NotificationType.NETWORK_NEW_POST);
                                notification.setRelevantId(newPost.getId().toHexString());
                                notification.setUserId(user.getId().toHexString());
                                if (u.getIsAllowedNetworkPostNotification()) {
                                    Notification savedNotification =
                                            notificationRepository.save(notification);
                                    sendNotification(
                                            notification.getNotificationUserId(),
                                            NotificationPayload.convertToPayload(
                                                    savedNotification, u));
                                }
                            }
                        });
    }

    @Async
    public void makeNewReelSharedNotificationAndSend(User user, Reel newReel) {
        user.getFollowerUserIds()
                .forEach(
                        userId -> {
                            Optional<User> optionalUser =
                                    userRepository.findById(new ObjectId(userId));
                            if (optionalUser.isPresent()) {
                                User u = optionalUser.get();
                                Notification notification = new Notification();
                                notification.setNotificationUserId(userId);
                                notification.setType(NotificationType.NETWORK_NEW_REEL);
                                notification.setRelevantId(newReel.getId().toHexString());
                                notification.setUserId(user.getId().toHexString());
                                if (u.getIsAllowedNetworkReelNotification()) {
                                    Notification savedNotification =
                                            notificationRepository.save(notification);
                                    sendNotification(
                                            notification.getNotificationUserId(),
                                            NotificationPayload.convertToPayload(
                                                    savedNotification, u));
                                }
                            }
                        });
    }

    @Async
    public void makeNewStorySharedNotificationAndSend(User user, Story newStory) {
        user.getFollowerUserIds()
                .forEach(
                        userId -> {
                            Optional<User> optionalUser =
                                    userRepository.findById(new ObjectId(userId));
                            if (optionalUser.isPresent()) {
                                User u = optionalUser.get();
                                Notification notification = new Notification();
                                notification.setNotificationUserId(userId);
                                notification.setType(NotificationType.NETWORK_NEW_STORY);
                                notification.setRelevantId(newStory.getId().toHexString());
                                notification.setUserId(user.getId().toHexString());
                                if (u.getIsAllowedNetworkStoryNotification()) {
                                    Notification savedNotification =
                                            notificationRepository.save(notification);
                                    sendNotification(
                                            notification.getNotificationUserId(),
                                            NotificationPayload.convertToPayload(
                                                    savedNotification, u));
                                }
                            }
                        });
    }

    @Async
    public void makeLikeNotificationAndSend(User user, String relevantId, LikeType type) {
        Notification notification = new Notification();
        switch (type) {
            case POST -> {
                Post post = postRepository.findById(new ObjectId(relevantId)).get();
                notification.setNotificationUserId(post.getUserId());
                notification.setType(NotificationType.LIKE_POST);
                notification.setRelevantId(post.getId().toHexString());
            }
            case REEL -> {
                Reel reel = reelRepository.findById(new ObjectId(relevantId)).get();
                notification.setNotificationUserId(reel.getUserId());
                notification.setType(NotificationType.LIKE_REEL);
                notification.setRelevantId(reel.getId().toHexString());
            }
            case COMMENT -> {
                Comment comment = commentRepository.findById(new ObjectId(relevantId)).get();
                notification.setNotificationUserId(comment.getUserId());
                notification.setType(NotificationType.LIKE_COMMENT);
                notification.setRelevantId(comment.getId().toHexString());
            }
            case STORY -> {
                Story story = storyRepository.findById(new ObjectId(relevantId)).get();
                notification.setNotificationUserId(story.getUserId());
                notification.setType(NotificationType.LIKE_STORY);
                notification.setRelevantId(story.getId().toHexString());
            }
        }
        notification.setUserId(user.getId().toHexString());
        if (notification.getNotificationUserId().equals(notification.getUserId())) {
            return;
        }
        Optional<User> optionalUser =
                userRepository.findById(new ObjectId(notification.getNotificationUserId()));
        if (optionalUser.isPresent()) {
            User notificationUser = optionalUser.get();
            if ((notification.getType().equals(NotificationType.LIKE_POST)
                            && notificationUser.getIsAllowedPostsLikeNotification())
                    || (notification.getType().equals(NotificationType.LIKE_REEL)
                            && notificationUser.getIsAllowedReelsLikeNotification())
                    || (notification.getType().equals(NotificationType.LIKE_STORY)
                            && notificationUser.getIsAllowedStorysLikeNotification())
                    || (notification.getType().equals(NotificationType.LIKE_COMMENT)
                            && notificationUser.getIsAllowedCommentsLikeNotification())) {
                Notification savedNotification = notificationRepository.save(notification);
                sendNotification(
                        notification.getNotificationUserId(),
                        NotificationPayload.convertToPayload(savedNotification, user));
            }
        }
    }

    @Async
    public void makeCommentNotificationAndSend(User user, String relevantId, CommentType type) {
        Notification notification = new Notification();
        switch (type) {
            case POST -> {
                Post post = postRepository.findById(new ObjectId(relevantId)).get();
                notification.setNotificationUserId(post.getUserId());
                notification.setType(NotificationType.COMMENT_POST);
                notification.setRelevantId(post.getId().toHexString());
            }
            case REEL -> {
                Reel reel = reelRepository.findById(new ObjectId(relevantId)).get();
                notification.setNotificationUserId(reel.getUserId());
                notification.setType(NotificationType.COMMENT_REEL);
                notification.setRelevantId(reel.getId().toHexString());
            }
        }
        notification.setUserId(user.getId().toHexString());
        if (notification.getNotificationUserId().equals(notification.getUserId())) {
            return;
        }
        Optional<User> optionalUser =
                userRepository.findById(new ObjectId(notification.getNotificationUserId()));
        if (optionalUser.isPresent()) {
            User notificationUser = optionalUser.get();
            if (!notificationRepository.existsByNotificationUserIdAndUserIdAndRelevantIdAndType(
                    notification.getNotificationUserId(),
                    notification.getUserId(),
                    notification.getRelevantId(),
                    notification.getType())) {
                if ((notification.getType().equals(NotificationType.COMMENT_POST)
                                && notificationUser.getIsAllowedPostsCommentNotification())
                        || (notification.getType().equals(NotificationType.COMMENT_REEL)
                                && notificationUser.getIsAllowedReelsCommentNotification())) {
                    Notification savedNotification = notificationRepository.save(notification);
                    sendNotification(
                            notification.getNotificationUserId(),
                            NotificationPayload.convertToPayload(savedNotification, user));
                }
            }
        }
    }

    @Async
    public void makeFollowNotificationAndSend(
            User user, User userToFollow, FollowStatus followStatus) {
        Notification notification = new Notification();
        notification.setNotificationUserId(userToFollow.getId().toHexString());
        switch (followStatus) {
            case FOLLOWED -> notification.setType(NotificationType.FOLLOW);
            case REQUEST_SENT -> notification.setType(NotificationType.FOLLOW_REQUEST);
        }
        notification.setRelevantId(user.getId().toHexString());
        notification.setUserId(user.getId().toHexString());

        if (!notificationRepository.existsByNotificationUserIdAndUserIdAndRelevantIdAndType(
                notification.getNotificationUserId(),
                notification.getUserId(),
                notification.getRelevantId(),
                notification.getType())) {
            if ((followStatus.equals(FollowStatus.FOLLOWED)
                            && userToFollow.getIsAllowedUsersFollowNotification())
                    || (followStatus.equals(FollowStatus.REQUEST_SENT)
                            && userToFollow.getIsAllowedUsersFollowRequestNotification())) {
                Notification savedNotification = notificationRepository.save(notification);
                sendNotification(
                        notification.getNotificationUserId(),
                        NotificationPayload.convertToPayload(savedNotification, user));
            }
        }
    }

    @Async
    public void makeFollowReqAcceptedNotificationAndSend(User requestedUser, User followedUser) {
        Notification notification = new Notification();
        notification.setNotificationUserId(requestedUser.getId().toHexString());
        notification.setType(NotificationType.FOLLOW_REQUEST_ACCEPT);
        notification.setRelevantId(followedUser.getId().toHexString());
        notification.setUserId(followedUser.getId().toHexString());
        if (!notificationRepository.existsByNotificationUserIdAndUserIdAndRelevantIdAndType(
                notification.getNotificationUserId(),
                notification.getUserId(),
                notification.getRelevantId(),
                notification.getType())) {
            if (requestedUser.getIsAllowedUsersFollowNotification()) {
                Notification savedNotification = notificationRepository.save(notification);
                sendNotification(
                        notification.getNotificationUserId(),
                        NotificationPayload.convertToPayload(savedNotification, followedUser));
            }
        }
    }

    void sendNotification(String userId, NotificationPayload notification) {
        log.info("Sending notification to userId: {}, message: {}", userId, notification);
        messagingTemplate.convertAndSend("/notification/" + userId, notification);
    }

    public List<NotificationResponse> getNotificationList(Integer page, Integer size, User user) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notificationPage =
                notificationRepository.findByNotificationUserIdOrderByCreatedAtDesc(
                        user.getId().toHexString(), pageable);
        return notificationPage.stream()
                .map(
                        notification -> {
                            User u =
                                    userRepository
                                            .findById(new ObjectId(notification.getUserId()))
                                            .orElse(null);
                            if (u != null) {
                                return NotificationResponse.builder()
                                        .id(notification.getId().toHexString())
                                        .notificationUserId(notification.getNotificationUserId())
                                        .userId(notification.getUserId())
                                        .type(notification.getType())
                                        .relevantId(notification.getRelevantId())
                                        .createdAt(notification.getCreatedAt())
                                        .username(u.getUsername())
                                        .fullname(u.getFullname())
                                        .profilePictureUrl(u.getProfileImageUrl())
                                        .build();
                            }
                            return null;
                        })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public void deleteAllNotifications(String notificationUserId) {
        notificationRepository.deleteByNotificationUserId(notificationUserId);
    }
}
