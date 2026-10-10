package com.app.Hi5.service;

import com.app.Hi5.dto.enums.LikeStatus;
import com.app.Hi5.dto.enums.ReportStatus;
import com.app.Hi5.dto.response.CommentResponse;
import com.app.Hi5.exceptions.ActionNotAllowedException;
import com.app.Hi5.exceptions.EntityNotFoundException;
import com.app.Hi5.exceptions.UnauthorizedAccessException;
import com.app.Hi5.exceptions.ValidationException;
import com.app.Hi5.model.Comment;
import com.app.Hi5.model.Enum.CommentType;
import com.app.Hi5.model.Post;
import com.app.Hi5.model.Reel;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.CommentRepository;
import com.app.Hi5.repository.PostRepository;
import com.app.Hi5.repository.ReelRepository;
import com.app.Hi5.repository.UserRepository;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ReelRepository reelRepository;
    private final CommentRepository commentRepository;

    private final NotificationService notificationService;

    @Transactional
    public String makeComment(User user, String relevantId, CommentType type, String content) {
        switch (type) {
            case POST -> {
                Post post =
                        postRepository
                                .findById(new ObjectId(relevantId))
                                .orElseThrow(() -> new EntityNotFoundException("post not found."));
                if (post.getIsCommentsDisabled()) {
                    throw new ActionNotAllowedException("comment is disabled on this post");
                }
            }
            case REEL -> {
                Reel reel =
                        reelRepository
                                .findById(new ObjectId(relevantId))
                                .orElseThrow(() -> new EntityNotFoundException("reel not found."));
                if (reel.getIsCommentsDisabled()) {
                    throw new ActionNotAllowedException("comment is disabled on this post");
                }
            }
            default -> throw new ValidationException("Invalid Type");
        }
        Comment comment =
                Comment.builder()
                        .content(content)
                        .userId(user.getId().toHexString())
                        .relevantId(relevantId)
                        .type(type)
                        .build();
        Comment savedComment = commentRepository.save(comment);
        switch (type) {
            case POST -> {
                Post post = postRepository.findById(new ObjectId(relevantId)).get();
                post.getCommentIds().add(savedComment.getId().toHexString());
                postRepository.save(post);
            }
            case REEL -> {
                Reel reel = reelRepository.findById(new ObjectId(relevantId)).get();
                reel.getCommentIds().add(savedComment.getId().toHexString());
                reelRepository.save(reel);
            }
        }
        notificationService.makeCommentNotificationAndSend(user, relevantId, type);
        return "Comment created successfully!";
    }

    public List<CommentResponse> getCommentList(
            CommentType commentType, String relevantId, Integer page, Integer size, User user) {
        Page<Comment> commentPage =
                commentRepository.findByTypeAndRelevantId(
                        commentType,
                        relevantId,
                        PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return commentPage.getContent().stream()
                .map(
                        comment -> {
                            User commentUser =
                                    userRepository
                                            .findById(new ObjectId(comment.getUserId()))
                                            .orElse(null);
                            if (commentUser == null) {
                                return null;
                            }
                            return CommentResponse.builder()
                                    .id(comment.getId().toHexString())
                                    .relevantId(comment.getRelevantId())
                                    .type(comment.getType())
                                    .userId(comment.getUserId())
                                    .username(commentUser.getUsername())
                                    .fullname(commentUser.getFullname())
                                    .profilePictureUrl(commentUser.getProfileImageUrl())
                                    .content(comment.getContent())
                                    .createdAt(comment.getCreatedAt())
                                    .likesCount(comment.getLikedUserIds().size())
                                    .likeStatus(
                                            comment.getLikedUserIds()
                                                            .contains(user.getId().toHexString())
                                                    ? LikeStatus.LIKED
                                                    : LikeStatus.NOT_LIKED)
                                    .reportStatus(
                                            comment.getReportedUsersIds()
                                                            .contains(user.getId().toHexString())
                                                    ? ReportStatus.REPORTED
                                                    : ReportStatus.NOT_REPORTED)
                                    .build();
                        })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public void deleteComment(User user, String commentId) {
        if (!ObjectId.isValid(commentId)) {
            throw new ValidationException("Invalid comment id");
        }
        Comment comment =
                commentRepository
                        .findById(new ObjectId(commentId))
                        .orElseThrow(() -> new EntityNotFoundException("Comment not found."));
        if (comment.getType().equals(CommentType.POST)) {
            Post post =
                    postRepository
                            .findById(new ObjectId(comment.getRelevantId()))
                            .orElseThrow(() -> new EntityNotFoundException("Post not found"));
            if (!(comment.getUserId().equals(user.getId().toHexString())
                    || post.getUserId().equals(user.getId().toHexString()))) {
                throw new UnauthorizedAccessException(
                        "You are not authorized to delete this post.");
            }
            post.getCommentIds().remove(comment.getId().toHexString());
            postRepository.save(post);
        } else if (comment.getType().equals(CommentType.REEL)) {
            Reel reel =
                    reelRepository
                            .findById(new ObjectId(comment.getRelevantId()))
                            .orElseThrow(() -> new EntityNotFoundException("Reel not found"));
            if ((!comment.getUserId().equals(user.getId().toHexString()))
                    || reel.getUserId().equals(user.getId().toHexString())) {
                throw new UnauthorizedAccessException(
                        "You are not authorized to delete this reel.");
            }
            reel.getCommentIds().remove(comment.getId().toHexString());
            reelRepository.save(reel);
        } else {
            throw new ValidationException("Invalid Type");
        }
        commentRepository.delete(comment);
    }

    //    List<CommentResponseDTO> getComment(String postId, int page, int pageSize, User user);
    //
    //    void deleteComment(User user, String commentId) throws AccessDeniedException;
    //
    //    void likeComment(User user, String commentId);
    //
    //    void unlikeComment(User user, String commentId);

}
