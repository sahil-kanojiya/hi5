package com.app.hi5.service;

import com.app.hi5.exceptions.EntityNotFoundException;
import com.app.hi5.exceptions.ValidationException;
import com.app.hi5.model.Post;
import com.app.hi5.model.Reel;
import com.app.hi5.model.Save;
import com.app.hi5.model.User;
import com.app.hi5.model.enums.SaveType;
import com.app.hi5.repository.PostRepository;
import com.app.hi5.repository.ReelRepository;
import com.app.hi5.repository.SaveRepository;
import com.app.hi5.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SaveService {

    private final SaveRepository saveRepository;
    private final PostRepository postRepository;
    private final ReelRepository reelRepository;
    private final UserRepository userRepository;

    public void save(User user, String relevantId, SaveType type) {
        switch (type) {
            case POST ->
                    postRepository
                            .findById(new ObjectId(relevantId))
                            .orElseThrow(() -> new EntityNotFoundException("post not found."));
            case REEL ->
                    reelRepository
                            .findById(new ObjectId(relevantId))
                            .orElseThrow(() -> new EntityNotFoundException("reel not found."));
            default -> throw new ValidationException("Invalid Type");
        }

        Save save =
                saveRepository
                        .findByUserIdAndRelevantIdAndSaveType(
                                user.getId().toHexString(), relevantId, type)
                        .orElse(
                                Save.builder()
                                        .saveType(type)
                                        .userId(user.getId().toHexString())
                                        .relevantId(relevantId)
                                        .build());
        save.setIsSaved(true);
        saveRepository.save(save);

        switch (type) {
            case POST -> {
                Post post = postRepository.findById(new ObjectId(relevantId)).get();
                user.getSavedPostIds().add(post.getId().toHexString());
                post.getSavedUserIds().add(user.getId().toHexString());
                postRepository.save(post);
                userRepository.save(user);
            }
            case REEL -> {
                Reel reel = reelRepository.findById(new ObjectId(relevantId)).get();
                user.getSavedReelsIds().add(reel.getId().toHexString());
                reel.getSavedUserIds().add(user.getId().toHexString());
                reelRepository.save(reel);
                userRepository.save(user);
            }
        }
    }

    public void remove(User user, String relevantId, SaveType type) {
        switch (type) {
            case POST ->
                    postRepository
                            .findById(new ObjectId(relevantId))
                            .orElseThrow(() -> new EntityNotFoundException("post not found."));
            case REEL ->
                    reelRepository
                            .findById(new ObjectId(relevantId))
                            .orElseThrow(() -> new EntityNotFoundException("reel not found."));
            default -> throw new ValidationException("Invalid Type");
        }

        Save save =
                saveRepository
                        .findByUserIdAndRelevantIdAndSaveType(
                                user.getId().toHexString(), relevantId, type)
                        .orElse(
                                Save.builder()
                                        .saveType(type)
                                        .userId(user.getId().toHexString())
                                        .relevantId(relevantId)
                                        .build());
        save.setIsSaved(false);
        saveRepository.save(save);

        switch (type) {
            case POST -> {
                Post post = postRepository.findById(new ObjectId(relevantId)).get();
                user.getSavedPostIds().remove(post.getId().toHexString());
                post.getSavedUserIds().remove(user.getId().toHexString());
                postRepository.save(post);
                userRepository.save(user);
            }
            case REEL -> {
                Reel reel = reelRepository.findById(new ObjectId(relevantId)).get();
                user.getSavedReelsIds().remove(reel.getId().toHexString());
                reel.getSavedUserIds().remove(user.getId().toHexString());
                reelRepository.save(reel);
                userRepository.save(user);
            }
        }
    }
}
