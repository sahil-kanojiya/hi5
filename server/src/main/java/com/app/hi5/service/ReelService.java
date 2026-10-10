package com.app.hi5.service;

import com.app.hi5.dto.enums.FollowStatus;
import com.app.hi5.dto.enums.LikeStatus;
import com.app.hi5.dto.enums.ReportStatus;
import com.app.hi5.dto.enums.SaveStatus;
import com.app.hi5.dto.response.LikedUserCardResponse;
import com.app.hi5.dto.response.ReelResponse;
import com.app.hi5.exceptions.EntityNotFoundException;
import com.app.hi5.exceptions.UnauthorizedAccessException;
import com.app.hi5.exceptions.ValidationException;
import com.app.hi5.model.Like;
import com.app.hi5.model.Reel;
import com.app.hi5.model.Save;
import com.app.hi5.model.User;
import com.app.hi5.model.enums.LikeType;
import com.app.hi5.model.enums.SaveType;
import com.app.hi5.repository.LikeRepository;
import com.app.hi5.repository.ReelRepository;
import com.app.hi5.repository.SaveRepository;
import com.app.hi5.repository.UserRepository;
import com.app.hi5.utility.FileStorage;
import com.app.hi5.utility.Validator;
import com.app.hi5.utility.enums.FileType;
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
public class ReelService {

    private final UserRepository userRepository;
    private final ReelRepository reelRepository;
    private final FileStorage fileStorage;
    private final NotificationService notificationService;
    private final LikeRepository likeRepository;
    private final SaveRepository saveRepository;

    public String makeReel(
            User user,
            String description,
            MultipartFile videoFile,
            Long duration,
            Boolean isPrivate,
            Boolean isCommentsDisabled) {
        Reel reel =
                Reel.builder()
                        .description(description)
                        .userId(user.getId().toHexString())
                        .isPrivate(isPrivate)
                        .isCommentsDisabled(isCommentsDisabled)
                        .build();
        Validator.validateReelMultipartFileExists(videoFile);
        try {
            String videoUrl = fileStorage.saveFile(videoFile, FileType.REEL_VIDEO);
            reel.setVideoUrl(videoUrl);
            reel.setDuration(duration);
            Reel savedReel = reelRepository.save(reel);
            user.getUserReelIds().add(savedReel.getId().toHexString());
            userRepository.save(user);
            notificationService.makeNewReelSharedNotificationAndSend(user, savedReel);
            return "Reel created successfully!";
        } catch (IOException e) {
            log.error("Error while saving files for Reel: {}", e.getMessage(), e);
            return "Failed to create Reel: " + e.getMessage();
        } catch (Exception ex) {
            log.error("Unexpected error while creating Reel: {}", ex.getMessage(), ex);
            return "An unexpected error occurred while creating the reel.";
        }
    }

    public void deleteReel(User user, String postId) {
        Reel reel =
                reelRepository
                        .findById(new ObjectId(postId))
                        .orElseThrow(() -> new EntityNotFoundException("Reel not found."));
        if (!reel.getUserId().equals(user.getId().toHexString())) {
            throw new UnauthorizedAccessException("You are not authorized to delete this post.");
        }
        try {
            if (reel.getVideoUrl() != null) {
                fileStorage.deleteFile(reel.getVideoUrl());
            }
        } catch (IOException e) {
            log.error("Error while saving files for post: {}", e.getMessage(), e);
        } catch (Exception ex) {
            log.error("Unexpected error while creating post: {}", ex.getMessage(), ex);
        }
        user.getUserReelIds().remove(reel.getId().toHexString());
        userRepository.save(user);
        reelRepository.delete(reel);
    }

    public List<ReelResponse> findRandomReels(User user, int numberOfPosts) {
        List<Reel> randomReels = reelRepository.findRandomReels(numberOfPosts);
        return randomReels.stream()
                .map(
                        reel -> {
                            User reelUser =
                                    userRepository
                                            .findById(new ObjectId(reel.getUserId()))
                                            .orElse(null);
                            if (reelUser == null) {
                                return null;
                            }
                            return ReelResponse.builder()
                                    .id(reel.getId().toHexString())
                                    .description(reel.getDescription())
                                    .videoUrl(reel.getVideoUrl())
                                    .createdAt(reel.getCreatedAt())
                                    .likesCount(reel.getLikedUserIds().size())
                                    .commentsCount(reel.getCommentIds().size())
                                    .likeStatus(
                                            reel.getLikedUserIds()
                                                            .contains(user.getId().toHexString())
                                                    ? LikeStatus.LIKED
                                                    : LikeStatus.NOT_LIKED)
                                    .reportStatus(
                                            reel.getReportedUsersIds()
                                                            .contains(user.getId().toHexString())
                                                    ? ReportStatus.REPORTED
                                                    : ReportStatus.NOT_REPORTED)
                                    .saveStatus(
                                            reel.getSavedUserIds()
                                                            .contains(user.getId().toHexString())
                                                    ? SaveStatus.SAVED
                                                    : SaveStatus.NOT_SAVED)
                                    .isPrivate(reel.getIsPrivate())
                                    .isCommentsDisabled(reel.getIsCommentsDisabled())
                                    .userId(reel.getUserId())
                                    .username(reelUser.getUsername())
                                    .fullname(reelUser.getFullname())
                                    .profilePictureUrl(reelUser.getProfileImageUrl())
                                    .followStatus(
                                            reelUser.getFollowerUserIds()
                                                            .contains(user.getId().toHexString())
                                                    ? FollowStatus.FOLLOWED
                                                    : (reelUser.getFollowRequestReceivedUserIds()
                                                                    .contains(
                                                                            user.getId()
                                                                                    .toHexString())
                                                            ? FollowStatus.REQUEST_SENT
                                                            : FollowStatus.NOT_FOLLOWED))
                                    .build();
                        })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public ReelResponse findReel(String reelId) {
        return reelRepository
                .findById(new ObjectId(reelId))
                .map(
                        reel -> {
                            User reelUser =
                                    userRepository
                                            .findById(new ObjectId(reel.getUserId()))
                                            .orElseThrow(
                                                    () ->
                                                            new EntityNotFoundException(
                                                                    "User not found."));
                            if (!reel.getIsPrivate()) {
                                return ReelResponse.builder()
                                        .id(reel.getId().toHexString())
                                        .description(reel.getDescription())
                                        .videoUrl(reel.getVideoUrl())
                                        .createdAt(reel.getCreatedAt())
                                        .likesCount(reel.getLikedUserIds().size())
                                        .commentsCount(reel.getCommentIds().size())
                                        .likeStatus(LikeStatus.NOT_LIKED)
                                        .reportStatus(ReportStatus.NOT_REPORTED)
                                        .saveStatus(SaveStatus.NOT_SAVED)
                                        .isPrivate(reel.getIsPrivate())
                                        .isCommentsDisabled(reel.getIsCommentsDisabled())
                                        .userId(reel.getUserId())
                                        .username(reelUser.getUsername())
                                        .fullname(reelUser.getFullname())
                                        .profilePictureUrl(reelUser.getProfileImageUrl())
                                        .followStatus(FollowStatus.NOT_FOLLOWED)
                                        .build();
                            }
                            return null;
                        })
                .orElseThrow(() -> new EntityNotFoundException("Reel not found."));
    }

    public ReelResponse findReel(String reelId, User user) {
        return reelRepository
                .findById(new ObjectId(reelId))
                .map(
                        reel -> {
                            User reelUser =
                                    userRepository
                                            .findById(new ObjectId(reel.getUserId()))
                                            .orElseThrow(
                                                    () ->
                                                            new EntityNotFoundException(
                                                                    "User not found."));
                            if (!reel.getIsPrivate()) {
                                return ReelResponse.builder()
                                        .id(reel.getId().toHexString())
                                        .description(reel.getDescription())
                                        .videoUrl(reel.getVideoUrl())
                                        .createdAt(reel.getCreatedAt())
                                        .likesCount(reel.getLikedUserIds().size())
                                        .commentsCount(reel.getCommentIds().size())
                                        .likeStatus(
                                                reel.getLikedUserIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? LikeStatus.LIKED
                                                        : LikeStatus.NOT_LIKED)
                                        .reportStatus(
                                                reel.getReportedUsersIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? ReportStatus.REPORTED
                                                        : ReportStatus.NOT_REPORTED)
                                        .saveStatus(
                                                reel.getSavedUserIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? SaveStatus.SAVED
                                                        : SaveStatus.NOT_SAVED)
                                        .isPrivate(reel.getIsPrivate())
                                        .isCommentsDisabled(reel.getIsCommentsDisabled())
                                        .userId(reel.getUserId())
                                        .username(reelUser.getUsername())
                                        .fullname(reelUser.getFullname())
                                        .profilePictureUrl(reelUser.getProfileImageUrl())
                                        .followStatus(
                                                reelUser.getFollowerUserIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? FollowStatus.FOLLOWED
                                                        : (reelUser.getFollowRequestReceivedUserIds()
                                                                        .contains(
                                                                                user.getId()
                                                                                        .toHexString())
                                                                ? FollowStatus.REQUEST_SENT
                                                                : FollowStatus.NOT_FOLLOWED))
                                        .build();
                            }
                            return null;
                        })
                .orElseThrow(() -> new EntityNotFoundException("Reel not found."));
    }

    public List<ReelResponse> findUserReels(String userId, Integer size, Integer page, User user) {
        if (!ObjectId.isValid(userId)) {
            throw new ValidationException("userId not valid");
        }
        if (userId.equals(user.getId().toHexString())
                || user.getFollowingUserIds().contains(userId)) {
            Page<Reel> reels =
                    reelRepository.findByUserIdInOrderByCreatedAtDesc(
                            Set.of(userId), PageRequest.of(page, size));
            return reels.getContent().stream()
                    .map(
                            reel -> {
                                User reelUser =
                                        userRepository
                                                .findById(new ObjectId(reel.getUserId()))
                                                .orElseThrow(
                                                        () ->
                                                                new EntityNotFoundException(
                                                                        "User not found."));
                                if (reelUser == null) {
                                    return null;
                                }
                                return ReelResponse.builder()
                                        .id(reel.getId().toHexString())
                                        .description(reel.getDescription())
                                        .videoUrl(reel.getVideoUrl())
                                        .createdAt(reel.getCreatedAt())
                                        .likesCount(reel.getLikedUserIds().size())
                                        .commentsCount(reel.getCommentIds().size())
                                        .likeStatus(
                                                reel.getLikedUserIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? LikeStatus.LIKED
                                                        : LikeStatus.NOT_LIKED)
                                        .reportStatus(
                                                reel.getReportedUsersIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? ReportStatus.REPORTED
                                                        : ReportStatus.NOT_REPORTED)
                                        .saveStatus(
                                                reel.getSavedUserIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? SaveStatus.SAVED
                                                        : SaveStatus.NOT_SAVED)
                                        .isPrivate(reel.getIsPrivate())
                                        .isCommentsDisabled(reel.getIsCommentsDisabled())
                                        .userId(reel.getUserId())
                                        .username(reelUser.getUsername())
                                        .fullname(reelUser.getFullname())
                                        .profilePictureUrl(reelUser.getProfileImageUrl())
                                        .followStatus(
                                                reelUser.getFollowerUserIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? FollowStatus.FOLLOWED
                                                        : (reelUser.getFollowRequestReceivedUserIds()
                                                                        .contains(
                                                                                user.getId()
                                                                                        .toHexString())
                                                                ? FollowStatus.REQUEST_SENT
                                                                : FollowStatus.NOT_FOLLOWED))
                                        .build();
                            })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        } else {
            Page<Reel> reels =
                    reelRepository.findByUserIdInAndIsPrivateFalseOrderByCreatedAtDesc(
                            Set.of(userId), PageRequest.of(page, size));
            return reels.getContent().stream()
                    .map(
                            reel -> {
                                User reelUser =
                                        userRepository
                                                .findById(new ObjectId(reel.getUserId()))
                                                .orElseThrow(
                                                        () ->
                                                                new EntityNotFoundException(
                                                                        "User not found."));
                                if (reelUser == null) {
                                    return null;
                                }
                                return ReelResponse.builder()
                                        .id(reel.getId().toHexString())
                                        .description(reel.getDescription())
                                        .videoUrl(reel.getVideoUrl())
                                        .createdAt(reel.getCreatedAt())
                                        .likesCount(reel.getLikedUserIds().size())
                                        .commentsCount(reel.getCommentIds().size())
                                        .likeStatus(
                                                reel.getLikedUserIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? LikeStatus.LIKED
                                                        : LikeStatus.NOT_LIKED)
                                        .reportStatus(
                                                reel.getReportedUsersIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? ReportStatus.REPORTED
                                                        : ReportStatus.NOT_REPORTED)
                                        .saveStatus(
                                                reel.getSavedUserIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? SaveStatus.SAVED
                                                        : SaveStatus.NOT_SAVED)
                                        .isPrivate(reel.getIsPrivate())
                                        .isCommentsDisabled(reel.getIsCommentsDisabled())
                                        .userId(reel.getUserId())
                                        .username(reelUser.getUsername())
                                        .fullname(reelUser.getFullname())
                                        .profilePictureUrl(reelUser.getProfileImageUrl())
                                        .followStatus(
                                                reelUser.getFollowerUserIds()
                                                                .contains(
                                                                        user.getId().toHexString())
                                                        ? FollowStatus.FOLLOWED
                                                        : (reelUser.getFollowRequestReceivedUserIds()
                                                                        .contains(
                                                                                user.getId()
                                                                                        .toHexString())
                                                                ? FollowStatus.REQUEST_SENT
                                                                : FollowStatus.NOT_FOLLOWED))
                                        .build();
                            })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        }
    }

    //    public List<ReelResponse> findUserSavedReels(Integer size, Integer page, User user) {
    //        Set<ObjectId> savedIds =
    // user.getSavedReelsIds().stream().map(ObjectId::new).collect(Collectors.toSet());
    //        return reelRepository.findByIdIn(savedIds, PageRequest.of(page,
    // size)).getContent().stream().map(reel -> {
    //            User reelUser = userRepository.findById(new
    // ObjectId(reel.getUserId())).orElseThrow(() -> new EntityNotFoundException("User not
    // found."));
    //            if (!reel.getIsPrivate()) {
    //                return
    // ReelResponse.builder().id(reel.getId().toHexString()).description(reel.getDescription()).thumbnailUrl(reel.getThumbnailUrl()).videoUrl(reel.getVideoUrl()).createdAt(reel.getCreatedAt()).likesCount(reel.getLikedUserIds().size()).commentsCount(reel.getCommentIds().size()).likeStatus(reel.getLikedUserIds().contains(user.getId().toHexString()) ? LikeStatus.LIKED : LikeStatus.NOT_LIKED).reportStatus(reel.getReportedUsersIds().contains(user.getId().toHexString()) ? ReportStatus.REPORTED : ReportStatus.NOT_REPORTED).saveStatus(reel.getSavedUserIds().contains(user.getId().toHexString()) ? SaveStatus.SAVED : SaveStatus.NOT_SAVED).isPrivate(reel.getIsPrivate()).isCommentsDisabled(reel.getIsCommentsDisabled()).userId(reel.getUserId()).username(reelUser.getUsername()).fullname(reelUser.getFullname()).profilePictureUrl(reelUser.getProfileImageUrl()).followStatus(reelUser.getFollowerUserIds().contains(user.getId().toHexString()) ? FollowStatus.FOLLOWED : (reelUser.getFollowRequestReceivedUserIds().contains(user.getId().toHexString()) ? FollowStatus.REQUEST_SENT : FollowStatus.NOT_FOLLOWED)).build();
    //            }
    //            return null;
    //        }).filter(Objects::nonNull).collect(Collectors.toList());
    //    }

    public List<ReelResponse> findUserSavedReels(Integer size, Integer page, User user) {
        Page<Save> saves =
                saveRepository.findByUserIdAndSaveTypeAndIsSavedTrueOrderByCreatedAtDesc(
                        user.getId().toHexString(), SaveType.REEL, PageRequest.of(page, size));
        return saves.getContent().stream()
                .map(
                        save -> {
                            Reel reel =
                                    reelRepository
                                            .findById(new ObjectId(save.getRelevantId()))
                                            .orElse(null);
                            if (reel == null) {
                                return null;
                            }
                            User reelUser =
                                    userRepository
                                            .findById(new ObjectId(reel.getUserId()))
                                            .orElse(null);
                            if (reelUser == null) {
                                return null;
                            }
                            return ReelResponse.builder()
                                    .id(reel.getId().toHexString())
                                    .description(reel.getDescription())
                                    .videoUrl(reel.getVideoUrl())
                                    .createdAt(reel.getCreatedAt())
                                    .likesCount(reel.getLikedUserIds().size())
                                    .commentsCount(reel.getCommentIds().size())
                                    .likeStatus(
                                            reel.getLikedUserIds()
                                                            .contains(user.getId().toHexString())
                                                    ? LikeStatus.LIKED
                                                    : LikeStatus.NOT_LIKED)
                                    .reportStatus(
                                            reel.getReportedUsersIds()
                                                            .contains(user.getId().toHexString())
                                                    ? ReportStatus.REPORTED
                                                    : ReportStatus.NOT_REPORTED)
                                    .saveStatus(
                                            reel.getSavedUserIds()
                                                            .contains(user.getId().toHexString())
                                                    ? SaveStatus.SAVED
                                                    : SaveStatus.NOT_SAVED)
                                    .isPrivate(reel.getIsPrivate())
                                    .isCommentsDisabled(reel.getIsCommentsDisabled())
                                    .userId(reel.getUserId())
                                    .username(reelUser.getUsername())
                                    .fullname(reelUser.getFullname())
                                    .profilePictureUrl(reelUser.getProfileImageUrl())
                                    .followStatus(
                                            reelUser.getFollowerUserIds()
                                                            .contains(user.getId().toHexString())
                                                    ? FollowStatus.FOLLOWED
                                                    : (reelUser.getFollowRequestReceivedUserIds()
                                                                    .contains(
                                                                            user.getId()
                                                                                    .toHexString())
                                                            ? FollowStatus.REQUEST_SENT
                                                            : FollowStatus.NOT_FOLLOWED))
                                    .build();
                        })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    //    public List<UserCardResponse> findLikedUsers(String reelId, Integer size, Integer page,
    // User user) {
    //        if (!ObjectId.isValid(reelId)) {
    //            throw new ValidationException("reelId not valid");
    //        }
    //        Reel reel = reelRepository.findById(new ObjectId(reelId)).orElseThrow(() -> new
    // EntityNotFoundException("reel not found!"));
    //        Set<ObjectId> likedUserIds =
    // reel.getLikedUserIds().stream().map(ObjectId::new).collect(Collectors.toSet());
    //        return userRepository.findByIdIn(likedUserIds, PageRequest.of(page,
    // size)).getContent().stream().map(u -> new UserCardResponse(u.getId().toHexString(),
    // u.getUsername(), u.getFullname(), u.getProfileImageUrl())).toList();
    //    }

    public List<LikedUserCardResponse> findLikedUsers(
            String reelId, Integer size, Integer page, User user) {
        if (!ObjectId.isValid(reelId)) {
            throw new ValidationException("reelId not valid");
        }
        Page<Like> likes =
                likeRepository.findByRelevantIdAndLikeTypeAndIsLikedTrueOrderByCreatedAtDesc(
                        reelId, LikeType.REEL, PageRequest.of(page, size));
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
