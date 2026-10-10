package com.app.hi5.service;

import com.app.hi5.exceptions.EntityNotFoundException;
import com.app.hi5.exceptions.ValidationException;
import com.app.hi5.model.Comment;
import com.app.hi5.model.Like;
import com.app.hi5.model.Post;
import com.app.hi5.model.Reel;
import com.app.hi5.model.Story;
import com.app.hi5.model.User;
import com.app.hi5.model.enums.LikeType;
import com.app.hi5.repository.CommentRepository;
import com.app.hi5.repository.LikeRepository;
import com.app.hi5.repository.PostRepository;
import com.app.hi5.repository.ReelRepository;
import com.app.hi5.repository.StoryRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final ReelRepository reelRepository;
    private final CommentRepository commentRepository;
    private final StoryRepository storyRepository;
    private final NotificationService notificationService;

    public void like(User user, String relevantId, LikeType type) {
        switch (type) {
            case POST -> {
                Post post =
                        postRepository
                                .findById(new ObjectId(relevantId))
                                .orElseThrow(() -> new EntityNotFoundException("post not found."));
                post.getLikedUserIds().add(user.getId().toHexString());
                postRepository.save(post);
            }
            case REEL -> {
                Reel reel =
                        reelRepository
                                .findById(new ObjectId(relevantId))
                                .orElseThrow(() -> new EntityNotFoundException("reel not found."));
                reel.getLikedUserIds().add(user.getId().toHexString());
                reelRepository.save(reel);
            }
            case COMMENT -> {
                Comment comment =
                        commentRepository
                                .findById(new ObjectId(relevantId))
                                .orElseThrow(
                                        () -> new EntityNotFoundException("comment not found."));
                comment.getLikedUserIds().add(user.getId().toHexString());
                commentRepository.save(comment);
            }
            case STORY -> {
                Story story =
                        storyRepository
                                .findById(new ObjectId(relevantId))
                                .orElseThrow(() -> new EntityNotFoundException("story not found."));
                story.getLikedUserIds().add(user.getId().toHexString());
                storyRepository.save(story);
            }
            default -> throw new ValidationException("Invalid Type");
        }
        Optional<Like> optionalLike =
                likeRepository.findByUserIdAndRelevantIdAndLikeType(
                        user.getId().toHexString(), relevantId, type);
        boolean isFirstTimeLiked = optionalLike.isEmpty();
        Like like =
                optionalLike.orElse(
                        Like.builder()
                                .likeType(type)
                                .userId(user.getId().toHexString())
                                .relevantId(relevantId)
                                .build());
        like.setIsLiked(true);
        likeRepository.save(like);
        if (isFirstTimeLiked) {
            notificationService.makeLikeNotificationAndSend(user, relevantId, type);
        }
    }

    public void unlike(User user, String relevantId, LikeType type) {
        switch (type) {
            case POST -> {
                Post post =
                        postRepository
                                .findById(new ObjectId(relevantId))
                                .orElseThrow(() -> new EntityNotFoundException("post not found."));
                post.getLikedUserIds().remove(user.getId().toHexString());
                postRepository.save(post);
            }
            case REEL -> {
                Reel reel =
                        reelRepository
                                .findById(new ObjectId(relevantId))
                                .orElseThrow(() -> new EntityNotFoundException("reel not found."));
                reel.getLikedUserIds().remove(user.getId().toHexString());
                reelRepository.save(reel);
            }
            case COMMENT -> {
                Comment comment =
                        commentRepository
                                .findById(new ObjectId(relevantId))
                                .orElseThrow(
                                        () -> new EntityNotFoundException("comment not found."));
                comment.getLikedUserIds().remove(user.getId().toHexString());
                commentRepository.save(comment);
            }
            case STORY -> {
                Story story =
                        storyRepository
                                .findById(new ObjectId(relevantId))
                                .orElseThrow(() -> new EntityNotFoundException("story not found."));
                story.getLikedUserIds().remove(user.getId().toHexString());
                storyRepository.save(story);
            }
            default -> throw new ValidationException("Invalid Type");
        }
        Like like =
                likeRepository
                        .findByUserIdAndRelevantIdAndLikeType(
                                user.getId().toHexString(), relevantId, type)
                        .orElse(
                                Like.builder()
                                        .likeType(type)
                                        .userId(user.getId().toHexString())
                                        .relevantId(relevantId)
                                        .build());
        log.debug("Updating like status to false for: {}", like);
        like.setIsLiked(false);
        likeRepository.save(like);
    }
}
