package com.app.Hi5.service;

import com.app.Hi5.dto.enums.LikeStatus;
import com.app.Hi5.dto.enums.ReportStatus;
import com.app.Hi5.dto.enums.SaveStatus;
import com.app.Hi5.dto.response.LikedUserCardResponse;
import com.app.Hi5.dto.response.PostResponse;
import com.app.Hi5.exceptions.EntityNotFoundException;
import com.app.Hi5.exceptions.UnauthorizedAccessException;
import com.app.Hi5.exceptions.ValidationException;
import com.app.Hi5.model.Enum.LikeType;
import com.app.Hi5.model.Enum.SaveType;
import com.app.Hi5.model.Like;
import com.app.Hi5.model.Post;
import com.app.Hi5.model.Save;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.LikeRepository;
import com.app.Hi5.repository.PostRepository;
import com.app.Hi5.repository.SaveRepository;
import com.app.Hi5.repository.UserRepository;
import com.app.Hi5.utility.FileStorage;
import com.app.Hi5.utility.enums.FileType;
import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final FileStorage fileStorage;
    private final NotificationService notificationService;
    private final LikeRepository likeRepository;
    private final SaveRepository saveRepository;

    public String makePost(
            User user,
            String content,
            MultipartFile imageFile,
            MultipartFile videoFile,
            Boolean isPrivate,
            Boolean isCommentsDisabled) {
        Post post =
                Post.builder()
                        .content(content)
                        .userId(user.getId().toHexString())
                        .isPrivate(isPrivate)
                        .isCommentsDisabled(isCommentsDisabled)
                        .build();
        try {
            if (imageFile != null && !imageFile.isEmpty()) {
                String imageUrl = fileStorage.saveFile(imageFile, FileType.POST_IMAGE);
                post.setImageUrl(imageUrl);
            }
            if (videoFile != null && !videoFile.isEmpty()) {
                String videoUrl = fileStorage.saveFile(videoFile, FileType.POST_VIDEO);
                post.setVideoUrl(videoUrl);
            }
            log.info("Post to save: {}", post);
            Post savedPost = postRepository.save(post);
            user.getUserPostIds().add(savedPost.getId().toHexString());
            log.info("User to save post: {}", user);
            User savedUser = userRepository.save(user);
            log.info("saved User {}", savedUser);
            notificationService.makeNewPostSharedNotificationAndSend(user, savedPost);
            return "Post created successfully!";
        } catch (IOException e) {
            log.error("Error while saving files for post: {}", e.getMessage(), e);
            return "Failed to create post: " + e.getMessage();
        } catch (Exception ex) {
            log.error("Unexpected error while creating post: {}", ex.getMessage(), ex);
            return "An unexpected error occurred while creating the post.";
        }
    }

    public void deletePost(User user, String postId) {
        Post post =
                postRepository
                        .findById(new ObjectId(postId))
                        .orElseThrow(() -> new EntityNotFoundException("Post not found."));
        if (!post.getUserId().equals(user.getId().toHexString())) {
            throw new UnauthorizedAccessException("You are not authorized to delete this post.");
        }
        try {
            if (post.getImageUrl() != null) {
                fileStorage.deleteFile(post.getImageUrl());
            }
            if (post.getVideoUrl() != null) {
                fileStorage.deleteFile(post.getVideoUrl());
            }
        } catch (IOException e) {
            log.error("Error while saving files for post: {}", e.getMessage(), e);
        } catch (Exception ex) {
            log.error("Unexpected error while creating post: {}", ex.getMessage(), ex);
        }
        user.getUserPostIds().remove(post.getId().toHexString());
        userRepository.save(user);
        postRepository.delete(post);
    }

    public List<PostResponse> findRandomPosts(User user, int numberOfPosts) {
        List<Post> randomPosts = postRepository.findRandomPosts(numberOfPosts);
        return randomPosts.stream()
                .map(
                        post -> {
                            User postUser =
                                    userRepository
                                            .findById(new ObjectId(post.getUserId()))
                                            .orElse(null);
                            if (postUser == null) {
                                return null;
                            }
                            return PostResponse.builder()
                                    .id(post.getId().toHexString())
                                    .userId(post.getUserId())
                                    .content(post.getContent())
                                    .imageUrl(post.getImageUrl())
                                    .videoUrl(post.getVideoUrl())
                                    .createdAt(post.getCreatedAt())
                                    .likesCount(post.getLikedUserIds().size())
                                    .commentsCount(post.getCommentIds().size())
                                    .likeStatus(
                                            post.getLikedUserIds()
                                                            .contains(user.getId().toHexString())
                                                    ? LikeStatus.LIKED
                                                    : LikeStatus.NOT_LIKED)
                                    .reportStatus(
                                            post.getReportedUsersIds()
                                                            .contains(user.getId().toHexString())
                                                    ? ReportStatus.REPORTED
                                                    : ReportStatus.NOT_REPORTED)
                                    .saveStatus(
                                            post.getSavedUserIds()
                                                            .contains(user.getId().toHexString())
                                                    ? SaveStatus.SAVED
                                                    : SaveStatus.NOT_SAVED)
                                    .isPrivate(post.getIsPrivate())
                                    .isCommentsDisabled(post.getIsCommentsDisabled())
                                    .username(postUser.getUsername())
                                    .fullname(postUser.getFullname())
                                    .profilePictureUrl(postUser.getProfileImageUrl())
                                    .build();
                        })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public PostResponse findPost(String postId) {
        return postRepository
                .findById(new ObjectId(postId))
                .map(
                        post -> {
                            User postUser =
                                    userRepository
                                            .findById(new ObjectId(post.getUserId()))
                                            .orElseThrow(
                                                    () ->
                                                            new EntityNotFoundException(
                                                                    "User not found."));
                            if (!post.getIsPrivate()) {
                                return PostResponse.builder()
                                        .id(post.getId().toHexString())
                                        .userId(post.getUserId())
                                        .content(post.getContent())
                                        .imageUrl(post.getImageUrl())
                                        .videoUrl(post.getVideoUrl())
                                        .createdAt(post.getCreatedAt())
                                        .likesCount(post.getLikedUserIds().size())
                                        .commentsCount(post.getCommentIds().size())
                                        .likeStatus(LikeStatus.NOT_LIKED)
                                        .reportStatus(ReportStatus.NOT_REPORTED)
                                        .saveStatus(SaveStatus.NOT_SAVED)
                                        .isPrivate(post.getIsPrivate())
                                        .isCommentsDisabled(post.getIsCommentsDisabled())
                                        .username(postUser.getUsername())
                                        .fullname(postUser.getFullname())
                                        .profilePictureUrl(postUser.getProfileImageUrl())
                                        .build();
                            }
                            return null;
                        })
                .orElseThrow(() -> new EntityNotFoundException("Post not found."));
    }

    public PostResponse findPost(String postId, User user) {
        return postRepository
                .findById(new ObjectId(postId))
                .map(
                        post -> {
                            User postUser =
                                    userRepository
                                            .findById(new ObjectId(post.getUserId()))
                                            .orElseThrow(
                                                    () ->
                                                            new EntityNotFoundException(
                                                                    "User not found."));
                            if (!post.getIsPrivate()) {
                                return PostResponse.builder()
                                        .id(post.getId().toHexString())
                                        .userId(post.getUserId())
                                        .content(post.getContent())
                                        .imageUrl(post.getImageUrl())
                                        .videoUrl(post.getVideoUrl())
                                        .createdAt(post.getCreatedAt())
                                        .likesCount(post.getLikedUserIds().size())
                                        .commentsCount(post.getCommentIds().size())
                                        .likeStatus(
                                                post.getLikedUserIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? LikeStatus.LIKED
                                                        : LikeStatus.NOT_LIKED)
                                        .reportStatus(
                                                post.getReportedUsersIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? ReportStatus.REPORTED
                                                        : ReportStatus.NOT_REPORTED)
                                        .saveStatus(
                                                post.getSavedUserIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? SaveStatus.SAVED
                                                        : SaveStatus.NOT_SAVED)
                                        .isPrivate(post.getIsPrivate())
                                        .isCommentsDisabled(post.getIsCommentsDisabled())
                                        .username(postUser.getUsername())
                                        .fullname(postUser.getFullname())
                                        .profilePictureUrl(postUser.getProfileImageUrl())
                                        .build();
                            }
                            return null;
                        })
                .orElseThrow(() -> new EntityNotFoundException("Post not found."));
    }

    public List<PostResponse> findFollowigsPosts(User user, Integer size, Integer page) {
        Page<Post> posts =
                postRepository.findByUserIdInOrderByCreatedAtDesc(
                        user.getFollowingUserIds(), PageRequest.of(page, size));
        return posts.getContent().stream()
                .map(
                        post -> {
                            User postUser =
                                    userRepository
                                            .findById(new ObjectId(post.getUserId()))
                                            .orElse(null);
                            if (postUser == null) {
                                return null;
                            }
                            return PostResponse.builder()
                                    .id(post.getId().toHexString())
                                    .userId(post.getUserId())
                                    .content(post.getContent())
                                    .imageUrl(post.getImageUrl())
                                    .videoUrl(post.getVideoUrl())
                                    .createdAt(post.getCreatedAt())
                                    .likesCount(post.getLikedUserIds().size())
                                    .commentsCount(post.getCommentIds().size())
                                    .likeStatus(
                                            post.getLikedUserIds()
                                                            .contains(user.getId().toHexString())
                                                    ? LikeStatus.LIKED
                                                    : LikeStatus.NOT_LIKED)
                                    .reportStatus(
                                            post.getReportedUsersIds()
                                                            .contains(user.getId().toHexString())
                                                    ? ReportStatus.REPORTED
                                                    : ReportStatus.NOT_REPORTED)
                                    .saveStatus(
                                            post.getSavedUserIds()
                                                            .contains(user.getId().toHexString())
                                                    ? SaveStatus.SAVED
                                                    : SaveStatus.NOT_SAVED)
                                    .isPrivate(post.getIsPrivate())
                                    .isCommentsDisabled(post.getIsCommentsDisabled())
                                    .username(postUser.getUsername())
                                    .fullname(postUser.getFullname())
                                    .profilePictureUrl(postUser.getProfileImageUrl())
                                    .build();
                        })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public List<PostResponse> findUserPosts(String userId, Integer size, Integer page, User user) {
        if (!ObjectId.isValid(userId)) {
            throw new ValidationException("userId not valid");
        }
        if (userId.equals(user.getId().toHexString())
                || user.getFollowingUserIds().contains(userId)) {
            Page<Post> posts =
                    postRepository.findByUserIdInOrderByCreatedAtDesc(
                            Set.of(userId), PageRequest.of(page, size));
            return posts.getContent().stream()
                    .map(
                            post -> {
                                User postUser =
                                        userRepository
                                                .findById(new ObjectId(post.getUserId()))
                                                .orElse(null);
                                if (postUser == null) {
                                    return null;
                                }
                                return PostResponse.builder()
                                        .id(post.getId().toHexString())
                                        .userId(post.getUserId())
                                        .content(post.getContent())
                                        .imageUrl(post.getImageUrl())
                                        .videoUrl(post.getVideoUrl())
                                        .createdAt(post.getCreatedAt())
                                        .likesCount(post.getLikedUserIds().size())
                                        .commentsCount(post.getCommentIds().size())
                                        .likeStatus(
                                                post.getLikedUserIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? LikeStatus.LIKED
                                                        : LikeStatus.NOT_LIKED)
                                        .reportStatus(
                                                post.getReportedUsersIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? ReportStatus.REPORTED
                                                        : ReportStatus.NOT_REPORTED)
                                        .saveStatus(
                                                post.getSavedUserIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? SaveStatus.SAVED
                                                        : SaveStatus.NOT_SAVED)
                                        .isPrivate(post.getIsPrivate())
                                        .isCommentsDisabled(post.getIsCommentsDisabled())
                                        .username(postUser.getUsername())
                                        .fullname(postUser.getFullname())
                                        .profilePictureUrl(postUser.getProfileImageUrl())
                                        .build();
                            })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        } else {
            Page<Post> posts =
                    postRepository.findByUserIdInAndIsPrivateFalseOrderByCreatedAtDesc(
                            Set.of(userId), PageRequest.of(page, size));
            return posts.getContent().stream()
                    .map(
                            post -> {
                                User postUser =
                                        userRepository
                                                .findById(new ObjectId(post.getUserId()))
                                                .orElse(null);
                                if (postUser == null) {
                                    return null;
                                }
                                return PostResponse.builder()
                                        .id(post.getId().toHexString())
                                        .userId(post.getUserId())
                                        .content(post.getContent())
                                        .imageUrl(post.getImageUrl())
                                        .videoUrl(post.getVideoUrl())
                                        .createdAt(post.getCreatedAt())
                                        .likesCount(post.getLikedUserIds().size())
                                        .commentsCount(post.getCommentIds().size())
                                        .likeStatus(
                                                post.getLikedUserIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? LikeStatus.LIKED
                                                        : LikeStatus.NOT_LIKED)
                                        .reportStatus(
                                                post.getReportedUsersIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? ReportStatus.REPORTED
                                                        : ReportStatus.NOT_REPORTED)
                                        .saveStatus(
                                                post.getSavedUserIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? SaveStatus.SAVED
                                                        : SaveStatus.NOT_SAVED)
                                        .isPrivate(post.getIsPrivate())
                                        .isCommentsDisabled(post.getIsCommentsDisabled())
                                        .username(postUser.getUsername())
                                        .fullname(postUser.getFullname())
                                        .profilePictureUrl(postUser.getProfileImageUrl())
                                        .build();
                            })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        }
    }

    //    public List<PostResponse> findUserSavedPosts(Integer size, Integer page, User user) {
    //        Set<ObjectId> savedPostIds =
    // user.getSavedPostIds().stream().map(ObjectId::new).collect(Collectors.toSet());
    //        return postRepository.findByIdIn(savedPostIds, PageRequest.of(page,
    // size)).getContent().stream().map(post -> {
    //            User postUser = userRepository.findById(new
    // ObjectId(post.getUserId())).orElse(null);
    //            if (postUser == null) {
    //                return null;
    //            }
    //            return
    // PostResponse.builder().id(post.getId().toHexString()).userId(post.getUserId()).content(post.getContent()).imageUrl(post.getImageUrl()).videoUrl(post.getVideoUrl()).createdAt(post.getCreatedAt()).likesCount(post.getLikedUserIds().size()).commentsCount(post.getCommentIds().size()).likeStatus(post.getLikedUserIds().contains(user.getId().toHexString()) ? LikeStatus.LIKED : LikeStatus.NOT_LIKED).reportStatus(post.getReportedUsersIds().contains(user.getId().toHexString()) ? ReportStatus.REPORTED : ReportStatus.NOT_REPORTED).saveStatus(post.getSavedUserIds().contains(user.getId().toHexString()) ? SaveStatus.SAVED : SaveStatus.NOT_SAVED).isPrivate(post.getIsPrivate()).isCommentsDisabled(post.getIsCommentsDisabled()).username(postUser.getUsername()).fullname(postUser.getFullname()).profilePictureUrl(postUser.getProfileImageUrl()).build();
    //        }).filter(Objects::nonNull).collect(Collectors.toList());
    //    }

    public List<PostResponse> findUserSavedPosts(Integer size, Integer page, User user) {
        Page<Save> saves =
                saveRepository.findByUserIdAndSaveTypeAndIsSavedTrueOrderByCreatedAtDesc(
                        user.getId().toHexString(), SaveType.POST, PageRequest.of(page, size));
        return saves.getContent().stream()
                .map(
                        save -> {
                            Post post =
                                    postRepository
                                            .findById(new ObjectId(save.getRelevantId()))
                                            .orElse(null);
                            if (post == null) {
                                return null;
                            }
                            User postUser =
                                    userRepository
                                            .findById(new ObjectId(post.getUserId()))
                                            .orElse(null);
                            if (postUser == null) {
                                return null;
                            }
                            return PostResponse.builder()
                                    .id(post.getId().toHexString())
                                    .userId(post.getUserId())
                                    .content(post.getContent())
                                    .imageUrl(post.getImageUrl())
                                    .videoUrl(post.getVideoUrl())
                                    .createdAt(post.getCreatedAt())
                                    .likesCount(post.getLikedUserIds().size())
                                    .commentsCount(post.getCommentIds().size())
                                    .likeStatus(
                                            post.getLikedUserIds()
                                                            .contains(user.getId().toHexString())
                                                    ? LikeStatus.LIKED
                                                    : LikeStatus.NOT_LIKED)
                                    .reportStatus(
                                            post.getReportedUsersIds()
                                                            .contains(user.getId().toHexString())
                                                    ? ReportStatus.REPORTED
                                                    : ReportStatus.NOT_REPORTED)
                                    .saveStatus(
                                            post.getSavedUserIds()
                                                            .contains(user.getId().toHexString())
                                                    ? SaveStatus.SAVED
                                                    : SaveStatus.NOT_SAVED)
                                    .isPrivate(post.getIsPrivate())
                                    .isCommentsDisabled(post.getIsCommentsDisabled())
                                    .username(postUser.getUsername())
                                    .fullname(postUser.getFullname())
                                    .profilePictureUrl(postUser.getProfileImageUrl())
                                    .build();
                        })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    //    public List<UserCardResponse> findLikedUsers(String postId, Integer size, Integer page,
    // User user) {
    //        if (!ObjectId.isValid(postId)) {
    //            throw new ValidationException("postId not valid");
    //        }
    //        Post post = postRepository.findById(new ObjectId(postId)).orElseThrow(() -> new
    // EntityNotFoundException("post not found!"));
    //        Set<ObjectId> likedUserIds =
    // post.getLikedUserIds().stream().map(ObjectId::new).collect(Collectors.toSet());
    //        return userRepository.findByIdIn(likedUserIds, PageRequest.of(page,
    // size)).getContent().stream().map(u -> new UserCardResponse(u.getId().toHexString(),
    // u.getUsername(), u.getFullname(), u.getProfileImageUrl())).toList();
    //    }

    public List<LikedUserCardResponse> findLikedUsers(
            String postId, Integer size, Integer page, User user) {
        if (!ObjectId.isValid(postId)) {
            throw new ValidationException("postId not valid");
        }
        Page<Like> likes =
                likeRepository.findByRelevantIdAndLikeTypeAndIsLikedTrueOrderByCreatedAtDesc(
                        postId, LikeType.POST, PageRequest.of(page, size));
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
}
