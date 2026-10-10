package com.app.Hi5.repository;

import com.app.Hi5.model.Enum.LikeType;
import com.app.Hi5.model.Like;
import java.util.Optional;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LikeRepository extends MongoRepository<Like, ObjectId> {

    Optional<Like> findByUserIdAndRelevantIdAndLikeType(
            String userId, String relevantId, LikeType liketype);

    Page<Like> findByRelevantIdAndLikeTypeAndIsLikedTrueOrderByCreatedAtDesc(
            String relevantId, LikeType likeType, Pageable pageable);
}
