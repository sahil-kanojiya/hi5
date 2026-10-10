package com.app.Hi5.service;

import com.app.Hi5.dto.enums.LikeStatus;
import com.app.Hi5.dto.response.LikedUserCardResponse;
import com.app.Hi5.dto.response.MyStoryResponse;
import com.app.Hi5.dto.response.NewStoryUserResponse;
import com.app.Hi5.dto.response.StoryResponse;
import com.app.Hi5.dto.response.ViewedUserCardResponse;
import com.app.Hi5.exceptions.EntityNotFoundException;
import com.app.Hi5.exceptions.UnauthorizedAccessException;
import com.app.Hi5.exceptions.ValidationException;
import com.app.Hi5.model.Enum.LikeType;
import com.app.Hi5.model.Like;
import com.app.Hi5.model.Story;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.LikeRepository;
import com.app.Hi5.repository.StoryRepository;
import com.app.Hi5.repository.UserRepository;
import com.app.Hi5.utility.FileStorage;
import com.app.Hi5.utility.enums.FileType;
import java.io.IOException;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;
    private final FileStorage fileStorage;
    private final NotificationService notificationService;
    private final LikeRepository likeRepository;

    public String makeStory(User user, MultipartFile imageFile, MultipartFile videoFile) {
        Story story = Story.builder().userId(user.getId().toHexString()).build();
        try {
            if (imageFile != null && !imageFile.isEmpty()) {
                String imageUrl = fileStorage.saveFile(imageFile, FileType.STORY_IMAGE);
                story.setImageUrl(imageUrl);
            }
            if (videoFile != null && !videoFile.isEmpty()) {
                String videoUrl = fileStorage.saveFile(videoFile, FileType.STORY_VIDEO);
                story.setVideoUrl(videoUrl);
            }
            Story savedStory = storyRepository.save(story);
            notificationService.makeNewStorySharedNotificationAndSend(user, savedStory);
            return "Story created successfully";
        } catch (IOException e) {
            log.error("Error while saving files for story: {}", e.getMessage(), e);
            return "Failed to create story: " + e.getMessage();
        } catch (Exception ex) {
            log.error("Unexpected error while creating story: {}", ex.getMessage(), ex);
            return "An unexpected error occurred while creating the story.";
        }
    }

    public void deleteStory(User user, String storyId) {
        Story story =
                storyRepository
                        .findById(new ObjectId(storyId))
                        .orElseThrow(() -> new EntityNotFoundException("Story not found."));
        if (!story.getUserId().equals(user.getId().toHexString())) {
            throw new UnauthorizedAccessException("You are not authorized to delete this post.");
        }
        try {
            if (story.getImageUrl() != null) {
                fileStorage.deleteFile(story.getImageUrl());
            }
            if (story.getVideoUrl() != null) {
                fileStorage.deleteFile(story.getVideoUrl());
            }
        } catch (IOException e) {
            log.error("Error while saving files for post: {}", e.getMessage(), e);
        } catch (Exception ex) {
            log.error("Unexpected error while creating post: {}", ex.getMessage(), ex);
        }
        storyRepository.delete(story);
    }

    public List<MyStoryResponse> getMyActiveStorys(User user) {
        Date now = new Date();
        Date last24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        List<Story> storiesFromLast24Hours =
                storyRepository.findStoriesFromLast24Hours(
                        user.getId().toHexString(),
                        last24Hours,
                        now,
                        Sort.by(Sort.Direction.ASC, "createdAt"));
        log.debug(
                "Found {} active stories for user {}",
                storiesFromLast24Hours.size(),
                user.getUsername());
        return storiesFromLast24Hours.stream()
                .map(
                        story ->
                                MyStoryResponse.builder()
                                        .id(story.getId().toHexString())
                                        .imageUrl(story.getImageUrl())
                                        .videoUrl(story.getVideoUrl())
                                        .createdAt(story.getCreatedAt())
                                        .likeCount(story.getLikedUserIds().size())
                                        .viewCount(story.getWatchedUserIds().size())
                                        .build())
                .collect(Collectors.toList());
    }

    public StoryResponse getMyFollowingsActiveStories(String userId, Integer index, User user) {
        if (!ObjectId.isValid(userId)) {
            throw new ValidationException("Invalid userId");
        }
        Date now = new Date();
        Date last24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        List<Story> stories =
                storyRepository.findStoriesFromLast24Hours(
                        userId, last24Hours, now, Sort.by(Sort.Direction.ASC, "createdAt"));
        if (stories.isEmpty() || index == null || index < 0 || index >= stories.size()) {
            throw new EntityNotFoundException("Story not found.");
        }
        Story story = stories.get(index);
        String userHexId = user.getId().toHexString();
        if (!story.getWatchedUserIds().contains(userHexId)) {
            story.getWatchedUserIds().add(userHexId);
            storyRepository.save(story);
        }
        return StoryResponse.builder()
                .id(story.getId().toHexString())
                .imageUrl(story.getImageUrl())
                .videoUrl(story.getVideoUrl())
                .likeStatus(
                        story.getLikedUserIds().contains(userHexId)
                                ? LikeStatus.LIKED
                                : LikeStatus.NOT_LIKED)
                .likeCount(story.getLikedUserIds().size())
                .build();
    }

    public List<NewStoryUserResponse> getNewStoryUsers(User user) {
        Date now = new Date();
        Date last24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        List<ObjectId> followingIds =
                user.getFollowingUserIds().stream().map(ObjectId::new).toList();
        List<User> followingUsers = userRepository.findAllById(followingIds);
        Map<String, User> userMap =
                followingUsers.stream()
                        .collect(Collectors.toMap(u -> u.getId().toHexString(), u -> u));
        return followingIds.stream()
                .map(
                        userId -> {
                            User followingUser = userMap.get(userId.toHexString());
                            if (followingUser == null) return null;
                            List<Story> stories =
                                    storyRepository.findStoriesFromLast24Hours(
                                            userId.toHexString(),
                                            last24Hours,
                                            now,
                                            Sort.by(Sort.Direction.ASC, "createdAt"));
                            if (stories.isEmpty()) return null;
                            long seenCount =
                                    stories.stream()
                                            .filter(
                                                    story ->
                                                            story.getLikedUserIds()
                                                                    .contains(
                                                                            user.getId()
                                                                                    .toHexString()))
                                            .count();
                            return NewStoryUserResponse.builder()
                                    .id(userId.toHexString())
                                    .fullname(followingUser.getFullname())
                                    .profilePictureUrl(followingUser.getProfileImageUrl())
                                    .totalStorys((long) stories.size())
                                    .totalSeenStorys(seenCount)
                                    .build();
                        })
                .filter(Objects::nonNull)
                .sorted(
                        Comparator.<NewStoryUserResponse>comparingLong(
                                        resp -> (resp.getTotalStorys() - resp.getTotalSeenStorys()))
                                .reversed())
                .toList();
    }

    public List<LikedUserCardResponse> findLikedUsers(
            String storyId, Integer size, Integer page, User user) {
        if (!ObjectId.isValid(storyId)) {
            throw new ValidationException("storyId not valid");
        }
        Page<Like> likes =
                likeRepository.findByRelevantIdAndLikeTypeAndIsLikedTrueOrderByCreatedAtDesc(
                        storyId, LikeType.STORY, PageRequest.of(page, size));
        return likes.getContent().stream()
                .map(
                        like -> {
                            User likedUser =
                                    userRepository
                                            .findById(new ObjectId(like.getUserId()))
                                            .orElse(null);
                            if (likedUser == null) {
                                return null;
                            }
                            return LikedUserCardResponse.builder()
                                    .id(likedUser.getId().toHexString())
                                    .username(likedUser.getUsername())
                                    .fullname(likedUser.getFullname())
                                    .profilePictureUrl(likedUser.getProfileImageUrl())
                                    .createdAt(like.getCreatedAt())
                                    .build();
                        })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public List<ViewedUserCardResponse> findViewedUsers(
            String storyId, Integer size, Integer page, User user) {
        if (!ObjectId.isValid(storyId)) {
            throw new ValidationException("storyId not valid");
        }
        Story story =
                storyRepository
                        .findById(new ObjectId(storyId))
                        .orElseThrow(() -> new EntityNotFoundException("Story not found."));
        return userRepository
                .findByIdIn(
                        story.getWatchedUserIds().stream()
                                .map(ObjectId::new)
                                .collect(Collectors.toSet()),
                        PageRequest.of(page, size))
                .get()
                .map(
                        (u) ->
                                ViewedUserCardResponse.builder()
                                        .id(u.getId().toHexString())
                                        .username(u.getUsername())
                                        .fullname(u.getFullname())
                                        .profilePictureUrl(u.getProfileImageUrl())
                                        .build())
                .collect(Collectors.toList());
    }
}
