package com.app.Hi5.controller;

import com.app.Hi5.dto.request.BanUserRequest;
import com.app.Hi5.dto.request.NewModeratorAccountRequest;
import com.app.Hi5.dto.response.ModeratorUserCardResponse;
import com.app.Hi5.dto.response.ReportDetailResponse;
import com.app.Hi5.dto.response.ReportedCommentResponse;
import com.app.Hi5.dto.response.ReportedPostResponse;
import com.app.Hi5.dto.response.ReportedReelResponse;
import com.app.Hi5.dto.response.ReportedUserResponse;
import com.app.Hi5.dto.response.UserCardResponse;
import com.app.Hi5.exceptions.EntityNotFoundException;
import com.app.Hi5.exceptions.UnauthorizedAccessException;
import com.app.Hi5.exceptions.ValidationException;
import com.app.Hi5.model.Comment;
import com.app.Hi5.model.Enum.CommentType;
import com.app.Hi5.model.Enum.ReportReason;
import com.app.Hi5.model.Enum.ReportType;
import com.app.Hi5.model.Post;
import com.app.Hi5.model.Reel;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.CommentRepository;
import com.app.Hi5.repository.PostRepository;
import com.app.Hi5.repository.ReelRepository;
import com.app.Hi5.repository.UserRepository;
import com.app.Hi5.security.UserDetailsImpl;
import com.app.Hi5.service.ReportService;
import com.app.Hi5.service.UserService;
import com.app.Hi5.utility.FileStorage;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/moderate")
@RequiredArgsConstructor
public class ModerationController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final ReportService reportService;
    private final PostRepository postRepository;
    private final ReelRepository reelRepository;
    private final CommentRepository commentRepository;
    private final FileStorage fileStorage;

    @GetMapping("/user/search/{keyword}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<List<UserCardResponse>> getUsersByPrefix(
            @PathVariable("keyword") String keyword,
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<UserCardResponse> responses =
                userService.getUsersByKeywordForModeration(
                        keyword, page, size, userDetails.getUser());
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @PatchMapping("/user/{userId}/ban")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<String> banUser(
            @PathVariable("userId") String userId, @RequestBody BanUserRequest request) {
        userService.banUser(userId, request.getBanToDate());
        return new ResponseEntity<>("user banned", HttpStatus.OK);
    }

    @PatchMapping("/user/{userId}/unban")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<String> unbanUser(@PathVariable("userId") String userId) {
        userService.unbanUser(userId);
        return new ResponseEntity<>("user unbanned", HttpStatus.OK);
    }

    @DeleteMapping("/user/{userId}/delete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<String> deleteUser(@PathVariable("userId") String userId) {
        userService.deleteUserAccount(userId);
        return new ResponseEntity<>("user deleted", HttpStatus.OK);
    }

    @GetMapping("/moderator")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ModeratorUserCardResponse>> getModerators() {
        List<ModeratorUserCardResponse> responses = userService.getModerators();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @PostMapping("/moderator")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> addModerator(@RequestBody NewModeratorAccountRequest request) {
        userService.makeModeratorAccount(
                request.getEmail(), request.getUsername(), request.getPassword());
        return new ResponseEntity<>("moderator account created successfully", HttpStatus.OK);
    }

    @DeleteMapping("/moderator/{userId}/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteModerator(@PathVariable("userId") String userId) {
        userService.deleteModeratorAccount(userId);
        return new ResponseEntity<>("moderator deleted", HttpStatus.OK);
    }

    @GetMapping("/content/post")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public List<ReportedPostResponse> getReportedPosts(
            @RequestParam("page") Integer page, @RequestParam("size") Integer size) {
        return reportService.findReportedPostsForModeration(page, size);
    }

    @GetMapping("/content/reel")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public List<ReportedReelResponse> getReportedReels(
            @RequestParam("page") Integer page, @RequestParam("size") Integer size) {
        return reportService.findReportedReelsForModeration(page, size);
    }

    @GetMapping("/content/comment")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public List<ReportedCommentResponse> getReportedComments(
            @RequestParam("page") Integer page, @RequestParam("size") Integer size) {
        return reportService.getReportedCommentsForModeration(page, size);
    }

    @DeleteMapping("/content/report")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public String deleteAllReports(
            @RequestParam("reportType") ReportType type,
            @RequestParam("relevantId") String relevantId) {
        if (!ObjectId.isValid(relevantId)) {
            throw new ValidationException("Invalid id");
        }
        reportService.deleteAllReports(relevantId, type);
        return "all reports deleted";
    }

    @DeleteMapping("/content")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public String deleteEntity(
            @RequestParam("reportType") ReportType type,
            @RequestParam("relevantId") String relevantId) {
        if (!ObjectId.isValid(relevantId)) {
            throw new ValidationException("Invalid id");
        }
        switch (type) {
            case POST -> {
                Post post =
                        postRepository
                                .findById(new ObjectId(relevantId))
                                .orElseThrow(() -> new EntityNotFoundException("Post not found."));
                User user =
                        userRepository
                                .findById(new ObjectId(post.getUserId()))
                                .orElseThrow(() -> new EntityNotFoundException("User not found."));
                if (!post.getUserId().equals(user.getId().toHexString())) {
                    throw new UnauthorizedAccessException(
                            "You are not authorized to delete this post.");
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
            case REEL -> {
                Reel reel =
                        reelRepository
                                .findById(new ObjectId(relevantId))
                                .orElseThrow(() -> new EntityNotFoundException("Reel not found."));
                User user =
                        userRepository
                                .findById(new ObjectId(reel.getUserId()))
                                .orElseThrow(() -> new EntityNotFoundException("User not found."));
                if (!reel.getUserId().equals(user.getId().toHexString())) {
                    throw new UnauthorizedAccessException(
                            "You are not authorized to delete this post.");
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
            case COMMENT -> {
                Comment comment =
                        commentRepository
                                .findById(new ObjectId(relevantId))
                                .orElseThrow(
                                        () -> new EntityNotFoundException("Comment not found."));
                User user =
                        userRepository
                                .findById(new ObjectId(comment.getUserId()))
                                .orElseThrow(() -> new EntityNotFoundException("User not found."));
                if (comment.getType().equals(CommentType.POST)) {
                    Post post =
                            postRepository
                                    .findById(new ObjectId(comment.getRelevantId()))
                                    .orElseThrow(
                                            () -> new EntityNotFoundException("Post not found"));
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
                                    .orElseThrow(
                                            () -> new EntityNotFoundException("Reel not found"));
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
            default -> throw new ValidationException("Invalid Type");
        }
        return "entity deleted";
    }

    @GetMapping("/report-summary")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public List<ReportDetailResponse> getReportSummary(
            @RequestParam("reportType") ReportType type,
            @RequestParam("relevantId") String relevantId) {
        return reportService.getReportCountsByTypeAndId(type, relevantId);
    }

    @GetMapping("/report-users")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public List<ReportedUserResponse> getReportUsers(
            @RequestParam("reportType") ReportType type,
            @RequestParam("relevantId") String relevantId,
            @RequestParam("reportReason") ReportReason reason,
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size) {
        return reportService.getReportedUsersByReason(type, relevantId, reason, page, size);
    }
}
