package com.app.Hi5.service;

import com.app.Hi5.dto.response.ReportDetailResponse;
import com.app.Hi5.dto.response.ReportedCommentResponse;
import com.app.Hi5.dto.response.ReportedPostResponse;
import com.app.Hi5.dto.response.ReportedReelResponse;
import com.app.Hi5.dto.response.ReportedUserResponse;
import com.app.Hi5.exceptions.EntityNotFoundException;
import com.app.Hi5.model.Comment;
import com.app.Hi5.model.Enum.CommentType;
import com.app.Hi5.model.Enum.ReportReason;
import com.app.Hi5.model.Enum.ReportType;
import com.app.Hi5.model.Post;
import com.app.Hi5.model.Reel;
import com.app.Hi5.model.Report;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.CommentRepository;
import com.app.Hi5.repository.PostRepository;
import com.app.Hi5.repository.ReelRepository;
import com.app.Hi5.repository.ReportRepository;
import com.app.Hi5.repository.UserRepository;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ReelRepository reelRepository;
    private final CommentRepository commentRepository;

    public void reportPost(User user, String relevantId, ReportType type, ReportReason reason) {
        Report report =
                Report.builder()
                        .relevantId(relevantId)
                        .type(type)
                        .reportedUserId(user.getId().toHexString())
                        .reason(reason)
                        .build();
        switch (type) {
            case POST -> {
                Post post =
                        postRepository
                                .findById(new ObjectId(relevantId))
                                .orElseThrow(() -> new EntityNotFoundException("post not found."));
                post.getReportedUsersIds().add(user.getId().toHexString());
                postRepository.save(post);
            }
            case REEL -> {
                Reel reel =
                        reelRepository
                                .findById(new ObjectId(relevantId))
                                .orElseThrow(() -> new EntityNotFoundException("reel not found."));
                reel.getReportedUsersIds().add(user.getId().toHexString());
                reelRepository.save(reel);
            }
            case COMMENT -> {
                Comment comment =
                        commentRepository
                                .findById(new ObjectId(relevantId))
                                .orElseThrow(
                                        () -> new EntityNotFoundException("comment not found."));
                comment.getReportedUsersIds().add(user.getId().toHexString());
                commentRepository.save(comment);
            }
            default -> throw new EntityNotFoundException("relevantId not found.");
        }
        reportRepository.save(report);
    }

    public List<ReportedPostResponse> findReportedPostsForModeration(Integer page, Integer size) {
        int skip = page * size;
        return reportRepository.findReportCountsByType(ReportType.POST, skip, size).stream()
                .map(
                        data -> {
                            Post post =
                                    postRepository
                                            .findById(new ObjectId(data.getId()))
                                            .orElse(null);
                            if (post == null) {
                                return null;
                            }
                            User user =
                                    userRepository
                                            .findById(new ObjectId(post.getUserId()))
                                            .orElse(null);
                            if (user == null) {
                                return null;
                            }
                            return ReportedPostResponse.builder()
                                    .id(data.getId())
                                    .postId(post.getId().toHexString())
                                    .userId(post.getUserId())
                                    .content(post.getContent())
                                    .imageUrl(post.getImageUrl())
                                    .videoUrl(post.getVideoUrl())
                                    .createdAt(post.getCreatedAt())
                                    .likesCount(post.getLikedUserIds().size())
                                    .commentsCount(post.getCommentIds().size())
                                    .isPrivate(post.getIsPrivate())
                                    .isCommentsDisabled(post.getIsCommentsDisabled())
                                    .username(user.getUsername())
                                    .fullname(user.getFullname())
                                    .profilePictureUrl(user.getProfileImageUrl())
                                    .totalReportsCount(data.getReportCount())
                                    .banUntil(user.getBanUntil())
                                    .build();
                        })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public List<ReportedReelResponse> findReportedReelsForModeration(Integer page, Integer size) {
        int skip = page * size;
        return reportRepository.findReportCountsByType(ReportType.REEL, skip, size).stream()
                .map(
                        data -> {
                            Reel reel =
                                    reelRepository
                                            .findById(new ObjectId(data.getId()))
                                            .orElse(null);
                            if (reel == null) {
                                return null;
                            }
                            User user =
                                    userRepository
                                            .findById(new ObjectId(reel.getUserId()))
                                            .orElse(null);
                            if (user == null) {
                                return null;
                            }
                            return ReportedReelResponse.builder()
                                    .id(data.getId())
                                    .reelId(reel.getId().toHexString())
                                    .userId(reel.getUserId())
                                    .description(reel.getDescription())
                                    .videoUrl(reel.getVideoUrl())
                                    .createdAt(reel.getCreatedAt())
                                    .likesCount(reel.getLikedUserIds().size())
                                    .commentsCount(reel.getCommentIds().size())
                                    .isPrivate(reel.getIsPrivate())
                                    .isCommentsDisabled(reel.getIsCommentsDisabled())
                                    .username(user.getUsername())
                                    .fullname(user.getFullname())
                                    .profilePictureUrl(user.getProfileImageUrl())
                                    .totalReportsCount(data.getReportCount())
                                    .banUntil(user.getBanUntil())
                                    .build();
                        })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public List<ReportedCommentResponse> getReportedCommentsForModeration(
            Integer page, Integer size) {
        int skip = page * size;
        return reportRepository.findReportCountsByType(ReportType.COMMENT, skip, size).stream()
                .map(
                        data -> {
                            Comment comment =
                                    commentRepository
                                            .findById(new ObjectId(data.getId()))
                                            .orElse(null);
                            if (comment == null) {
                                return null;
                            }
                            User user =
                                    userRepository
                                            .findById(new ObjectId(comment.getUserId()))
                                            .orElse(null);
                            if (user == null) {
                                return null;
                            }
                            if (comment.getType() == CommentType.POST) {
                                Post post =
                                        postRepository
                                                .findById(new ObjectId(comment.getRelevantId()))
                                                .orElse(null);
                                if (post == null) {
                                    return null;
                                }
                                User postOwner =
                                        userRepository
                                                .findById(new ObjectId(post.getUserId()))
                                                .orElse(null);
                                if (postOwner == null) {
                                    return null;
                                }
                                ReportedCommentResponse.CommentTypePostResponse postResponse =
                                        ReportedCommentResponse.CommentTypePostResponse.builder()
                                                .id(data.getId())
                                                .postId(post.getId().toHexString())
                                                .userId(post.getUserId())
                                                .content(post.getContent())
                                                .imageUrl(post.getImageUrl())
                                                .videoUrl(post.getVideoUrl())
                                                .createdAt(post.getCreatedAt())
                                                .likesCount(post.getLikedUserIds().size())
                                                .commentsCount(post.getCommentIds().size())
                                                .isPrivate(post.getIsPrivate())
                                                .isCommentsDisabled(post.getIsCommentsDisabled())
                                                .username(postOwner.getUsername())
                                                .fullname(postOwner.getFullname())
                                                .profilePictureUrl(postOwner.getProfileImageUrl())
                                                .build();
                                return ReportedCommentResponse.builder()
                                        .id(data.getId())
                                        .commentId(comment.getId().toHexString())
                                        .relevantId(comment.getRelevantId())
                                        .type(comment.getType())
                                        .userId(comment.getUserId())
                                        .username(user.getUsername())
                                        .fullname(user.getFullname())
                                        .profilePictureUrl(user.getProfileImageUrl())
                                        .content(comment.getContent())
                                        .createdAt(comment.getCreatedAt())
                                        .likesCount(comment.getLikedUserIds().size())
                                        .postResponse(postResponse)
                                        .totalReportsCount(data.getReportCount())
                                        .banUntil(user.getBanUntil())
                                        .build();
                            } else if (comment.getType() == CommentType.REEL) {
                                Reel reel =
                                        reelRepository
                                                .findById(new ObjectId(comment.getRelevantId()))
                                                .orElse(null);
                                if (reel == null) {
                                    return null;
                                }
                                User reelOwner =
                                        userRepository
                                                .findById(new ObjectId(reel.getUserId()))
                                                .orElse(null);
                                if (reelOwner == null) {
                                    return null;
                                }
                                ReportedCommentResponse.CommentTypeReelResponse reelResponse =
                                        ReportedCommentResponse.CommentTypeReelResponse.builder()
                                                .id(data.getId())
                                                .reelId(reel.getId().toHexString())
                                                .userId(reel.getUserId())
                                                .description(reel.getDescription())
                                                .videoUrl(reel.getVideoUrl())
                                                .createdAt(reel.getCreatedAt())
                                                .likesCount(reel.getLikedUserIds().size())
                                                .commentsCount(reel.getCommentIds().size())
                                                .isPrivate(reel.getIsPrivate())
                                                .isCommentsDisabled(reel.getIsCommentsDisabled())
                                                .username(reelOwner.getUsername())
                                                .fullname(reelOwner.getFullname())
                                                .profilePictureUrl(reelOwner.getProfileImageUrl())
                                                .build();
                                return ReportedCommentResponse.builder()
                                        .id(data.getId())
                                        .commentId(comment.getId().toHexString())
                                        .relevantId(comment.getRelevantId())
                                        .type(comment.getType())
                                        .userId(comment.getUserId())
                                        .username(user.getUsername())
                                        .fullname(user.getFullname())
                                        .profilePictureUrl(user.getProfileImageUrl())
                                        .content(comment.getContent())
                                        .createdAt(comment.getCreatedAt())
                                        .likesCount(comment.getLikedUserIds().size())
                                        .reelResponse(reelResponse)
                                        .totalReportsCount(data.getReportCount())
                                        .banUntil(user.getBanUntil())
                                        .build();
                            } else {
                                return null;
                            }
                        })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public List<ReportDetailResponse> getReportCountsByTypeAndId(
            ReportType type, String relevantId) {
        return reportRepository.findReasonCountsByTypeAndRelevantId(type, relevantId).stream()
                .map(
                        data ->
                                ReportDetailResponse.builder()
                                        .reason(data.getReason())
                                        .count(data.getCount())
                                        .build())
                .toList();
    }

    public List<ReportedUserResponse> getReportedUsersByReason(
            ReportType type, String relevantId, ReportReason reason, Integer page, Integer size) {
        int skip = page * size;
        return reportRepository
                .findUsersByTypeRelevantAndReason(type, relevantId, reason, skip, size)
                .stream()
                .map(
                        reportData -> {
                            User user =
                                    userRepository
                                            .findById(new ObjectId(reportData.getUser()))
                                            .orElse(null);
                            if (user == null) {
                                return null;
                            }
                            return ReportedUserResponse.builder()
                                    .userId(user.getId().toHexString())
                                    .fullname(user.getFullname())
                                    .username(user.getUsername())
                                    .profilePictureUrl(user.getProfileImageUrl())
                                    .reportedAt(reportData.getReportedAt())
                                    .build();
                        })
                .collect(Collectors.toList());
    }

    public void deleteAllReports(String relevantId, ReportType type) {
        List<Report> reports = reportRepository.findByRelevantIdAndType(relevantId, type);
        switch (type) {
            case POST ->
                    reports.forEach(
                            report ->
                                    postRepository
                                            .findById(new ObjectId(relevantId))
                                            .ifPresent(
                                                    post -> {
                                                        post.getReportedUsersIds().clear();
                                                        postRepository.save(post);
                                                    }));
            case REEL ->
                    reports.forEach(
                            report ->
                                    reelRepository
                                            .findById(new ObjectId(relevantId))
                                            .ifPresent(
                                                    reel -> {
                                                        reel.getReportedUsersIds().clear();
                                                        reelRepository.save(reel);
                                                    }));
            case COMMENT ->
                    reports.forEach(
                            report ->
                                    commentRepository
                                            .findById(new ObjectId(relevantId))
                                            .ifPresent(
                                                    comment -> {
                                                        comment.getReportedUsersIds().clear();
                                                        commentRepository.save(comment);
                                                    }));
        }
        reportRepository.deleteAll(reports);
    }
}
